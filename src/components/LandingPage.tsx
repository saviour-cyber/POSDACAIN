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

      {/* HERO */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-16 pt-20 overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 z-0 bg-[#0b1220]/80 sm:bg-[#0b1220]/70" />
        
        <div className="relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-[600px] animate-fade-in-up">
            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              Revolutionize Your Business with <span className="text-[#4da6ff]">Advanced POS</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 pt-2">
              Manage sales, inventory and analytics in one powerful system. The ultimate solution for modern retail & restaurants.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <button className="px-8 py-4 rounded-[30px] bg-[#4da6ff] hover:bg-[#3b92eb] hover:shadow-[0_0_20px_rgba(77,166,255,0.4)] text-white font-semibold transition-all transform hover:-translate-y-1">
                  Get Started
                </button>
              </Link>
              <Link href="/login">
                <button className="px-8 py-4 rounded-[30px] bg-transparent border border-white hover:bg-white/10 text-white font-semibold transition-all transform hover:-translate-y-1">
                  Watch Demo
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE HERO MOCKUP (CSS Illusion) */}
          <div className="relative hidden lg:flex items-center justify-center h-[600px] w-full perspective-1000 pl-16">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-[#6a5cff]/30 to-[#4da6ff]/30 blur-[100px] rounded-full pointer-events-none -z-10"></div>

            {/* Desktop Dashboard */}
            <div className="absolute right-0 w-[650px] h-[420px] bg-[#0b1220]/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_80px_-20px_rgba(77,166,255,0.2)] p-5 transform rotate-y-[-10deg] rotate-x-[5deg] translate-z-[-50px] hover:translate-z-[-20px] hover:rotate-y-[-5deg] transition-transform duration-700">
              
              {/* Dashboard Layout: Sidebar + Canvas */}
              <div className="flex h-full gap-5">
                
                {/* Sidebar */}
                <div className="w-14 shrink-0 flex flex-col gap-4 border-r border-white/5 pr-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4da6ff] to-[#6a5cff] shadow-lg shadow-[#4da6ff]/30 mb-4"></div>
                  {[1,2,3,4].map(i => (
                     <div key={i} className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/20 transition-colors cursor-default"></div>
                  ))}
                  <div className="mt-auto w-8 h-8 rounded-full bg-slate-800 border my-1 border-slate-600"></div>
                </div>

                {/* Main Canvas */}
                <div className="flex-1 flex flex-col gap-5">
                  <div className="flex justify-between items-center">
                    <div className="w-32 h-4 rounded-full bg-white/10"></div>
                    <div className="flex gap-2">
                      <div className="w-20 h-6 rounded-full bg-[#4da6ff]/20 border border-[#4da6ff]/40"></div>
                      <div className="w-6 h-6 rounded-full bg-white/10"></div>
                    </div>
                  </div>

                  {/* Top KPIs (Floating Glass Cards) */}
                  <div className="flex gap-4">
                    <div className="flex-1 h-20 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between backdrop-blur-md hover:-translate-y-1 transition-transform shadow-lg shadow-black/20 cursor-default">
                       <div className="w-16 h-2 bg-white/20 rounded-full"></div>
                       <div className="flex justify-between items-end">
                         <div className="w-20 h-5 bg-white/80 rounded-md"></div>
                         <div className="w-8 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                       </div>
                    </div>
                    <div className="flex-1 h-20 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between backdrop-blur-md hover:-translate-y-1 transition-transform shadow-lg shadow-black/20 cursor-default">
                       <div className="w-16 h-2 bg-white/20 rounded-full"></div>
                       <div className="flex justify-between items-end">
                         <div className="w-20 h-5 bg-white/80 rounded-md"></div>
                         <div className="w-8 h-3 bg-rose-400 rounded-full shadow-[0_0_10px_rgba(251,113,133,0.5)]"></div>
                       </div>
                    </div>
                  </div>

                  {/* Big Chart Area */}
                  <div className="flex-1 rounded-xl bg-gradient-to-b from-[#4da6ff]/10 to-transparent border border-white/10 relative overflow-hidden flex items-end shadow-inner">
                      <svg viewBox="0 0 400 100" className="absolute bottom-0 w-[110%] -left-[5%] h-full opacity-80 drop-shadow-[0_0_15px_rgba(77,166,255,0.6)]" preserveAspectRatio="none">
                         <path d="M0,80 Q50,90 100,50 T200,40 T300,70 T400,20 L400,100 L0,100 Z" fill="url(#grad)" stroke="none" />
                         <path d="M0,80 Q50,90 100,50 T200,40 T300,70 T400,20" fill="none" stroke="#4da6ff" strokeWidth="2.5" />
                         <defs>
                           <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#4da6ff" stopOpacity="0.5"/>
                             <stop offset="100%" stopColor="#4da6ff" stopOpacity="0"/>
                           </linearGradient>
                         </defs>
                      </svg>
                  </div>
                </div>

                {/* Right Panel (Transactions) */}
                <div className="w-40 shrink-0 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col backdrop-blur-md">
                  <div className="w-20 h-3 bg-white/20 rounded-full mb-4"></div>
                  <div className="space-y-3 flex-1 overflow-hidden">
                    {['bg-emerald-400', 'bg-emerald-400', 'bg-amber-400', 'bg-emerald-400', 'bg-rose-400'].map((color, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                        <div className="space-y-1">
                          <div className="w-12 h-2 bg-white/60 rounded-full"></div>
                          <div className="w-8 h-1.5 bg-white/20 rounded-full"></div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${color} shadow-lg shadow-black`}></div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Tablet / Phone Mockup (Overlap) */}
            <div className="absolute -left-12 bottom-0 w-[240px] h-[400px] bg-[#02050e] border-[6px] border-slate-800/90 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,1),0_0_40px_-5px_rgba(77,166,255,0.3)] p-1.5 transform rotate-y-[12deg] rotate-x-[5deg] translate-z-[120px] hover:translate-z-[160px] hover:rotate-y-[8deg] transition-all duration-700 backdrop-blur-md overflow-hidden z-20">
               
               {/* Glass Reflection effect */}
               <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent z-50"></div>
               
               <div className="w-full h-full bg-[#0b1220] rounded-[22px] overflow-hidden flex flex-col border border-white/5 relative z-10">
                  {/* Status Bar */}
                  <div className="h-6 flex justify-between items-center px-4 pt-1">
                     <div className="w-6 h-1.5 bg-white/30 rounded-full"></div>
                     <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                        <div className="w-2.5 h-1.5 bg-white/30 rounded-sm"></div>
                     </div>
                  </div>

                  {/* Tablet Hero Widget */}
                  <div className="flex-1 p-3 flex flex-col gap-3">
                     <div className="h-20 bg-gradient-to-br from-[#6a5cff] to-[#4da6ff] rounded-xl flex flex-col justify-center px-4 relative overflow-hidden shadow-lg shadow-[#4da6ff]/20">
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/20 rounded-full blur-xl translate-x-1/2 translate-y-1/3"></div>
                        <div className="w-16 h-2 bg-white/60 rounded-full mb-2"></div>
                        <div className="w-24 h-5 bg-white rounded-md shadow-sm"></div>
                     </div>

                     {/* Vibrant POS Grid */}
                     <div className="grid grid-cols-2 gap-2 flex-1">
                        {[
                          "bg-emerald-500", "bg-rose-500", "bg-blue-500", 
                          "bg-amber-500", "bg-purple-500", "bg-cyan-500"
                        ].map((c, i) => (
                          <div key={i} className={`${c} rounded-xl shadow-inner relative overflow-hidden group border border-white/10`}>
                             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                             <div className="absolute bottom-2 left-2 w-10 h-1.5 bg-white/90 rounded-full shadow-sm"></div>
                             <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/20"></div>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="h-14 bg-[#050a15] flex justify-around items-center px-2 border-t border-white/10 pb-1 shrink-0">
                     {[1,2,3,4].map(i => (
                        <div key={i} className={`w-5 h-5 rounded-md ${i===1?'bg-gradient-to-r from-[#4da6ff] to-[#6a5cff]':'bg-white/10'} shadow-sm`}></div>
                     ))}
                  </div>
               </div>
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
