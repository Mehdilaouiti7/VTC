import type { PricingRule, ServiceType, TripType } from "@/lib/types";

interface EstimateInput {
  serviceType: ServiceType;
  tripType: TripType;
  durationHours: number | null;
  passengers: number;
  stopsCount: number;
}

export function estimatePrice(
  rules: PricingRule[],
  input: EstimateInput
): number | null {
  const rule = rules.find((r) => r.service_type === input.serviceType);
  if (!rule) return null;

  let price = rule.base_price;

  if (input.tripType === "mise_a_disposition" && rule.price_per_hour) {
    const hours = Math.max(input.durationHours ?? 1, 1);
    price = rule.price_per_hour * hours;
  } else if (input.tripType === "aller_retour") {
    price = price * 1.85;
  }

  if (input.stopsCount > 0) {
    price += input.stopsCount * 12;
  }

  if (input.passengers > 4) {
    price += (input.passengers - 4) * 8;
  }

  return Math.round(price);
}
