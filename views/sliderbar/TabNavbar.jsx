'use client'

import { AppBar, Toolbar, IconButton, Typography, Avatar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useThemeMode } from '@/app/providers'

export default function TopNavbar({
    title = 'Dashboard',
    onMenuClick
}) {

    const { isLightTheme, toggleTheme } = useThemeMode()

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: isLightTheme ? '#ffffff' : '#111111',
                borderBottom: '1px solid #333',
                color: isLightTheme ? '#000' : '#fff'
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
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
                            fontWeight: 600
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
                        gap: '12px'
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
                                ? <LightModeIcon />
                                : <DarkModeIcon />
                        }
                    </IconButton>

                    {/* Notification */}
                    <IconButton
                        sx={{
                            color: isLightTheme ? '#000' : '#fff'
                        }}
                    >
                        <NotificationsIcon />
                    </IconButton>

                    {/* User Profile */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 35,
                                height: 35,
                                bgcolor: '#00b8f2'
                            }}
                        >
                            A
                        </Avatar>

                        <div>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 600,
                                    lineHeight: 1
                                }}
                            >
                                Admin
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'gray'
                                }}
                            >
                                Super Admin
                            </Typography>
                        </div>
                    </div>

                </div>

            </Toolbar>
        </AppBar>
    )
}