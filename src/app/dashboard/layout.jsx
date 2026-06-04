import { Silder } from "@views/sliderbar/Slider";
import TopNavbar from "@views/sliderbar/TabNavbar";


export const metadata = {
  title: "MedRx Pharmacy Admin Portal",
  description: "Pharmaceutical inventory and prescription management console.",
};

export default function RootLayout({ children }) {

  return (
    <div className="flex h-screen w-full">
      <Silder />

      {/* main content */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
        <div className="px-4 pt-4">
          <TopNavbar title={'RedeCare Pharmacy Admin'} />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto rounded-md">
          {children}
        </main>

      </div>

    </div>
  );
}







// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import { useThemeMode } from '../providers';

// // Material UI Primitives
// import {
//   Box,
//   Drawer,
//   AppBar,
//   Toolbar,
//   IconButton,
//   Typography,
//   Avatar,
//   Button,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Divider,
//   useMediaQuery,
//   useTheme,
//   Popover,
// } from '@mui/material';

// // Material UI Icons
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import MedicationIcon from '@mui/icons-material/Medication';
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import PeopleIcon from '@mui/icons-material/People';
// import BusinessIcon from '@mui/icons-material/Business';
// import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
// import PaymentIcon from '@mui/icons-material/Payment';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import AssessmentIcon from '@mui/icons-material/Assessment';
// import ShieldIcon from '@mui/icons-material/Shield';
// import SettingsIcon from '@mui/icons-material/Settings';
// import LogoutIcon from '@mui/icons-material/Logout';
// import MenuIcon from '@mui/icons-material/Menu';
// import LightModeIcon from '@mui/icons-material/LightMode';
// import DarkModeIcon from '@mui/icons-material/DarkMode';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';

// // Import JSON Navigation Config
// import navigationData from '@/data/navigation.json';

// // Icon Map using MUI Icon instances
// const IconMap = {
//   overview: <DashboardIcon fontSize="small" />,
//   medicines: <MedicationIcon fontSize="small" />,
//   orders: <ReceiptLongIcon fontSize="small" />,
//   prescriptions: <AssignmentIcon fontSize="small" />,
//   customers: <PeopleIcon fontSize="small" />,
//   suppliers: <BusinessIcon fontSize="small" />,
//   coupons: <ConfirmationNumberIcon fontSize="small" />,
//   payments: <PaymentIcon fontSize="small" />,
//   delivery: <LocalShippingIcon fontSize="small" />,
//   reports: <AssessmentIcon fontSize="small" />,
//   usersRoles: <ShieldIcon fontSize="small" />,
//   settings: <SettingsIcon fontSize="small" />,
// };

// const drawerWidth = 288;

// export default function DashboardLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

//   const { isLightTheme, toggleTheme } = useThemeMode();
//   const [authorized, setAuthorized] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [expandedMenus, setExpandedMenus] = useState({});
//   const [anchorElNotif, setAnchorElNotif] = useState(null);

//   const [currentUser, setCurrentUser] = useState({
//     name: 'MedRx Admin',
//     email: 'admin@medrx.com',
//     role: 'Super Admin',
//   });

//   useEffect(() => {
//     const loggedIn = localStorage.getItem('isLoggedIn');
//     if (loggedIn !== 'true') {
//       router.push('/');
//     } else {
//       setAuthorized(true);
//     }
//   }, [router]);

//   useEffect(() => {
//     const loadUser = () => {
//       const storedUser = localStorage.getItem('currentUser');
//       if (storedUser) {
//         const parsed = JSON.parse(storedUser);
//         if (parsed.email === 'admin@shaadiexpert.com' || parsed.name === 'ShaadiExpert Admin') {
//           const migrated = {
//             ...parsed,
//             name: 'MedRx Admin',
//             email: 'admin@medrx.com'
//           };
//           localStorage.setItem('currentUser', JSON.stringify(migrated));
//           setCurrentUser(migrated);
//         } else {
//           setCurrentUser(parsed);
//         }
//       }
//     };

//     loadUser();

//     // Listen to custom updates (e.g. from Settings update profile)
//     window.addEventListener('currentUserUpdated', loadUser);
//     return () => window.removeEventListener('currentUserUpdated', loadUser);
//   }, []);

//   // Expand parent menus based on active pathname on mount / navigation
//   useEffect(() => {
//     navigationData.forEach((item) => {
//       if (item.submenus && item.submenus.some((sub) => pathname === sub.link)) {
//         setExpandedMenus((prev) => ({
//           ...prev,
//           [item.id]: true,
//         }));
//       }
//     });
//   }, [pathname]);

//   const handleLogout = () => {
//     localStorage.removeItem('isLoggedIn');
//     localStorage.removeItem('currentUser');
//     router.push('/');
//   };

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleNotifClick = (event) => {
//     setAnchorElNotif(event.currentTarget);
//   };

//   const handleNotifClose = () => {
//     setAnchorElNotif(null);
//   };

//   const isNotifOpen = Boolean(anchorElNotif);

//   // Dynamically filter menu tree by role permissions
//   const filteredMenuItems = useMemo(() => {
//     return navigationData
//       .map((item) => {
//         const parentAllowed = item.roles.includes(currentUser.role);
//         if (!parentAllowed) return null;

//         if (item.submenus) {
//           const allowedSubmenus = item.submenus.filter((sub) => sub.roles.includes(currentUser.role));
//           if (allowedSubmenus.length === 0) return null;
//           return { ...item, submenus: allowedSubmenus };
//         }

//         return item;
//       })
//       .filter(Boolean);
//   }, [currentUser.role]);

//   // Route Guard: Auto-correct if current page falls outside role permissions
//   useEffect(() => {
//     if (!authorized) return;

//     // Skip verification if we are at root dashboard path or profile settings
//     if (pathname === '/dashboard' || pathname === '/dashboard/settings') return;

//     const allowedLinks = [];
//     filteredMenuItems.forEach((item) => {
//       if (item.submenus) {
//         item.submenus.forEach((sub) => {
//           if (sub.link) allowedLinks.push(sub.link);
//         });
//       } else if (item.link) {
//         allowedLinks.push(item.link);
//       }
//     });

//     if (allowedLinks.length > 0 && !allowedLinks.includes(pathname)) {
//       router.push(allowedLinks[0]);
//     }
//   }, [filteredMenuItems, pathname, authorized, router]);

//   const toggleSubmenu = (menuId) => {
//     setExpandedMenus((prev) => ({
//       ...prev,
//       [menuId]: !prev[menuId],
//     }));
//   };

//   const getTabLabel = () => {
//     for (const item of navigationData) {
//       if (item.link === pathname) return item.label;
//       if (item.submenus) {
//         const sub = item.submenus.find((s) => s.link === pathname);
//         if (sub) return `${item.label} / ${sub.label}`;
//       }
//     }
//     if (pathname === '/dashboard/settings') return 'Settings / Profile';
//     return 'Dashboard';
//   };

//   const drawerContent = (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', py: 3, px: 2 }}>
//       {/* Brand Header */}
//       <Box>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, mb: 4 }}>
//           <Box sx={{ p: 1, backgroundColor: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: '12px' }}>
//             <MedicationIcon sx={{ color: '#ec4899', display: 'block' }} />
//           </Box>
//           <Box>
//             <Typography variant="subtitle1" sx={{ fontWeight: 805, lineHeight: 1, color: 'var(--foreground)' }}>
//               Med<span style={{ color: '#ec4899' }}>Rx</span>
//             </Typography>
//             <Typography variant="caption" sx={{ fontSize: '10px', color: '#71717a', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', mt: 0.5, display: 'block' }}>
//               Pharmacy Admin
//             </Typography>
//           </Box>
//         </Box>

//         {/* Sidebar Navigation */}
//         <List sx={{ p: 0, '& .MuiListItemButton-root': { borderRadius: '12px', mb: 0.5 } }}>
//           {filteredMenuItems.map((item) => {
//             const hasSubmenus = !!item.submenus;
//             const isExpanded = !!expandedMenus[item.id];
//             const isParentActive = hasSubmenus && item.submenus.some((sub) => sub.link === pathname);

//             return (
//               <Box key={item.id}>
//                 {hasSubmenus ? (
//                   <>
//                     <ListItemButton
//                       onClick={() => toggleSubmenu(item.id)}
//                       sx={{
//                         px: 2,
//                         py: 1.2,
//                         color: isParentActive ? '#ec4899' : '#a1a1aa',
//                         backgroundColor: isParentActive ? 'rgba(236, 72, 153, 0.05)' : 'transparent',
//                         border: '1px solid',
//                         borderColor: isParentActive ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
//                         '&:hover': {
//                           color: 'var(--foreground)',
//                           backgroundColor: 'rgba(255, 255, 255, 0.05)',
//                         }
//                       }}
//                     >
//                       <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
//                         {IconMap[item.icon]}
//                       </ListItemIcon>
//                       <ListItemText
//                         primary={item.label}
//                         primaryTypographyProps={{ fontSize: '12px', fontWeight: isParentActive ? 700 : 600, letterSpacing: '0.02em' }}
//                       />
//                       {isExpanded ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
//                     </ListItemButton>

//                     <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//                       <List component="div" disablePadding sx={{ pl: 3, borderLeft: '1px solid var(--card-border)', ml: 3, my: 0.5 }}>
//                         {item.submenus.map((sub) => {
//                           const isSubActive = pathname === sub.link;
//                           return (
//                             <ListItemButton
//                               key={sub.id}
//                               component={Link}
//                               href={sub.link || '#'}
//                               onClick={() => {
//                                 if (!isMdUp) setMobileOpen(false);
//                               }}
//                               sx={{
//                                 pl: 3,
//                                 py: 0.8,
//                                 borderRadius: '8px !important',
//                                 color: isSubActive ? '#ffffff' : '#a1a1aa',
//                                 backgroundColor: isSubActive ? '#ec4899 !important' : 'transparent',
//                                 boxShadow: isSubActive ? '0 3px 10px rgba(236,72,153,0.15)' : 'none',
//                                 '&:hover': {
//                                   color: 'var(--foreground)',
//                                   backgroundColor: 'rgba(255, 255, 255, 0.05)',
//                                 }
//                               }}
//                             >
//                               <ListItemText
//                                 primary={sub.label}
//                                 primaryTypographyProps={{ fontSize: '11px', fontWeight: 600 }}
//                               />
//                             </ListItemButton>
//                           );
//                         })}
//                       </List>
//                     </Collapse>
//                   </>
//                 ) : (
//                   <ListItemButton
//                     component={Link}
//                     href={item.link || '#'}
//                     onClick={() => {
//                       if (!isMdUp) setMobileOpen(false);
//                     }}
//                     sx={{
//                       px: 2,
//                       py: 1.2,
//                       color: pathname === item.link ? '#ffffff' : '#a1a1aa',
//                       backgroundColor: pathname === item.link ? '#ec4899 !important' : 'transparent',
//                       boxShadow: pathname === item.link ? '0 4px 15px rgba(236,72,153,0.15)' : 'none',
//                       border: '1px solid',
//                       borderColor: pathname === item.link ? 'rgba(236, 72, 153, 0.2)' : 'transparent',
//                       '&:hover': {
//                         color: 'var(--foreground)',
//                         backgroundColor: 'rgba(255, 255, 255, 0.05)',
//                       }
//                     }}
//                   >
//                     <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
//                       {IconMap[item.icon]}
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={item.label}
//                       primaryTypographyProps={{ fontSize: '12px', fontWeight: pathname === item.link ? 700 : 600, letterSpacing: '0.02em' }}
//                     />
//                   </ListItemButton>
//                 )}
//               </Box>
//             );
//           })}
//         </List>
//       </Box>

//       {/* Sidebar Footer */}
//       <Box sx={{ borderTop: '1px solid var(--card-border)', pt: 3 }}>
//         <Box sx={{ display: 'flex', gap: 1.5, px: 1, mb: 3 }}>
//           <Avatar
//             sx={{
//               width: 40,
//               height: 40,
//               backgroundColor: 'rgba(236, 72, 153, 0.1)',
//               color: '#ec4899',
//               fontSize: '14px',
//               fontWeight: 700,
//               border: '1px solid rgba(236, 72, 153, 0.2)'
//             }}
//           >
//             {currentUser.name.charAt(0).toUpperCase()}
//           </Avatar>
//           <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//             <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
//               {currentUser.name}
//             </Typography>
//             <Typography variant="caption" sx={{ fontSize: '9px', color: '#71717a', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', mt: 0.5 }}>
//               {currentUser.role}
//             </Typography>
//           </Box>
//         </Box>

//         <Button
//           fullWidth
//           variant="outlined"
//           onClick={handleLogout}
//           startIcon={<LogoutIcon />}
//           sx={{
//             py: 1.2,
//             borderRadius: '12px',
//             color: '#a1a1aa',
//             borderColor: 'var(--card-border)',
//             fontWeight: 700,
//             fontSize: '12px',
//             '&:hover': {
//               color: '#f87171',
//               borderColor: 'rgba(239, 68, 68, 0.2)',
//               backgroundColor: 'rgba(239, 68, 68, 0.05)',
//             }
//           }}
//         >
//           Sign Out
//         </Button>
//       </Box>
//     </Box>
//   );

//   if (!authorized) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
//           <p className="text-zinc-400 text-sm font-medium animate-pulse">Verifying credentials...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative', bgcolor: 'var(--background)', color: 'var(--foreground)' }}>
//       {/* Mobile Drawer (Collapsible) */}
//       {!isMdUp && (
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{ keepMounted: true }}
//           sx={{
//             '& .MuiDrawer-paper': {
//               width: drawerWidth,
//               boxSizing: 'border-box',
//               background: 'var(--card-bg)',
//               borderColor: 'var(--card-border)',
//               backgroundImage: 'none',
//               backdropFilter: 'blur(12px)',
//             },
//           }}
//         >
//           {drawerContent}
//         </Drawer>
//       )}

//       {/* Desktop Drawer (Sticky/Permanent Sidebar) */}
//       {isMdUp && (
//         <Box
//           component="nav"
//           sx={{ width: drawerWidth, shrink: 0, borderRight: '1px solid var(--card-border)', position: 'sticky', top: 0, height: '100vh' }}
//         >
//           <Box className="glass" sx={{ height: '100%' }}>
//             {drawerContent}
//           </Box>
//         </Box>
//       )}

//       {/* Content wrapper */}
//       <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
//         {/* Header App Bar */}
//         <AppBar
//           position="sticky"
//           elevation={0}
//           sx={{
//             background: isLightTheme ? 'rgba(255, 255, 255, 0.8)' : 'rgba(9, 9, 11, 0.8)',
//             backdropFilter: 'blur(12px)',
//             borderBottom: '1px solid var(--card-border)',
//             top: 0,
//             zIndex: 10,
//           }}
//         >
//           <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               {!isMdUp && (
//                 <IconButton
//                   color="inherit"
//                   aria-label="open drawer"
//                   edge="start"
//                   onClick={handleDrawerToggle}
//                   sx={{ color: '#a1a1aa' }}
//                 >
//                   <MenuIcon />
//                 </IconButton>
//               )}
//               <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '13px' }}>
//                 {getTabLabel()}
//               </Typography>
//             </Box>

//             {/* Quick Header Widget Panel */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               {/* Theme Toggle */}
//               <IconButton
//                 onClick={toggleTheme}
//                 sx={{
//                   p: 1,
//                   backgroundColor: 'rgba(255, 255, 255, 0.02)',
//                   border: '1px solid var(--card-border)',
//                   borderRadius: '12px',
//                   color: isLightTheme ? '#f59e0b' : '#a1a1aa',
//                   '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
//                 }}
//               >
//                 {isLightTheme ? <LightModeIcon sx={{ fontSize: 18 }} /> : <DarkModeIcon sx={{ fontSize: 18 }} />}
//               </IconButton>

//               {/* Notification Tray */}
//               <Box>
//                 <IconButton
//                   onClick={handleNotifClick}
//                   sx={{
//                     p: 1,
//                     backgroundColor: 'rgba(255, 255, 255, 0.02)',
//                     border: '1px solid var(--card-border)',
//                     borderRadius: '12px',
//                     color: '#a1a1aa',
//                     position: 'relative',
//                     '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
//                   }}
//                 >
//                   <NotificationsIcon sx={{ fontSize: 18 }} />
//                   <Box
//                     sx={{
//                       position: 'absolute',
//                       top: 4,
//                       right: 4,
//                       width: 8,
//                       height: 8,
//                       borderRadius: '50%',
//                       backgroundColor: '#ec4899',
//                     }}
//                   />
//                 </IconButton>

//                 <Popover
//                   open={isNotifOpen}
//                   anchorEl={anchorElNotif}
//                   onClose={handleNotifClose}
//                   anchorOrigin={{
//                     vertical: 'bottom',
//                     horizontal: 'right',
//                   }}
//                   transformOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                   }}
//                   PaperProps={{
//                     sx: {
//                       mt: 1.5,
//                       width: 320,
//                       p: 2,
//                       backgroundColor: 'var(--card-bg)',
//                       borderColor: 'var(--card-border)',
//                       borderRadius: '16px',
//                       color: 'var(--foreground)',
//                       boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
//                     }
//                   }}
//                 >
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid var(--card-border)', mb: 2 }}>
//                     <Typography variant="body2" sx={{ fontWeight: 800 }}>Platform Notifications</Typography>
//                     <Button size="small" onClick={() => handleNotifClose()} sx={{ color: '#ec4899', fontSize: '10px', p: 0, minWidth: 0, fontWeight: 700 }}>
//                       Clear All
//                     </Button>
//                   </Box>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                     <Box>
//                       <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '11px' }}>Pending documents submitted</Typography>
//                       <Typography variant="caption" sx={{ color: '#71717a', fontSize: '10px' }}>Applicant Sneha Reddy uploaded Aadhar card proof.</Typography>
//                     </Box>
//                     <Divider sx={{ opacity: 0.05 }} />
//                     <Box>
//                       <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '11px' }}>Prescription uploaded</Typography>
//                       <Typography variant="caption" sx={{ color: '#71717a', fontSize: '10px' }}>Ramesh Kumar uploaded doctor prescription for verification.</Typography>
//                     </Box>
//                   </Box>
//                 </Popover>
//               </Box>

//               {/* Quick Profile Pill */}
//               <Box
//                 component={Link}
//                 href="/dashboard/settings"
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 1,
//                   p: 0.5,
//                   pr: 1.5,
//                   backgroundColor: 'rgba(255, 255, 255, 0.02)',
//                   border: '1px solid var(--card-border)',
//                   borderRadius: '12px',
//                   textDecoration: 'none',
//                   cursor: 'pointer',
//                   '&:hover': {
//                     backgroundColor: 'rgba(255, 255, 255, 0.05)'
//                   }
//                 }}
//               >
//                 <Avatar
//                   sx={{
//                     width: 28,
//                     height: 28,
//                     borderRadius: '8px',
//                     backgroundColor: 'rgba(236, 72, 153, 0.1)',
//                     color: '#ec4899',
//                     fontSize: '11px',
//                     fontWeight: 700
//                   }}
//                 >
//                   {currentUser.name.charAt(0).toUpperCase()}
//                 </Avatar>
//                 <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--foreground)', display: { xs: 'none', sm: 'inline-block' } }}>
//                   {currentUser.name}
//                 </Typography>
//               </Box>
//             </Box>
//           </Toolbar>
//         </AppBar>

//         {/* Viewport Main Content Wrapper */}
//         <Box component="main" sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 3, md: 4 } }}>
//           {children}
//         </Box>
//       </Box>
//     </Box>
//   );
// }
