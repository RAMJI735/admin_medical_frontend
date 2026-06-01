'use client';

export default function OverviewView() {
  const stats = [
    {
      title: 'Total Matrimonial Users',
      value: '14,820',
      change: '+12.5% this month',
      color: 'from-pink-500/20 to-purple-500/20',
      icon: (
        <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Active Experts & Matchmakers',
      value: '382',
      change: '+8 new onboarded',
      color: 'from-purple-500/20 to-indigo-500/20',
      icon: (
        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Successful Matches',
      value: '1,942',
      change: '+45 couples paired',
      color: 'from-emerald-500/20 to-teal-500/20',
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: 'Pending Verifications',
      value: '47',
      change: '22 submitted today',
      color: 'from-amber-500/20 to-orange-500/20',
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  const activities = [
    {
      user: 'Rohan Sharma',
      action: 'completed document upload',
      target: 'Profile Verification',
      time: '5 mins ago',
      badge: 'Verification',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      user: 'Matchmaker Priya',
      action: 'initiated matchmaking proposal for',
      target: 'Amit Patel & Shruti Sen',
      time: '20 mins ago',
      badge: 'Matchmaking',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    },
    {
      user: 'System Bot',
      action: 'completed monthly performance report for',
      target: '35 Active Experts',
      time: '1 hour ago',
      badge: 'System',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      user: 'Expert Anita K.',
      action: 'approved new onboarding for matchmaker',
      target: 'Deepak Mehta',
      time: '3 hours ago',
      badge: 'Expert Management',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-8 animate-shimmer">
      {/* Page Title & Context */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">System Overview</h2>
        <p className="text-zinc-400 text-sm mt-1">Live metrics and matrimonial operational analytics.</p>
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
                <span className="text-emerald-500">↑</span>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytical Visualizations & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Matchmaking Success Trend Chart */}
        <div className="glass rounded-2xl p-6 border border-border lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Monthly Matching Progress</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Success matchmaking trends and onboarding rate.</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                Successful Couples
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                Active Profiles
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
                d="M0 160 Q100 130 200 100 T400 60 T500 40 L500 200 L0 200 Z"
                fill="url(#purpleGrad)"
                opacity="0.1"
              />
              {/* Pink area under Successful Couples */}
              <path
                d="M0 180 Q100 160 200 130 T400 90 T500 70 L500 200 L0 200 Z"
                fill="url(#pinkGrad)"
                opacity="0.15"
              />

              {/* Purple Line */}
              <path
                d="M0 160 Q100 130 200 100 T400 60 T500 40"
                fill="none"
                stroke="#9333ea"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Pink Line */}
              <path
                d="M0 180 Q100 160 200 130 T400 90 T500 70"
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
            <div className="absolute bottom-[-24px] inset-x-0 flex justify-between text-[10px] text-zinc-500 font-semibold px-2">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
            </div>
          </div>
        </div>

        {/* Live Matching Action Feed */}
        <div className="glass rounded-2xl p-6 border border-border space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Recent Operations</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Real-time matchmaker matching updates.</p>
          </div>

          <div className="space-y-5 flex-1 mt-6">
            {activities.map((act, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 ring-4 ring-pink-500/10 group-hover:scale-125 transition-transform" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    <span className="font-bold text-foreground group-hover:text-pink-500 transition-colors">{act.user}</span>{' '}
                    {act.action}{' '}
                    <span className="font-semibold text-pink-600 dark:text-pink-100">{act.target}</span>
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-500 font-medium">{act.time}</span>
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
