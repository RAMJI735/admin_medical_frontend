'use client';

import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Silder } from "@views/sliderbar/Slider";
import TopNavbar from "@views/sliderbar/TabNavbar";
import { useThemeMode } from "@/app/providers";

export default function RootLayout({ children }) {
  const { isLightTheme } = useThemeMode();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300 ${
      isLightTheme ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Desktop Sidebar (Sticky/Permanent) */}
      <div className="hidden md:block shrink-0 h-full">
        <Silder />
      </div>

      {/* Mobile Drawer Sidebar (Collapsible Overlay) */}
      <Drawer
        open={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 260,
            backgroundColor: isLightTheme ? '#ffffff' : '#111827',
            borderColor: isLightTheme ? '#e2e8f0' : '#1f2937',
            borderRight: '1px solid',
          }
        }}
      >
        <Silder onClose={() => setIsMobileOpen(false)} />
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <div className="px-3 sm:px-6 pt-3 sm:pt-4 pb-2">
          <TopNavbar
            title={'RedeCare Pharmacy Admin'}
            onMenuClick={() => setIsMobileOpen((prev) => !prev)}
          />
        </div>

        {/* Page Viewport */}
        <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
