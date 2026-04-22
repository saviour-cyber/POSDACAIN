"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid administrative credentials");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950"></div>
      
      <div className="max-w-md w-full bg-gray-900/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-800 relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">System Owner Login</h1>
          <p className="text-gray-500 text-sm font-medium mt-2">Sign in to access the global anchor console.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Admin Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-4 rounded-2xl bg-gray-950 border border-gray-800 focus:border-indigo-500 focus:ring-4 ring-indigo-500/10 text-white placeholder:text-gray-700 outline-none transition-all font-bold"
              placeholder="owner@nexasync.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Secure Passphrase</label>
            <input
              type="password"
              required
              className="w-full px-4 py-4 rounded-2xl bg-gray-950 border border-gray-800 focus:border-indigo-500 focus:ring-4 ring-indigo-500/10 text-white placeholder:text-gray-700 outline-none transition-all font-bold"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Authenticate Identity"}
          </button>
        </form>
      </div>
    </div>
  );
}
