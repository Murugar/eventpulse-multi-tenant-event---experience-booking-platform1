import React, { useState, useMemo } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { EventCategory } from '../../types';
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

export const EventDiscovery: React.FC = () => {
  const {
    events,
    venues,
    activeTenant,
    currentTenantId,
    setSelectedEventId,
    setConciergeOpen,
    setConciergeChannel
  } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Filter events based on active tenant, category, city, and search query
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Tenant filter
      if (currentTenantId && event.tenantId !== currentTenantId) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && event.category !== selectedCategory) {
        return false;
      }
      // Venue city filter
      const venue = venues.find(v => v.id === event.venueId);
      if (selectedCity !== 'all' && venue && !venue.city.includes(selectedCity)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesTagline = event.tagline.toLowerCase().includes(q);
        const matchesLineup = event.lineupOrHosts?.some(h => h.toLowerCase().includes(q));
        const matchesVenue = venue?.name.toLowerCase().includes(q) || venue?.city.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTagline && !matchesLineup && !matchesVenue) {
          return false;
        }
      }
      return true;
    });
  }, [events, venues, currentTenantId, selectedCategory, selectedCity, searchQuery]);

  const featuredEvent = useMemo(() => {
    return filteredEvents.find(e => e.featured) || filteredEvents[0];
  }, [filteredEvents]);

  const cities = useMemo(() => {
    const list = venues.map(v => v.city.split(',')[0].trim());
    return Array.from(new Set(list));
  }, [venues]);

  const categoryLabels: { id: EventCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Experiences' },
    { id: 'concert', label: 'Concerts & Arenas' },
    { id: 'conference', label: 'Tech & Summits' },
    { id: 'dining', label: 'Dining Degustations' },
    { id: 'brand_activation', label: 'Brand Pavilions' },
    { id: 'workshop', label: 'Masterclasses' }
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Showcase Section */}
      {featuredEvent && (
        <section className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 z-0">
            <img
              src={featuredEvent.imageUrl}
              alt={featuredEvent.title}
              className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-3xl">
              {/* Unboxed Metadata (Zero-Pill Discipline) */}
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase mb-3">
                <span>Featured Experience</span>
                <span aria-hidden="true">&middot;</span>
                <span>{featuredEvent.category.replace('_', ' ')}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{featuredEvent.date}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                {featuredEvent.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
                {featuredEvent.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setSelectedEventId(featuredEvent.id)}
                  className="px-6 py-3 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Select Tickets &amp; Reserve</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setConciergeChannel('whatsapp');
                    setConciergeOpen(true);
                  }}
                  className="px-5 py-3 text-sm font-medium text-slate-200 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Book via WhatsApp</span>
                </button>
              </div>

              {/* Quick Info Bar */}
              <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>{featuredEvent.date} · {featuredEvent.startTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>
                    {venues.find(v => v.id === featuredEvent.venueId)?.name} (
                    {venues.find(v => v.id === featuredEvent.venueId)?.city})
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums text-white">
                  <span>Passes from ${Math.min(...featuredEvent.tiers.map(t => t.price))}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Discovery Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Client Brand Indicator (if a tenant is selected) */}
        {activeTenant && (
          <div className="mb-6 p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Viewing Branded Booking Experience
              </div>
              <div className="text-lg font-bold text-slate-900">{activeTenant.name}</div>
              <div className="text-xs text-slate-600">{activeTenant.tagline}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-mono">{activeTenant.customDomain}</span>
            </div>
          </div>
        )}

        {/* Filter Controls Row */}
        <div className="space-y-4 mb-8">
          {/* Search and City selection */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search concerts, tech summits, chef degustations, speakers or venues..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-700 cursor-pointer"
                >
                  <option value="all">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {(searchQuery || selectedCategory !== 'all' || selectedCity !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedCity('all');
                  }}
                  className="px-3 py-2.5 text-xs text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Category Segmented Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categoryLabels.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Heading with Results Count */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Upcoming Available Experiences ({filteredEvents.length})
          </h2>
          <div className="text-xs text-slate-500 font-mono">
            Unified Real-Time Inventory Active
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8">
            <Filter className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 mb-1">No matching experiences found</h3>
            <p className="text-xs text-slate-500 mb-4">Try clearing your filters or search terms.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedCity('all');
              }}
              className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => {
              const venue = venues.find(v => v.id === event.venueId);
              const minPrice = Math.min(...event.tiers.map(t => t.price));
              const totalCapacity = event.tiers.reduce((acc, t) => acc + t.capacity, 0);
              const totalRemaining = event.tiers.reduce(
                (acc, t) => acc + (t.capacity - t.soldCount - t.heldCount),
                0
              );
              const isLowStock = totalRemaining < 50;

              return (
                <div
                  key={event.id}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Media Container */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                      
                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-3 left-3 text-white">
                        <span className="text-[11px] text-slate-300 uppercase tracking-wide">From </span>
                        <span className="text-base font-bold font-mono tabular-nums">${minPrice}</span>
                      </div>

                      {/* Stock / Capacity status */}
                      <div className="absolute bottom-3 right-3 text-right">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                          isLowStock ? 'bg-amber-500/90 text-slate-950 font-semibold' : 'bg-black/60 text-white backdrop-blur-sm'
                        }`}>
                          {totalRemaining} available
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5">
                      {/* Unboxed Metadata (Zero-Pill Discipline) */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span className="capitalize">{event.category.replace('_', ' ')}</span>
                        <span aria-hidden="true">&middot;</span>
                        <span>{venue?.city}</span>
                        <span aria-hidden="true">&middot;</span>
                        <span>{event.date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5">
                        {event.title}
                      </h3>

                      {/* Tagline */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {event.tagline}
                      </p>

                      {/* Venue info */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{venue?.name}</span>
                      </div>

                      {/* Schedule teaser */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{event.date} · {event.startTime} - {event.endTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-5 pt-0">
                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400 font-mono">
                        {event.tiers.length} Tier Options
                      </div>
                      <button
                        onClick={() => setSelectedEventId(event.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-md transition-colors cursor-pointer"
                      >
                        Select Tickets
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
