import React, { useState, useMemo } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  Building2,
  TrendingUp,
  Calendar,
  Layers,
  Tag,
  DollarSign,
  ShieldCheck,
  Headphones,
  Link2,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Lock,
  Clock,
  QrCode,
  UserCheck,
  Send
} from 'lucide-react';
import { UserRole } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    tenants,
    currentTenantId,
    setCurrentTenantId,
    activeTenant,
    adminTab,
    setAdminTab,
    staffMembers,
    currentStaff,
    setCurrentStaffRole,
    events,
    venues,
    updateEventStatus,
    activeHolds,
    releaseTemporaryHold,
    promotions,
    bookings,
    transactions,
    processRefund,
    conversations,
    sendMessageToChannel,
    resolveConversation,
    integrations,
    toggleIntegration,
    triggerSyncIntegration,
    setDoorScannerOpen,
    setCreateEventModalOpen,
    showToast
  } = usePlatform();

  // Filters inside admin tables
  const [eventSearch, setEventSearch] = useState('');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [supportReplyText, setSupportReplyText] = useState('');
  const [selectedSupportSessionId, setSelectedSupportSessionId] = useState<string>(conversations[0]?.id || '');

  // Filtered by tenant if active
  const scopedEvents = useMemo(() => {
    return events.filter(e => (!currentTenantId || e.tenantId === currentTenantId));
  }, [events, currentTenantId]);

  const scopedBookings = useMemo(() => {
    return bookings.filter(b => (!currentTenantId || b.tenantId === currentTenantId));
  }, [bookings, currentTenantId]);

  const scopedTransactions = useMemo(() => {
    return transactions.filter(t => (!currentTenantId || t.tenantId === currentTenantId));
  }, [transactions, currentTenantId]);

  // Aggregate Metrics & Analytics
  const totalGMV = scopedTransactions.reduce((acc, t) => acc + (t.type === 'payment' ? t.amount : 0), 0);
  const totalRefunds = scopedTransactions.reduce((acc, t) => acc + (t.type === 'refund' ? Math.abs(t.amount) : 0), 0);
  const totalAgencyFees = scopedTransactions.reduce((acc, t) => acc + t.agencyFee, 0);
  const totalClientNet = scopedTransactions.reduce((acc, t) => acc + t.clientNet, 0);
  const totalTicketsSold = scopedBookings.filter(b => b.status === 'confirmed').reduce((acc, b) => acc + b.quantity, 0);

  // Check-in rates
  const totalTicketsIssued = scopedBookings.reduce((acc, b) => acc + b.tickets.length, 0);
  const totalCheckedIn = scopedBookings.reduce(
    (acc, b) => acc + b.tickets.filter(t => t.checkedIn).length,
    0
  );
  const checkInRate = totalTicketsIssued > 0 ? Math.round((totalCheckedIn / totalTicketsIssued) * 100) : 0;

  // Channel breakdown
  const channelCounts = useMemo(() => {
    const counts: Record<string, number> = { web: 0, whatsapp: 0, concierge: 0, box_office: 0 };
    scopedBookings.forEach(b => {
      counts[b.channel] = (counts[b.channel] || 0) + b.quantity;
    });
    return counts;
  }, [scopedBookings]);

  const selectedSupportSession = conversations.find(c => c.id === selectedSupportSessionId) || conversations[0];

  const handleSendSupportReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportReplyText.trim() || !selectedSupportSession) return;
    sendMessageToChannel(selectedSupportSession.id, supportReplyText, 'human_agent');
    setSupportReplyText('');
    showToast(`Replied to ${selectedSupportSession.customerName} as ${currentStaff.name}`);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      
      {/* Top Admin Bar: Brand Context & Staff Persona Switcher */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              M
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Agency Central Operations Hub</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded">
                  {currentTenantId ? `Client: ${activeTenant?.name}` : 'Agency Master View'}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Multi-Tenant Architecture &middot; PostgreSQL Schema &middot; Redis Unified Holds
              </div>
            </div>
          </div>

          {/* Tenant Selector & Staff Persona RBAC Selector */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Filter by Brand */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-medium">Filter Client:</span>
              <select
                value={currentTenantId || 'all'}
                onChange={e => setCurrentTenantId(e.target.value === 'all' ? null : e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer font-medium"
              >
                <option value="all">All Brands (Agency Master)</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Staff Role Switcher */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-medium">Persona:</span>
              <select
                value={currentStaff.role}
                onChange={e => setCurrentStaffRole(e.target.value as UserRole)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer font-medium text-slate-900"
              >
                <option value="agency_admin">Agency Super Admin (Elena)</option>
                <option value="client_admin">Client Event Lead (Marcus)</option>
                <option value="box_office_staff">Door Gate Staff (Jackson)</option>
                <option value="customer_support">Support Specialist (Amara)</option>
              </select>
            </div>

          </div>

        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-xs font-semibold">
            <button
              onClick={() => setAdminTab('analytics')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                adminTab === 'analytics' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Executive Overview</span>
            </button>

            <button
              onClick={() => setAdminTab('events')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                adminTab === 'events' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Event Manager ({scopedEvents.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('inventory')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                adminTab === 'inventory' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Unified Inventory &amp; Holds ({activeHolds.length} Active)</span>
            </button>

            <button
              onClick={() => setAdminTab('promotions')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                adminTab === 'promotions' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Promotions &amp; Quotas</span>
            </button>

            <button
              onClick={() => setAdminTab('transactions')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                adminTab === 'transactions' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Financial Ledger &amp; Payouts</span>
            </button>

            <button
              onClick={() => setAdminTab('support')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                adminTab === 'support' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Support &amp; Handoffs</span>
            </button>

            <button
              onClick={() => setAdminTab('integrations')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                adminTab === 'integrations' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>CRM &amp; POS Integrations</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Admin Workspace Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* SUBTAB 1: ANALYTICS & EXECUTIVE OVERVIEW */}
        {adminTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Gross Merchandise Value (GMV)
                </div>
                <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-900">
                  ${totalGMV.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">
                  +$501 today &middot; 0% payment chargebacks
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Total Confirmed Tickets
                </div>
                <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-900">
                  {totalTicketsSold} Passes
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Across {scopedEvents.length} active event instances
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Gate Check-In Velocity
                </div>
                <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-900">
                  {checkInRate}%
                </div>
                <div className="text-[11px] text-indigo-600 font-medium mt-1">
                  {totalCheckedIn} of {totalTicketsIssued} scanned at doors
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Active Unified Holds
                </div>
                <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-900">
                  {activeHolds.length} Sessions
                </div>
                <div className="text-[11px] text-amber-600 font-medium mt-1">
                  Locked across Web, WhatsApp &amp; Voice
                </div>
              </div>
            </div>

            {/* Middle Row: Channel Breakdown & Reconciliation Snapshot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Channel Distribution */}
              <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Omnichannel Booking Distribution</h3>
                    <p className="text-xs text-slate-500">Real-time inventory reservations by channel</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Total: {totalTicketsSold} tix</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-700">Web Booking Portal</span>
                      <span className="font-mono tabular-nums text-slate-900">
                        {channelCounts.web || 0} tickets ({Math.round(((channelCounts.web || 0) / (totalTicketsSold || 1)) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-slate-900 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-700">WhatsApp Automated Concierge</span>
                      <span className="font-mono tabular-nums text-slate-900">
                        {channelCounts.whatsapp || 0} tickets ({Math.round(((channelCounts.whatsapp || 0) / (totalTicketsSold || 1)) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-700">Voice-Assisted &amp; Concierge Desk</span>
                      <span className="font-mono tabular-nums text-slate-900">
                        {channelCounts.concierge || 0} tickets ({Math.round(((channelCounts.concierge || 0) / (totalTicketsSold || 1)) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Safeguard against overbooking:</span>
                  <span className="text-emerald-700 font-semibold">100% Invariant Compliant</span>
                </div>
              </div>

              {/* Agency vs Client Split */}
              <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Settlement &amp; Fee Reconciliation</h3>
                      <p className="text-xs text-slate-500">Automatic agency commission cut vs net client payouts</p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Synchronized
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                      <span className="text-slate-600">Total Captured Volume</span>
                      <span className="font-bold font-mono tabular-nums text-slate-900">${totalGMV.toFixed(2)}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                      <span className="text-slate-600">Payment Gateway Interchange (2.9% + $0.30)</span>
                      <span className="font-bold font-mono tabular-nums text-slate-700">-$103.15</span>
                    </div>
                    <div className="p-3 bg-indigo-50/60 rounded-lg flex justify-between items-center text-indigo-950">
                      <span className="font-semibold">Agency Platform Commission (avg 8%)</span>
                      <span className="font-bold font-mono tabular-nums">${totalAgencyFees.toFixed(2)}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg flex justify-between items-center text-emerald-950 font-bold">
                      <span>Net Client Tenant Payout Balance</span>
                      <span className="font-mono tabular-nums text-base">${totalClientNet.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Next Automated Payout Cadence:</span>
                  <span className="font-medium text-slate-900">Friday, Nov 06 &middot; Direct ACH</span>
                </div>
              </div>

            </div>

            {/* Live Door Check-in Quick Launcher */}
            <div className="p-5 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  On-Site Operations
                </div>
                <div className="text-base font-bold text-white">
                  Live Gate Box Office &amp; QR Code Scanner
                </div>
                <p className="text-xs text-slate-300">
                  Scan physical or mobile tickets at venue gates with instant pass validation.
                </p>
              </div>
              <button
                onClick={() => setDoorScannerOpen(true)}
                className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                <QrCode className="w-4 h-4" />
                <span>Launch Door Scanner Mode</span>
              </button>
            </div>

          </div>
        )}

        {/* SUBTAB 2: EVENT MANAGEMENT */}
        {adminTab === 'events' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Client Brand Events Roster</h3>
                <p className="text-xs text-slate-500">Manage schedules, ticket tier capacity, and published states</p>
              </div>

              <button
                onClick={() => setCreateEventModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Event</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Event &amp; Brand</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Venue &amp; Date</th>
                    <th className="py-3 px-4">Tiers &amp; Pricing</th>
                    <th className="py-3 px-4">Total Capacity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {scopedEvents.map(event => {
                    const tenant = tenants.find(t => t.id === event.tenantId);
                    const venue = venues.find(v => v.id === event.venueId);
                    const totalCap = event.tiers.reduce((a, t) => a + t.capacity, 0);
                    const totalSold = event.tiers.reduce((a, t) => a + t.soldCount, 0);

                    return (
                      <tr key={event.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{event.title}</div>
                          <div className="text-[11px] text-slate-500">{tenant?.name}</div>
                        </td>
                        <td className="py-3.5 px-4 capitalize text-slate-700">
                          {event.category.replace('_', ' ')}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-900">{event.date}</div>
                          <div className="text-[11px] text-slate-500">{venue?.city}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                          {event.tiers.length} Tiers (${Math.min(...event.tiers.map(t => t.price))} - ${Math.max(...event.tiers.map(t => t.price))})
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums">
                          <span className="font-semibold text-slate-900">{totalSold}</span>
                          <span className="text-slate-400"> / {totalCap}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={event.status}
                            onChange={e => updateEventStatus(event.id, e.target.value as any)}
                            className="text-xs bg-slate-100 border border-slate-300 rounded px-2 py-1 font-semibold cursor-pointer"
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="sold_out">Sold Out</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => showToast(`Opening event tier manager for ${event.title}`)}
                            className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                          >
                            Edit Tiers
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 3: UNIFIED INVENTORY & HOLDS */}
        {adminTab === 'inventory' && (
          <div className="space-y-6">
            
            {/* Active Holds Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Active Unified Inventory Holds</h3>
                  <p className="text-xs text-slate-500">
                    Real-time temporary holds locked across all channels to prevent overbooking
                  </p>
                </div>
                <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                  {activeHolds.length} Active Lock(s)
                </span>
              </div>

              {activeHolds.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No active temporary holds currently in progress. All inventory is fully available for reservations.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Hold ID</th>
                        <th className="py-2.5 px-3">Event &amp; Tier</th>
                        <th className="py-2.5 px-3">Qty</th>
                        <th className="py-2.5 px-3">Channel</th>
                        <th className="py-2.5 px-3">Customer Reference</th>
                        <th className="py-2.5 px-3">Expires In</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {activeHolds.map(hold => {
                        const event = events.find(e => e.id === hold.eventId);
                        const tier = event?.tiers.find(t => t.id === hold.tierId);
                        const remainingSecs = Math.max(0, Math.floor((hold.expiresAt - Date.now()) / 1000));
                        const mm = Math.floor(remainingSecs / 60);
                        const ss = remainingSecs % 60;

                        return (
                          <tr key={hold.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">{hold.id}</td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-900">{event?.title}</div>
                              <div className="text-[11px] text-slate-500">{tier?.name}</div>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold">{hold.quantity}</td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 text-slate-800">
                                {hold.channel}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-600">{hold.customerIdentifier}</td>
                            <td className="py-3 px-3 font-mono tabular-nums text-amber-700 font-bold">
                              {mm}:{ss.toString().padStart(2, '0')}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => releaseTemporaryHold(hold.id)}
                                className="px-2.5 py-1 text-[11px] text-rose-700 bg-rose-50 hover:bg-rose-100 rounded cursor-pointer font-medium"
                              >
                                Release Hold
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* All Tiers Inventory Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Live Unified Inventory Capacity Matrix</h3>
              <p className="text-xs text-slate-500 mb-4">
                Total capacity vs sold vs currently held across all clients and tiers
              </p>

              <div className="space-y-4">
                {scopedEvents.map(event => (
                  <div key={event.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-bold text-sm text-slate-900 mb-2">{event.title}</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {event.tiers.map(tier => {
                        const available = tier.capacity - tier.soldCount - tier.heldCount;
                        return (
                          <div key={tier.id} className="p-3 bg-white rounded-lg border border-slate-200">
                            <div className="flex justify-between items-center text-xs font-semibold text-slate-900 mb-1">
                              <span>{tier.name}</span>
                              <span className="font-mono tabular-nums">${tier.price}</span>
                            </div>
                            <div className="grid grid-cols-3 text-center text-xs gap-1 py-1.5 font-mono">
                              <div>
                                <div className="text-[10px] text-slate-400">Sold</div>
                                <div className="font-bold text-slate-800">{tier.soldCount}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-amber-600">Held</div>
                                <div className="font-bold text-amber-600">{tier.heldCount}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-emerald-600">Free</div>
                                <div className="font-bold text-emerald-600">{available}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SUBTAB 4: PROMOTIONS & QUOTAS */}
        {adminTab === 'promotions' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Promotions, Early-Bird Offers &amp; Bundles</h3>
                <p className="text-xs text-slate-500">Configure discount rules, redemption quotas, and brand restrictions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotions.map(promo => {
                const tenant = tenants.find(t => t.id === promo.tenantId);
                const percentRedeemed = Math.round((promo.currentRedemptions / promo.maxRedemptions) * 100);

                return (
                  <div key={promo.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-sm text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded">
                          {promo.code}
                        </span>
                        <span className="text-xs font-semibold text-indigo-700 font-mono">
                          {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `$${promo.discountValue} OFF`}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mb-3">{promo.description}</p>

                      <div className="text-[11px] text-slate-500 space-y-1 mb-3">
                        <div>Scope: <strong>{tenant ? tenant.name : 'Agency-Wide (All Clients)'}</strong></div>
                        <div>Valid Until: <strong>{promo.validUntil}</strong></div>
                        {promo.minTickets && <div>Min Order: <strong>{promo.minTickets} tickets</strong></div>}
                      </div>
                    </div>

                    {/* Quota Progress Bar */}
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                        <span>Redemption Quota</span>
                        <span className="font-mono tabular-nums">{promo.currentRedemptions} / {promo.maxRedemptions} ({percentRedeemed}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${percentRedeemed}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB 5: FINANCIAL LEDGER & RECONCILIATION */}
        {adminTab === 'transactions' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Financial Ledger &amp; Settlement Log</h3>
                <p className="text-xs text-slate-500">Every payment, refund, gateway fee and agency commission split</p>
              </div>

              <button
                onClick={() => showToast('Exporting financial reconciliation CSV report...')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                Export Settlement CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Txn ID</th>
                    <th className="py-3 px-4">Customer &amp; Booking</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Gross Amount</th>
                    <th className="py-3 px-4">Gateway Fee</th>
                    <th className="py-3 px-4">Agency Cut</th>
                    <th className="py-3 px-4">Client Net</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Refund Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {scopedTransactions.map(txn => {
                    const isRefund = txn.type === 'refund';
                    return (
                      <tr key={txn.id} className="hover:bg-slate-50 font-mono text-xs">
                        <td className="py-3 px-4 font-bold text-slate-900">{txn.id}</td>
                        <td className="py-3 px-4 font-sans">
                          <div className="font-semibold text-slate-900">{txn.customerName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{txn.bookingId}</div>
                        </td>
                        <td className="py-3 px-4 font-sans uppercase text-[11px] text-slate-600">
                          {txn.channel}
                        </td>
                        <td className={`py-3 px-4 font-bold ${isRefund ? 'text-rose-600' : 'text-slate-900'}`}>
                          ${txn.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-slate-500">-${txn.gatewayFee.toFixed(2)}</td>
                        <td className="py-3 px-4 text-indigo-700 font-semibold">${txn.agencyFee.toFixed(2)}</td>
                        <td className="py-3 px-4 font-bold text-emerald-700">${txn.clientNet.toFixed(2)}</td>
                        <td className="py-3 px-4 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            txn.status === 'captured' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {txn.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-sans">
                          {!isRefund && (
                            <button
                              onClick={() => processRefund(txn.bookingId, true, 'Admin manual override')}
                              className="px-2.5 py-1 text-[11px] text-rose-700 bg-rose-50 hover:bg-rose-100 rounded cursor-pointer font-medium"
                            >
                              Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 6: CUSTOMER SUPPORT & HUMAN HANDOFF DESK */}
        {adminTab === 'support' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
            
            {/* Left Queue List */}
            <div className="md:col-span-5 border-r border-slate-200 p-4 space-y-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Live Support Queue &amp; Handoffs ({conversations.length})
              </div>

              {conversations.map(conv => {
                const isSelected = conv.id === selectedSupportSessionId;
                const isHandoff = conv.status === 'handed_off_to_human';

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedSupportSessionId(conv.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs text-slate-900">{conv.customerName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{conv.lastActivity}</span>
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-1 mb-2">
                      {conv.messages[conv.messages.length - 1]?.text}
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="uppercase font-semibold text-slate-500">{conv.channel}</span>
                      {isHandoff ? (
                        <span className="px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
                          Human Handoff
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-600">
                          AI Handling
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Chat & Reply Workspace */}
            <div className="md:col-span-7 flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {selectedSupportSession?.customerName}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Channel: {selectedSupportSession?.channel.toUpperCase()} &middot; ID: {selectedSupportSession?.id}
                    </div>
                  </div>

                  <button
                    onClick={() => resolveConversation(selectedSupportSession.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                </div>

                {/* Conversation messages feed */}
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
                  {selectedSupportSession?.messages.map(m => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl text-xs max-w-[85%] ${
                        m.sender === 'user'
                          ? 'bg-slate-100 text-slate-800 ml-auto'
                          : m.sender === 'human_agent'
                          ? 'bg-amber-100 text-amber-950 font-medium'
                          : m.sender === 'system'
                          ? 'bg-indigo-50 text-indigo-900 italic text-center mx-auto'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 mb-0.5">
                        {m.sender.toUpperCase()} &middot; {m.timestamp}
                      </div>
                      <div>{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff Reply Form */}
              <form onSubmit={handleSendSupportReply} className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${selectedSupportSession?.customerName} as ${currentStaff.name}...`}
                  value={supportReplyText}
                  onChange={e => setSupportReplyText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="submit"
                  disabled={!supportReplyText.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* SUBTAB 7: BUSINESS INTEGRATIONS */}
        {adminTab === 'integrations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-1">CRM, POS &amp; Marketing Connectors</h3>
              <p className="text-xs text-slate-500 mb-6">
                Seamless synchronization with external enterprise sales, marketing, and on-site ticketing systems
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map(int => (
                  <div key={int.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-sm text-slate-900">{int.name}</div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          int.connected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {int.connected ? 'Connected' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3 leading-relaxed">{int.description}</p>
                      <div className="text-[11px] text-slate-500 font-mono mb-4">
                        Synced Records: {int.eventsSyncedCount.toLocaleString()} &middot; Last Sync: {int.lastSync}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <button
                        onClick={() => toggleIntegration(int.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                          int.connected ? 'text-rose-700 bg-rose-50 hover:bg-rose-100' : 'text-slate-900 bg-white border border-slate-300'
                        }`}
                      >
                        {int.connected ? 'Disconnect' : 'Connect API'}
                      </button>

                      {int.connected && (
                        <button
                          onClick={() => triggerSyncIntegration(int.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Sync Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
