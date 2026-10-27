import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { X, Plus, Trash2, Calendar, MapPin, DollarSign, Image as ImageIcon } from 'lucide-react';
import { EventCategory, TicketTier } from '../../types';

export const EventCreateModal: React.FC = () => {
  const {
    createEventModalOpen,
    setCreateEventModalOpen,
    tenants,
    venues,
    createEvent
  } = usePlatform();

  const [tenantId, setTenantId] = useState(tenants[0]?.id || 'apex-live');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('concert');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [venueId, setVenueId] = useState(venues[0]?.id || 'venue-solstice');
  const [date, setDate] = useState('2026-12-18');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('22:30');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/hero_concert_stage_1793098377229.jpg');

  // Dynamic ticket tiers
  const [tiers, setTiers] = useState<Array<{
    name: string;
    price: number;
    capacity: number;
    description: string;
    benefits: string[];
    maxPerOrder: number;
  }>>([
    {
      name: 'VIP Front Row Experience',
      price: 250,
      capacity: 100,
      description: 'Front row priority seating and lounge access',
      benefits: ['VIP Lane Entrance', 'Champagne Welcome'],
      maxPerOrder: 4
    },
    {
      name: 'General Admission',
      price: 65,
      capacity: 800,
      description: 'Standard access to main experience zone',
      benefits: ['Unreserved Seating', 'Standard Entry'],
      maxPerOrder: 8
    }
  ]);

  if (!createEventModalOpen) return null;

  const handleAddTier = () => {
    setTiers(prev => [
      ...prev,
      {
        name: 'Early Bird Pass',
        price: 45,
        capacity: 200,
        description: 'Special early reservation pricing',
        benefits: ['Full Day Access'],
        maxPerOrder: 6
      }
    ]);
  };

  const handleRemoveTier = (idx: number) => {
    setTiers(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || tiers.length === 0) return;

    createEvent({
      tenantId,
      title,
      category,
      tagline,
      description,
      imageUrl,
      date,
      startTime,
      endTime,
      venueId,
      featured: false,
      status: 'published',
      schedule: [
        { time: startTime, title: 'Doors Open & Welcome Reception', stageOrRoom: 'Main Hall' },
        { time: endTime, title: 'Event Concludes', stageOrRoom: 'Main Hall' }
      ],
      tiers: tiers.map((t, i) => ({
        ...t,
        id: `t-${i}`,
        eventId: '',
        soldCount: 0,
        heldCount: 0
      }))
    });

    setCreateEventModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold">Publish New Experience</h2>
            <p className="text-xs text-slate-400">Configure multi-tenant branding, venue, and ticket tiers</p>
          </div>
          <button
            onClick={() => setCreateEventModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Target Client Brand</label>
              <select
                value={tenantId}
                onChange={e => setTenantId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 capitalize"
              >
                <option value="concert">Concert / Arena</option>
                <option value="conference">Tech / Executive Summit</option>
                <option value="dining">Fine Dining Degustation</option>
                <option value="brand_activation">Brand Activation Pavilion</option>
                <option value="workshop">Workshop / Masterclass</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Luminary Global Robotics & AI Summit 2026"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">Short Tagline</label>
            <input
              type="text"
              required
              placeholder="e.g. An exclusive single-evening keynote and networking dinner..."
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Venue Location</label>
              <select
                value={venueId}
                onChange={e => setVenueId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-900 mb-1">Start</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-900 mb-1">End</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Ticket Tiers Configuration */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Ticket Tiers &amp; Capacity ({tiers.length})
              </div>
              <button
                type="button"
                onClick={handleAddTier}
                className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="space-y-3">
              {tiers.map((tier, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Tier Name (e.g. VIP Front Row)"
                      value={tier.name}
                      onChange={e => {
                        const val = e.target.value;
                        setTiers(prev => prev.map((t, i) => i === idx ? { ...t, name: val } : t));
                      }}
                      className="flex-1 px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded"
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-slate-500">$</span>
                        <input
                          type="number"
                          placeholder="Price"
                          value={tier.price}
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 0;
                            setTiers(prev => prev.map((t, i) => i === idx ? { ...t, price: val } : t));
                          }}
                          className="w-16 px-2 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded"
                        />
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-slate-500">Cap:</span>
                        <input
                          type="number"
                          placeholder="Cap"
                          value={tier.capacity}
                          onChange={e => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setTiers(prev => prev.map((t, i) => i === idx ? { ...t, capacity: val } : t));
                          }}
                          className="w-16 px-2 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded"
                        />
                      </div>
                      {tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTier(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateEventModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              Publish Event to Inventory
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
