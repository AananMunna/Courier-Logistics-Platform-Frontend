import type { Metadata } from "next";
import ProfilePage from "@/components/modules/profile/profile-page";

export const metadata: Metadata = { title: "Profile & security" };

export default function CustomerProfilePage() {
  return <ProfilePage />;
}
