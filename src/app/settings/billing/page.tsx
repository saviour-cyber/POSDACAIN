import DashboardShell from "@/components/layout/DashboardShell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  Zap,
  Building2,
  Crown,
  CreditCard,
  ShieldCheck,
  Clock,
  Users,
} from "lucide-react";

const plans = [
  {
    id: "freemium",
    name: "Freemium",
    price: 0,
    period: "Forever",
    color: "gray",
    badge: "Current Plan",
    icon: Clock,
    description: "Get started at no cost. Perfect for small setups.",
    features: [
      "1 Cashier account",
      "Up to 50 products",
      "Basic sales & checkout",
      "Basic reports",
      "Community support",
    ],
    cta: "Your current plan",
    disabled: true,
  },
  {
    id: "starter",
    name: "Starter",
    price: 1500,
    period: "/ month",
    color: "blue",
    badge: "Popular",
    icon: Zap,
    description: "Ideal for small businesses ready to scale.",
    features: [
      "3 Cashier accounts",
      "Unlimited products",
      "Sales, Inventory & Reports",
      "Customer management",
      "Stock alerts & control",
      "Email support",
    ],
    cta: "Subscribe to Starter",
    disabled: false,
  },
  {
    id: "business",
    name: "Business",
    price: 3500,
    period: "/ month",
    color: "teal",
    badge: "Best Value",
    icon: Building2,
    description: "Full-featured POS for growing businesses.",
    features: [
      "10 Cashier accounts",
      "Unlimited products",
      "All modules included",
      "Advanced stock reporting",
      "User role management",
      "Priority support",
      "Automated backups",
    ],
    cta: "Subscribe to Business",
    disabled: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 8000,
    period: "/ month",
    color: "purple",
    badge: "Premium",
    icon: Crown,
    description: "For large operations across multiple locations.",
    features: [
      "Unlimited cashier accounts",
      "Multi-branch support",
      "All Business features",
      "Analytics dashboard",
      "Dedicated account manager",
      "SLA-backed support",
      "Custom integrations",
    ],
    cta: "Subscribe to Enterprise",
    disabled: false,
  },
];

const colorMap: Record<string, { card: string; badge: string; btn: string; icon: string }> = {
  gray:   { card: "border-gray-200 bg-gray-50",     badge: "bg-gray-100 text-gray-600",      btn: "bg-gray-200 text-gray-500 cursor-not-allowed",         icon: "text-gray-400 bg-gray-100" },
  blue:   { card: "border-blue-200 bg-blue-50/30",  badge: "bg-blue-100 text-blue-700",      btn: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200",   icon: "text-blue-600 bg-blue-100" },
  teal:   { card: "border-teal-200 bg-teal-50/30",  badge: "bg-teal-100 text-teal-700",      btn: "bg-[#008080] hover:bg-[#006666] text-white shadow-teal-200",  icon: "text-teal-600 bg-teal-100" },
  purple: { card: "border-purple-200 bg-purple-50/30", badge: "bg-purple-100 text-purple-700", btn: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200", icon: "text-purple-600 bg-purple-100" },
};

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <DashboardShell>
      <div className="max-w-[1200px] mx-auto space-y-8 pb-20">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Billing & Plans</h1>
          <p className="text-sm font-medium text-gray-400 mt-1">
            Manage your subscription and upgrade your plan
          </p>
        </div>

        {/* Current Plan Banner */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={24} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Plan</p>
              <p className="text-xl font-black text-gray-900">Freemium</p>
              <p className="text-xs font-medium text-gray-400 mt-0.5">Free forever · No credit card required</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-black text-emerald-600">Active</span>
          </div>
        </div>

        {/* Plans Grid */}
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-5">Choose a Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {plans.map((plan) => {
              const c = colorMap[plan.color];
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl border-2 p-6 flex flex-col gap-5 transition-all ${c.card}`}
                >
                  {/* Plan Header */}
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
                      <plan.icon size={20} />
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${c.badge}`}>
                      {plan.badge}
                    </span>
                  </div>

                  {/* Plan Name & Price */}
                  <div>
                    <h3 className="text-lg font-black text-gray-900">{plan.name}</h3>
                    <p className="text-xs font-medium text-gray-400 mt-0.5">{plan.description}</p>
                    <div className="flex items-end gap-1 mt-3">
                      <span className="text-2xl font-black text-gray-900">
                        {plan.price === 0 ? "Free" : `KES ${plan.price.toLocaleString()}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-xs font-bold text-gray-400 mb-1">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-xs font-medium text-gray-600">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    disabled={plan.disabled}
                    className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg ${c.btn} disabled:shadow-none disabled:active:scale-100`}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-gray-400" />
            Payment & Billing Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: ShieldCheck, title: "Secure Payments", desc: "All payments are encrypted and processed securely via M-PESA or card." },
              { icon: Clock, title: "Monthly Billing", desc: "You are billed once a month. Cancel anytime with no penalty." },
              { icon: Users, title: "Team Seats", desc: "Seats apply to your entire organization. Manage users under User Management." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{item.title}</p>
                  <p className="text-xs font-medium text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}
