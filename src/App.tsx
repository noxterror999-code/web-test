/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Fuel, 
  TrendingUp, 
  Newspaper, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Menu, 
  X,
  Droplets,
  Info,
  Phone,
  Globe
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OilPrice {
  id: number;
  company: string;
  diesel: number;
  gasohol95: number;
  gasohol91: number;
  gasoholE20: number;
  gasoholE85: number;
  update_time: string;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: string;
}

interface HistoryData {
  date: string;
  diesel: number;
  gasohol95: number;
  gasohol91: number;
}

export default function App() {
  const [prices, setPrices] = useState<OilPrice[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'prices' | 'news' | 'market' | 'contact'>('home');
  const [province, setProvince] = useState('Bangkok');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pricesRes, newsRes, historyRes] = await Promise.all([
          fetch('/api/oilprice'),
          fetch('/api/news'),
          fetch('/api/history')
        ]);
        
        const pricesData = await pricesRes.json();
        const newsData = await newsRes.json();
        const historyData = await historyRes.json();
        
        setPrices(pricesData);
        setNews(newsData);
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto update every hour (simulated)
    const interval = setInterval(() => {
      setLastUpdate(new Date().toLocaleString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
      fetchData();
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  const provinces = ['Bangkok', 'Khon Kaen', 'Udon Thani', 'Chiang Mai', 'Phuket', 'Chonburi'];

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMenuOpen(false);
      }}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
        activeTab === id 
          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
          : "text-slate-600 hover:bg-slate-100"
      )}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium animate-pulse">Loading FuelCheck Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Fuel className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                FuelCheck <span className="text-emerald-600">Thailand</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              <NavItem id="home" label="Home" icon={TrendingUp} />
              <NavItem id="prices" label="Oil Prices" icon={Droplets} />
              <NavItem id="news" label="Energy News" icon={Newspaper} />
              <NavItem id="market" label="Market" icon={Globe} />
              <NavItem id="contact" label="Contact" icon={Phone} />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 animate-in slide-in-from-top duration-200">
            <NavItem id="home" label="Home" icon={TrendingUp} />
            <NavItem id="prices" label="Oil Prices" icon={Droplets} />
            <NavItem id="news" label="Energy News" icon={Newspaper} />
            <NavItem id="market" label="Market" icon={Globe} />
            <NavItem id="contact" label="Contact" icon={Phone} />
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {activeTab === 'home' && "Thailand Oil Price Dashboard"}
              {activeTab === 'prices' && "Detailed Fuel Prices"}
              {activeTab === 'news' && "Energy & Oil News"}
              {activeTab === 'market' && "Global Energy Market"}
              {activeTab === 'contact' && "Contact FuelCheck"}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>Last Updated: {lastUpdate}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <select 
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 cursor-pointer font-medium text-emerald-600"
                >
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          {activeTab === 'home' && (
            <div className="flex gap-2">
              <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Brent Crude</p>
                <p className="text-lg font-bold text-slate-900">$82.45 <span className="text-emerald-500 text-sm font-medium">+1.2%</span></p>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">WTI Crude</p>
                <p className="text-lg font-bold text-slate-900">$78.12 <span className="text-rose-500 text-sm font-medium">-0.4%</span></p>
              </div>
            </div>
          )}
        </div>

        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Diesel', price: prices[0]?.diesel, color: 'bg-blue-500' },
                { label: 'Gasohol 95', price: prices[0]?.gasohol95, color: 'bg-emerald-500' },
                { label: 'Gasohol 91', price: prices[0]?.gasohol91, color: 'bg-amber-500' },
                { label: 'Gasohol E20', price: prices[0]?.gasoholE20, color: 'bg-purple-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", stat.color)}>
                      <Droplets size={20} />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">LIVE</span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900">{stat.price?.toFixed(2)}</span>
                    <span className="text-slate-400 text-sm">THB/L</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Price Table */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-lg">Price Comparison by Brand</h3>
                  <button onClick={() => setActiveTab('prices')} className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:underline">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <th className="px-6 py-4">Company</th>
                        <th className="px-6 py-4">Diesel</th>
                        <th className="px-6 py-4">Gasohol 95</th>
                        <th className="px-6 py-4">Gasohol 91</th>
                        <th className="px-6 py-4">E20</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {prices.slice(0, 6).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                                {item.company[0]}
                              </div>
                              <span className="font-bold text-slate-700">{item.company}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono font-medium">{item.diesel.toFixed(2)}</td>
                          <td className="px-6 py-4 font-mono font-medium">{item.gasohol95.toFixed(2)}</td>
                          <td className="px-6 py-4 font-mono font-medium">{item.gasohol91.toFixed(2)}</td>
                          <td className="px-6 py-4 font-mono font-medium">{item.gasoholE20.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* News Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Latest News</h3>
                    <Newspaper className="text-slate-300" size={20} />
                  </div>
                  <div className="space-y-6">
                    {news.slice(0, 3).map((item) => (
                      <div key={item.id} className="group cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.summary}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('news')}
                    className="w-full mt-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Read All News
                  </button>
                </div>

                <div className="bg-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2">Fuel Saving Tips</h3>
                    <p className="text-emerald-100 text-sm mb-4">Learn how to optimize your vehicle's fuel consumption with our expert guide.</p>
                    <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-emerald-900/20">
                      View Tips
                    </button>
                  </div>
                  <Droplets className="absolute -right-4 -bottom-4 text-emerald-500/30 w-32 h-32" />
                </div>
              </div>
            </div>

            {/* Historical Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="font-bold text-lg">7-Day Price Trend</h3>
                  <p className="text-slate-500 text-sm">Historical average prices across all providers</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-medium text-slate-600">Gasohol 95</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs font-medium text-slate-600">Diesel</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="gasohol95" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="diesel" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prices' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg">Full Price List by Company</h3>
              <p className="text-slate-500 text-sm">Comprehensive list of all fuel types and providers in {province}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase font-bold tracking-wider">
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Diesel</th>
                    <th className="px-6 py-4">Gasohol 95</th>
                    <th className="px-6 py-4">Gasohol 91</th>
                    <th className="px-6 py-4">E20</th>
                    <th className="px-6 py-4">E85</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prices.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                            {item.company[0]}
                          </div>
                          <span className="font-bold text-slate-700">{item.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-blue-600">{item.diesel.toFixed(2)}</td>
                      <td className="px-6 py-4 font-mono font-medium text-emerald-600">{item.gasohol95.toFixed(2)}</td>
                      <td className="px-6 py-4 font-mono font-medium text-amber-600">{item.gasohol91.toFixed(2)}</td>
                      <td className="px-6 py-4 font-mono font-medium text-purple-600">{item.gasoholE20.toFixed(2)}</td>
                      <td className="px-6 py-4 font-mono font-medium text-rose-600">{item.gasoholE85.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="h-48 bg-slate-200 relative">
                  <img 
                    src={`https://picsum.photos/seed/${item.id + 10}/800/600`} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-slate-400 font-medium mb-2">{item.date}</p>
                  <h3 className="font-bold text-xl text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                    {item.summary}
                  </p>
                  <button className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                    Read More <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
              <Globe className="mx-auto text-emerald-600 mb-4" size={48} />
              <h2 className="text-2xl font-bold mb-2">Global Energy Market Insights</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Real-time data from international exchanges including NYMEX, ICE, and TOCOM. 
                Monitor crude oil futures, natural gas, and refined product spreads.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-lg mb-6">Commodity Prices</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Natural Gas', price: '2.45', change: '+0.05', trend: 'up' },
                    { name: 'Heating Oil', price: '2.68', change: '-0.02', trend: 'down' },
                    { name: 'Ethanol', price: '2.15', change: '0.00', trend: 'neutral' },
                    { name: 'Propane', price: '0.85', change: '+0.01', trend: 'up' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <span className="font-bold text-slate-700">{item.name}</span>
                      <div className="text-right">
                        <p className="font-mono font-bold">${item.price}</p>
                        <p className={cn(
                          "text-xs font-bold",
                          item.trend === 'up' ? "text-emerald-500" : item.trend === 'down' ? "text-rose-500" : "text-slate-400"
                        )}>
                          {item.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-lg mb-6">Market Sentiment</h3>
                <div className="flex items-center justify-center h-48 relative">
                  <div className="w-40 h-40 rounded-full border-8 border-slate-100 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-emerald-600">Bullish</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sentiment Index</p>
                    </div>
                  </div>
                  {/* Simple gauge needle simulation */}
                  <div className="absolute w-1 h-20 bg-emerald-600 origin-bottom bottom-1/2 rotate-45 rounded-full"></div>
                </div>
                <p className="text-sm text-slate-500 text-center mt-4">
                  Market sentiment remains positive due to expected demand growth in Asia.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 bg-emerald-600 text-white">
                  <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                  <p className="text-emerald-100 mb-8">
                    Have questions about oil prices or energy trends in Thailand? Our team is here to help.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider">Call Us</p>
                        <p className="font-bold">+66 (0) 2-123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Globe size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider">Email</p>
                        <p className="font-bold">support@fuelcheck.co.th</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider">Office</p>
                        <p className="font-bold">Sukhumvit Rd, Bangkok, Thailand</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Message</label>
                      <textarea 
                        rows={4}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                      ></textarea>
                    </div>
                    <button className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-600 p-1.5 rounded-lg">
                  <Fuel className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  FuelCheck <span className="text-emerald-600">Thailand</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm max-w-sm">
                FuelCheck Thailand provides real-time oil price monitoring and energy market analysis. 
                Our mission is to empower Thai consumers with accurate data for better energy decisions.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="hover:text-emerald-600 cursor-pointer" onClick={() => setActiveTab('home')}>Dashboard</li>
                <li className="hover:text-emerald-600 cursor-pointer" onClick={() => setActiveTab('prices')}>Price List</li>
                <li className="hover:text-emerald-600 cursor-pointer" onClick={() => setActiveTab('news')}>Energy News</li>
                <li className="hover:text-emerald-600 cursor-pointer" onClick={() => setActiveTab('market')}>Market Trends</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="hover:text-emerald-600 cursor-pointer">API Documentation</li>
                <li className="hover:text-emerald-600 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-emerald-600 cursor-pointer">Terms of Service</li>
                <li className="hover:text-emerald-600 cursor-pointer">Cookie Settings</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400 font-medium">
              © 2026 FuelCheck Thailand. All rights reserved. Data provided by Ministry of Energy.
            </p>
            <div className="flex gap-6">
              <div className="flex items-center gap-1 text-xs text-slate-400 font-bold uppercase tracking-widest">
                <Info size={14} />
                <span>Disclaimer</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 font-bold uppercase tracking-widest">
                <Globe size={14} />
                <span>English (TH)</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
