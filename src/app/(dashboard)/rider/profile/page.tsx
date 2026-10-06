import type { Metadata } from "next";
import ProfilePage from "@/components/modules/profile/profile-page";
import { RiderSettingsForm } from "@/components/modules/rider/rider-settings-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Profile & vehicle" };

export default function RiderProfilePage() {
  return (
    <ProfilePage
      title="Profile & vehicle"
      description="Keep your contact and vehicle details up to date."
    >
      <Card>
        <CardHeader>
          <CardTitle>Vehicle & availability</CardTitle>
          <CardDescription>
            Admins use this to assign the right parcels to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RiderSettingsForm />
        </CardContent>
      </Card>
    </ProfilePage>
  );
}
