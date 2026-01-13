
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Wrench, Package, PlusCircle, Menu, 
  ChevronRight, Settings, LogOut, UserCog, HardHat, Calendar as CalendarIcon,
  ClipboardList, Calculator, Bell, User as UserIcon, X, CheckCircle, 
  DollarSign, Info, Clock, Trash2, Mail, ShieldAlert, Globe, Sun, Moon, Monitor, ChevronDown,
  UserCheck, EyeOff, Shield, Check, Trash, AlertTriangle, Plus, Palette, Zap, Cpu, MessageSquare,
  Car, LayoutGrid, ChevronLeft
} from 'lucide-react';
import { AppData, User, Role, Notification, InvoiceStatus, CustomerType, InvoiceType } from './types';
import { loadData, saveData } from './lib/storage';

// Components
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import CustomerProfile from './components/CustomerProfile';
import ServiceList from './components/ServiceList';
import InventoryManagement from './components/InventoryManagement';
import TeamList from './components/TeamList';
import InvoiceEditor from './components/InvoiceEditor';
import InvoiceArchive from './components/InvoiceArchive';
import InvoiceView from './components/InvoiceView';
import Calendar from './components/Calendar';
import Login from './components/Login';
import SystemSettings from './components/SystemSettings';
import BrandingStudio from './components/BrandingStudio';
import Accounting from './components/Accounting';
import UserProfile from './components/UserProfile';
import PublicBookingPortal from './components/PublicBookingPortal';
import UserManagement from './components/UserManagement';
import AutomationHub from './components/AutomationHub';
import ChatHub from './components/ChatHub';
import CustomerPortal from './components/CustomerPortal';
import VehicleRegistry from './components/VehicleRegistry';
import FloorPlan from './components/FloorPlan';

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(loadData());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [realAdmin, setRealAdmin] = useState<User | null>(null); 
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  
  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      const theme = data.config.themeMode;
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const isDark = theme === 'dark' || (theme === 'system' && systemDark);
      if (isDark) {
        root.classList.add('dark');
        document.documentElement.style.setProperty('--primary-color', data.config.primaryColorDark || '#a78bfa');
      } else {
        root.classList.remove('dark');
        document.documentElement.style.setProperty('--primary-color', data.config.primaryColor || '#7c3aed');
      }
    };
    applyTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => { if (data.config.themeMode === 'system') applyTheme(); };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [data.config.themeMode, data.config.primaryColor, data.config.primaryColorDark]);

  useEffect(() => {
    saveData(data);
    document.title = data.config.appName;
  }, [data]);

  const updateData = (newData: Partial<AppData>) => setData(prev => ({ ...prev, ...newData }));

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = { ...notif, id: Date.now().toString(), timestamp: new Date().toISOString(), read: false };
    updateData({ notifications: [newNotif, ...(data.notifications || [])] });
  };

  const markAsRead = (id: string) => {
    updateData({
      notifications: data.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    });
  };

  const clearNotifications = () => {
    updateData({ notifications: [] });
  };

  const handleImpersonate = (userToShadow: User) => {
    if (!realAdmin && currentUser?.role === Role.ADMIN) setRealAdmin(currentUser);
    setCurrentUser(userToShadow);
  };

  const exitShadowMode = () => { if (realAdmin) { setCurrentUser(realAdmin); setRealAdmin(null); } };

  // Guest Routes Parsing
  const hash = window.location.hash;
  if (hash === '#/booking') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-12">
        <PublicBookingPortal data={data} onBookingComplete={() => {}} />
      </div>
    );
  }

  if (hash.startsWith('#/guest/')) {
    const invId = hash.split('/guest/')[1];
    return <CustomerPortal data={data} invoiceId={invId} updateData={updateData} />;
  }

  if (!currentUser) return <Login config={data.config} users={data.users} onLogin={setCurrentUser} />;

  const isAdmin = currentUser.role === Role.ADMIN;
  const isManager = currentUser.role === Role.MANAGER || isAdmin;
  
  const perms = data.config.rolePermissions?.[currentUser.role] || {
    canSelfDelete: isAdmin,
    modules: isAdmin ? ['finances', 'inventory', 'catalog', 'staffing', 'security'] : (currentUser.role === Role.MANAGER ? ['finances', 'inventory', 'catalog', 'staffing'] : [])
  };

  const filteredNotifications = (data.notifications || []).filter(n => {
    if (perms.modules.includes('finances') || perms.modules.includes('staffing')) return true;
    return n.message.toLowerCase().includes(currentUser.name.toLowerCase()) || n.title.toLowerCase().includes(currentUser.name.toLowerCase()) || n.type === 'system';
  });

  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
        {realAdmin && (
          <div className="bg-amber-500 text-white py-1.5 px-6 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest no-print z-[60]">
             <UserCheck size={14}/> Shadow Mode: Viewing as {currentUser.name}
             <button onClick={exitShadowMode} className="bg-white text-amber-600 px-3 py-0.5 rounded-full hover:bg-amber-50 transition-colors flex items-center gap-1"><EyeOff size={12}/> Exit Shadow</button>
          </div>
        )}

        <div className="flex-1 flex min-h-0 relative overflow-hidden">
          {(isSidebarOpen || isNotifOpen) && (
            <div 
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-40 transition-opacity animate-in fade-in" 
              onClick={() => { setSidebarOpen(false); setNotifOpen(false); }} 
            />
          )}

          <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-900 z-[70] shadow-2xl border-l border-slate-200 dark:border-slate-800 transition-transform duration-300 transform ${isNotifOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col">
              <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                <div>
                  <h3 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                    <Bell size={16} className="text-primary" /> Alerts
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{unreadCount} Unread Actions</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={clearNotifications} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"><Trash size={16} /></button>
                  <button onClick={() => setNotifOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><X size={18} /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredNotifications.length > 0 ? filteredNotifications.map(notif => (
                  <div key={notif.id} className={`p-4 rounded-2xl border transition-all group relative ${notif.read ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800' : 'bg-primary/5 dark:bg-primary/10 border-primary/20 shadow-sm'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-xl shrink-0 ${notif.type === 'issue' ? 'bg-rose-50 text-rose-500' : notif.type === 'billing' ? 'bg-emerald-50 text-emerald-500' : notif.type === 'work' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-50'}`}>
                        {notif.type === 'issue' ? <AlertTriangle size={14}/> : notif.type === 'billing' ? <DollarSign size={14}/> : notif.type === 'work' ? <Wrench size={14}/> : <Info size={14}/>}
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="text-[11px] font-black text-slate-900 dark:text-slate-100 mb-0.5">{notif.title}</div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{notif.message}</p>
                        <div className="mt-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1.5"><Clock size={8}/> {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      {!notif.read && <button onClick={() => markAsRead(notif.id)} className="absolute top-4 right-4 p-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 rounded-lg"><Check size={12} /></button>}
                    </div>
                  </div>
                )) : <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-30"><div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center"><Bell size={24} className="text-slate-400" /></div><p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inbox is empty</p></div>}
              </div>
            </div>
          </div>

          <aside className={`fixed lg:static inset-y-0 left-0 bg-slate-900 dark:bg-slate-950 text-white z-50 flex flex-col transform transition-all duration-300 border-r border-slate-800 lg:border-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex-1 flex flex-col overflow-y-auto p-4 scrollbar-hide">
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-2'} mb-8 shrink-0 relative transition-all`}>
                <div className={`w-10 h-10 bg-primary rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-primary/20 transition-all ${isSidebarCollapsed ? 'scale-90' : ''}`}>
                  {data.config.logoUrl ? <img src={data.config.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <Wrench className="w-5 h-5 text-white" />}
                </div>
                {!isSidebarCollapsed && (
                  <div className="min-w-0 animate-in fade-in duration-300">
                    <h1 className="text-base font-black tracking-tight truncate">{data.config.appName}</h1>
                    <p className="text-[8px] text-slate-500 truncate uppercase tracking-[0.15em] font-black">{data.config.appTagline}</p>
                  </div>
                )}
              </div>

              <nav className="space-y-1">
                <SidebarLink to="/" icon={<LayoutDashboard size={18} />} label="Overview" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />
                <SidebarLink to="/calendar" icon={<CalendarIcon size={18} />} label="Schedule" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />
                
                <div className={`pt-6 pb-2 text-[10px] font-black text-slate-600 uppercase tracking-widest ${isSidebarCollapsed ? 'text-center' : 'ml-4'}`}>
                  {isSidebarCollapsed ? '•' : 'Workshop Intelligence'}
                </div>
                <SidebarLink to="/floor" icon={<LayoutGrid size={18}/>} label="Floor Plan" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />
                <SidebarLink to="/vehicles" icon={<Car size={18}/>} label="Vehicles" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />

                <div className={`pt-6 pb-2 text-[10px] font-black text-slate-600 uppercase tracking-widest ${isSidebarCollapsed ? 'text-center' : 'ml-4'}`}>
                  {isSidebarCollapsed ? '•' : 'Operations'}
                </div>
                {isManager && <SidebarLink to="/invoices/new" icon={<PlusCircle size={18} />} label="New Job" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />}
                <SidebarLink to="/invoices" icon={<ClipboardList size={18} />} label="Work Orders" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />
                <SidebarLink to="/customers" icon={<Users size={18} />} label="Clients" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />
                <SidebarLink to="/chat" icon={<MessageSquare size={18} />} label="Staff Chat" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />
                
                {isManager && (
                  <>
                    <div className={`pt-6 pb-2 text-[10px] font-black text-slate-600 uppercase tracking-widest ${isSidebarCollapsed ? 'text-center' : 'ml-4'}`}>
                      {isSidebarCollapsed ? '•' : 'Governance'}
                    </div>
                    {perms.modules.includes('finances') && <SidebarLink to="/accounting" icon={<Calculator size={18} />} label="Financials" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />}
                    {perms.modules.includes('catalog') && <SidebarLink to="/services" icon={<Wrench size={18} />} label="Services" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />}
                    {perms.modules.includes('inventory') && <SidebarLink to="/inventory" icon={<Package size={18} />} label="Inventory" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />}
                    {perms.modules.includes('staffing') && <SidebarLink to="/team" icon={<HardHat size={18} />} label="Team" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />}
                  </>
                )}
                {isManager && (
                  <>
                    <div className={`pt-6 pb-2 text-[10px] font-black text-slate-600 uppercase tracking-widest ${isSidebarCollapsed ? 'text-center' : 'ml-4'}`}>
                      {isSidebarCollapsed ? '•' : 'System'}
                    </div>
                    <SidebarLink to="/users" icon={<Shield size={18} />} label="User Access" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />
                    {isAdmin && <SidebarLink to="/automation" icon={<Zap size={18} />} label="Automation" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />}
                    {isAdmin && <SidebarLink to="/branding" icon={<Palette size={18} />} label="Branding" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />}
                    {isAdmin && <SidebarLink to="/settings" icon={<Settings size={18} />} label="Global Settings" collapsed={isSidebarCollapsed} onClick={() => setSidebarOpen(false)} />}
                  </>
                )}
              </nav>
            </div>
            
            <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-900/50">
              <Link to="/profile" className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-3'} py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group`}>
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black text-[10px] border border-primary/20 shrink-0">{currentUser.name.charAt(0)}</div>
                {!isSidebarCollapsed && (
                  <div className="min-w-0 flex-1 animate-in fade-in duration-300">
                    <div className="text-[11px] font-black truncate text-white">{currentUser.name}</div>
                    <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{currentUser.role}</div>
                  </div>
                )}
                {!isSidebarCollapsed && <button onClick={(e) => { e.preventDefault(); setCurrentUser(null); }} className="p-1.5 text-slate-500 hover:text-rose-500 transition-colors" title="Sign Out"><LogOut size={14} /></button>}
              </Link>
            </div>
          </aside>

          <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 transition-colors overflow-hidden">
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-8 no-print shrink-0 transition-colors">
              <div className="flex items-center gap-4">
                <button 
                  className="hidden lg:flex p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                  onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                >
                  {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
                <button className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setSidebarOpen(true)}>
                  <Menu size={20} />
                </button>
                <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight"><RouteTitle /></h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Workshop Online</span>
                </div>
                {isManager && <Link to="/invoices/new" title="New Job Entry" className="p-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all"><Plus size={18} /></Link>}
                <button onClick={() => setNotifOpen(true)} className={`p-2 rounded-xl relative transition-all group ${isNotifOpen ? 'bg-slate-100 dark:bg-slate-800 text-primary' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  <Bell size={18} className={unreadCount > 0 ? 'animate-ring' : ''} />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-lg">{unreadCount}</span>}
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
                <UserMenu currentUser={currentUser} setCurrentUser={setCurrentUser} data={data} updateData={updateData} />
              </div>
            </header>

            <div className="flex-1 p-6 lg:p-8 overflow-y-auto scrollbar-hide">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 h-full">
                <Routes>
                  <Route path="/" element={<Dashboard data={data} user={currentUser} updateData={updateData} />} />
                  <Route path="/calendar" element={<Calendar data={data} updateData={updateData} user={currentUser} />} />
                  <Route path="/vehicles" element={<VehicleRegistry data={data} updateData={updateData} />} />
                  <Route path="/floor" element={<FloorPlan data={data} updateData={updateData} />} />
                  <Route path="/customers" element={<CustomerList data={data} updateData={updateData} role={currentUser.role} user={currentUser} />} />
                  <Route path="/customer/:id" element={<CustomerProfile data={data} updateData={updateData} user={currentUser} />} />
                  <Route path="/services" element={perms.modules.includes('catalog') ? <ServiceList data={data} updateData={updateData} role={currentUser.role} /> : <Navigate to="/" />} />
                  <Route path="/inventory" element={perms.modules.includes('inventory') ? <InventoryManagement data={data} updateData={updateData} role={currentUser.role} /> : <Navigate to="/" />} />
                  <Route path="/team" element={perms.modules.includes('staffing') ? <TeamList data={data} updateData={updateData} role={currentUser.role} onImpersonate={handleImpersonate} /> : <Navigate to="/" />} />
                  <Route path="/invoices" element={<InvoiceArchive data={data} updateData={updateData} user={currentUser} />} />
                  <Route path="/invoices/new" element={isAdmin || perms.modules.includes('finances') ? <InvoiceEditor data={data} updateData={updateData} user={currentUser} addNotification={addNotification} /> : <Navigate to="/" />} />
                  <Route path="/invoices/edit/:id" element={<InvoiceEditor data={data} updateData={updateData} user={currentUser} addNotification={addNotification} />} />
                  <Route path="/invoices/view/:id" element={<InvoiceView data={data} user={currentUser} />} />
                  <Route path="/accounting" element={perms.modules.includes('finances') ? <Accounting data={data} updateData={updateData} user={currentUser} /> : <Navigate to="/" />} />
                  <Route path="/users" element={isManager ? <UserManagement data={data} updateData={updateData} currentUser={currentUser} /> : <Navigate to="/" />} />
                  <Route path="/branding" element={isAdmin ? <BrandingStudio data={data} updateData={updateData} currentUser={currentUser} /> : <Navigate to="/" />} />
                  <Route path="/settings" element={isAdmin ? <SystemSettings data={data} updateData={updateData} currentUser={currentUser} /> : <Navigate to="/" />} />
                  <Route path="/automation" element={isAdmin ? <AutomationHub data={data} updateData={updateData} currentUser={currentUser} /> : <Navigate to="/" />} />
                  <Route path="/profile" element={<UserProfile data={data} user={currentUser} updateData={updateData} />} />
                  <Route path="/chat" element={<ChatHub data={data} currentUser={currentUser} updateData={updateData} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </div>
      <style>{`@keyframes ring { 0% { transform: rotate(0); } 10% { transform: rotate(15deg); } 20% { transform: rotate(-15deg); } 30% { transform: rotate(10deg); } 40% { transform: rotate(-10deg); } 50% { transform: rotate(5deg); } 60% { transform: rotate(-5deg); } 100% { transform: rotate(0); } } .animate-ring { animation: ring 1.5s ease-in-out infinite; transform-origin: top center; }`}</style>
    </HashRouter>
  );
};

const UserMenu: React.FC<{ currentUser: User; setCurrentUser: any; data: AppData; updateData: any }> = ({ currentUser, setCurrentUser, data, updateData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const click = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  const toggleTheme = () => {
    const nextMode = data.config.themeMode === 'light' ? 'dark' : (data.config.themeMode === 'dark' ? 'system' : 'light');
    updateData({ config: { ...data.config, themeMode: nextMode } });
  };

  const getThemeIcon = () => {
    if (data.config.themeMode === 'light') return <Sun size={14} />;
    if (data.config.themeMode === 'dark') return <Moon size={14} />;
    return <Monitor size={14} />;
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2.5 p-1 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] shrink-0 border border-primary/5">{currentUser.name.charAt(0)}</div>
        <div className="hidden sm:block text-left"><div className="text-[10px] font-black text-slate-900 dark:text-slate-100 leading-none mb-0.5">{currentUser.name}</div><div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{currentUser.role}</div></div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-[100] animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account</p></div>
          <button onClick={toggleTheme} className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest"><div className="flex items-center gap-3">{getThemeIcon()}<span>Mode: {data.config.themeMode}</span></div><div className="w-6 h-3 bg-slate-200 dark:bg-slate-700 rounded-full relative"><div className={`absolute top-0.5 w-2 h-2 bg-white rounded-full transition-all ${data.config.themeMode === 'light' ? 'left-0.5' : (data.config.themeMode === 'dark' ? 'left-3.5' : 'left-2')}`} /></div></button>
          <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-[10px] font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest"><UserIcon size={14} className="text-primary"/> My Identity</Link>
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-4" /><button onClick={() => { setCurrentUser(null); }} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-left transition-colors uppercase tracking-widest"><LogOut size={14} /> Sign Out</button>
        </div>
      )}
    </div>
  );
};

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: string; collapsed: boolean; onClick: () => void }> = ({ to, icon, label, collapsed, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} onClick={onClick} className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between px-4'} py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 hover:bg-slate-800/50 dark:hover:bg-slate-900 hover:text-white'}`}>
      <div className="flex items-center gap-3">
        <div className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-primary'}`}>{icon}</div>
        {!collapsed && <span className={`text-[12px] font-black uppercase tracking-tight animate-in fade-in duration-300 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{label}</span>}
      </div>
      {!collapsed && isActive && <div className="w-1 h-1 rounded-full bg-white animate-pulse" />}
      {collapsed && isActive && <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}
    </Link>
  );
};

const RouteTitle: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  if (path === '/') return <>Overview</>;
  if (path === '/calendar') return <>Schedule</>;
  if (path === '/vehicles') return <>Vehicles</>;
  if (path === '/floor') return <>Floor Plan</>;
  if (path === '/invoices') return <>Work Orders</>;
  if (path === '/customers') return <>Clients</>;
  if (path === '/accounting') return <>Financials</>;
  if (path === '/services') return <>Services</>;
  if (path === '/inventory') return <>Inventory</>;
  if (path === '/team') return <>Team</>;
  if (path === '/users') return <>User Access</>;
  if (path === '/automation') return <>Automation</>;
  if (path === '/branding') return <>Branding</>;
  if (path === '/settings') return <>Global Settings</>;
  if (path === '/chat') return <>Staff Chat</>;
  if (path.startsWith('/invoices/new')) return <>New Job</>;
  if (path === '/profile') return <>Personal Profile</>;
  if (path.startsWith('/customer/')) return <>Client Record</>;
  return <>AutoFix Pro</>;
};

export default App;
