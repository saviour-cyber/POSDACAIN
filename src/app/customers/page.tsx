import DashboardShell from "@/components/layout/DashboardShell";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CustomerHeader from "./CustomerHeader";
import CustomersTable from "./CustomersTable";

export default async function CustomersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <DashboardShell>
      <CustomerHeader />
      <CustomersTable />
    </DashboardShell>
  );
}
