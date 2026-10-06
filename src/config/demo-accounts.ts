export interface DemoAccount {
  role: "ADMIN" | "CUSTOMER" | "RIDER";
  label: string;
  description: string;
  email: string;
  password: string;
}

/** Seeded by the backend on first boot. Override through NEXT_PUBLIC_DEMO_* variables. */
export const demoAccounts: DemoAccount[] = [
  {
    role: "ADMIN",
    label: "Admin",
    description: "Dispatch, riders, hubs & reports",
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "admin@courier.com",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "Admin@123",
  },
  {
    role: "CUSTOMER",
    label: "Customer",
    description: "Book, pay & track parcels",
    email:
      process.env.NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL ?? "customer@courier.com",
    password: process.env.NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD ?? "Customer@123",
  },
  {
    role: "RIDER",
    label: "Rider",
    description: "Pickups, deliveries & earnings",
    email: process.env.NEXT_PUBLIC_DEMO_RIDER_EMAIL ?? "rider@courier.com",
    password: process.env.NEXT_PUBLIC_DEMO_RIDER_PASSWORD ?? "Rider@123",
  },
];
