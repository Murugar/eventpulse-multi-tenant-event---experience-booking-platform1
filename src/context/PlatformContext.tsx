import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  ClientTenant,
  VenueLocation,
  EventItem,
  TicketTier,
  TemporaryHold,
  PromotionOffer,
  BookingOrder,
  FinancialTransaction,
  BusinessIntegration,
  StaffMember,
  ConversationalSession,
  BookingChannel,
  UserRole
} from '../types';
import {
  mockTenants,
  mockVenues,
  mockEvents,
  mockPromotions,
  mockBookings,
  mockTransactions,
  mockIntegrations,
  mockStaff,
  initialConversations
} from '../data/mockData';

interface CheckoutRequest {
  holdId?: string;
  eventId: string;
  tierId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  paymentMethod: 'credit_card' | 'apple_pay' | 'google_pay' | 'corporate_invoice';
  appliedPromoCode?: string;
  addOns?: { name: string; price: number }[];
  dietaryNote?: string;
}

interface PlatformContextType {
  // Tenancy
  tenants: ClientTenant[];
  currentTenantId: string | null; // null = Agency Master
  setCurrentTenantId: (id: string | null) => void;
  activeTenant: ClientTenant | null;

  // View & Mode
  viewMode: 'public' | 'admin';
  setViewMode: (mode: 'public' | 'admin') => void;
  adminTab: 'analytics' | 'events' | 'inventory' | 'promotions' | 'transactions' | 'scanner' | 'support' | 'integrations';
  setAdminTab: (tab: 'analytics' | 'events' | 'inventory' | 'promotions' | 'transactions' | 'scanner' | 'support' | 'integrations') => void;

  // Staff & Permissions
  staffMembers: StaffMember[];
  currentStaff: StaffMember;
  setCurrentStaffRole: (role: UserRole) => void;

  // Events & Venues
  events: EventItem[];
  venues: VenueLocation[];
  selectedEvent: EventItem | null;
  setSelectedEventId: (id: string | null) => void;
  createEvent: (newEvent: Omit<EventItem, 'id'>) => void;
  updateEventStatus: (eventId: string, status: EventItem['status']) => void;

  // Unified Inventory & Holds
  activeHolds: TemporaryHold[];
  createTemporaryHold: (
    eventId: string,
    tierId: string,
    quantity: number,
    channel: BookingChannel,
    customerIdentifier: string
  ) => { success: boolean; hold?: TemporaryHold; error?: string };
  releaseTemporaryHold: (holdId: string) => void;
  extendTemporaryHold: (holdId: string, minutes?: number) => void;
  activeCheckoutHold: TemporaryHold | null;
  setActiveCheckoutHold: (hold: TemporaryHold | null) => void;

  // Promotions
  promotions: PromotionOffer[];
  validatePromotion: (
    code: string,
    eventId: string,
    ticketCount: number,
    subtotal: number
  ) => { valid: boolean; discountAmount: number; error?: string; promo?: PromotionOffer };
  createPromotion: (promo: Omit<PromotionOffer, 'id' | 'currentRedemptions'>) => void;

  // Bookings & Checkout
  bookings: BookingOrder[];
  completeCheckout: (request: CheckoutRequest) => Promise<{ success: boolean; booking?: BookingOrder; error?: string }>;
  processRefund: (bookingId: string, restockInventory: boolean, reason?: string) => { success: boolean; message: string };
  userBookings: BookingOrder[];

  // Financials & Transactions
  transactions: FinancialTransaction[];

  // Door Check-in Scanner
  verifyAndCheckInTicket: (ticketCode: string) => {
    status: 'success' | 'already_checked_in' | 'invalid';
    ticket?: any;
    event?: EventItem;
    booking?: BookingOrder;
    message: string;
  };

