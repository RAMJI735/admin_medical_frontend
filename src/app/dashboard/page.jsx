'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// Import Views
import OverviewView from './components/overview';
import ExpertsView from './components/experts';
import UsersView from './components/users';
import VerificationsView from './components/verifications';
import SettingsView from './components/settings';

// Import JSON Navigation Config
import navigationData from '@/data/navigation.json';

// String-to-SVG Icon Mapper
const IconMap = {
  overview: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
    </svg>
  ),
  experts: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  verifications: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const [currentUser, setCurrentUser] = useState({
    name: 'ShaadiExpert Admin',
    email: 'admin@shaadiexpert.com',
    role: 'Super Admin',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  const handleProfileUpdateFromSettings = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const toggleTheme = () => {
    setIsLightTheme(!isLightTheme);
    document.body.classList.toggle('light-theme');
  };

  // Dynamically filter menu tree by role permissions
  const filteredMenuItems = useMemo(() => {
    return navigationData
      .map((item) => {
        const parentAllowed = item.roles.includes(currentUser.role);
        if (!parentAllowed) return null;

        if (item.submenus) {
          const allowedSubmenus = item.submenus.filter((sub) => sub.roles.includes(currentUser.role));
          if (allowedSubmenus.length === 0) return null;
          return { ...item, submenus: allowedSubmenus };
        }

        return item;
      })
      .filter(Boolean);
  }, [currentUser.role]);

  // Route Guard: Auto-correct if currently active tab falls outside permissions
  useEffect(() => {
    const allowedIds = [];
    filteredMenuItems.forEach((item) => {
      if (item.submenus) {
        item.submenus.forEach((sub) => allowedIds.push(sub.id));
      } else {
        allowedIds.push(item.id);
      }
    });

    if (allowedIds.length > 0 && !allowedIds.includes(activeTab)) {
      setActiveTab(allowedIds[0]);
    }
  }, [filteredMenuItems, activeTab]);

  const toggleSubmenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const getTabLabel = () => {
    for (const item of navigationData) {
      if (item.id === activeTab) return item.label;
      if (item.submenus) {
        const sub = item.submenus.find((s) => s.id === activeTab);
        if (sub) return `${item.label} / ${sub.label}`;
      }
    }
    return 'Dashboard';
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row relative">
      {/* LEFT SIDE: NAVBAR MENU SIDEBAR */}
      <aside
        className={`w-72 bg-card/85 border-r border-border shrink-0 flex flex-col justify-between py-6 px-4 z-30 transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:sticky top-0 bottom-0 left-0 h-screen glass`}
      >
        {/* Sidebar Header / Logo */}
        <div>
          <div className="flex items-center gap-3 px-3.5 mb-8">
            <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-xl">
              <svg className="w-5.5 h-5.5 text-pink-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground leading-none">
                Shaadi<span className="text-pink-500">Expert</span>
              </h1>
              <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase mt-1 block">
                Partner Admin
              </span>
            </div>
          </div>

          {/* Dynamic Navigation Links with Permissions & Submenus */}
          <nav className="space-y-1">
            {filteredMenuItems.map((item) => {
              const hasSubmenus = !!item.submenus;
              const isExpanded = !!expandedMenus[item.id];
              const isParentActive = hasSubmenus && item.submenus.some((sub) => sub.id === activeTab);

              return (
                <div key={item.id} className="space-y-1">
                  {hasSubmenus ? (
                    /* Render Collapsible Menu Parent Trigger */
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                        isParentActive
                          ? 'border-pink-500/10 bg-pink-500/5 text-pink-500 font-bold'
                          : 'text-zinc-400 border-transparent hover:text-foreground hover:bg-zinc-100/10 dark:hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {IconMap[item.icon]}
                        <span>{item.label}</span>
                      </div>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-250 ${isExpanded ? 'rotate-180 text-pink-500' : 'text-zinc-500'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    /* Render Standard Navigation Item */
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 768) {
                          setIsSidebarOpen(false);
                        }
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                        activeTab === item.id
                          ? 'bg-pink-500 text-white border-pink-500/20 shadow-[0_4px_15px_rgba(236,72,153,0.15)] font-bold'
                          : 'text-zinc-400 border-transparent hover:text-foreground hover:bg-zinc-100/10 dark:hover:bg-zinc-900/60'
                      }`}
                    >
                      {IconMap[item.icon]}
                      <span>{item.label}</span>
                    </button>
                  )}

                  {/* Render Nested Submenus */}
                  {hasSubmenus && isExpanded && (
                    <div className="pl-6 space-y-1 border-l border-border ml-6 animate-in slide-in-from-top-1 duration-200">
                      {item.submenus.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveTab(sub.id);
                            if (window.innerWidth < 768) {
                              setIsSidebarOpen(false);
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[11px] font-semibold transition-all border cursor-pointer ${
                            activeTab === sub.id
                              ? 'bg-pink-500 text-white border-pink-500/20 shadow-[0_3px_10px_rgba(236,72,153,0.1)]'
                              : 'text-zinc-400 border-transparent hover:text-foreground hover:bg-zinc-100/10 dark:hover:bg-zinc-900/30'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${activeTab === sub.id ? 'bg-white' : 'bg-zinc-500'}`} />
                          <span>{sub.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Profile info & Sign Out */}
        <div className="border-t border-border pt-6 space-y-4">
          {/* Active Admin Profile Card */}
          <div className="flex gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm select-none shadow-[0_0_15px_rgba(236,72,153,0.1)]">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h5 className="font-bold text-foreground text-xs truncate leading-normal">{currentUser.name}</h5>
              <p className="text-[9px] text-zinc-500 font-bold tracking-wide uppercase mt-0.5">{currentUser.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-background hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-border text-zinc-400 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE: SCREEN MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Right Header Navigation Panel */}
        <header className="sticky top-0 z-20 h-16 bg-background/80 border-b border-border flex items-center justify-between px-6 backdrop-blur-md">
          {/* Menu Drawer Toggle on Mobile */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 bg-card border border-border text-zinc-400 hover:text-foreground rounded-xl md:hidden transition-all"
            >
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h3 className="font-bold text-sm text-foreground/90 capitalize hidden sm:block">
              {getTabLabel()}
            </h3>
          </div>

          {/* Quick Header Widget Panel */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-card/60 hover:bg-card border border-border rounded-xl text-zinc-400 hover:text-foreground transition-all transform active:scale-95 cursor-pointer"
              title="Toggle Dark/Light Mode"
            >
              {isLightTheme ? (
                <svg className="w-4 h-4 text-amber-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464-5.636a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464a1 1 0 10-1.414 1.414l.707.707a1 1 0 101.414-1.414l-.707-.707zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Simulated Notification Tray */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 bg-card/60 hover:bg-card border border-border rounded-xl text-zinc-400 hover:text-foreground transition-all relative transform active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 glass border border-border rounded-2xl shadow-xl p-4 space-y-3 z-40 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-xs font-bold text-foreground">Platform Notifications</span>
                    <button
                      onClick={() => setIsNotifOpen(false)}
                      className="text-[10px] text-pink-500 hover:underline font-semibold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                    <div className="text-[11px] leading-relaxed text-zinc-400">
                      <p className="font-semibold text-foreground">Pending documents submitted</p>
                      <p className="text-zinc-500 mt-0.5">Applicant Sneha Reddy uploaded Aadhar card proof.</p>
                    </div>
                    <div className="text-[11px] leading-relaxed text-zinc-400 border-t border-border pt-2.5">
                      <p className="font-semibold text-foreground">Match Proposal Accepted</p>
                      <p className="text-zinc-500 mt-0.5">Amit Patel accepted proposal sent by Priya Sundaram.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Profile Pill */}
            <div className="flex items-center gap-2.5 bg-card/50 border border-border rounded-xl py-1 pl-1 pr-3 shadow-sm select-none">
              <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-500 font-bold text-xs flex items-center justify-center">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-[11px] font-bold text-foreground/80 truncate max-w-[90px] hidden sm:inline-block">
                {currentUser.name}
              </span>
            </div>
          </div>
        </header>

        {/* Right Viewport Main Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'overview' && <OverviewView />}
          {activeTab === 'experts' && <ExpertsView />}
          {activeTab === 'users' && <UsersView />}
          {activeTab === 'verifications' && <VerificationsView />}
          {activeTab === 'settings' && (
            <SettingsView onProfileUpdate={handleProfileUpdateFromSettings} />
          )}
        </main>
      </div>
    </div>
  );
}
