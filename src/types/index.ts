export type EventCategory = 
  | 'concert' 
  | 'conference' 
  | 'corporate' 
  | 'brand_activation' 
  | 'workshop' 
  | 'dining';

export type BookingChannel = 'web' | 'whatsapp' | 'voice' | 'box_office' | 'concierge';

export type UserRole = 'agency_admin' | 'client_admin' | 'box_office_staff' | 'customer_support';

export interface ClientTenant {
  id: string;
  name: string;
  slug: string;
  brandColor: string; // Tailwind color or hex
  accentColor: string;
  logoText: string;
  tagline: string;
  customDomain: string;
  currency: string;
  currencySymbol: string;
  heroBanner?: string;
  contactEmail: string;
  commissionRate: number; // e.g. 0.08 for 8%
}

export interface VenueLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  type: 'amphitheater' | 'auditorium' | 'restaurant_chef_table' | 'exhibition_pavilion' | 'ballroom';
  seatingMapUrl?: string;
}

export interface TicketTier {
  id: string;
  eventId: string;
  name: string; // e.g. VIP Front Row, General Admission, Early Bird, Degustation Table
  price: number;
  capacity: number;
  soldCount: number;
  heldCount: number; // Active temporary holds
  description: string;
  benefits: string[];
  maxPerOrder: number;
  availableFrom?: string;
  availableUntil?: string;
}

export interface EventScheduleItem {
  time: string;
  title: string;
  speakerOrPerformer?: string;
  stageOrRoom: string;
}

export interface EventItem {
  id: string;
  tenantId: string;
  title: string;
  category: EventCategory;
  tagline: string;
  description: string;
  imageUrl: string;
  date: string;
  startTime: string;
  endTime: string;
  venueId: string;
  featured: boolean;
  tiers: TicketTier[];
  schedule: EventScheduleItem[];
  lineupOrHosts?: string[];
  addOns?: {
    id: string;
    name: string;
    price: number;
    description: string;
  }[];
  dietaryOptionsAvailable?: boolean;
  status: 'published' | 'draft' | 'sold_out' | 'cancelled';
}

export interface TemporaryHold {
  id: string;
  eventId: string;
  tierId: string;
  quantity: number;
  channel: BookingChannel;
  sessionId: string;
  customerIdentifier: string;
  expiresAt: number; // Epoch timestamp
  createdAt: number;
}

export interface PromotionOffer {
  id: string;
  tenantId?: string; // If null, applies agency-wide
  code: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minTickets?: number;
  minOrderAmount?: number;
  maxRedemptions: number;
  currentRedemptions: number;
  validUntil: string;
  description: string;
  applicableCategories?: EventCategory[];
  isBundle?: boolean;
  bundleDescription?: string;
}

export interface TicketPass {
  id: string;
  bookingId: string;
  ticketCode: string; // E.g. EP-8291-VIP
  eventId: string;
  tierName: string;
  attendeeName: string;
  attendeeEmail: string;
  seatInfo?: string;
  checkedIn: boolean;
  checkedInAt?: string;
  dietaryNote?: string;
}

export interface BookingOrder {
  id: string;
  tenantId: string;
  eventId: string;
  channel: BookingChannel;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  tierId: string;
  tierName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discountAmount: number;
  appliedPromoCode?: string;
  addOnsSelected?: { name: string; price: number }[];
  totalAmount: number;
  status: 'confirmed' | 'refunded' | 'partially_refunded' | 'cancelled';
  paymentMethod: 'credit_card' | 'apple_pay' | 'google_pay' | 'corporate_invoice';
  paymentTransactionId: string;
  tickets: TicketPass[];
  bookedAt: string;
}

export interface FinancialTransaction {
  id: string;
  bookingId: string;
  tenantId: string;
  channel: BookingChannel;
  amount: number;
  type: 'payment' | 'refund';
  status: 'captured' | 'refunded' | 'settled';
  gatewayFee: number;
  agencyFee: number;
  clientNet: number;
  timestamp: string;
  customerName: string;
}

export interface ConversationalMessage {
  id: string;
  sender: 'user' | 'bot' | 'human_agent' | 'system';
  text: string;
  timestamp: string;
  actionPayload?: {
    type: 'suggest_events' | 'hold_ticket' | 'handoff_alert' | 'link_ticket';
    eventId?: string;
    tierId?: string;
  };
}

export interface ConversationalSession {
  id: string;
  channel: 'chatbot' | 'whatsapp' | 'voice';
  customerName: string;
  customerPhone?: string;
  status: 'active' | 'handed_off_to_human' | 'resolved';
  assignedAgent?: string;
  messages: ConversationalMessage[];
  lastActivity: string;
  tenantId?: string;
}

export interface BusinessIntegration {
  id: string;
  name: string;
  type: 'crm' | 'pos' | 'marketing' | 'webhooks';
  provider: string; // e.g. Salesforce, HubSpot, Square, Mailchimp
  connected: boolean;
  lastSync?: string;
  eventsSyncedCount: number;
  description: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string; // null for agency admin
  avatar?: string;
}