  // Conversational Channels
  conversations: ConversationalSession[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  sendMessageToChannel: (sessionId: string, text: string, sender: 'user' | 'bot' | 'human_agent') => void;
  requestHumanHandoff: (sessionId: string) => void;
  resolveConversation: (sessionId: string) => void;

  // Integrations
  integrations: BusinessIntegration[];
  toggleIntegration: (id: string) => void;
  triggerSyncIntegration: (id: string) => void;

  // Modals & UI States
  myBookingsOpen: boolean;
  setMyBookingsOpen: (open: boolean) => void;
  doorScannerOpen: boolean;
  setDoorScannerOpen: (open: boolean) => void;
  createEventModalOpen: boolean;
  setCreateEventModalOpen: (open: boolean) => void;
  conciergeOpen: boolean;
  setConciergeOpen: (open: boolean) => void;
  conciergeChannel: 'chatbot' | 'whatsapp' | 'voice';
  setConciergeChannel: (channel: 'chatbot' | 'whatsapp' | 'voice') => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Tenants & Venues
  const [tenants] = useState<ClientTenant[]>(mockTenants);
  const [venues] = useState<VenueLocation[]>(mockVenues);
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);

  // View Mode
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [adminTab, setAdminTab] = useState<'analytics' | 'events' | 'inventory' | 'promotions' | 'transactions' | 'scanner' | 'support' | 'integrations'>('analytics');

  // Staff & RBAC
  const [staffMembers] = useState<StaffMember[]>(mockStaff);
  const [currentStaffRole, setCurrentStaffRoleState] = useState<UserRole>('agency_admin');

  const currentStaff = useMemo(() => {
    return staffMembers.find(s => s.role === currentStaffRole) || staffMembers[0];
  }, [currentStaffRole, staffMembers]);

  const setCurrentStaffRole = (role: UserRole) => {
    setCurrentStaffRoleState(role);
    showToast(`Switched active staff persona to ${role.replace('_', ' ').toUpperCase()}`);
  };

  // Events state
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Unified Inventory & Holds
  const [activeHolds, setActiveHolds] = useState<TemporaryHold[]>([
    {
      id: 'HLD-8941',
      eventId: 'evt-astra-nova',
      tierId: 'tier-astra-vip',
      quantity: 2,
      channel: 'whatsapp',
      sessionId: 'sess-wa-david',
      customerIdentifier: 'David K. (+1 555-392-1084)',
      expiresAt: Date.now() + 580 * 1000,
      createdAt: Date.now() - 20 * 1000
    }
  ]);

  const [activeCheckoutHold, setActiveCheckoutHold] = useState<TemporaryHold | null>(null);

  // Promotions
  const [promotions, setPromotions] = useState<PromotionOffer[]>(mockPromotions);

  // Bookings & Transactions
  const [bookings, setBookings] = useState<BookingOrder[]>(mockBookings);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(mockTransactions);

  // Conversational Sessions
  const [conversations, setConversations] = useState<ConversationalSession[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-01');

  // Business Integrations
  const [integrations, setIntegrations] = useState<BusinessIntegration[]>(mockIntegrations);

  // Modals & UI
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [doorScannerOpen, setDoorScannerOpen] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [conciergeChannel, setConciergeChannel] = useState<'chatbot' | 'whatsapp' | 'voice'>('chatbot');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  const activeTenant = useMemo(() => {
    if (!currentTenantId) return null;
    return tenants.find(t => t.id === currentTenantId) || null;
  }, [currentTenantId, tenants]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return events.find(e => e.id === selectedEventId) || null;
  }, [selectedEventId, events]);

  // User bookings (Marcus Reynolds by default as logged in customer)
  const userBookings = useMemo(() => {
    return bookings.filter(b => b.customerEmail === 'm.reynolds@apexventures.com' || b.channel === 'web');
  }, [bookings]);

