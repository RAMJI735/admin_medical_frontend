'use client';

import { useState } from 'react';

export default function UsersView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  const [users] = useState([
    {
      id: 1,
      name: 'Rohan Malhotra',
      age: 28,
      gender: 'Male',
      location: 'Mumbai, India',
      religion: 'Hindu (Punjabi)',
      profession: 'Software Architect at TechCorp',
      salary: '₹35 LPA',
      verified: true,
      matchPref: 'Vegetarian, Professional, based in Maharashtra, Age 24-28',
      family: 'Father is a retired Bank Manager, Mother is a homemaker. One younger sister (married).',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    },
    {
      id: 2,
      name: 'Priya Sen',
      age: 26,
      gender: 'Female',
      location: 'Kolkata, India',
      religion: 'Hindu (Bengali)',
      profession: 'Senior Product Designer at DesignHub',
      salary: '₹22 LPA',
      verified: true,
      matchPref: 'Open-minded, Creative Professional, location independent, Age 26-30',
      family: 'Nuclear family. Father is a Professor at Calcutta University, Mother is a Doctor.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    {
      id: 3,
      name: 'Amit Patel',
      age: 31,
      gender: 'Male',
      location: 'Ahmedabad, India',
      religion: 'Hindu (Gujarati)',
      profession: 'Managing Director, Patel Chemicals',
      salary: '₹75 LPA',
      verified: true,
      matchPref: 'Traditional values, Willing to settle in family business, Age 25-29',
      family: 'Joint family. Business background. Highly respected in local Gujarati community.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      age: 27,
      gender: 'Female',
      location: 'Hyderabad, India',
      religion: 'Hindu (Telugu)',
      profession: 'Data Scientist at AnalyticsPro',
      salary: '₹28 LPA',
      verified: false,
      matchPref: 'Post-graduate, settled in Bangalore/Hyderabad, Age 28-32',
      family: 'Upper-middle-class. Father is an IAS officer, Mother is a retired college Lecturer.',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150',
    },
    {
      id: 5,
      name: 'Karan Singh Sodhi',
      age: 29,
      gender: 'Male',
      location: 'Delhi NCR, India',
      religion: 'Sikh',
      profession: 'Corporate Lawyer, Sodhi Partners',
      salary: '₹40 LPA',
      verified: true,
      matchPref: 'Sikh, Professional background, settled in Delhi/Canada, Age 25-29',
      family: 'Father is Senior Advocate, Mother is a Fashion Boutique Owner. Two elder brothers.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    {
      id: 6,
      name: 'Dr. Fatima Sheikh',
      age: 29,
      gender: 'Female',
      location: 'Lucknow, India',
      religion: 'Muslim (Sunni)',
      profession: 'MD Pediatrics, Apollo Hospital',
      salary: '₹30 LPA',
      verified: false,
      matchPref: 'Doctor or highly qualified professional, family oriented, Age 29-33',
      family: 'Respectable Sunni Muslim family. Father owns cold storage chain, Mother is a Writer.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
  ]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.religion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profession.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = genderFilter === 'All' || user.gender === genderFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Verified' && user.verified) ||
      (statusFilter === 'Unverified' && !user.verified);

    return matchesSearch && matchesGender && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Matrimonial Users</h2>
        <p className="text-zinc-400 text-sm mt-1">Browse, filter, and inspect registered matrimonial profiles.</p>
      </div>

      {/* Toolbar Filter Control */}
      <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full xl:w-96">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="h-4.5 w-4.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, location, community, or profession..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 text-foreground placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 w-full xl:w-auto">
          {/* Gender Filter */}
          <div className="flex bg-card border border-border p-1 rounded-xl">
            {['All', 'Male', 'Female'].map((gender) => (
              <button
                key={gender}
                onClick={() => setGenderFilter(gender)}
                className={`py-1.5 px-3.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  genderFilter === gender
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-zinc-400 hover:text-foreground'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>

          {/* Verification Filter */}
          <div className="flex bg-card border border-border p-1 rounded-xl">
            {['All', 'Verified', 'Unverified'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`py-1.5 px-3.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-zinc-400 hover:text-foreground'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Data Grid Table */}
      <div className="glass border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-card/30 text-zinc-450 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-4 px-6">User Name</th>
                <th className="py-4 px-4">Gender & Age</th>
                <th className="py-4 px-4">Location Base</th>
                <th className="py-4 px-4">Community / Religion</th>
                <th className="py-4 px-4">Profession & Income</th>
                <th className="py-4 px-4">Verification</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs font-medium text-zinc-400">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-card/40 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-background overflow-hidden border border-border group-hover:border-zinc-400 dark:group-hover:border-zinc-700 transition-colors">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                          }}
                        />
                      </div>
                      <span className="font-semibold text-foreground group-hover:text-pink-500 transition-colors">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground/80">{user.gender}, {user.age} yrs</td>
                  <td className="py-4 px-4 text-zinc-500">{user.location}</td>
                  <td className="py-4 px-4 text-zinc-500">{user.religion}</td>
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <p className="text-foreground/90 truncate max-w-[150px]">{user.profession}</p>
                      <p className="text-[10px] text-zinc-500">{user.salary}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {user.verified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                        <span className="w-1 h-1 rounded-full bg-green-500" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-bold bg-zinc-500/10 text-zinc-500 border border-border">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="bg-background border border-border hover:border-zinc-400 dark:hover:border-zinc-700 text-foreground py-1.5 px-3 rounded-lg font-semibold text-[11px] transition-all hover:bg-card active:scale-95 cursor-pointer"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <svg className="w-10 h-10 text-zinc-605 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h4 className="font-bold text-foreground mt-4">No Matrimonial Profiles Found</h4>
            <p className="text-zinc-500 text-xs mt-1.5 max-w-xs mx-auto">Modify your search query or adjust filters.</p>
          </div>
        )}
      </div>

      {/* User Details Slide-over Drawer Overlay */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-end p-4">
          <div className="glass border-l border-border h-full w-full max-w-lg rounded-3xl shadow-2xl p-6 flex flex-col justify-between animate-in fade-in slide-in-from-right duration-300">
            {/* Header info */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-foreground">Matrimonial Candidate File</h3>
                  {selectedUser.verified && (
                    <span className="text-[9px] font-bold uppercase bg-green-500/10 text-green-500 border border-green-500/20 px-1.5 py-0.5 rounded-md">
                      Verified
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1 bg-background border border-border text-zinc-400 hover:text-foreground rounded-lg transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Profile Card Header */}
              <div className="flex gap-5 items-center pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-background border-2 border-pink-500/20 overflow-hidden flex-shrink-0">
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-foreground">{selectedUser.name}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{selectedUser.gender} • {selectedUser.age} Years Old • {selectedUser.location}</p>
                </div>
              </div>

              {/* Comprehensive candidate attributes */}
              <div className="space-y-4 py-6 overflow-y-auto max-h-[50vh] pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Community / Caste</span>
                    <p className="text-xs font-semibold text-foreground/90">{selectedUser.religion}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Current Salary</span>
                    <p className="text-xs font-semibold text-foreground/90">{selectedUser.salary}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Profession Profile</span>
                  <p className="text-xs font-semibold text-foreground/90">{selectedUser.profession}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Family Background</span>
                  <p className="text-xs text-zinc-500 leading-relaxed bg-background/40 border border-border p-3 rounded-xl">
                    {selectedUser.family}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Desired Partner Criteria</span>
                  <p className="text-xs text-pink-650 leading-relaxed bg-pink-500/5 border border-pink-500/10 p-3 rounded-xl dark:text-pink-200">
                    {selectedUser.matchPref}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-border flex gap-4">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 bg-background border border-border text-zinc-450 text-xs font-semibold py-3 rounded-xl hover:text-foreground transition-all cursor-pointer"
              >
                Close Profile
              </button>
              <button
                onClick={() => {
                  alert(`Assigning matchmaker expert to counsel ${selectedUser.name}...`);
                }}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold py-3 rounded-xl shadow-lg shadow-pink-500/10 transition-all text-center cursor-pointer"
              >
                Assign Matchmaker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
