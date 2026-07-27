'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PermissionService } from '../services/permission/permissionService';
import { useThemeMode } from '@/app/providers';
import { Autocomplete, TextField, Snackbar, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ShieldIcon from '@mui/icons-material/Shield';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const DEFAULT_ROLES = [
    { id: 'superadmin', name: 'Super Admin', description: 'Full system access & database permissions' },
    { id: 'user', name: 'user', description: 'Access to prescriptions, medicine stock & logs' },
    { id: 'support', name: 'Support Staff', description: 'View customer orders and handle ticket queries' },
    { id: 'manager', name: 'Store Manager', description: 'Inventory management and staff overview' },
    { id: 'delivery', name: 'Delivery Boy', description: "Deliver Medicine to customer's doorstep" }
];

export default function PermissionList({ PermissionData = [], onSave }) {
    const { isLightTheme, toggleTheme } = useThemeMode();
    const [roles, setRoles] = useState(DEFAULT_ROLES);
    const [selectedRole, setSelectedRole] = useState('superadmin');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Extract all permission action types (e.g. ['add', 'view', 'edit', 'delete'])
    const allActions = useMemo(() => {
        const actionsSet = new Set();
        PermissionData.forEach((item) => {
            item.permission?.forEach((p) => actionsSet.add(p));
        });
        return Array.from(actionsSet);
    }, [PermissionData]);

    // Initial permission state matrix keyed by role -> menu -> action (boolean)
    const [rolePermissions, setRolePermissions] = useState(() => {
        const initialState = {};
        DEFAULT_ROLES.forEach((role) => {
            initialState[role.id] = {};
            PermissionData.forEach((item) => {
                initialState[role.id][item.menu] = {};
                item.permission?.forEach((action) => {
                    if (role.id === 'superadmin') {
                        initialState[role.id][item.menu][action] = true;
                    } else {
                        initialState[role.id][item.menu][action] = action === 'view';
                    }
                });
            });
        });
        return initialState;
    });

    // Fetch saved permissions from backend on mount
    useEffect(() => {
        const fetchBackendPermissions = async () => {
            try {
                setLoading(true);
                const res = await PermissionService.getPermissions();
                if (Array.isArray(res)) {
                    const backendRoleKeys = new Set(DEFAULT_ROLES.map((r) => r.id));
                    res.forEach((doc) => {
                        if (doc.role) backendRoleKeys.add(doc.role);
                    });

                    const updatedRolesList = Array.from(backendRoleKeys).map((roleId) => {
                        const existing = DEFAULT_ROLES.find((r) => r.id === roleId);
                        return existing || { id: roleId, name: roleId, description: 'Saved role configuration from database' };
                    });

                    setRoles(updatedRolesList);

                    setRolePermissions((prev) => {
                        const newState = { ...prev };
                        res.forEach((doc) => {
                            const roleKey = doc.role;
                            if (roleKey && Array.isArray(doc.permissions)) {
                                if (!newState[roleKey]) {
                                    newState[roleKey] = {};
                                }

                                PermissionData.forEach((item) => {
                                    newState[roleKey][item.menu] = {};
                                    item.permission?.forEach((act) => {
                                        newState[roleKey][item.menu][act] = false;
                                    });
                                });

                                doc.permissions.forEach((permStr) => {
                                    const [menu, action] = permStr.split(':');
                                    if (menu && action && newState[roleKey]?.[menu]) {
                                        newState[roleKey][menu][action] = true;
                                    }
                                });
                            }
                        });
                        return newState;
                    });
                }
            } catch (err) {
                console.error("Failed to fetch permissions from backend:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBackendPermissions();
    }, [PermissionData]);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const showToast = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    // Current active role permissions object
    const currentPermissions = useMemo(() => {
        if (rolePermissions[selectedRole]) {
            return rolePermissions[selectedRole];
        }
        const defaultMatrix = {};
        PermissionData.forEach((item) => {
            defaultMatrix[item.menu] = {};
            item.permission?.forEach((action) => {
                defaultMatrix[item.menu][action] = selectedRole === 'superadmin';
            });
        });
        return defaultMatrix;
    }, [rolePermissions, selectedRole, PermissionData]);

    // Toggle single permission checkbox
    const handleTogglePermission = (menu, action) => {
        setRolePermissions((prev) => {
            const roleState = { ...(prev[selectedRole] || currentPermissions) };
            const menuState = { ...(roleState[menu] || {}) };
            menuState[action] = !menuState[action];
            return {
                ...prev,
                [selectedRole]: {
                    ...roleState,
                    [menu]: menuState,
                },
            };
        });
    };

    // Toggle row select all for a specific menu
    const handleToggleRowSelectAll = (menu, actions) => {
        const currentMenuObj = currentPermissions[menu] || {};
        const isAllChecked = actions.every((act) => currentMenuObj[act]);

        setRolePermissions((prev) => {
            const roleState = { ...(prev[selectedRole] || currentPermissions) };
            const updatedMenuState = {};
            actions.forEach((act) => {
                updatedMenuState[act] = !isAllChecked;
            });
            return {
                ...prev,
                [selectedRole]: {
                    ...roleState,
                    [menu]: updatedMenuState,
                },
            };
        });
    };

    // Toggle column select all for a specific action
    const handleToggleColumnSelectAll = (action) => {
        const isColumnAllChecked = PermissionData.every(
            (item) => currentPermissions[item.menu]?.[action]
        );

        setRolePermissions((prev) => {
            const roleState = { ...(prev[selectedRole] || currentPermissions) };
            PermissionData.forEach((item) => {
                if (item.permission?.includes(action)) {
                    roleState[item.menu] = {
                        ...(roleState[item.menu] || {}),
                        [action]: !isColumnAllChecked,
                    };
                }
            });
            return {
                ...prev,
                [selectedRole]: roleState,
            };
        });
    };

    // Toggle global select all
    const isGlobalAllChecked = useMemo(() => {
        return PermissionData.every((item) =>
            item.permission?.every((act) => currentPermissions[item.menu]?.[act])
        );
    }, [PermissionData, currentPermissions]);

    const handleToggleGlobalSelectAll = () => {
        setRolePermissions((prev) => {
            const roleState = { ...(prev[selectedRole] || currentPermissions) };
            PermissionData.forEach((item) => {
                const menuObj = {};
                item.permission?.forEach((act) => {
                    menuObj[act] = !isGlobalAllChecked;
                });
                roleState[item.menu] = menuObj;
            });
            return {
                ...prev,
                [selectedRole]: roleState,
            };
        });
    };

    // Reset current role permissions
    const handleReset = () => {
        setRolePermissions((prev) => {
            const roleState = {};
            PermissionData.forEach((item) => {
                roleState[item.menu] = {};
                item.permission?.forEach((act) => {
                    roleState[item.menu][act] = selectedRole === 'superadmin';
                });
            });
            return { ...prev, [selectedRole]: roleState };
        });
        showToast(`Permissions reset for ${selectedRole}`, 'info');
    };

    // Save current configuration to backend
    const handleSave = async () => {
        if (!selectedRole || !selectedRole.trim()) {
            showToast('Please select or enter a valid role name', 'error');
            return;
        }

        const cleanRole = selectedRole.trim();
        try {
            setSaving(true);
            const permission = Object.entries(currentPermissions).flatMap(([menu, actions]) =>
                Object.entries(actions)
                    .filter(([, allowed]) => allowed)
                    .map(([action]) => `${menu}:${action}`)
            );

            const payload = { role: cleanRole, permissions: permission, permission };
            console.log("Saving Permission Payload:", payload);

            await PermissionService.savePermission(payload);

            setRoles((prev) => {
                if (!prev.some((r) => r.id === cleanRole)) {
                    return [...prev, { id: cleanRole, name: cleanRole, description: 'Saved role configuration' }];
                }
                return prev;
            });

            if (onSave) onSave(payload);

            showToast(`Permissions for "${cleanRole}" saved successfully!`, 'success');
        } catch (error) {
            console.error("Save permissions error:", error);
            showToast(error.message || 'Failed to save permissions to backend', 'error');
        } finally {
            setSaving(false);
        }
    };

    const activeRoleDetails = roles.find((r) => r.id === selectedRole) || {
        name: selectedRole,
        description: 'Custom user role configuration',
    };

    const roleOptions = roles.map((r) => r.id);

    return (
        <div className={`flex flex-col gap-6 w-full transition-colors duration-300 ${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3500}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '12px' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* HEADER & ROLE SELECTION CARD */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${
                isLightTheme
                    ? 'bg-white border border-slate-200 shadow-md'
                    : 'bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl'
            }`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <ShieldIcon className="text-indigo-500 w-6 h-6" />
                            <h2 className={`text-xl font-extrabold tracking-tight ${isLightTheme ? 'text-slate-900' : 'text-white'}`}>
                                Role & Permission Configurator
                            </h2>
                        </div>
                        <p className={`text-xs mt-1 ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                            Select an existing role or type a new role name, configure permissions, and click save.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                            isLightTheme
                                ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 shadow-sm'
                                : 'bg-slate-800/80 text-amber-300 border-slate-700 hover:bg-slate-800'
                        }`}
                    >
                        {isLightTheme ? (
                            <>
                                <DarkModeIcon className="w-4 h-4 text-indigo-600" />
                                <span>Dark Mode</span>
                            </>
                        ) : (
                            <>
                                <LightModeIcon className="w-4 h-4 text-amber-400" />
                                <span>Day Mode</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-center w-full">
                    <div className="flex-1 w-full min-w-[280px]">
                        <Autocomplete
                            fullWidth
                            freeSolo
                            options={roleOptions}
                            value={selectedRole || ''}
                            onChange={(event, newValue) => {
                                setSelectedRole(newValue ? newValue.trim() : '');
                            }}
                            onInputChange={(event, newInputValue) => {
                                setSelectedRole(newInputValue ? newInputValue.trim() : '');
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    size="small"
                                    label="Select or Enter Role"
                                    placeholder="Choose existing or type new role..."
                                    className={isLightTheme ? 'bg-slate-50 rounded-xl' : 'bg-slate-950/60 rounded-xl'}
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            color: isLightTheme ? '#64748b !important' : '#94a3b8 !important',
                                            fontSize: '0.75rem !important',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '0.75rem',
                                            color: isLightTheme ? '#0f172a' : '#f8fafc',
                                            fontSize: '0.85rem',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: isLightTheme ? '#cbd5e1' : '#1f2937' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
                                        },
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className="flex-[1.5] w-full">
                        <div className={`border rounded-xl p-4 flex items-center justify-between transition-colors ${
                            isLightTheme ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800'
                        }`}>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block">
                                    Active Role Context
                                </span>
                                <h4 className={`text-sm font-semibold mt-0.5 ${isLightTheme ? 'text-slate-900' : 'text-white'}`}>
                                    {activeRoleDetails?.name}
                                </h4>
                                <p className={`text-xs mt-0.5 ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {activeRoleDetails?.description}
                                </p>
                            </div>
                            <span className={`px-3 py-1 text-[11px] font-bold rounded-full border ${selectedRole === 'superadmin' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'}`}>
                                {selectedRole === 'superadmin' ? 'Full Access' : 'Custom Config'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* PERMISSION MATRIX TABLE FORM */}
            <div className={`rounded-2xl p-6 transition-all duration-300 ${
                isLightTheme
                    ? 'bg-white border border-slate-200 shadow-md'
                    : 'bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl'
            }`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                        <h3 className={`text-base font-bold ${isLightTheme ? 'text-slate-900' : 'text-white'}`}>
                            Module Permission Matrix
                        </h3>
                        <p className={`text-xs mt-0.5 ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                            Check checkboxes to grant specific permissions to <strong className="text-indigo-600">{selectedRole}</strong>.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleReset}
                            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                                isLightTheme
                                    ? 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-300'
                                    : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border-slate-700/80'
                            }`}
                        >
                            <RotateLeftIcon className="w-4 h-4 text-slate-400" />
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            <SaveIcon className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>

                <div className={`w-full h-px mb-4 ${isLightTheme ? 'bg-slate-200' : 'bg-slate-800'}`} />

                <div className={`overflow-x-auto rounded-xl border ${isLightTheme ? 'border-slate-200' : 'border-slate-800'}`}>
                    <table className="w-full min-w-[650px] text-left text-xs border-collapse">
                        <thead>
                            <tr className={`border-b uppercase tracking-wider font-extrabold ${
                                isLightTheme
                                    ? 'bg-slate-100 border-slate-200 text-slate-600'
                                    : 'bg-slate-950/70 border-slate-800 text-slate-400'
                            }`}>
                                <th className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(isGlobalAllChecked)}
                                            onChange={handleToggleGlobalSelectAll}
                                            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                        />
                                        <span>Modules / Sections</span>
                                    </div>
                                </th>

                                {allActions.map((action) => {
                                    const isColAllChecked = PermissionData.length > 0 && PermissionData.every(
                                        (item) => Boolean(currentPermissions[item.menu]?.[action])
                                    );
                                    return (
                                        <th key={action} className="py-3 px-4 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`capitalize font-bold ${isLightTheme ? 'text-slate-800' : 'text-slate-300'}`}>{action}</span>
                                                <label className={`flex flex-col items-center cursor-pointer text-[10px] ${isLightTheme ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(isColAllChecked)}
                                                        onChange={() => handleToggleColumnSelectAll(action)}
                                                        className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                                    />
                                                    <span className="font-semibold text-[9px] mt-0.5">ALL</span>
                                                </label>
                                            </div>
                                        </th>
                                    );
                                })}

                                <th className="py-3 px-4 text-right">ROW ACTION</th>
                            </tr>
                        </thead>

                        <tbody className={`divide-y ${isLightTheme ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
                            {PermissionData.map((item) => {
                                const menuName = item.menu;
                                const menuActions = item.permission || [];
                                const currentMenuState = currentPermissions[menuName] || {};
                                const isRowAllChecked = menuActions.every((act) => currentMenuState[act]);

                                return (
                                    <tr key={menuName} className={`transition-colors ${isLightTheme ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}`}>
                                        <td className={`py-3.5 px-4 font-semibold capitalize ${isLightTheme ? 'text-slate-900' : 'text-white'}`}>
                                            <div className="pl-6">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                                                    {menuName}
                                                </span>
                                            </div>
                                        </td>

                                        {allActions.map((action) => {
                                            const exists = menuActions.includes(action);
                                            const isChecked = Boolean(currentMenuState[action]);

                                            return (
                                                <td key={action} className="py-3.5 px-4 text-center">
                                                    {exists ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleTogglePermission(menuName, action)}
                                                            className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600 transition"
                                                        />
                                                    ) : (
                                                        <span className={`text-xs font-mono ${isLightTheme ? 'text-slate-400' : 'text-slate-600'}`}>N/A</span>
                                                    )}
                                                </td>
                                            );
                                        })}

                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleRowSelectAll(menuName, menuActions)}
                                                className={`text-xs font-semibold transition cursor-pointer ${isRowAllChecked ? 'text-rose-500 hover:text-rose-600' : 'text-indigo-600 hover:text-indigo-500'}`}
                                            >
                                                {isRowAllChecked ? 'Deselect Row' : 'Select Row'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
