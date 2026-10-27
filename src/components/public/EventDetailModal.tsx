import React, { useState, useMemo } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Check,
  ShieldCheck,
  Users,
  Utensils,
  Plus,
  Minus,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';

export const EventDetailModal: React.FC = () => {
  const {
    selectedEvent,
    setSelectedEventId,
    venues,
    createTemporaryHold,
    setActiveCheckoutHold,
    tenants
  } = usePlatform();

  if (!selectedEvent) return null;

  const venue = venues.find(v => v.id === selectedEvent.venueId);
  const tenant = tenants.find(t => t.id === selectedEvent.tenantId);

  // Active view tab inside modal
  const [activeTab, setActiveTab] = useState<'tickets' | 'schedule' | 'lineup' | 'venue'>('tickets');

  // Selected tier & quantity
  const [selectedTierId, setSelectedTierId] = useState<string>(selectedEvent.tiers[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [dietaryNote, setDietaryNote] = useState<string>('');
  const [holdError, setHoldError] = useState<string | null>(null);
  const [isSubmittingHold, setIsSubmittingHold] = useState(false);

  const currentTier = useMemo(() => {
    return selectedEvent.tiers.find(t => t.id === selectedTierId) || selectedEvent.tiers[0];
  }, [selectedTierId, selectedEvent]);

  // Calculate tier available stock
  const tierRemaining = currentTier ? currentTier.capacity - currentTier.soldCount - currentTier.heldCount : 0;

  const addOnsTotal = useMemo(() => {
    if (!selectedEvent.addOns) return 0;
    return selectedEvent.addOns
      .filter(a => selectedAddOnIds.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);
  }, [selectedEvent, selectedAddOnIds]);

  const subtotal = currentTier ? currentTier.price * quantity : 0;
  const estimatedTotal = subtotal + addOnsTotal;

  const handleToggleAddOn = (id: string) => {
    setSelectedAddOnIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleStartBookingHold = () => {
    if (!currentTier) return;
    setHoldError(null);
    setIsSubmittingHold(true);

    const result = createTemporaryHold(
      selectedEvent.id,
      currentTier.id,
      quantity,
      'web',
      'Web Guest Session'
    );

    setIsSubmittingHold(false);

    if (!result.success) {
      setHoldError(result.error || 'Failed to place temporary inventory hold.');
      return;
    }

    if (result.hold) {
      // Store any selected add-ons and dietary note in session storage or state
      setSelectedEventId(null); // Close detail modal
      setActiveCheckoutHold(result.hold); // Will open checkout modal automatically
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header with Hero Backing */}
        <div className="relative h-56 sm:h-64 bg-slate-900 shrink-0">
          <img
            src={selectedEvent.imageUrl}
            alt={selectedEvent.title}
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setSelectedEventId(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Title info */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <span>{tenant?.name}</span>
              <span aria-hidden="true">&middot;</span>
              <span className="capitalize">{selectedEvent.category.replace('_', ' ')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight line-clamp-2">
              {selectedEvent.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {selectedEvent.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {selectedEvent.startTime} - {selectedEvent.endTime}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {venue?.name}, {venue?.city}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 bg-slate-50 flex items-center gap-6 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'tickets'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ticket Tiers &amp; Reservations
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'schedule'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Agenda &amp; Schedule
          </button>
          {selectedEvent.lineupOrHosts && selectedEvent.lineupOrHosts.length > 0 && (
            <button
              onClick={() => setActiveTab('lineup')}
              className={`py-3.5 border-b-2 cursor-pointer transition-colors ${
                activeTab === 'lineup'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Lineup &amp; Speakers
            </button>
          )}
          <button
            onClick={() => setActiveTab('venue')}
            className={`py-3.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'venue'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Venue &amp; Seating Layout
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: TICKETS & RESERVATION ENGINE */}
          {activeTab === 'tickets' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Tier Selection List */}
              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Select Seating Tier / Package
                </div>

                {selectedEvent.tiers.map(tier => {
                  const isSelected = tier.id === selectedTierId;
                  const remaining = tier.capacity - tier.soldCount - tier.heldCount;
                  const isSoldOut = remaining <= 0;

                  return (
                    <div
                      key={tier.id}
                      onClick={() => !isSoldOut && setSelectedTierId(tier.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                          : isSoldOut
                          ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                          : 'border-slate-200 hover:border-slate-400 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div>
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span>{tier.name}</span>
                            {isSelected && (
                              <span className="text-[10px] font-semibold bg-slate-900 text-white px-2 py-0.5 rounded">
                                Selected
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">{tier.description}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-base font-bold font-mono tabular-nums text-slate-900">
                            ${tier.price}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {isSoldOut ? (
                              <span className="text-rose-600 font-semibold">Sold Out</span>
                            ) : (
                              <span>{remaining} left</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Benefits preview */}
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                        {tier.benefits.map((b, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Dietary input for dining events */}
                {selectedEvent.dietaryOptionsAvailable && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Dietary Preferences &amp; Allergies for Sommelier &amp; Chef
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vegetarian alternative, shellfish allergy, gluten sensitive..."
                      value={dietaryNote}
                      onChange={e => setDietaryNote(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                )}

                {/* Add-Ons selection */}
                {selectedEvent.addOns && selectedEvent.addOns.length > 0 && (
                  <div className="pt-3">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Experience Enhancements &amp; Add-ons
                    </div>
                    <div className="space-y-2">
                      {selectedEvent.addOns.map(addon => {
                        const checked = selectedAddOnIds.includes(addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => handleToggleAddOn(addon.id)}
                            className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                              checked
                                ? 'border-indigo-600 bg-indigo-50/50'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {}}
                                className="rounded text-indigo-600"
                              />
                              <div>
                                <div className="font-semibold text-slate-900">{addon.name}</div>
                                <div className="text-[11px] text-slate-500">{addon.description}</div>
                              </div>
                            </div>
                            <div className="font-bold font-mono tabular-nums text-slate-900 shrink-0 pl-2">
                              +${addon.price}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Reservation & Hold Summary Drawer */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Reserve Tickets with 10-Min Hold
                  </div>

                  {/* Quantity selector */}
                  <div className="mb-4">
                    <label className="block text-xs text-slate-600 mb-1.5">Quantity of Tickets</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-base font-bold font-mono tabular-nums text-slate-900 min-w-6 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(q => Math.min(currentTier?.maxPerOrder || 6, tierRemaining, q + 1))
                        }
                        disabled={quantity >= (currentTier?.maxPerOrder || 6) || quantity >= tierRemaining}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs text-slate-500">
                        (Max {currentTier?.maxPerOrder || 6} per order)
                      </span>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 py-3 border-y border-slate-200 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>{currentTier?.name} &times; {quantity}</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900">${subtotal}</span>
                    </div>
                    {addOnsTotal > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Selected Enhancements</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-900">+${addOnsTotal}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-900 font-bold text-sm pt-1">
                      <span>Estimated Total</span>
                      <span className="font-mono tabular-nums">${estimatedTotal}</span>
                    </div>
                  </div>

                  {/* Hold Engine Notice */}
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong>Unified Inventory Safeguard:</strong> Clicking below places a 10-minute temporary hold. Tickets are locked in Redis memory and cannot be double-booked across web or WhatsApp channels.
                    </div>
                  </div>

                  {holdError && (
                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
                      {holdError}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-2">
                  <button
                    onClick={handleStartBookingHold}
                    disabled={isSubmittingHold || tierRemaining <= 0}
                    className="w-full py-3 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Place 10-Minute Hold &amp; Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Hold will automatically expire after 10 minutes if not completed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULE & AGENDA */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Program Timeline &amp; Stages
              </div>
              <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                {selectedEvent.schedule.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white" />
                    <div className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                      {item.time} &middot; <span className="text-indigo-600">{item.stageOrRoom}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5">{item.title}</div>
                    {item.speakerOrPerformer && (
                      <div className="text-xs text-slate-500 mt-0.5">Featuring: {item.speakerOrPerformer}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LINEUP & HOSTS */}
          {activeTab === 'lineup' && selectedEvent.lineupOrHosts && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Featured Artists, Speakers &amp; Curators
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedEvent.lineupOrHosts.map((host, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                      {host.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{host}</div>
                      <div className="text-xs text-slate-500">Official Headliner / Speaker</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VENUE & SEATING LAYOUT */}
          {activeTab === 'venue' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Venue Details &amp; Interactive Seating Zones
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="font-bold text-sm text-slate-900">{venue?.name}</div>
                <div className="text-xs text-slate-600 mt-1">{venue?.address}</div>
                <div className="text-xs text-slate-500 mt-1 font-mono">
                  Standard Capacity: {venue?.capacity.toLocaleString()} attendees &middot; Format: {venue?.type}
                </div>
              </div>

              {/* Graphical Seating Zone Map Representation */}
              <div className="p-6 rounded-xl border border-slate-300 bg-slate-950 text-white text-center">
                <div className="py-2 px-6 rounded bg-slate-800 inline-block text-xs font-bold uppercase tracking-wider text-amber-400 mb-8">
                  STAGE / CHEF HEARTH / KEYNOTE PODIUM
                </div>

                <div className="max-w-md mx-auto space-y-3">
                  <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs flex justify-between items-center">
                    <span className="font-semibold">ZONE A: VIP Front Row / Chef Counter</span>
                    <span className="font-mono tabular-nums">$285 - $380</span>
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 text-xs flex justify-between items-center">
                    <span className="font-semibold">ZONE B: Reserved Lower Bowl / Executive Area</span>
                    <span className="font-mono tabular-nums">$165 - $980</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs flex justify-between items-center">
                    <span className="font-semibold">ZONE C: General Admission / Lawn / Timed Entry</span>
                    <span className="font-mono tabular-nums">$45 - $75</span>
                  </div>
                </div>

                <div className="mt-8 text-[11px] text-slate-400">
                  Real-time seat reservations are automatically locked into unified inventory upon hold creation.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
