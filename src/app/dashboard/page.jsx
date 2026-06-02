'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeMode } from '../providers';

// Material UI Primitives
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  useMediaQuery,
  useTheme,
  Popover,
} from '@mui/material';

// Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import MedicationIcon from '@mui/icons-material/Medication';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShieldIcon from '@mui/icons-material/Shield';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Import Views
import OverviewView from './components/overview';
import SettingsView from './components/settings';
import MedicinesView from './components/medicines';
import OrdersView from './components/orders';
import PrescriptionsView from './components/prescriptions';
import CustomersView from './components/customers';
import SuppliersView from './components/suppliers';
import CouponsView from './components/coupons';
import PaymentsView from './components/payments';
import DeliveryView from './components/delivery';
import ReportsView from './components/reports';
import UsersRolesView from './components/usersRoles';
import StoreSettingsView from './components/storeSettings';

// Import JSON Navigation Config
import navigationData from '@/data/navigation.json';

// Icon Map using MUI Icon instances
const IconMap = {
  overview: <DashboardIcon fontSize="small" />,
  medicines: <MedicationIcon fontSize="small" />,
  orders: <ReceiptLongIcon fontSize="small" />,
  prescriptions: <AssignmentIcon fontSize="small" />,
  customers: <PeopleIcon fontSize="small" />,
  suppliers: <BusinessIcon fontSize="small" />,
  coupons: <ConfirmationNumberIcon fontSize="small" />,
  payments: <PaymentIcon fontSize="small" />,
  delivery: <LocalShippingIcon fontSize="small" />,
  reports: <AssessmentIcon fontSize="small" />,
  usersRoles: <ShieldIcon fontSize="small" />,
  settings: <SettingsIcon fontSize="small" />,
};

// Component Map mapping active tab IDs to views
const componentMap = {
  // Core
  'overview': OverviewView,
  'settings': SettingsView,

  // Medicines
  'all-medicines': MedicinesView,
  'add-medicine': MedicinesView,
  'categories': MedicinesView,
  'brands': MedicinesView,
  'inventory': MedicinesView,
  'expiry-alerts': MedicinesView,

  // Orders
  'new-orders': OrdersView,
  'processing-orders': OrdersView,
  'shipped-orders': OrdersView,
  'delivered-orders': OrdersView,
  'cancelled-orders': OrdersView,

  // Prescriptions
  'pending-verification': PrescriptionsView,
  'approved-prescriptions': PrescriptionsView,
  'rejected-prescriptions': PrescriptionsView,

  // Customers
  'all-customers': CustomersView,
  'customer-groups': CustomersView,

  // Suppliers
  'all-suppliers': SuppliersView,
  'add-supplier': SuppliersView,
  'purchase-orders': SuppliersView,

  // Coupons
  'coupons': CouponsView,
  'promotions': CouponsView,

  // Payments
  'transactions': PaymentsView,
  'refunds': PaymentsView,

  // Delivery
  'delivery-partners': DeliveryView,
  'tracking': DeliveryView,

  // Reports
  'sales-report': ReportsView,
  'inventory-report': ReportsView,
  'customer-report': ReportsView,
  'profit-report': ReportsView,

  // UsersRoles
  'users': UsersRolesView,
  'roles': UsersRolesView,
  'permissions': UsersRolesView,

  // StoreSettings
  'store-information': StoreSettingsView,
  'gst-settings': StoreSettingsView,
  'payment-gateway': StoreSettingsView,
  'email-settings': StoreSettingsView,
  'sms-settings': StoreSettingsView,
};

const drawerWidth = 288;

