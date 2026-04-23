import Link from "next/link";
import { 
  CheckCircle2, 
  BarChart3, 
  Store, 
  CreditCard, 
  CloudBase, 
  CloudIcon, 
  Smartphone, 
  ArrowRight,
  TrendingUp,
  Package,
  Users
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative font-sans text-gray-200">
      {/* Immersive Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

      {/* Navigation Bar */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-24 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Store className="text-white absolute" size={18} />
          </div>
          <span className="text-xl font-black text-white tracking-tight">CanonPOS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/register" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white text-sm font-semibold rounded-full transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col justify-center min-h-[calc(100vh-180px)] px-6 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center mt-12">
          
          {/* Left Hero Content */}
          <div className="max-w-2xl space-y-8">
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Revolutionize Your Business with Our <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                Advanced POS System
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 font-medium max-w-lg">
              The Ultimate Solution for Retail & Restaurants. Seamlessly manage sales, inventory, and analytics in one powerful platform.
            </p>

            <ul className="space-y-4">
              {[
                "Fast & Easy Checkout",
                "Advanced Sales Reports",
                "Inventory & Employee Management"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                    <CheckCircle2 size={12} className="text-teal-400" />
                  </div>
                  <span className="text-gray-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/register" 
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(45,212,191,0.3)] hover:shadow-[0_0_40px_rgba(45,212,191,0.5)] transition-all flex items-center justify-center gap-2 group"
              >
                Get Started Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/login" 
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white font-bold rounded-2xl transition-all flex items-center justify-center"
              >
                Watch Demo
              </Link>
            </div>
          </div>

          {/* Right Hero Graphics - CSS UI Mockup */}
          <div className="relative perspective-1000 hidden lg:block h-[500px]">
            {/* The Dashboard Screen (Back) */}
            <div className="absolute right-0 top-10 w-[600px] h-[380px] bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl p-4 transform rotate-y-[-10deg] rotate-x-[5deg] translate-x-12 translate-z-[-100px] hover:translate-z-[-80px] transition-transform duration-700">
              {/* Fake UI Header */}
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-4">
                <div className="w-24 h-4 bg-slate-800 rounded-full"></div>
                <div className="flex gap-2">
                   <div className="w-6 h-6 bg-slate-800 rounded-full"></div>
                   <div className="w-6 h-6 bg-slate-800 rounded-full"></div>
                </div>
              </div>
              {/* Fake UI Body */}
              <div className="grid grid-cols-3 gap-4 h-full">
                <div className="col-span-2 space-y-4">
                  <div className="h-28 bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                    <div className="w-16 h-3 bg-slate-700 rounded-full mb-2"></div>
                    <div className="w-32 h-8 bg-slate-200 rounded-md mb-2"></div>
                    {/* Tiny CSS Line chart representation */}
                    <div className="w-full h-8 mt-4 border-b border-l border-slate-700 relative flex items-end justify-between px-1">
                       <div className="w-2 h-4 bg-teal-500 rounded-t-sm"></div>
                       <div className="w-2 h-6 bg-teal-500 rounded-t-sm"></div>
                       <div className="w-2 h-3 bg-teal-500 rounded-t-sm"></div>
                       <div className="w-2 h-8 bg-teal-500 rounded-t-sm"></div>
                       <div className="w-2 h-5 bg-teal-500 rounded-t-sm"></div>
                       <div className="w-2 h-7 bg-teal-500 rounded-t-sm"></div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 h-20 bg-slate-800/80 rounded-xl border border-slate-700/50 flex items-center justify-center">
                       <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                          <Package size={16} className="text-teal-400" />
                       </div>
                    </div>
                    <div className="flex-1 h-20 bg-slate-800/80 rounded-xl border border-slate-700/50 flex items-center justify-center">
                       <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                          <Users size={16} className="text-cyan-400" />
                       </div>
                    </div>
                  </div>
                </div>
                <div className="h-[calc(100%-4rem)] bg-slate-800/80 rounded-xl border border-slate-700/50 p-3">
                   <div className="w-16 h-3 bg-slate-700 rounded-full mb-4"></div>
                   <div className="space-y-3">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="flex gap-2 items-center">
                          <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
                          <div className="w-full h-3 bg-slate-700/50 rounded-full"></div>
                        </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            {/* The POS Tablet (Front) */}
            <div className="absolute left-10 bottom-0 w-[260px] h-[340px] bg-black border-4 border-slate-800 rounded-[28px] shadow-2xl p-2 transform rotate-y-[15deg] rotate-x-[5deg] translate-z-[100px] hover:translate-z-[120px] hover:rotate-y-[10deg] transition-all duration-700">
               <div className="w-full h-full bg-white rounded-[20px] overflow-hidden flex flex-col">
                  {/* Tablet Header */}
                  <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center justify-between px-3">
                     <div className="w-12 h-3 bg-slate-300 rounded-full"></div>
                     <div className="w-16 h-5 bg-teal-500 rounded-md"></div>
                  </div>
                  {/* Tablet Tiles */}
                  <div className="flex-1 p-2 grid grid-cols-2 gap-2">
                     <div className="bg-red-500/90 rounded-lg shadow-inner"></div>
                     <div className="bg-blue-500/90 rounded-lg shadow-inner"></div>
                     <div className="bg-orange-500/90 rounded-lg shadow-inner"></div>
                     <div className="bg-green-500/90 rounded-lg shadow-inner"></div>
                     <div className="bg-purple-500/90 rounded-lg shadow-inner"></div>
                     <div className="bg-teal-500/90 rounded-lg shadow-inner"></div>
                  </div>
                  {/* Tablet Checkout Bar */}
                  <div className="h-16 bg-slate-800 m-2 mt-0 rounded-xl flex items-center justify-between px-4 text-white">
                     <div className="w-10 h-3 bg-slate-600 rounded-full"></div>
                     <div className="w-14 h-4 bg-white rounded-full"></div>
                  </div>
               </div>
               {/* Stand Base */}
               <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl border-x-4 border-b-4 border-slate-800"></div>
               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-4 bg-slate-800 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5)]"></div>
            </div>
            
            {/* Glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-teal-500/20 blur-[100px] rounded-full point-events-none -z-10"></div>
          </div>
        </div>

      </main>

      {/* Bottom Features Bar */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-24 pb-12 mt-12 lg:mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
           
           <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/20 transition-colors">
                 <CreditCard className="text-gray-300 group-hover:text-teal-400" size={20} />
              </div>
              <div>
                 <h3 className="text-white font-bold text-sm mb-1">Integrated Payments</h3>
                 <p className="text-gray-400 text-xs font-medium">Accept payments from all wallets</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group border-y md:border-y-0 md:border-x border-white/10">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                 <BarChart3 className="text-gray-300 group-hover:text-cyan-400" size={20} />
              </div>
              <div>
                 <h3 className="text-white font-bold text-sm mb-1">Real-Time Analytics</h3>
                 <p className="text-gray-400 text-xs font-medium">Track your sales impact</p>
              </div>
           </div>

           <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/20 transition-colors">
                 <CloudIcon className="text-gray-300 group-hover:text-teal-400" size={20} />
              </div>
              <div>
                 <h3 className="text-white font-bold text-sm mb-1">Cloud-Based Access</h3>
                 <p className="text-gray-400 text-xs font-medium">Manage from any device</p>
              </div>
           </div>

        </div>
      </div>
      
    </div>
  );
}
