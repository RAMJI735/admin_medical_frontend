'use client'

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import navbarItem from "@/data/navigation.json";
import { useThemeMode } from "@/app/providers";

export const Silder = () => {
    const pathname = usePathname();
    const { isLightTheme } = useThemeMode();

    const [openMenus, setOpenMenus] = useState({});

    const handleMenuClick = (menuId) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    return (
        <aside
            className={`w-[250px] h-screen overflow-y-auto p-4 scrollbar-hide border-r
      ${isLightTheme
                    ? "bg-white border-gray-200"
                    : "bg-[#111827] border-gray-800"
                }`}
        >

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

        </aside>
    );
};