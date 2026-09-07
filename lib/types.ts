export type ServiceType =
  | "transfert_aeroport"
  | "transfert_gare"
  | "professionnel"
  | "prive"
  | "mise_a_disposition"
  | "evenement";

export type TripType = "aller_simple" | "aller_retour" | "mise_a_disposition";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "refused"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "deposit_paid" | "paid";

export interface PricingRule {
  id: string;
  service_type: ServiceType;
  label: string;
  base_price: number;
  price_per_hour: number | null;
  price_per_km: number | null;
  description: string | null;
}

export interface BlockedSlot {
  id: string;
  start_at: string;
  end_at: string;
  reason: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  created_at: string;
  status: BookingStatus;
  service_type: ServiceType;
  trip_type: TripType;
  pickup_address: string;
  dropoff_address: string;
  stops: string[];
  date: string;
  time: string;
  return_date: string | null;
  return_time: string | null;
  duration_hours: number | null;
  passengers: number;
  luggage: number;
  child_seat: boolean;
  special_request: string | null;
  comment: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  estimated_price: number | null;
  final_price: number | null;
  payment_status: PaymentStatus;
  admin_notes: string | null;
}

export interface QuoteRequest {
  id: string;
  created_at: string;
  status: BookingStatus;
  service_type: ServiceType | null;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  preferred_date: string | null;
  preferred_time: string | null;
  request_details: string;
  admin_notes: string | null;
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  transfert_aeroport: "Transfert aéroport",
  transfert_gare: "Transfert gare",
  professionnel: "Déplacement professionnel",
  prive: "Trajet privé",
  mise_a_disposition: "Mise à disposition",
  evenement: "Événement & occasion spéciale",
};
