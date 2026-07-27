'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppBar, Toolbar, IconButton, Typography, Avatar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LogoutIcon from '@mui/icons-material/Logout'
import { useThemeMode } from '@/app/providers'
import { useAuth } from "../../services/AuthService/AuthContext"

export default function TopNavbar({
    title = 'Dashboard',
    onMenuClick
}) {
    const router = useRouter()
    const { isLightTheme, toggleTheme } = useThemeMode()
    const { user: authUser, logout } = useAuth()
    
    const user = authUser || { name: 'Admin', role: 'Super Admin' }

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: isLightTheme ? '#ffffff' : '#111827',
                border: isLightTheme ? '1px solid #e2e8f0' : '1px solid #1f2937',
                color: isLightTheme ? '#0f172a' : '#f8fafc',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: isLightTheme ? '0 2px 8px rgba(0,0,0,0.04)' : '0 4px 12px rgba(0,0,0,0.3)',
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: { xs: 2.5, sm: 3 },
                    py: 0.5,
                    gap: 1.5,
                }}
            >

                {/* Left Side */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    <IconButton
                        onClick={onMenuClick}
                        sx={{
                            color: isLightTheme ? '#000' : '#fff'
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: { xs: '14px', sm: '18px' }
                        }}
                    >
                        {title}
                    </Typography>
                </div>

                {/* Right Side */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >

                    {/* Theme Toggle */}
                    <IconButton
                        onClick={toggleTheme}
                        sx={{
                            color: isLightTheme ? '#f59e0b' : '#fff'
                        }}
                    >
                        {
                            isLightTheme
                                ? <LightModeIcon fontSize="small" />
                                : <DarkModeIcon fontSize="small" />
                        }
                    </IconButton>

                    {/* Notification */}
                    <IconButton
                        sx={{
                            color: isLightTheme ? '#000' : '#fff'
                        }}
                    >
                        <NotificationsIcon fontSize="small" />
                    </IconButton>

                    {/* User Profile */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: '#00b8f2',
                                fontWeight: 700,
                                fontSize: '13px'
                            }}
                        >
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </Avatar>

                        <div className="hidden sm:block">
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 600,
                                    lineHeight: 1
                                }}
                            >
                                {user.name}
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'gray'
                                }}
                            >
                                {user.role}
                            </Typography>
                        </div>
                    </div>

                    {/* Logout Icon Button */}
                    <IconButton
                        onClick={handleLogout}
                        title="Logout"
                        sx={{
                            color: isLightTheme ? '#000' : '#fff',
                            '&:hover': {
                                color: '#ef4444',
                                backgroundColor: isLightTheme ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.15)'
                            }
                        }}
                    >
                        <LogoutIcon />
                    </IconButton>

                </div>

            </Toolbar>
        </AppBar>
    )
}