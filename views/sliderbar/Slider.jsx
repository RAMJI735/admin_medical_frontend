'use client'

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LogoutIcon from "@mui/icons-material/Logout";

import navbarItem from "@/data/navigation.json";
import { useThemeMode } from "@/app/providers";
import { useAuth } from "../../services/AuthService/AuthContext";

export const Silder = ({ onClose }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { isLightTheme } = useThemeMode();
    const { isAuthenticated, loading, logout } = useAuth();

    const [openMenus, setOpenMenus] = useState({});

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, loading, router]);

    const handleMenuClick = (menuId) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const handleLogout = () => {
        if (onClose) onClose();
        logout();
        router.push('/');
    };

    return (
        <aside
            className={`w-[260px] h-full p-4 flex flex-col justify-between border-r
      ${isLightTheme
                    ? "bg-white border-gray-200"
                    : "bg-[#111827] border-gray-800"
                }`}
        >
            <div className="flex-1 overflow-y-auto scrollbar-hide pr-1">

                {/* Logo */}

                <div
                    className={`flex items-center gap-3 p-3 mb-6 rounded-xl
            ${isLightTheme
                            ? "bg-gray-100"
                            : "bg-white/10"
                        }`}
                >
                    <div className="p-2 bg-[#00b8f2]/10 border border-[#00b8f2]/20 rounded-xl">
                        <span className="text-[#00b8f2] text-xl">💊</span>
                    </div>

                    <div>
                        <h1
                            className={`font-bold text-lg leading-none
                ${isLightTheme
                                    ? "text-black"
                                    : "text-white"
                                }`}
                        >
                            Rede<span className="text-[#00b8f2]">Care</span>
                        </h1>

                        <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase mt-1 block">
                            Pharmacy Admin
                        </span>
                    </div>
                </div>

                {/* Menus */}

                {navbarItem.map((item) => {

                    const isParentActive =
                        item.link === pathname ||
                        item.submenus?.some(
                            (sub) => sub.link === pathname
                        );

                    return (
                        <div key={item.id} className="mb-1">

                            {/* Parent Menu */}

                            {item.submenus ? (

                                <div
                                    onClick={() => handleMenuClick(item.id)}
                                    className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-all
                    ${isParentActive
                                            ? "bg-[#00b8f2] text-white"
                                            : isLightTheme
                                                ? "text-black hover:bg-gray-100"
                                                : "text-white hover:bg-white/10"
                                        }`}
                                >
                                    <span>{item.label}</span>

                                    {
                                        openMenus[item.id]
                                            ? <KeyboardArrowDownIcon fontSize="small" />
                                            : <KeyboardArrowRightIcon fontSize="small" />
                                    }
                                </div>

                            ) : (

                                <Link
                                    href={item.link}
                                    onClick={() => onClose?.()}
                                    className={`block p-3 rounded-lg transition-all
                    ${pathname === item.link
                                            ? "bg-[#00b8f2] text-white"
                                            : isLightTheme
                                                ? "text-black hover:bg-gray-100"
                                                : "text-white hover:bg-white/10"
                                        }`}
                                >
                                    {item.label}
                                </Link>

                            )}

                            {/* Submenus */}

                            {item.submenus && (

                                <Collapse
                                    in={openMenus[item.id] || isParentActive}
                                    timeout="auto"
                                >

                                    <div className="flex flex-col gap-1 ml-4 mt-2">

                                        {item.submenus.map((subItem) => (

                                            <Link
                                                key={subItem.id}
                                                href={subItem.link}
                                                onClick={() => onClose?.()}
                                                className={`p-2 rounded-lg text-sm transition-all
                          ${pathname === subItem.link
                                                        ? "bg-[#00b8f2] text-white"
                                                        : isLightTheme
                                                            ? "text-gray-700 hover:bg-gray-100"
                                                            : "text-gray-300 hover:bg-white/5"
                                                    }`}
                                            >
                                                {subItem.label}
                                            </Link>

                                        ))}

                                    </div>

                                </Collapse>

                            )}

                        </div>
                    );
                })}
            </div>

            {/* Logout Button */}
            <div className={`pt-4 border-t mt-4 ${
                isLightTheme ? "border-gray-200" : "border-gray-800"
            }`}>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 active:scale-[0.98] transition-all font-semibold text-sm cursor-pointer"
                >
                    <LogoutIcon fontSize="small" />
                    Logout
                </button>
            </div>

        </aside>
    );
};