'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

export default function OverviewView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders/stats/dashboard');
        setData(res);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message || 'Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-shimmer">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
          <p className="text-zinc-400 text-sm mt-1">Live metrics and pharmaceutical operational analytics.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-border relative overflow-hidden">
              <div className="h-4 w-24 bg-zinc-700/30 rounded animate-pulse" />
              <div className="h-8 w-16 bg-zinc-700/30 rounded mt-4 animate-pulse" />
              <div className="h-3 w-32 bg-zinc-700/30 rounded mt-2 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 border border-border lg:col-span-2 h-80 animate-pulse bg-zinc-700/10" />
          <div className="glass rounded-2xl p-6 border border-border h-80 animate-pulse bg-zinc-700/10" />
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Patients',
      value: data?.totalPatients?.toLocaleString() || '0',
      change: 'Active registered profiles',
      color: 'from-pink-500/20 to-purple-500/20',
      icon: (
        <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Total Medicines',
      value: data?.totalMedicines?.toLocaleString() || '0',
      change: 'Available in repository',
      color: 'from-purple-500/20 to-indigo-500/20',
      icon: (
        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Verified Prescriptions',
      value: data?.verifiedPrescriptions?.toLocaleString() || '0',
      change: 'Audit approved orders',
      color: 'from-emerald-500/20 to-teal-500/20',
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Pending Verifications',
      value: data?.pendingPrescriptions?.toLocaleString() || '0',
      change: 'Awaiting review',
      color: 'from-amber-500/20 to-orange-500/20',
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ];

  const sales = data?.salesData || [0, 0, 0, 0, 0, 0];
  const prescriptions = data?.prescriptionData || [0, 0, 0, 0, 0, 0];
  const months = data?.months || ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
  const activities = data?.activities || [];

  const maxSales = Math.max(...sales, 1);
  const maxPrescr = Math.max(...prescriptions, 1);

  // Map value to Y coordinate (30 is top, 170 is bottom, viewBox height is 200)
  const getSalesY = (val) => 170 - ((val / maxSales) * 130);
  const getPrescrY = (val) => 170 - ((val / maxPrescr) * 130);

  // X coordinates for the 6 points spanning across 500 width
  const xCoords = [20, 110, 200, 290, 380, 470];

  // Build lines
  const salesPoints = sales.map((val, idx) => `${xCoords[idx]} ${getSalesY(val)}`);
  const salesLinePath = `M ${salesPoints.join(' L ')}`;
  const salesAreaPath = `${salesLinePath} L ${xCoords[xCoords.length - 1]} 200 L ${xCoords[0]} 200 Z`;

  const prescrPoints = prescriptions.map((val, idx) => `${xCoords[idx]} ${getPrescrY(val)}`);
  const prescrLinePath = `M ${prescrPoints.join(' L ')}`;
  const prescrAreaPath = `${prescrLinePath} L ${xCoords[xCoords.length - 1]} 200 L ${xCoords[0]} 200 Z`;

  return (
    <div className="space-y-8 animate-shimmer">
      {/* Page Title & Context */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
        <p className="text-zinc-400 text-sm mt-1">Live metrics and pharmaceutical operational analytics.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="glass rounded-2xl p-6 border border-border relative overflow-hidden group hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300"
          >
            {/* Soft decorative glow background */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-450 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className="p-2.5 bg-card border border-border rounded-xl">
                {stat.icon}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</div>
              <p className="text-xs text-zinc-500 mt-2 font-medium flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytical Visualizations & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Sales Success Trend Chart */}
        <div className="glass rounded-2xl p-6 border border-border lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Monthly Sales & Refills Progress</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Sales trends and regular patient refills rate.</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                Completed Orders
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-650" />
                Prescriptions Logged
              </div>
            </div>
          </div>

          {/* Simple Premium Inline SVG Chart */}
          <div className="relative h-64 w-full flex items-end">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="currentColor" className="text-border" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" className="text-border" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="currentColor" className="text-border" strokeWidth="1" strokeDasharray="4,4" />

              {/* Purple area under Active Profiles */}
              <path
                d={prescrAreaPath}
                fill="url(#purpleGrad)"
                opacity="0.1"
              />
              {/* Pink area under Successful Couples */}
              <path
                d={salesAreaPath}
                fill="url(#pinkGrad)"
                opacity="0.15"
              />

              {/* Purple Line */}
              <path
                d={prescrLinePath}
                fill="none"
                stroke="#9333ea"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Pink Line */}
              <path
                d={salesLinePath}
                fill="none"
                stroke="#ec4899"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9333ea" />
                  <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Bottom X-Axis Labels */}
            <div className="absolute bottom-[-24px] inset-x-0 flex justify-between text-[10px] text-zinc-500 font-semibold px-4">
              {months.map((m, idx) => (
                <span key={idx}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Matching Action Feed */}
        <div className="glass rounded-2xl p-6 border border-border space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Recent Operations</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Real-time pharmacy dashboard updates.</p>
          </div>

          <div className="space-y-5 flex-1 mt-6 overflow-y-auto max-h-[280px] pr-1">
            {activities.map((act, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 ring-4 ring-pink-500/10 group-hover:scale-125 transition-transform" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    <span className="font-bold text-foreground group-hover:text-pink-500 transition-colors">{act.user}</span>{' '}
                    {act.action}{' '}
                    <span className="font-semibold text-pink-650 dark:text-pink-100">{act.target}</span>
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-550 font-medium">{act.time}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-md font-semibold border ${act.badgeColor}`}>
                      {act.badge}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
