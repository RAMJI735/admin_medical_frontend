'use client';

import { useState } from 'react';

export default function ExpertsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);

  // Form states for new expert
  const [newExpertName, setNewExpertName] = useState('');
  const [newExpertEmail, setNewExpertEmail] = useState('');
  const [newExpertRole, setNewExpertRole] = useState('Senior Matchmaker');
  const [newExpertLocation, setNewExpertLocation] = useState('Mumbai, India');
  const [newExpertBio, setNewExpertBio] = useState('');

  // Initial mock experts state
  const [experts, setExperts] = useState([
    {
      id: 1,
      name: 'Sarah K. Alvi',
      email: 'sarah.alvi@shaadiexpert.com',
      role: 'Head Matchmaker',
      location: 'Mumbai, India',
      status: 'Active',
      rating: 4.9,
      matches: 124,
      bio: 'Over 8 years of premier matrimonial matching experience specializing in North Indian cultures. Expert counselor.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      id: 2,
      name: 'Ramesh Chawla',
      email: 'ramesh.c@shaadiexpert.com',
      role: 'Senior Consultant',
      location: 'Delhi NCR, India',
      status: 'Active',
      rating: 4.8,
      matches: 98,
      bio: 'Dedicated to Gujarati and Punjabi matrimonial services. Focused on value systems and compatibility metrics.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      id: 3,
      name: 'Priya Sundaram',
      email: 'priya.s@shaadiexpert.com',
      role: 'South Matchmaking Expert',
      location: 'Bangalore, India',
      status: 'Active',
      rating: 4.7,
      matches: 86,
      bio: 'Specialist in South Indian matches. Holds an advanced diploma in relationships and family counseling.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
    {
      id: 4,
      name: 'Vikram Malhotra',
      email: 'vikram.m@shaadiexpert.com',
      role: 'Junior Consultant',
      location: 'Pune, India',
      status: 'Pending',
      rating: 4.2,
      matches: 12,
      bio: 'Onboarding expert with strong communication skills and modern tech-matching paradigms.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    {
      id: 5,
      name: 'Meena Advani',
      email: 'meena.a@shaadiexpert.com',
      role: 'Elite Matchmaker',
      location: 'Kolkata, India',
      status: 'Suspended',
      rating: 4.5,
      matches: 55,
      bio: 'Senior counselor for NRI match proposals. Suspended temporarily due to leaves.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
  ]);

  const filteredExperts = experts.filter((exp) => {
    const matchesSearch =
      exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && exp.status === statusFilter;
  });

  const handleAddExpert = (e) => {
    e.preventDefault();
    if (!newExpertName || !newExpertEmail) return;

    const newExp = {
      id: experts.length + 1,
      name: newExpertName,
      email: newExpertEmail,
      role: newExpertRole,
      location: newExpertLocation,
      status: 'Active',
      rating: 5.0,
      matches: 0,
      bio: newExpertBio || 'Dedicated matchmaker focused on providing highly personal consultations.',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?w=150`,
    };

    setExperts([newExp, ...experts]);
    setIsModalOpen(false);
    
    // Clear inputs
    setNewExpertName('');
    setNewExpertEmail('');
    setNewExpertBio('');
  };

  const toggleExpertStatus = (id) => {
    setExperts(
      experts.map((exp) => {
        if (exp.id === id) {
          const nextStatus = exp.status === 'Active' ? 'Suspended' : 'Active';
          const updated = { ...exp, status: nextStatus };
          if (selectedExpert && selectedExpert.id === id) {
            setSelectedExpert(updated);
          }
          return updated;
        }
        return exp;
      })
    );
  };

  const approvePendingExpert = (id) => {
    setExperts(
      experts.map((exp) => {
        if (exp.id === id) {
          const updated = { ...exp, status: 'Active' };
          if (selectedExpert && selectedExpert.id === id) {
            setSelectedExpert(updated);
          }
          return updated;
        }
        return exp;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Experts & Matchmakers</h2>
          <p className="text-zinc-400 text-sm mt-1">Manage onboarded wedding consultants and platform matchmakers.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-pink-500/25 transition-all self-start flex items-center gap-2 transform active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Matchmaker
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="h-4.5 w-4.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search experts, roles, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 text-foreground placeholder-zinc-550 transition-all"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex bg-card border border-border p-1 rounded-xl self-stretch md:self-auto overflow-x-auto">
          {['All', 'Active', 'Pending', 'Suspended'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`py-1.5 px-3.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
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

      {/* Experts Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredExperts.map((exp) => (
          <div
            key={exp.id}
            className="glass rounded-2xl border border-border p-6 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-all group relative overflow-hidden"
          >
            {/* Soft border accent */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-border group-hover:via-pink-500/50 to-transparent transition-all duration-500" />

            <div>
              {/* Profile Card Header */}
              <div className="flex gap-4 items-start">
                <div className="relative w-12 h-12 rounded-xl bg-background border border-border overflow-hidden flex-shrink-0">
                  {/* Avatar Image (with fallbacks) */}
                  <img
                    src={exp.avatar}
                    alt={exp.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-foreground group-hover:text-pink-500 transition-colors truncate">
                    {exp.name}
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium truncate mt-0.5">{exp.role}</p>
                </div>
              </div>

              {/* Bio & Details */}
              <p className="text-xs text-zinc-450 leading-relaxed mt-4 line-clamp-2">{exp.bio}</p>

              {/* Badges / Location */}
              <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-semibold text-zinc-500">
                <span className="flex items-center gap-1">
                  <span className="text-amber-400">★</span> {exp.rating}
                </span>
                <span>•</span>
                <span>{exp.matches} couples matched</span>
                <span>•</span>
                <span className="truncate max-w-[120px]">{exp.location}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 mt-6 pt-5 border-t border-border">
              <button
                onClick={() => setSelectedExpert(exp)}
                className="flex-1 bg-background hover:bg-card border border-border text-foreground font-semibold text-xs py-2 rounded-xl transition-all cursor-pointer"
              >
                View Profile
              </button>

              {exp.status === 'Pending' ? (
                <button
                  onClick={() => approvePendingExpert(exp.id)}
                  className="px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-450 border border-emerald-500/20 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Approve
                </button>
              ) : (
                <button
                  onClick={() => toggleExpertStatus(exp.id)}
                  className={`px-3 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    exp.status === 'Active'
                      ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-450 border-emerald-500/20'
                  }`}
                >
                  {exp.status === 'Active' ? 'Suspend' : 'Activate'}
                </button>
              )}
            </div>

            {/* Float State Status Badge */}
            <div className="absolute top-4 right-4">
              <span
                className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase border ${
                  exp.status === 'Active'
                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                    : exp.status === 'Pending'
                    ? 'bg-amber-500/10 text-amber-550 border-amber-500/20'
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                }`}
              >
                {exp.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredExperts.length === 0 && (
        <div className="glass rounded-2xl border border-border p-12 text-center">
          <svg className="w-12 h-12 text-zinc-550 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h4 className="font-bold text-foreground mt-4 text-base">No Experts Found</h4>
          <p className="text-zinc-500 text-xs mt-1.5 max-w-sm mx-auto">Try refining your search term or choosing a different status filter toggle.</p>
        </div>
      )}

      {/* Expert Profile Details Overlay Drawer */}
      {selectedExpert && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-end p-4">
          <div className="glass border-l border-border h-full w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col justify-between animate-in fade-in slide-in-from-right duration-300">
            <div>
              {/* Close Button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-foreground">Matchmaker Information</h3>
                <button
                  onClick={() => setSelectedExpert(null)}
                  className="p-1 bg-background border border-border text-zinc-400 hover:text-foreground rounded-lg transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Profile card Details */}
              <div className="text-center pb-6 border-b border-border">
                <div className="w-20 h-20 rounded-full mx-auto bg-background border-2 border-pink-500/40 overflow-hidden relative mb-4">
                  <img src={selectedExpert.avatar} alt={selectedExpert.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-xl text-foreground">{selectedExpert.name}</h4>
                <p className="text-xs text-pink-500 font-semibold mt-1">{selectedExpert.role}</p>
                <p className="text-xs text-zinc-550 mt-1">{selectedExpert.location}</p>
              </div>

              <div className="space-y-4 py-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Contact Email</span>
                  <p className="text-sm text-foreground/90 font-medium">{selectedExpert.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Short Biography</span>
                  <p className="text-xs text-zinc-450 leading-relaxed">{selectedExpert.bio}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-background border border-border p-3 rounded-xl">
                    <span className="text-[9px] uppercase font-bold text-zinc-500">Matches Made</span>
                    <p className="text-lg font-bold text-foreground mt-1">{selectedExpert.matches} Couples</p>
                  </div>
                  <div className="bg-background border border-border p-3 rounded-xl">
                    <span className="text-[9px] uppercase font-bold text-zinc-500">Expert Rating</span>
                    <p className="text-lg font-bold text-foreground mt-1 flex items-center gap-1">
                      <span className="text-amber-400">★</span> {selectedExpert.rating}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex gap-4">
              <button
                onClick={() => {
                  toggleExpertStatus(selectedExpert.id);
                }}
                className={`flex-1 font-bold text-xs py-3 rounded-xl transition-all border cursor-pointer ${
                  selectedExpert.status === 'Active'
                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20'
                }`}
              >
                {selectedExpert.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Matchmaker Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass border border-border rounded-3xl w-full max-w-lg shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Top Pink Line */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-pink-500 to-transparent" />

            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-foreground">Add New Expert Matchmaker</h3>
                <p className="text-zinc-400 text-xs mt-0.5">Invite new matrimonial consultant to the platform.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 bg-background border border-border text-zinc-450 hover:text-foreground rounded-lg transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddExpert} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Anjali Sharma"
                    value={newExpertName}
                    onChange={(e) => setNewExpertName(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="anjali.s@shaadiexpert.com"
                    value={newExpertEmail}
                    onChange={(e) => setNewExpertEmail(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                    Assigned Role
                  </label>
                  <select
                    value={newExpertRole}
                    onChange={(e) => setNewExpertRole(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  >
                    <option value="Senior Matchmaker">Senior Matchmaker</option>
                    <option value="Junior Consultant">Junior Consultant</option>
                    <option value="Elite Matchmaking Partner">Elite Matchmaking Partner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                    Location Base
                  </label>
                  <input
                    type="text"
                    required
                    value={newExpertLocation}
                    onChange={(e) => setNewExpertLocation(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                  Professional Biography / Specialization
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about the matchmaker's culture focus or specialties..."
                  value={newExpertBio}
                  onChange={(e) => setNewExpertBio(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition-all resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-background border border-border text-zinc-450 text-xs font-semibold py-2.5 rounded-xl hover:text-foreground transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md shadow-pink-500/10 transition-all cursor-pointer"
                >
                  Invite Matchmaker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
