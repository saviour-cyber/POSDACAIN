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

          {/* RIGHT SIDE HERO COMPONENT (Stripe/Shopify Realism) */}
          <div className="relative hidden lg:flex items-center justify-center h-[700px] w-full perspective-1000 pl-10 z-10 animate-fade-in-up">
            
            {/* Deep Ambient Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-purple-600/30 blur-[120px] rounded-full pointer-events-none -z-20"></div>

            {/* Main DOM Dashboard (No abstract boxes - Full Realism) */}
            <div className="absolute right-0 top-10 w-[700px] h-[500px] bg-[#0E1526] border border-slate-700/60 rounded-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),0_0_100px_-20px_rgba(99,102,241,0.2)] flex flex-col overflow-hidden transform rotate-y-[-8deg] rotate-x-[4deg] translate-x-10 translate-z-[-20px] hover:translate-z-[0px] hover:rotate-y-[-4deg] transition-all duration-700 z-10">
              
              {/* Dashboard Navbar */}
              <div className="h-14 bg-[#111827] border-b border-slate-700/50 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-600 hover:bg-red-400 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-yellow-400 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-800 hover:bg-green-400 transition-colors"></div>
                  </div>
                  <div className="flex gap-5 text-[13px] font-semibold text-slate-400">
                    <span className="text-white bg-slate-800 px-3 py-1 rounded-md shadow-sm">Overview</span>
                    <span className="hover:text-white cursor-pointer transition-colors py-1">Customers</span>
                    <span className="hover:text-white cursor-pointer transition-colors py-1">Products</span>
                    <span className="hover:text-white cursor-pointer transition-colors py-1">Settings</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-56 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center px-3 shadow-inner">
                    <span className="text-slate-500 text-xs">Search transactions...</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-slate-600 bg-gradient-to-tr from-purple-500 to-blue-500 shadow-md"></div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 p-6 grid grid-cols-3 gap-6 bg-[#0E1526]">
                
                {/* Left Column (Charts & Stats) */}
                <div className="col-span-2 flex flex-col gap-6 relative z-10">
                  {/* Top Analytics Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-5 flex flex-col justify-between shadow-lg hover:border-slate-600 transition-colors">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Volume</p>
                      <div className="mt-3 flex items-end justify-between">
                        <h3 className="text-[28px] font-black text-white leading-none">$124,563.00</h3>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">+14.2%</span>
                      </div>
                    </div>
                    <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-5 flex flex-col justify-between shadow-lg hover:border-slate-600 transition-colors">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active POS Terminals</p>
                      <div className="mt-3 flex items-end justify-between">
                        <h3 className="text-[28px] font-black text-white leading-none">4 Locations</h3>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">Online</span>
                      </div>
                    </div>
                  </div>

                  {/* High Quality Chart Box (Fully Clear SVG) */}
                  <div className="flex-1 bg-[#111827] border border-slate-700/50 rounded-xl pt-5 mx-0 flex flex-col overflow-hidden relative shadow-lg hover:border-slate-600 transition-colors">
                    <div className="px-6 pb-2 flex justify-between items-center z-10">
                      <h4 className="text-[15px] font-bold text-slate-200">Revenue Growth</h4>
                      <select className="bg-[#0E1526] border border-slate-700 text-[11px] font-semibold text-slate-300 rounded-md px-3 py-1.5 outline-none shadow-inner cursor-pointer hover:border-slate-500 transition-colors">
                        <option>Last 7 Days</option>
                      </select>
                    </div>
                    {/* Background Grid Lines */}
                    <div className="absolute inset-x-0 bottom-0 top-16 flex flex-col justify-between px-6 py-4 z-0">
                       <div className="w-full border-b border-slate-700/30"></div>
                       <div className="w-full border-b border-slate-700/30"></div>
                       <div className="w-full border-b border-slate-700/30"></div>
                       <div className="w-full border-b border-slate-700/60"></div>
                    </div>
                    {/* SVG Curve perfectly mapped mapped to data bounds */}
                    <div className="flex-1 w-full relative z-10 mt-2 pointer-events-none">
                      <svg viewBox="0 0 500 150" className="absolute bottom-0 w-full h-[120%] opacity-100 drop-shadow-[0_8px_16px_rgba(59,130,246,0.5)]" preserveAspectRatio="none">
                         <path d="M0,130 C40,110 80,120 120,80 C160,40 200,90 250,50 C300,10 350,60 400,30 C450,0 500,20 500,20 L500,150 L0,150 Z" fill="url(#blueGrad)" stroke="none" />
                         <path d="M0,130 C40,110 80,120 120,80 C160,40 200,90 250,50 C300,10 350,60 400,30 C450,0 500,20 500,20" fill="none" stroke="#60A5FA" strokeWidth="3" />
                         <defs>
                           <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4"/>
                             <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                           </linearGradient>
                         </defs>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Right Column (Transactions Table) */}
                <div className="col-span-1 bg-[#111827] border border-slate-700/50 rounded-xl flex flex-col overflow-hidden shadow-lg relative z-10 hover:border-slate-600 transition-colors">
                  <div className="px-5 py-4 border-b border-slate-700/50 bg-[#0E1526]/50 shrink-0">
                    <h4 className="text-[13px] font-bold text-white uppercase tracking-wider">Recent Activity</h4>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {[
                      { n: 'Jane Cooper', d: 'Today, 2:40 PM', a: '+$145.00', s: 'text-emerald-400 bg-emerald-400/10' },
                      { n: 'Refund processed', d: 'Today, 1:12 PM', a: '-$32.50', s: 'text-slate-400 bg-slate-800' },
                      { n: 'Bessie Cooper', d: 'Yesterday, 8:00 AM', a: '+$98.20', s: 'text-emerald-400 bg-emerald-400/10' },
                      { n: 'Esther Howard', d: 'Oct 23, 4:24 PM', a: '+$340.00', s: 'text-emerald-400 bg-emerald-400/10' },
                      { n: 'Subscription fee', d: 'Oct 23, 1:00 PM', a: '-$49.00', s: 'text-slate-400 bg-slate-800' },
                    ].map((tx, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-700/40 transition-colors cursor-pointer border border-transparent hover:border-slate-700 shadow-sm">
                        <div>
                          <p className="text-xs font-bold text-slate-200 mb-1">{tx.n}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{tx.d}</p>
                        </div>
                        <span className={`text-[11px] font-black px-2 py-1 rounded shadow-inner ${tx.s}`}>{tx.a}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Device Mockup (Secondary, smaller, overlapping in front, clear UI) */}
            <div className="absolute left-0 bottom-6 w-[220px] h-[380px] bg-[#020617] border-[4px] border-slate-800 rounded-[30px] shadow-[0_50px_100px_-20px_rgba(0,0,0,1),20px_0_40px_-10px_rgba(0,0,0,0.6)] transform rotate-y-[10deg] rotate-x-[5deg] translate-z-[100px] hover:translate-z-[120px] hover:rotate-y-[5deg] transition-all duration-700 z-30 p-1.5 backdrop-blur-3xl">
               
               {/* Ambient Terminal Reflection */}
               <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent z-50 rounded-[26px]"></div>
               
               {/* Terminal Screen Realism */}
               <div className="w-full h-full bg-white rounded-[22px] overflow-hidden flex flex-col border border-slate-300 relative shadow-inner z-10">
                  
                  {/* Status Bar */}
                  <div className="h-5 flex justify-between items-center px-4 bg-gray-50 border-b border-gray-100 shrink-0">
                     <span className="text-[8px] font-black text-gray-800 tracking-wider">12:30</span>
                     <div className="flex gap-1 items-center">
                        <div className="w-1.5 h-1.5 rounded-full border border-gray-400 bg-gray-200"></div>
                        <div className="w-2.5 h-1.5 bg-gray-800 rounded-[2px]"></div>
                     </div>
                  </div>

                  {/* High Quality Checkout View */}
                  <div className="bg-gray-50 border-b border-gray-200 p-5 shrink-0 flex flex-col items-center shadow-sm relative overflow-hidden">
                     <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl translate-x-1/2 translate-y-1/2"></div>
                     <p className="text-[9px] text-slate-500 font-bold mb-1 uppercase tracking-widest relative z-10">Amount Due</p>
                     <h2 className="text-[32px] font-black text-slate-900 tracking-tighter relative z-10">$24.50</h2>
                     <p className="text-[9px] text-blue-600 font-semibold mt-1 bg-blue-50 px-2 py-0.5 rounded-full relative z-10">Tap, insert, or swipe</p>
                  </div>

                  {/* Real POS Receipt Grid */}
                  <div className="flex-1 bg-white p-4 flex flex-col gap-3">
                     <div className="flex justify-between items-center text-[11px] border-b border-slate-100 pb-2">
                        <span className="text-slate-600 font-bold">Iced Latte x2</span>
                        <span className="text-slate-900 font-black">$9.00</span>
                     </div>
                     <div className="flex justify-between items-center text-[11px] border-b border-slate-100 pb-2">
                        <span className="text-slate-600 font-bold">Pastry Box</span>
                        <span className="text-slate-900 font-black">$14.00</span>
                     </div>
                     <div className="flex justify-between items-center text-[11px] pb-2 text-emerald-600">
                        <span className="font-bold">Tax (VAT 8%)</span>
                        <span className="font-black">$1.50</span>
                     </div>

                     <div className="mt-auto grid grid-cols-2 gap-2">
                       <div className="bg-slate-100/80 border border-slate-200 text-slate-700 text-[11px] font-black py-2.5 rounded-xl text-center hover:bg-slate-200 transition-colors shadow-sm cursor-pointer">Cash</div>
                       <div className="bg-blue-600 border border-blue-500 text-white shadow-lg shadow-blue-600/30 text-[11px] font-black py-2.5 rounded-xl text-center hover:bg-blue-700 transition-all cursor-pointer">Card</div>
                     </div>
                  </div>
                  
                  {/* Apple glass swipe bar at bottom */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-900 rounded-full opacity-20"></div>
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
