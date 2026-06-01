'use client';

import { useState } from 'react';

export default function VerificationsView() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: 'Rohan Sharma',
      email: 'rohan.s@gmail.com',
      date: 'June 1, 2026',
      documentType: 'Aadhar Identity Card',
      documentNo: 'xxxx-xxxx-8492',
      status: 'Pending Review',
      docImage: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400',
    },
    {
      id: 2,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@yahoo.com',
      date: 'May 31, 2026',
      documentType: 'Passport Proof',
      documentNo: 'Lxxxxx92',
      status: 'Pending Review',
      docImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400',
    },
    {
      id: 3,
      name: 'Vikram Chawla',
      email: 'vikram.chawla@gmail.com',
      date: 'May 30, 2026',
      documentType: 'PAN Income Card',
      documentNo: 'BXXXXX581A',
      status: 'Approved',
      docImage: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400',
    },
    {
      id: 4,
      name: 'Fatima Sheikh',
      email: 'fatima.sheikh@gmail.com',
      date: 'May 28, 2026',
      documentType: 'Driving License',
      documentNo: 'DL-xxxxxxxx823',
      status: 'Pending Review',
      docImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400',
    },
  ]);

  const [activeRequest, setActiveRequest] = useState(null);

  const handleApprove = (id) => {
    setRequests(
      requests.map((req) => {
        if (req.id === id) {
          return { ...req, status: 'Approved' };
        }
        return req;
      })
    );
    if (activeRequest && activeRequest.id === id) {
      setActiveRequest({ ...activeRequest, status: 'Approved' });
    }
  };

  const handleReject = (id) => {
    setRequests(
      requests.map((req) => {
        if (req.id === id) {
          return { ...req, status: 'Rejected' };
        }
        return req;
      })
    );
    if (activeRequest && activeRequest.id === id) {
      setActiveRequest({ ...activeRequest, status: 'Rejected' });
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'Pending Review').length;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Verification Center</h2>
          <p className="text-zinc-400 text-sm mt-1">Review government-issued identification documents and verify profiles.</p>
        </div>
        {pendingCount > 0 && (
          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold py-1.5 px-3 rounded-lg self-start dark:text-amber-400">
            {pendingCount} Pending Reviews Remaining
          </span>
        )}
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Request queue list */}
        <div className="glass border border-border rounded-2xl p-5 lg:col-span-2 space-y-4">
          <h3 className="font-bold text-base text-foreground">Verification Queue</h3>

          <div className="divide-y divide-border/40">
            {requests.map((req) => (
              <div
                key={req.id}
                onClick={() => setActiveRequest(req)}
                className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-card/30 px-3 rounded-xl transition-colors ${
                  activeRequest?.id === req.id ? 'bg-card/45 border border-border' : 'border border-transparent'
                }`}
              >
                {/* User info */}
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-background border border-border rounded-xl text-zinc-400">
                    <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{req.name}</h4>
                    <p className="text-zinc-500 text-xs mt-0.5">{req.email} • {req.date}</p>
                  </div>
                </div>

                {/* Doc attributes / Status */}
                <div className="flex items-center gap-4 justify-between sm:justify-start">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-foreground/80 font-semibold">{req.documentType}</p>
                    <p className="text-[10px] text-zinc-500 font-medium">{req.documentNo}</p>
                  </div>

                  <span
                    className={`text-[9px] px-2.5 py-0.5 rounded-md font-bold border uppercase ${
                      req.status === 'Approved'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : req.status === 'Rejected'
                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                        : 'bg-amber-500/10 text-amber-550 border-amber-500/20'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side document viewer / actions panel */}
        <div className="glass border border-border rounded-2xl p-5 flex flex-col justify-between h-fit min-h-[400px]">
          {activeRequest ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="pb-4 border-b border-border">
                  <h3 className="font-bold text-base text-foreground">Document Inspection</h3>
                  <p className="text-xs text-zinc-550 mt-0.5">Applicant: {activeRequest.name}</p>
                </div>

                {/* Identity File Card */}
                <div className="mt-4 space-y-4">
                  <div className="bg-background border border-border p-3 rounded-xl flex justify-between items-center text-xs font-semibold">
                    <div>
                      <p className="text-zinc-500 font-bold uppercase text-[9px]">Document Details</p>
                      <p className="text-foreground/90 mt-1">{activeRequest.documentType}</p>
                    </div>
                    <span className="text-[10px] text-zinc-500">{activeRequest.documentNo}</span>
                  </div>

                  {/* Document preview box */}
                  <div className="relative h-44 rounded-xl bg-background border border-border overflow-hidden flex items-center justify-center group">
                    <img
                      src={activeRequest.docImage}
                      alt="Verification Document preview"
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white flex items-center gap-1.5 pointer-events-none">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Preview ID Image
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-border space-y-3 mt-6">
                {activeRequest.status === 'Pending Review' ? (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleReject(activeRequest.id)}
                      className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Reject Proof
                    </button>
                    <button
                      onClick={() => handleApprove(activeRequest.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md shadow-green-500/10 transition-all cursor-pointer"
                    >
                      Approve Profile
                    </button>
                  </div>
                ) : (
                  <div
                    className={`p-3 border rounded-xl text-center text-xs font-semibold ${
                      activeRequest.status === 'Approved'
                        ? 'bg-green-500/5 text-green-500 border-green-500/10'
                        : 'bg-red-500/5 text-red-500 border-red-500/10'
                    }`}
                  >
                    Action Recorded: Document is {activeRequest.status}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <svg className="w-10 h-10 text-zinc-650 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h4 className="font-bold text-foreground mt-4 text-sm">No Document Selected</h4>
              <p className="text-zinc-550 text-xs mt-1.5 max-w-[200px]">Click any verification row in the queue to inspect government identity files and approve verification.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
