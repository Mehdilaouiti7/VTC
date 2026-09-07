import { z } from "zod";

export const bookingSchema = z.object({
  service_type: z.enum([
    "transfert_aeroport",
    "transfert_gare",
    "professionnel",
    "prive",
    "mise_a_disposition",
    "evenement",
  ]),
  trip_type: z.enum(["aller_simple", "aller_retour", "mise_a_disposition"]),
  pickup_address: z.string().min(3, "Adresse de départ requise"),
  dropoff_address: z.string().min(1).default(""),
  stops: z.array(z.string().min(1)).default([]),
  date: z.string().min(1, "Date requise"),
  time: z.string().min(1, "Heure requise"),
  return_date: z.string().optional().nullable(),
  return_time: z.string().optional().nullable(),
  duration_hours: z.number().min(1).max(240).optional().nullable(),
  passengers: z.number().int().min(1).max(50),
  luggage: z.number().int().min(0).max(50),
  child_seat: z.boolean(),
  special_request: z.string().optional().nullable(),
  comment: z.string().max(2000).optional().nullable(),
  first_name: z.string().min(1, "Prénom requis"),
  last_name: z.string().min(1, "Nom requis"),
  phone: z.string().min(6, "Numéro de téléphone invalide"),
  email: z.string().email("Email invalide"),
  estimated_price: z.number().optional().nullable(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const quoteSchema = z.object({
  service_type: z
    .enum([
      "transfert_aeroport",
      "transfert_gare",
      "professionnel",
      "prive",
      "mise_a_disposition",
      "evenement",
    ])
    .optional()
    .nullable(),
  first_name: z.string().min(1, "Prénom requis"),
  last_name: z.string().min(1, "Nom requis"),
  phone: z.string().min(6, "Numéro de téléphone invalide"),
  email: z.string().email("Email invalide"),
  preferred_date: z.string().optional().nullable(),
  preferred_time: z.string().optional().nullable(),
  request_details: z.string().min(10, "Merci de détailler votre demande (10 caractères minimum)"),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
