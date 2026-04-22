import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { tenant: true }
        });

        if (!user || user.status === 'INACTIVE' || user.status === 'SUSPENDED') {
          // If user is suspended, block immediately
          if (user?.status === 'SUSPENDED') {
             throw new Error("Account suspended due to too many failed login attempts. Contact Admin.");
          }
          return null;
        }

        // Get tenant's security config
        const tenantMetadata = user.tenant.metadata as any;
        const maxAttempts = tenantMetadata?.systemConfig?.security?.maxLoginAttempts || 5;
        const userMetadata = user.metadata as any || {};
        const currentAttempts = userMetadata.loginAttempts || 0;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // Get password policy
        const passwordPolicy = tenantMetadata?.systemConfig?.passwordPolicy;
        const passwordUpdatedAt = (user.metadata as any)?.passwordUpdatedAt;

        if (passwordPolicy?.passwordExpiryDays && passwordUpdatedAt) {
           const expiryDays = passwordPolicy.passwordExpiryDays;
           const lastUpdate = new Date(passwordUpdatedAt);
           const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
           
           if (daysSinceUpdate > expiryDays) {
              throw new Error("PASSWORD_EXPIRED");
           }
        }

        if (!isPasswordValid) {
          const newAttempts = currentAttempts + 1;
          
          await prisma.user.update({
            where: { id: user.id },
            data: {
              status: newAttempts >= maxAttempts ? 'SUSPENDED' : user.status,
              metadata: {
                ...userMetadata,
                loginAttempts: newAttempts,
                lastAttemptAt: new Date().toISOString()
              }
            }
          });

          if (newAttempts >= maxAttempts) {
             throw new Error("Account suspended after 5 failed attempts.");
          }
          return null;
        }

        // Success: Reset login attempts
        if (currentAttempts > 0) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              metadata: {
                ...userMetadata,
                loginAttempts: 0
              }
            }
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          tenantId: user.tenantId,
          role: user.role,
          businessType: user.tenant.businessType,
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.tenantId = user.tenantId;
        token.role = user.role;
        token.businessType = user.businessType;

        // Fetch tenant config for global logic (Maintenance, etc)
        const tenant = await prisma.tenant.findUnique({
           where: { id: user.tenantId },
           select: { metadata: true }
        });
        token.systemConfig = (tenant?.metadata as any)?.systemConfig || null;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.tenantId = token.tenantId;
        session.user.role = token.role;
        session.user.businessType = token.businessType;
        session.user.systemConfig = token.systemConfig;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
