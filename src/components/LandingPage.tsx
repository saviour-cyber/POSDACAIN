import Link from "next/link";
import { Package, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b1220] text-white font-sans selection:bg-[#4da6ff] selection:text-white overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-[100] flex justify-between items-center px-6 lg:px-16 py-5 bg-[#0b1220]/80 backdrop-blur-md border-b border-white/5">
        <h2 className="text-2xl font-bold tracking-tight">SmartPOS</h2>
        <div className="hidden md:flex gap-6 items-center">
          <Link href="#" className="hover:text-[#4da6ff] transition-colors">Home</Link>
          <Link href="#services" className="hover:text-[#4da6ff] transition-colors">Services</Link>
          <Link href="#contact" className="hover:text-[#4da6ff] transition-colors">Contact</Link>
          <Link href="/login" className="hover:text-[#4da6ff] transition-colors font-semibold">Login</Link>
        </div>
        <Link href="/register" className="md:hidden px-5 py-2 rounded-[30px] bg-[#4da6ff] hover:bg-blue-500 text-white text-sm font-semibold transition-all">
          Register
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center px-6 lg:px-16 pt-24 pb-12 overflow-hidden bg-[#0b1220]">
        {/* Subtle Gradient Overlays */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-purple-600/5 blur-[120px] -z-10 animate-pulse"></div>
        
        <div className="relative z-10 w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Headline & CTAs */}
          <div className="max-w-[650px] animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 group cursor-default">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-[11px] font-bold text-blue-300 uppercase tracking-[0.2em]">Next-Gen POS Systems</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black leading-[1.05] mb-8 tracking-[-0.030em] text-white">
              The Smart Way to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Scale Your Sales.</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 leading-relaxed font-medium">
              Manage inventory, process payments, and track real-time analytics 
              with the world&apos;s most intuitive point-of-sale platform.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <Link href="/register">
                <button className="px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-lg transition-all transform hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)] active:scale-95 shadow-xl shadow-blue-900/20 border border-white/10 flex items-center gap-3">
                  Start FREE Trial
                  <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-xs">→</span>
                </button>
              </Link>
              <Link href="/login">
                <button className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-extrabold text-lg transition-all transform hover:-translate-y-1.5 backdrop-blur-md active:scale-95 flex items-center gap-2">
                  Live Demo
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                </button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trusted by leading retailers</p>
            </div>
          </div>

          {/* RIGHT SIDE HERO COMPONENT (Stripe/Shopify Realism) */}
          <div className="relative hidden lg:flex items-center justify-end h-[750px] w-full perspective-2000 z-10">
            
            {/* Deep Ambient Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-blue-600/40 via-transparent to-purple-600/40 blur-[150px] rounded-full pointer-events-none -z-20"></div>

            {/* MAIN DASHBOARD (The Focus) */}
            <div className="relative w-[850px] h-[580px] bg-[#0E1526] border border-slate-700/60 rounded-2xl shadow-[0_60px_100px_-30px_rgba(0,0,0,0.9),0_0_120px_-30px_rgba(99,102,241,0.3)] flex flex-col overflow-hidden transform rotate-y-[-12deg] rotate-x-[6deg] translate-x-20 translate-z-[-40px] hover:translate-z-0 hover:rotate-y-[-6deg] transition-all duration-1000 z-10 ring-1 ring-white/5">
              
              {/* Dashboard Navbar */}
              <div className="h-16 bg-[#111827] border-b border-slate-700/50 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                  </div>
                  <div className="flex gap-6 text-[13px] font-bold text-slate-400">
                    <span className="text-blue-400 pb-5 border-b-2 border-blue-400 translate-y-[10px]">Overview</span>
                    <span className="hover:text-white cursor-pointer transition-colors">Sales Tracking</span>
                    <span className="hover:text-white cursor-pointer transition-colors">Inventory</span>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-full border-2 border-slate-700 bg-[#0E1526] flex items-center justify-center">
                    <Users size={18} className="text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 p-8 grid grid-cols-3 gap-8 bg-[#0E1526]">
                
                {/* Left Column (Charts & Stats) */}
                <div className="col-span-2 flex flex-col gap-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-[#111827] border border-slate-700/50 rounded-[20px] p-6 shadow-2xl hover:border-blue-500/30 transition-all group">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-4">Daily Volume</p>
                      <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-black text-white leading-none tracking-tighter">KSh 124,563.00</h3>
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md translate-y-1">+12%</span>
                      </div>
                    </div>
                    <div className="bg-[#111827] border border-slate-700/50 rounded-[20px] p-6 shadow-2xl hover:border-purple-500/30 transition-all">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-4">Avg Transaction</p>
                      <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-black text-white leading-none tracking-tighter">KSh 3,240.50</h3>
                      </div>
                    </div>
                  </div>

                  {/* High Quality Chart */}
                  <div className="flex-1 bg-[#111827] border border-slate-700/50 rounded-[24px] p-6 flex flex-col shadow-2xl relative group">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h4 className="text-base font-black text-white tracking-tight">Revenue Stream</h4>
                        <p className="text-xs text-slate-500 font-bold mt-1">Updated 2 minutes ago</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">W</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 w-full relative z-10 bottom-0 pointer-events-none">
                      <svg viewBox="0 0 500 150" className="absolute bottom-0 w-full h-[140%] drop-shadow-[0_15px_30px_rgba(59,130,246,0.6)]" preserveAspectRatio="none">
                         <path d="M0,130 C50,110 100,140 150,80 C200,20 250,90 300,40 C350,0 400,60 450,20 C480,10 500,30 500,30 L500,150 L0,150 Z" fill="url(#blueHeroGrad)" stroke="none" />
                         <path d="M0,130 C50,110 100,140 150,80 C200,20 250,90 300,40 C350,0 400,60 450,20 C480,10 500,30 500,30" fill="none" stroke="#4da6ff" strokeWidth="4" strokeLinecap="round" />
                         <defs>
                           <linearGradient id="blueHeroGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4"/>
                             <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                           </linearGradient>
                         </defs>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Right Column (Transactions Table) */}
                <div className="col-span-1 bg-[#111827] border border-slate-700/50 rounded-[24px] flex flex-col overflow-hidden shadow-2xl ring-1 ring-white/5">
                  <div className="px-6 py-5 border-b border-slate-700/50 bg-slate-900/40">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Stream</h4>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {[
                      { n: 'Main Branch Cafe', d: '2m ago', a: '+KSh 340', s: 'text-emerald-400 bg-emerald-400/10' },
                      { n: 'Supplies: Milk', d: '12m ago', a: '-KSh 1,200', s: 'text-slate-400 bg-slate-800' },
                      { n: 'Downtown Shop', d: '45m ago', a: '+KSh 12,400', s: 'text-emerald-400 bg-emerald-400/10' },
                      { n: 'Esther Howard', d: '1h ago', a: '+KSh 450', s: 'text-emerald-400 bg-emerald-400/10' },
                    ].map((tx, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 rounded-[16px] bg-slate-800/30 border border-slate-700/40 hover:bg-slate-700/50 transition-all group cursor-pointer shadow-sm">
                        <div>
                          <p className="text-[11px] font-black text-slate-200 group-hover:text-white mb-1 tracking-tight">{tx.n}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">{tx.d}</p>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-1 rounded-md ${tx.s}`}>{tx.a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TABLET POS (The Secondary Device) */}
            <div className="absolute left-[-40px] bottom-[-20px] w-[210px] h-[360px] bg-[#020617] border-[6px] border-slate-900 rounded-[36px] shadow-[0_60px_120px_-30px_rgba(0,0,0,1),-40px_0_80px_-20px_rgba(0,0,0,0.8)] transform rotate-y-[15deg] rotate-x-[4deg] translate-z-[120px] hover:translate-z-[150px] transition-all duration-1000 z-50 p-2 border-t-slate-700/50">
               
               {/* Screen Realism */}
               <div className="w-full h-full bg-white rounded-[26px] overflow-hidden flex flex-col border border-slate-300 relative shadow-inner">
                  {/* Status Bar */}
                  <div className="h-6 flex justify-between items-center px-5 bg-slate-50 shrink-0">
                     <span className="text-[8px] font-black text-slate-900 tracking-wider">12:30</span>
                     <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800/20"></div>
                        <div className="w-2.5 h-1.2 rounded-[1px] bg-emerald-500"></div>
                     </div>
                  </div>

                  <div className="bg-blue-600 p-6 flex flex-col items-center text-white shrink-0 shadow-lg relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-transparent opacity-50"></div>
                     <p className="text-[8px] font-black uppercase tracking-[0.2em] relative z-10 mb-2 opacity-60">Total Bill</p>
                     <h2 className="text-[28px] font-black tracking-tighter relative z-10">KSh 3,240</h2>
                     <div className="mt-4 px-4 py-1.5 bg-white/20 rounded-full text-[8px] font-black uppercase tracking-widest relative z-10 backdrop-blur-md">Awaiting Payment</div>
                  </div>

                  <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
                     {[1,2,3].map(i => (
                        <div key={i} className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-2">
                           <span className="text-slate-500 font-bold tracking-tight">Artisan Latte x{i}</span>
                           <span className="text-slate-900 font-black tracking-tighter">KSh 450</span>
                        </div>
                     ))}
                     
                     <div className="mt-auto flex gap-2">
                        <div className="flex-1 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-black/30 cursor-pointer">CARD</div>
                        <div className="flex-1 h-12 bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-center text-blue-600 text-[10px] font-black cursor-pointer">MPESA</div>
                     </div>
                  </div>
               </div>
               {/* Apple bar */}
               <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-black/10 rounded-full"></div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="flex flex-wrap justify-between items-center gap-6 px-6 lg:px-16 py-10 bg-white/5 backdrop-blur-sm border-y border-white/5">
          <div className="flex items-center gap-3 font-semibold text-lg hover:text-[#4da6ff] transition-colors cursor-default">
            <span className="text-2xl">💳</span> Integrated Payments
          </div>
          <div className="flex items-center gap-3 font-semibold text-lg hover:text-[#4da6ff] transition-colors cursor-default">
            <span className="text-2xl">📊</span> Real-Time Analytics
          </div>
          <div className="flex items-center gap-3 font-semibold text-lg hover:text-[#4da6ff] transition-colors cursor-default">
            <span className="text-2xl">☁️</span> Cloud Access
          </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="px-6 lg:px-16 py-24 text-center">
          <h2 className="text-4xl font-bold mb-12">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                  "Sales Management",
                  "Inventory Control",
                  "Customer Management",
                  "Reports & Analytics",
                  "Staff Management",
                  "Multi-store Support"
              ].map((service, idx) => (
                  <div 
                      key={idx} 
                      className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(77,166,255,0.15)] transition-all duration-300 cursor-default"
                  >
                      <h3 className="text-xl font-semibold">{service}</h3>
                  </div>
              ))}
          </div>
      </section>

      {/* STATS */}
      <section className="flex flex-wrap justify-around items-center gap-8 px-6 py-16 bg-[#050a15] border-t border-white/5">
          <div className="text-center group">
              <div className="text-4xl font-bold text-[#4da6ff] mb-2 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-gray-400 uppercase tracking-wide text-sm">Customers</div>
          </div>
          <div className="text-center group">
              <div className="text-4xl font-bold text-[#4da6ff] mb-2 group-hover:scale-110 transition-transform">1200+</div>
              <div className="text-gray-400 uppercase tracking-wide text-sm">Businesses</div>
          </div>
          <div className="text-center group">
              <div className="text-4xl font-bold text-[#4da6ff] mb-2 group-hover:scale-110 transition-transform">98%</div>
              <div className="text-gray-400 uppercase tracking-wide text-sm">Satisfaction</div>
          </div>
          <div className="text-center group">
              <div className="text-4xl font-bold text-[#4da6ff] mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-gray-400 uppercase tracking-wide text-sm">Support</div>
          </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#4da6ff] to-[#6a5cff] px-6 py-20 text-center">
          <h2 className="text-4xl font-bold mb-8">Start Your Journey Today</h2>
          <Link href="/register">
            <button className="px-10 py-4 border-2 border-white bg-white hover:bg-transparent text-[#6a5cff] hover:text-white rounded-[30px] font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Get Started
            </button>
          </Link>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 lg:px-16 py-16 bg-[#050a15] text-sm border-t border-white/10">
          <div>
              <h4 className="text-xl font-bold mb-4">SmartPOS</h4>
              <p className="text-[#ccc] mb-4">All-in-one POS system for modern businesses.</p>
          </div>
          <div>
              <h4 className="text-lg font-bold mb-4">Links</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-[#ccc] hover:text-white transition-colors">Home</Link></li>
                <li><Link href="#services" className="text-[#ccc] hover:text-white transition-colors">Services</Link></li>
                <li><Link href="#contact" className="text-[#ccc] hover:text-white transition-colors">Contact</Link></li>
              </ul>
          </div>
          <div>
              <h4 className="text-lg font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-[#ccc]">
                <li>Sales</li>
                <li>Inventory</li>
                <li>Reports</li>
              </ul>
          </div>
          <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-[#ccc]">
                <li>Email: info@canonpos.co.ke</li>
                <li>Phone: +254 700 000000</li>
              </ul>
          </div>
      </footer>

    </div>
  );
}
