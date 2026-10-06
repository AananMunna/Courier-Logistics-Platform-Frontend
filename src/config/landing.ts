/**
 * Marketing copy that is not driven by the API.
 * STATS only state facts about the product itself (booking steps, payment options,
 * tracking stages), so nothing here needs a business claim to be true.
 * TESTIMONIALS are hidden until real, permissioned customer quotes are added:
 * set SHOW_TESTIMONIALS = true afterwards.
 */
export const STATS = [
  { value: 4, suffix: " steps", label: "To book a parcel" },
  { value: 2, suffix: "", label: "Ways to pay: bKash or cash on delivery" },
  { value: 6, suffix: "", label: "Tracked stages, booking to delivery" },
  { value: 24, suffix: "/7", label: "Online parcel tracking" },
] as const;

export const SHOW_TESTIMONIALS = false;

export const PAYMENT_METHODS = [
  "bKash payments",
  "Cash on delivery",
  "Live tracking",
  "Verified riders",
  "Hub-to-hub network",
  "Delivery notes",
  "Instant fee estimate",
  "Secure accounts",
] as const;

/** Illustrative placeholders: replace with real quotes before enabling SHOW_TESTIMONIALS. */
export const TESTIMONIALS = [
  {
    quote:
      "I stopped calling the courier to ask where my orders are. The tracking page answers it before my customers even ask.",
    name: "Nusrat J.",
    role: "Online clothing seller, Dhaka",
  },
  {
    quote:
      "Booking takes two minutes and the fee is clear before I confirm. No surprises at the counter.",
    name: "Imran H.",
    role: "Freelance designer, Chattogram",
  },
  {
    quote:
      "Cash on delivery is recorded automatically, so my end-of-day numbers finally match.",
    name: "Tania R.",
    role: "Home bakery owner, Sylhet",
  },
] as const;

export const FAQS = [
  {
    q: "How is the delivery fee calculated?",
    a: "A base fee, plus a per-kg charge for the parcel weight, plus a per-km charge for the distance. Use the estimator on the pricing page to see the number before you book.",
  },
  {
    q: "Can I pay when the parcel is delivered?",
    a: "Yes. Add the amount to collect when you book. The rider collects it from the receiver and it is recorded automatically on delivery.",
  },
  {
    q: "How do I pay online?",
    a: "Open your shipment and pay the delivery fee securely with bKash. Your payment history stays in your dashboard.",
  },
  {
    q: "Can I cancel a booking?",
    a: "You can cancel from the shipment page while it is still waiting for pickup. Once a rider has collected the parcel, contact support.",
  },
  {
    q: "How do I become a rider?",
    a: "Apply from the rider page with your details. Our team reviews every application before a rider can accept parcels.",
  },
  {
    q: "Can the receiver track the parcel without an account?",
    a: "Yes. Anyone with the tracking code can open the Track page and see the latest status.",
  },
] as const;
