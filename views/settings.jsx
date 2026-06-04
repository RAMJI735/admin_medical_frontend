'use client';

import { useState, useEffect } from 'react';

export default function SettingsView({ onProfileUpdate }) {
  // Admin details state
  const [adminName, setAdminName] = useState('MedRx Admin');
  const [adminEmail, setAdminEmail] = useState('admin@medrx.com');
  const [adminRole, setAdminRole] = useState('Super Admin');
  const [newPassword, setNewPassword] = useState('');
  
  // Platform preferences state
  const [aiMatching, setAiMatching] = useState(true);
  const [prioritizeVerified, setPrioritizeVerified] = useState(true);
  const [autoAssignMatchmakers, setAutoAssignMatchmakers] = useState(false);
  const [ageTolerance, setAgeTolerance] = useState(4);
  const [matchingThreshold, setMatchingThreshold] = useState(75);

  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    // Load current admin details
    const currUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currUser.name) setAdminName(currUser.name);
    if (currUser.email) setAdminEmail(currUser.email);
    if (currUser.role) setAdminRole(currUser.role);
  }, []);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setSaveStatus('');

    const currUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const updatedUser = {
      ...currUser,
      name: adminName,
      email: adminEmail,
    };

    if (newPassword) {
      updatedUser.password = newPassword;
    }

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Also update in all users array
    const users = JSON.parse(localStorage.getItem('admin_users') || '[]');
    const updatedUsers = users.map((u) => {
      if (u.email === currUser.email) {
        return { ...u, name: adminName, email: adminEmail, ...(newPassword ? { password: newPassword } : {}) };
      }
      return u;
    });
    localStorage.setItem('admin_users', JSON.stringify(updatedUsers));

    setSaveStatus('Profile updated successfully!');
    setNewPassword('');

    // Trigger parent callback to update layout header
    if (onProfileUpdate) {
      onProfileUpdate(updatedUser);
    }

    setTimeout(() => {
      setSaveStatus('');
    }, 2000);
  };

  const handlePlatformSave = (e) => {
    e.preventDefault();
    setSaveStatus('Platform settings saved successfully!');
    setTimeout(() => {
      setSaveStatus('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">System Settings</h2>
        <p className="text-zinc-400 text-sm mt-1">Configure your administrator profile and matrimonial platform parameters.</p>
      </div>

      {saveStatus && (
        <div className="p-3.5 bg-green-500/10 border border-green-500/20 text-green-500 border-green-500/20 text-xs rounded-xl flex items-center gap-2 animate-bounce">
          <svg className="w-4.5 h-4.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{saveStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card Settings */}
        <div className="glass border border-border rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-base text-foreground">Personal Profile</h3>
            <p className="text-zinc-500 text-xs mt-0.5">Modify your admin display credentials and email login.</p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                  Designated Role
                </label>
                <input
                  type="text"
                  disabled
                  value={adminRole}
                  className="w-full bg-background/40 border border-border/80 rounded-xl px-4 py-2.5 text-xs text-zinc-500 font-medium cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                  Update Password
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to keep same"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-pink-500/10 transition-all cursor-pointer"
            >
              Update Profile Credentials
            </button>
          </form>
        </div>

        {/* Platform Preference Settings */}
        <div className="glass border border-border rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-base text-foreground">Platform Matchmaking Parameters</h3>
            <p className="text-zinc-500 text-xs mt-0.5">Tune matching tolerance metrics and administrative rules.</p>
          </div>

          <form onSubmit={handlePlatformSave} className="space-y-6">
            {/* Slide Toggles */}
            <div className="space-y-4">
              {/* AI Matching Toggle */}
              <div className="flex items-center justify-between p-3 bg-background/30 border border-border rounded-xl">
                <div>
                  <h4 className="font-semibold text-xs text-foreground">AI-Powered Compatibility Matchmaker</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Utilize cognitive matching algorithm to suggest partners.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAiMatching(!aiMatching)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                    aiMatching ? 'bg-pink-500' : 'bg-zinc-300 dark:bg-zinc-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                    aiMatching ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Verified Experts Priority Toggle */}
              <div className="flex items-center justify-between p-3 bg-background/30 border border-border rounded-xl">
                <div>
                  <h4 className="font-semibold text-xs text-foreground">Prioritize Verified Matchmakers</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Route premium matrimonial leads to active vetted consultants.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrioritizeVerified(!prioritizeVerified)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                    prioritizeVerified ? 'bg-pink-500' : 'bg-zinc-300 dark:bg-zinc-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                    prioritizeVerified ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Auto Assign Toggle */}
              <div className="flex items-center justify-between p-3 bg-background/30 border border-border rounded-xl">
                <div>
                  <h4 className="font-semibold text-xs text-foreground">Auto-Assign Verification Files</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Automatically allot incoming documents to support staff.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoAssignMatchmakers(!autoAssignMatchmakers)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                    autoAssignMatchmakers ? 'bg-pink-500' : 'bg-zinc-300 dark:bg-zinc-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                    autoAssignMatchmakers ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Range Sliders */}
            <div className="space-y-4 pt-4 border-t border-border">
              {/* Age Tolerance Range */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-500 dark:text-zinc-300">Age Matching Tolerance Range</span>
                  <span className="text-pink-500">± {ageTolerance} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={ageTolerance}
                  onChange={(e) => setAgeTolerance(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>

              {/* Matching Score Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-500 dark:text-zinc-300">Minimum Suggestion Compatibility Score</span>
                  <span className="text-pink-500">{matchingThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={matchingThreshold}
                  onChange={(e) => setMatchingThreshold(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-pink-500/10 transition-all w-full cursor-pointer"
            >
              Save Platform Configuration
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
