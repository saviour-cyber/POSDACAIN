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
          <div className="relative perspective-1000 hidden lg:block h-[500px]">
            {/* Desktop Dashboard */}
            <div className="absolute right-0 top-10 w-[600px] h-[380px] bg-[#0b1220]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-4 transform rotate-y-[-10deg] rotate-x-[5deg] translate-x-12 translate-z-[-100px] hover:translate-z-[-80px] hover:rotate-y-[-5deg] transition-all duration-700">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="w-24 h-4 bg-white/10 rounded-full"></div>
                <div className="flex gap-2">
                   <div className="w-6 h-6 bg-white/10 rounded-full"></div>
                   <div className="w-6 h-6 bg-white/10 rounded-full"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 h-[calc(100%-3rem)]">
                <div className="col-span-2 space-y-4 h-full flex flex-col">
                  <div className="h-32 bg-gradient-to-br from-[#4da6ff]/10 to-transparent rounded-xl border border-[#4da6ff]/20 p-4 shrink-0 flex flex-col justify-end">
                    <div className="w-16 h-3 bg-[#4da6ff]/50 rounded-full mb-2"></div>
                    <div className="w-32 h-8 bg-white/80 rounded-md"></div>
                    {/* Tiny Chart */}
                    <div className="w-full h-12 mt-4 border-b border-l border-white/10 relative flex items-end justify-between px-2 pb-1">
                       {[2,4,3,8,5,7,9,6].map((h, i) => (
                           <div key={i} className="w-3 bg-[#4da6ff] rounded-t-sm" style={{ height: `${h}0%` }}></div>
                       ))}
                    </div>
                  </div>
                  <div className="flex gap-4 flex-1">
                    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                       <Package size={24} className="text-[#4da6ff]" />
                    </div>
                    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                       <Users size={24} className="text-purple-400" />
                    </div>
                  </div>
                </div>
                <div className="h-full bg-white/5 rounded-xl border border-white/10 p-3 flex flex-col">
                   <div className="w-16 h-3 bg-white/20 rounded-full mb-4"></div>
                   <div className="flex-1 space-y-3">
                     {[1,2,3,4,5].map(i => (
                        <div key={i} className="flex gap-2 items-center">
                          <div className="w-6 h-6 bg-white/10 rounded-full shrink-0"></div>
                          <div className="w-full h-2 bg-white/10 rounded-full"></div>
                        </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Tablet POS Terminal */}
            <div className="absolute left-10 bottom-0 w-[260px] h-[340px] bg-black border-4 border-gray-800 rounded-[28px] shadow-2xl p-2 transform rotate-y-[15deg] rotate-x-[5deg] translate-z-[100px] hover:translate-z-[120px] hover:rotate-y-[5deg] transition-all duration-700">
               <div className="w-full h-full bg-white rounded-[20px] overflow-hidden flex flex-col">
                  <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-3 shrink-0">
                     <div className="w-12 h-3 bg-gray-300 rounded-full"></div>
                     <div className="w-16 h-5 bg-[#4da6ff] rounded-md"></div>
                  </div>
                  <div className="flex-1 p-2 grid grid-cols-2 gap-2">
                     <div className="bg-red-500 rounded-lg shadow-inner"></div>
                     <div className="bg-blue-500 rounded-lg shadow-inner"></div>
                     <div className="bg-orange-500 rounded-lg shadow-inner"></div>
                     <div className="bg-green-500 rounded-lg shadow-inner"></div>
                     <div className="bg-purple-500 rounded-lg shadow-inner"></div>
                     <div className="bg-[#4da6ff] rounded-lg shadow-inner"></div>
                  </div>
                  <div className="h-16 bg-[#0b1220] m-2 mt-0 rounded-xl shrink-0 flex items-center justify-between px-4">
                     <div className="w-10 h-3 bg-white/30 rounded-full"></div>
                     <div className="w-14 h-4 bg-white rounded-full"></div>
                  </div>
               </div>
               {/* Stand Stand */}
               <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl border-x-4 border-b-4 border-gray-800"></div>
               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-4 bg-gray-800 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.8)]"></div>
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
