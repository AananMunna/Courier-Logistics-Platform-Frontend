const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && value !== undefined && value !== ""
    ? parsed
    : fallback;
};

/** Mirrors the backend formula: base + (per kg × weight) + (per km × distance). */
export const pricingConfig = {
  baseFee: toNumber(process.env.NEXT_PUBLIC_BASE_DELIVERY_FEE, 50),
  perKgFee: toNumber(process.env.NEXT_PUBLIC_PER_KG_FEE, 15),
  perKmFee: toNumber(process.env.NEXT_PUBLIC_PER_KM_FEE, 10),
} as const;

export function estimateDeliveryFee(weightKg: number, distanceKm?: number) {
  const weight = Number.isFinite(weightKg) && weightKg > 0 ? weightKg : 0;
  const distance =
    distanceKm && Number.isFinite(distanceKm) && distanceKm > 0
      ? distanceKm
      : 0;

  const total =
    pricingConfig.baseFee +
    pricingConfig.perKgFee * weight +
    pricingConfig.perKmFee * distance;

  return Math.round(total * 100) / 100;
}