  // UNIFIED INVENTORY: Background hold expiration watchdog
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setActiveHolds(prevHolds => {
        const expired = prevHolds.filter(h => h.expiresAt <= now);
        if (expired.length === 0) return prevHolds;

        // Release expired holds back to inventory
        expired.forEach(hold => {
          setEvents(currentEvents =>
            currentEvents.map(ev => {
              if (ev.id !== hold.eventId) return ev;
              return {
                ...ev,
                tiers: ev.tiers.map(t => {
                  if (t.id !== hold.tierId) return t;
                  return {
                    ...t,
                    heldCount: Math.max(0, t.heldCount - hold.quantity)
                  };
                })
              };
            })
          );
          showToast(`Hold ${hold.id} on ${hold.quantity} ticket(s) expired and restored to inventory pool.`);
        });

        return prevHolds.filter(h => h.expiresAt > now);
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Atomic Temporary Hold creation
  const createTemporaryHold = (
    eventId: string,
    tierId: string,
    quantity: number,
    channel: BookingChannel,
    customerIdentifier: string
  ) => {
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return { success: false, error: 'Event not found' };

    const targetTier = targetEvent.tiers.find(t => t.id === tierId);
    if (!targetTier) return { success: false, error: 'Ticket tier not found' };

    // Unified inventory atomic check: capacity vs sold + held
    const available = targetTier.capacity - (targetTier.soldCount + targetTier.heldCount);
    if (available < quantity) {
      return {
        success: false,
        error: `Only ${Math.max(0, available)} ticket(s) currently available in unified inventory.`
      };
    }

    const holdId = `HLD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newHold: TemporaryHold = {
      id: holdId,
      eventId,
      tierId,
      quantity,
      channel,
      sessionId: `sess-${Date.now()}`,
      customerIdentifier,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minute hold
      createdAt: Date.now()
    };

    // Increment heldCount in tier
    setEvents(prevEvents =>
      prevEvents.map(ev => {
        if (ev.id !== eventId) return ev;
        return {
          ...ev,
          tiers: ev.tiers.map(t => {
            if (t.id !== tierId) return t;
            return { ...t, heldCount: t.heldCount + quantity };
          })
        };
      })
    );

    setActiveHolds(prev => [newHold, ...prev]);
    setActiveCheckoutHold(newHold);
    showToast(`10-Minute Hold secured (${newHold.id}). Inventory reserved across all channels.`);

    return { success: true, hold: newHold };
  };

  const releaseTemporaryHold = (holdId: string) => {
    const targetHold = activeHolds.find(h => h.id === holdId);
    if (!targetHold) return;

    setEvents(prev =>
      prev.map(ev => {
        if (ev.id !== targetHold.eventId) return ev;
        return {
          ...ev,
          tiers: ev.tiers.map(t => {
            if (t.id !== targetHold.tierId) return t;
            return { ...t, heldCount: Math.max(0, t.heldCount - targetHold.quantity) };
          })
        };
      })
    );

    setActiveHolds(prev => prev.filter(h => h.id !== holdId));
    if (activeCheckoutHold?.id === holdId) {
      setActiveCheckoutHold(null);
    }
    showToast(`Hold ${holdId} released back to inventory pool.`);
  };

  const extendTemporaryHold = (holdId: string, minutes: number = 5) => {
    setActiveHolds(prev =>
      prev.map(h => {
        if (h.id !== holdId) return h;
        return { ...h, expiresAt: h.expiresAt + minutes * 60 * 1000 };
      })
    );
    showToast(`Hold extended by +${minutes} minutes for checkout.`);
  };

  // Promotion validation
  const validatePromotion = (
    code: string,
    eventId: string,
    ticketCount: number,
    subtotal: number
  ) => {
    const cleanCode = code.trim().toUpperCase();
    const promo = promotions.find(p => p.code.toUpperCase() === cleanCode);
    if (!promo) {
      return { valid: false, discountAmount: 0, error: 'Invalid promotion code' };
    }

    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) {
      return { valid: false, discountAmount: 0, error: 'Event not found' };
    }

    if (promo.tenantId && promo.tenantId !== targetEvent.tenantId) {
      return { valid: false, discountAmount: 0, error: 'Coupon not applicable to this client brand' };
    }

    if (promo.applicableCategories && !promo.applicableCategories.includes(targetEvent.category)) {
      return {
        valid: false,
        discountAmount: 0,
        error: `Coupon only valid for ${promo.applicableCategories.join(', ')} events`
      };
    }

    if (promo.minTickets && ticketCount < promo.minTickets) {
      return {
        valid: false,
        discountAmount: 0,
        error: `Requires at least ${promo.minTickets} tickets to redeem`
      };
    }

    if (promo.currentRedemptions >= promo.maxRedemptions) {
      return { valid: false, discountAmount: 0, error: 'Coupon redemption quota exhausted' };
    }

    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = (subtotal * promo.discountValue) / 100;
    } else {
      discount = Math.min(subtotal, promo.discountValue);
    }

    return { valid: true, discountAmount: Math.round(discount * 100) / 100, promo };
  };

  const createPromotion = (promoData: Omit<PromotionOffer, 'id' | 'currentRedemptions'>) => {
    const newPromo: PromotionOffer = {
      ...promoData,
      id: `promo-${Date.now()}`,
      currentRedemptions: 0
    };
    setPromotions(prev => [newPromo, ...prev]);
    showToast(`Promotion ${newPromo.code} created with quota of ${newPromo.maxRedemptions}`);
  };

  // Checkout completion
  const completeCheckout = async (request: CheckoutRequest): Promise<{ success: boolean; booking?: BookingOrder; error?: string }> => {
    const targetEvent = events.find(e => e.id === request.eventId);
    if (!targetEvent) return { success: false, error: 'Event not found' };

    const targetTier = targetEvent.tiers.find(t => t.id === request.tierId);
    if (!targetTier) return { success: false, error: 'Ticket tier not found' };

    let discountAmount = 0;
    if (request.appliedPromoCode) {
      const val = validatePromotion(
        request.appliedPromoCode,
        request.eventId,
        request.quantity,
        targetTier.price * request.quantity
      );
      if (val.valid) {
        discountAmount = val.discountAmount;
        // increment promo redemption
        setPromotions(prev =>
          prev.map(p =>
            p.code.toUpperCase() === request.appliedPromoCode?.toUpperCase()
              ? { ...p, currentRedemptions: p.currentRedemptions + 1 }
              : p
          )
        );
      }
    }

    const addOnsTotal = (request.addOns || []).reduce((acc, curr) => acc + curr.price, 0);
    const subtotal = targetTier.price * request.quantity;
    const totalAmount = Math.max(0, subtotal - discountAmount + addOnsTotal);

    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const tenant = tenants.find(t => t.id === targetEvent.tenantId) || tenants[0];

    // Generate individual ticket passes
    const tickets = Array.from({ length: request.quantity }).map((_, idx) => ({
      id: `tkt-${bookingId}-${idx + 1}`,
      bookingId,
      ticketCode: `${tenant.slug.substring(0, 3).toUpperCase()}-${bookingId}-${(idx + 1).toString().padStart(2, '0')}`,
      eventId: targetEvent.id,
      tierName: targetTier.name,
      attendeeName: idx === 0 ? request.customerName : `${request.customerName} (Guest ${idx + 1})`,
      attendeeEmail: request.customerEmail,
      seatInfo: `Section ${targetTier.name.includes('VIP') ? 'A' : 'GA'}, Seat ${10 + idx}`,
      checkedIn: false,
      dietaryNote: request.dietaryNote
    }));

    const newBooking: BookingOrder = {
      id: bookingId,
      tenantId: targetEvent.tenantId,
      eventId: targetEvent.id,
      channel: request.holdId ? 'web' : 'web',
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone,
      companyName: request.companyName,
      tierId: targetTier.id,
      tierName: targetTier.name,
      quantity: request.quantity,
      unitPrice: targetTier.price,
      subtotal,
      discountAmount,
      appliedPromoCode: request.appliedPromoCode,
      addOnsSelected: request.addOns,
      totalAmount,
      status: 'confirmed',
      paymentMethod: request.paymentMethod,
      paymentTransactionId: `txn_${Date.now()}`,
      tickets,
      bookedAt: new Date().toISOString()
    };

    // Update inventory: deduct from heldCount (if hold existed) or just add to soldCount
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id !== targetEvent.id) return ev;
        return {
          ...ev,
          tiers: ev.tiers.map(t => {
            if (t.id !== targetTier.id) return t;
            const releasedHeld = request.holdId ? request.quantity : 0;
            return {
              ...t,
              heldCount: Math.max(0, t.heldCount - releasedHeld),
              soldCount: t.soldCount + request.quantity
            };
          })
        };
      })
    );

    // Remove active hold
    if (request.holdId) {
      setActiveHolds(prev => prev.filter(h => h.id !== request.holdId));
      setActiveCheckoutHold(null);
    }

    // Record Financial Transaction & Commission Reconciliation
    const gatewayFee = Math.round((totalAmount * 0.029 + 0.3) * 100) / 100;
    const agencyRate = tenant.commissionRate || 0.08;
    const agencyFee = Math.round(totalAmount * agencyRate * 100) / 100;
    const clientNet = Math.round((totalAmount - gatewayFee - agencyFee) * 100) / 100;

    const newTxn: FinancialTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId,
      tenantId: tenant.id,
      channel: 'web',
      amount: totalAmount,
      type: 'payment',
      status: 'captured',
      gatewayFee,
      agencyFee,
      clientNet,
      timestamp: new Date().toISOString(),
      customerName: request.customerName
    };

    setBookings(prev => [newBooking, ...prev]);
    setTransactions(prev => [newTxn, ...prev]);

    showToast(`Booking ${bookingId} confirmed! ${request.quantity} ticket pass(es) issued.`);
    return { success: true, booking: newBooking };
  };

  // Cancellation and Refund with inventory restock toggle
  const processRefund = (bookingId: string, restockInventory: boolean, reason?: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found' };

    if (booking.status === 'refunded') {
      return { success: false, message: 'Booking has already been refunded' };
    }

    // Update booking status
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'refunded' } : b))
    );

    // If restock requested, return soldCount back to available capacity
    if (restockInventory) {
      setEvents(prev =>
        prev.map(ev => {
          if (ev.id !== booking.eventId) return ev;
          return {
            ...ev,
            tiers: ev.tiers.map(t => {
              if (t.id !== booking.tierId) return t;
              return {
                ...t,
                soldCount: Math.max(0, t.soldCount - booking.quantity)
              };
            })
          };
        })
      );
    }

    // Add negative transaction for reconciliation
    const refundTxn: FinancialTransaction = {
      id: `TXN-REF-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId,
      tenantId: booking.tenantId,
      channel: booking.channel,
      amount: -booking.totalAmount,
      type: 'refund',
      status: 'refunded',
      gatewayFee: 0,
      agencyFee: 0,
      clientNet: -booking.totalAmount,
      timestamp: new Date().toISOString(),
      customerName: booking.customerName
    };
    setTransactions(prev => [refundTxn, ...prev]);

    showToast(`Refund processed for ${bookingId} ($${booking.totalAmount}). ${restockInventory ? 'Tickets restocked to inventory.' : ''}`);
    return { success: true, message: 'Refund successfully completed and reconciled.' };
  };

  // Door Check-in Scanner
  const verifyAndCheckInTicket = (ticketCode: string): {
    status: 'success' | 'already_checked_in' | 'invalid';
    ticket?: any;
    event?: EventItem;
    booking?: BookingOrder;
    message: string;
  } => {
    const cleanCode = ticketCode.trim().toUpperCase();
    let foundTicket: any = null;
    let foundBooking: BookingOrder | null = null;

    for (const b of bookings) {
      const match = b.tickets.find(t => t.ticketCode.toUpperCase() === cleanCode);
      if (match) {
        foundTicket = match;
        foundBooking = b;
        break;
      }
    }

    if (!foundTicket || !foundBooking) {
      return {
        status: 'invalid',
        message: `Ticket pass "${cleanCode}" was not found in the platform registry.`
      };
    }

    const event = events.find(e => e.id === foundBooking?.eventId);

    if (foundTicket.checkedIn) {
      return {
        status: 'already_checked_in',
        ticket: foundTicket,
        event,
        booking: foundBooking,
        message: `Warning: This ticket was already checked in at ${foundTicket.checkedInAt || 'earlier today'}.`
      };
    }

    // Perform check-in
    const checkInTime = new Date().toISOString();
    setBookings(prev =>
      prev.map(b => {
        if (b.id !== foundBooking?.id) return b;
        return {
          ...b,
          tickets: b.tickets.map(t =>
            t.ticketCode.toUpperCase() === cleanCode
              ? { ...t, checkedIn: true, checkedInAt: checkInTime }
              : t
          )
        };
      })
    );

    return {
      status: 'success',
      ticket: { ...foundTicket, checkedIn: true, checkedInAt: checkInTime },
      event,
      booking: foundBooking,
      message: `Verified: ${foundTicket.attendeeName} (${foundTicket.tierName})`
    };
  };

  // Conversational channels
  const sendMessageToChannel = (sessionId: string, text: string, sender: 'user' | 'bot' | 'human_agent') => {
    const newMsg = {
      id: `m-${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev =>
      prev.map(conv => {
        if (conv.id !== sessionId) return conv;
        return {
          ...conv,
          lastActivity: 'Just now',
          messages: [...conv.messages, newMsg]
        };
      })
    );

    // If user sent a message to the bot and session is not handed off, simulate intelligent bot reply
    if (sender === 'user') {
      const conv = conversations.find(c => c.id === sessionId);
      if (conv && conv.status !== 'handed_off_to_human') {
        setTimeout(() => {
          generateBotResponse(sessionId, text);
        }, 800);
      }
    }
  };

  const generateBotResponse = (sessionId: string, userQuery: string) => {
    const lower = userQuery.toLowerCase();
    let reply = '';
    let actionPayload: any = undefined;

    if (lower.includes('vip') || lower.includes('concert') || lower.includes('astra')) {
      reply = `We have active availability for Astra Nova at The Solstice Amphitheater! VIP Front Row is $285 with backstage lounge access, and Reserved Lower Bowl is $165. Would you like me to hold 2 tickets for you for 10 minutes?`;
      actionPayload = { type: 'suggest_events', eventId: 'evt-astra-nova' };
    } else if (lower.includes('dinner') || lower.includes('truffle') || lower.includes('wine') || lower.includes('food')) {
      reply = `Chef Antoine Laurent's 7-Course Truffle & Heritage Degustation has 4 Chef Counter seats remaining for Nov 28. Dietary restrictions (including pescatarian or vegetarian) are accommodated with advance notice.`;
      actionPayload = { type: 'suggest_events', eventId: 'evt-velvet-truffle' };
    } else if (lower.includes('conference') || lower.includes('tech') || lower.includes('luminary') || lower.includes('ai')) {
      reply = `The Global Executive AI Summit in Paris offers Executive All-Access passes ($1,850) and Full Delegate passes ($980). Use coupon code TECHSUMMIT50 for $50 off today!`;
      actionPayload = { type: 'suggest_events', eventId: 'evt-luminary-summit' };
    } else if (lower.includes('hold') || lower.includes('reserve')) {
      reply = `I can place a 10-minute temporary inventory lock for you so your seats aren't lost while you decide. What event and how many tickets?`;
    } else if (lower.includes('human') || lower.includes('agent') || lower.includes('representative') || lower.includes('help')) {
      requestHumanHandoff(sessionId);
      return;
    } else {
      reply = `I can help you discover premier concerts, tech summits, Michelin chef table reservations, and brand activations across our client roster. Would you like to check dates or place a ticket hold?`;
    }

    const botMsg = {
      id: `bot-${Date.now()}`,
      sender: 'bot' as const,
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionPayload
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id !== sessionId) return c;
        return {
          ...c,
          lastActivity: 'Just now',
          messages: [...c.messages, botMsg]
        };
      })
    );
  };

  const requestHumanHandoff = (sessionId: string) => {
    const sysMsg = {
      id: `sys-${Date.now()}`,
      sender: 'system' as const,
      text: 'You have been connected to our priority guest operations team. An agent is reviewing your inquiry.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id !== sessionId) return c;
        return {
          ...c,
          status: 'handed_off_to_human',
          assignedAgent: 'Amara Patel',
          lastActivity: 'Handoff requested',
          messages: [...c.messages, sysMsg]
        };
      })
    );
    showToast(`Live Support Handoff requested for session ${sessionId}`);
  };

  const resolveConversation = (sessionId: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === sessionId ? { ...c, status: 'resolved' } : c))
    );
    showToast(`Session ${sessionId} marked as resolved.`);
  };

  // Event creation
  const createEvent = (newEventData: Omit<EventItem, 'id'>) => {
    const newId = `evt-${Date.now()}`;
    const newEvent: EventItem = {
      ...newEventData,
      id: newId,
      tiers: newEventData.tiers.map((t, idx) => ({
        ...t,
        id: `tier-${newId}-${idx + 1}`,
        eventId: newId,
        soldCount: 0,
        heldCount: 0
      }))
    };
    setEvents(prev => [newEvent, ...prev]);
    showToast(`Event "${newEvent.title}" published successfully.`);
  };

  const updateEventStatus = (eventId: string, status: EventItem['status']) => {
    setEvents(prev => prev.map(e => (e.id === eventId ? { ...e, status } : e)));
    showToast(`Event status updated to ${status}.`);
  };

  // Integrations toggle & sync
  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const newStatus = !item.connected;
        showToast(`${item.name} ${newStatus ? 'connected' : 'disconnected'}.`);
        return { ...item, connected: newStatus };
      })
    );
  };

  const triggerSyncIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        showToast(`Manual sync executed for ${item.name} (+48 records synced).`);
        return {
          ...item,
          lastSync: 'Just now',
          eventsSyncedCount: item.eventsSyncedCount + 48
        };
      })
    );
  };

  return (
    <PlatformContext.Provider
      value={{
        tenants,
        currentTenantId,
        setCurrentTenantId,
        activeTenant,
        viewMode,
        setViewMode,
        adminTab,
        setAdminTab,
        staffMembers,
        currentStaff,
        setCurrentStaffRole,
        events,
        venues,
        selectedEvent,
        setSelectedEventId,
        createEvent,
        updateEventStatus,
        activeHolds,
        createTemporaryHold,
        releaseTemporaryHold,
        extendTemporaryHold,
        activeCheckoutHold,
        setActiveCheckoutHold,
        promotions,
        validatePromotion,
        createPromotion,
        bookings,
        completeCheckout,
        processRefund,
        userBookings,
        transactions,
        verifyAndCheckInTicket,
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessageToChannel,
        requestHumanHandoff,
        resolveConversation,
        integrations,
        toggleIntegration,
        triggerSyncIntegration,
        myBookingsOpen,
        setMyBookingsOpen,
        doorScannerOpen,
        setDoorScannerOpen,
        createEventModalOpen,
        setCreateEventModalOpen,
        conciergeOpen,
        setConciergeOpen,
        conciergeChannel,
        setConciergeChannel,
        toastMessage,
        showToast
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