export default function DashboardPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const { isLightTheme, toggleTheme } = useThemeMode();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [anchorElNotif, setAnchorElNotif] = useState(null);

  const [currentUser, setCurrentUser] = useState({
    name: 'MedRx Admin',
    email: 'admin@medrx.com',
    role: 'Super Admin',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.email === 'admin@shaadiexpert.com' || parsed.name === 'ShaadiExpert Admin') {
        const migrated = {
          ...parsed,
          name: 'MedRx Admin',
          email: 'admin@medrx.com'
        };
        localStorage.setItem('currentUser', JSON.stringify(migrated));
        setCurrentUser(migrated);
      } else {
        setCurrentUser(parsed);
      }
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotifClick = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorElNotif(null);
  };

  const isNotifOpen = Boolean(anchorElNotif);

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

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', py: 3, px: 2 }}>
      {/* Brand Header */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, mb: 4 }}>
          <Box sx={{ p: 1, backgroundColor: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: '12px' }}>
            <MedicationIcon sx={{ color: '#ec4899', display: 'block' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 805, lineHeight: 1, color: 'var(--foreground)' }}>
              Med<span style={{ color: '#ec4899' }}>Rx</span>
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '10px', color: '#71717a', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', mt: 0.5, display: 'block' }}>
              Pharmacy Admin
            </Typography>
          </Box>
        </Box>

        {/* Sidebar Navigation */}
        <List sx={{ p: 0, '& .MuiListItemButton-root': { borderRadius: '12px', mb: 0.5 } }}>
          {filteredMenuItems.map((item) => {
            const hasSubmenus = !!item.submenus;
            const isExpanded = !!expandedMenus[item.id];
            const isParentActive = hasSubmenus && item.submenus.some((sub) => sub.id === activeTab);

            return (
              <Box key={item.id}>
                {hasSubmenus ? (
                  <>
                    <ListItemButton
                      onClick={() => toggleSubmenu(item.id)}
                      sx={{
                        px: 2,
                        py: 1.2,
                        color: isParentActive ? '#ec4899' : '#a1a1aa',
                        backgroundColor: isParentActive ? 'rgba(236, 72, 153, 0.05)' : 'transparent',
                        border: '1px solid',
                        borderColor: isParentActive ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
                        '&:hover': {
                          color: 'var(--foreground)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                        {IconMap[item.icon]}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.label} 
                        primaryTypographyProps={{ fontSize: '12px', fontWeight: isParentActive ? 700 : 600, letterSpacing: '0.02em' }} 
                      />
                      {isExpanded ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
                    </ListItemButton>

                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ pl: 3, borderLeft: '1px solid var(--card-border)', ml: 3, my: 0.5 }}>
                        {item.submenus.map((sub) => {
                          const isSubActive = activeTab === sub.id;
                          return (
                            <ListItemButton
                              key={sub.id}
                              onClick={() => {
                                setActiveTab(sub.id);
                                if (!isMdUp) setMobileOpen(false);
                              }}
                              sx={{
                                pl: 3,
                                py: 0.8,
                                borderRadius: '8px !important',
                                color: isSubActive ? '#ffffff' : '#a1a1aa',
                                backgroundColor: isSubActive ? '#ec4899 !important' : 'transparent',
                                boxShadow: isSubActive ? '0 3px 10px rgba(236,72,153,0.15)' : 'none',
                                '&:hover': {
                                  color: 'var(--foreground)',
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                }
                              }}
                            >
                              <ListItemText 
                                primary={sub.label} 
                                primaryTypographyProps={{ fontSize: '11px', fontWeight: 600 }} 
                              />
                            </ListItemButton>
                          );
                        })}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItemButton
                    onClick={() => {
                      setActiveTab(item.id);
                      if (!isMdUp) setMobileOpen(false);
                    }}
                    sx={{
                      px: 2,
                      py: 1.2,
                      color: activeTab === item.id ? '#ffffff' : '#a1a1aa',
                      backgroundColor: activeTab === item.id ? '#ec4899 !important' : 'transparent',
                      boxShadow: activeTab === item.id ? '0 4px 15px rgba(236,72,153,0.15)' : 'none',
                      border: '1px solid',
                      borderColor: activeTab === item.id ? 'rgba(236, 72, 153, 0.2)' : 'transparent',
                      '&:hover': {
                        color: 'var(--foreground)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                      {IconMap[item.icon]}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{ fontSize: '12px', fontWeight: activeTab === item.id ? 700 : 600, letterSpacing: '0.02em' }} 
                    />
                  </ListItemButton>
                )}
              </Box>
            );
          })}
        </List>
      </Box>

      {/* Sidebar Footer */}
      <Box sx={{ borderTop: '1px solid var(--card-border)', pt: 3 }}>
        <Box sx={{ display: 'flex', gap: 1.5, px: 1, mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              backgroundColor: 'rgba(236, 72, 153, 0.1)', 
              color: '#ec4899', 
              fontSize: '14px', 
              fontWeight: 700, 
              border: '1px solid rgba(236, 72, 153, 0.2)' 
            }}
          >
            {currentUser.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
              {currentUser.name}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '9px', color: '#71717a', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', mt: 0.5 }}>
              {currentUser.role}
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            py: 1.2,
            borderRadius: '12px',
            color: '#a1a1aa',
            borderColor: 'var(--card-border)',
            fontWeight: 700,
            fontSize: '12px',
            '&:hover': {
              color: '#f87171',
              borderColor: 'rgba(239, 68, 68, 0.2)',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
            }
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Mobile Drawer (Collapsible) */}
      {!isMdUp && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              backgroundImage: 'none',
              backdropFilter: 'blur(12px)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop Drawer (Sticky/Permanent Sidebar) */}
      {isMdUp && (
        <Box
          component="nav"
          sx={{ width: drawerWidth, shrink: 0, borderRight: '1px solid var(--card-border)', position: 'sticky', top: 0, height: '100vh' }}
        >
          <Box className="glass" sx={{ height: '100%' }}>
            {drawerContent}
          </Box>
        </Box>
      )}

      {/* Content wrapper */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header App Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: isLightTheme ? 'rgba(255, 255, 255, 0.8)' : 'rgba(9, 9, 11, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--card-border)',
            top: 0,
            zIndex: 10,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!isMdUp && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ color: '#a1a1aa' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '13px' }}>
                {getTabLabel()}
              </Typography>
            </Box>

            {/* Quick Header Widget Panel */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Theme Toggle */}
              <IconButton
                onClick={toggleTheme}
                sx={{
                  p: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  color: isLightTheme ? '#f59e0b' : '#a1a1aa',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                }}
              >
                {isLightTheme ? <LightModeIcon sx={{ fontSize: 18 }} /> : <DarkModeIcon sx={{ fontSize: 18 }} />}
              </IconButton>

              {/* Notification Tray */}
              <Box>
                <IconButton
                  onClick={handleNotifClick}
                  sx={{
                    p: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    color: '#a1a1aa',
                    position: 'relative',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: 18 }} />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#ec4899',
                    }}
                  />
                </IconButton>

                <Popover
                  open={isNotifOpen}
                  anchorEl={anchorElNotif}
                  onClose={handleNotifClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      width: 320,
                      p: 2,
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--card-border)',
                      borderRadius: '16px',
                      color: 'var(--foreground)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid var(--card-border)', mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>Platform Notifications</Typography>
                    <Button size="small" onClick={() => handleNotifClose()} sx={{ color: '#ec4899', fontSize: '10px', p: 0, minWidth: 0, fontWeight: 700 }}>
                      Clear All
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '11px' }}>Pending documents submitted</Typography>
                      <Typography variant="caption" sx={{ color: '#71717a', fontSize: '10px' }}>Applicant Sneha Reddy uploaded Aadhar card proof.</Typography>
                    </Box>
                    <Divider sx={{ opacity: 0.05 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '11px' }}>Prescription uploaded</Typography>
                      <Typography variant="caption" sx={{ color: '#71717a', fontSize: '10px' }}>Ramesh Kumar uploaded doctor prescription for verification.</Typography>
                    </Box>
                  </Box>
                </Popover>
              </Box>

              {/* Quick Profile Pill */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0.5, pr: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--card-border)', borderRadius: '12px' }}>
                <Avatar 
                  sx={{ 
                    width: 28, 
                    height: 28, 
                    borderRadius: '8px', 
                    backgroundColor: 'rgba(236, 72, 153, 0.1)', 
                    color: '#ec4899', 
                    fontSize: '11px', 
                    fontWeight: 700 
                  }}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--foreground)', display: { xs: 'none', sm: 'inline-block' } }}>
                  {currentUser.name}
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Viewport Main Content Wrapper */}
        <Box component="main" sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 3, md: 4 } }}>
          {(() => {
            const ActiveComponent = componentMap[activeTab];
            return ActiveComponent ? (
              <ActiveComponent 
                activeTab={activeTab} 
                onProfileUpdate={activeTab === 'settings' ? handleProfileUpdateFromSettings : undefined} 
              />
            ) : null;
          })()}
        </Box>
      </Box>
    </Box>
  );
}
