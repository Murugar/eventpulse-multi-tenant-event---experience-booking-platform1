import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Building2,
  Calendar,
  Ticket,
  MessageSquare,
  ShieldAlert,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    tenants,
    currentTenantId,
    setCurrentTenantId,
    activeTenant,
    viewMode,
    setViewMode,
    activeHolds,
    setActiveCheckoutHold,
    setMyBookingsOpen,
    setConciergeOpen,
    setDoorScannerOpen,
    userBookings
  } = usePlatform();

  const userActiveHold = activeHolds[0];

  return (
    <>
      {/* Top Banner if Active Temporary Hold Exists */}
      {userActiveHold && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-medium flex items-center justify-between border-b border-amber-600">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>
                <strong>Unified Inventory Hold Active:</strong> {userActiveHold.quantity} ticket(s) locked under {userActiveHold.id} (Channel: {userActiveHold.channel.toUpperCase()})
              </span>
            </div>
            <button
              onClick={() => setActiveCheckoutHold(userActiveHold)}
              className="underline font-semibold hover:text-slate-900 cursor-pointer"
            >
              Resume Checkout &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Header - Adheres to 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single Brand Wordmark / Multi-tenant Client Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                setViewMode('public');
                setCurrentTenantId(null);
              }}
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm ${
                  activeTenant ? 'bg-slate-900' : 'bg-indigo-600'
                }`}>
                  {activeTenant ? activeTenant.logoText.charAt(0) : 'EP'}
                </div>
                <div>
                  <div className="text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                    {activeTenant ? activeTenant.logoText : 'EVENTPULSE'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                    {activeTenant ? activeTenant.tagline : 'Enterprise Multi-Tenant Booking Engine'}
                  </div>
                </div>
              </div>
            </button>

            {/* Client Brand Switcher (Simulates individual tenant branded domain / agency master) */}
            <div className="relative group/tenant">
              <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{activeTenant ? activeTenant.name : 'All Brands (Agency Master)'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              
              <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1 hidden group-hover/tenant:block z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Tenant Portal
                </div>
                <button
                  onClick={() => setCurrentTenantId(null)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    currentTenantId === null ? 'font-semibold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>Agency Master (All Events)</span>
                  {currentTenantId === null && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Active</span>}
                </button>
                <div className="my-1 border-t border-slate-100" />
                {tenants.map(tenant => (
                  <button
                    key={tenant.id}
                    onClick={() => setCurrentTenantId(tenant.id)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentTenantId === tenant.id ? 'font-semibold text-slate-900 bg-slate-100' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900">{tenant.name}</div>
                      <div className="text-[10px] text-slate-400">{tenant.customDomain}</div>
                    </div>
                    {currentTenantId === tenant.id && (
                      <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">Branded</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Zone 2: 4-5 Clean Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setViewMode('public')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'public' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              Explore Events
            </button>
            <button
              onClick={() => setConciergeOpen(true)}
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-slate-600"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>Omnichannel Concierge</span>
            </button>
            <button
              onClick={() => setDoorScannerOpen(true)}
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-slate-600"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
              <span>Door Box Office Scanner</span>
            </button>
            <button
              onClick={() => setMyBookingsOpen(true)}
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-slate-600"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-600" />
              <span>My Tickets ({userBookings.length})</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action (Mode switch between Customer Experience and Agency Admin Dashboard) */}
          <div className="flex items-center gap-3 shrink-0">
            {viewMode === 'public' ? (
              <button
                onClick={() => setViewMode('admin')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>Agency Admin Console</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Internal</span>
              </button>
            ) : (
              <button
                onClick={() => setViewMode('public')}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>Back to Customer Portal</span>
              </button>
            )}
          </div>

        </div>
      </header>
    </>
  );
};
