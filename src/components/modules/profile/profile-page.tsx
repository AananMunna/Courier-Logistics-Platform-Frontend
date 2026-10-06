import type { ReactNode } from "react";
import { DashboardHero } from "@/components/shared/dashboard-hero";
import { PageContainer } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AvatarUploader } from "./avatar-uploader";
import { ChangePasswordForm } from "./change-password-form";
import { ProfileForm } from "./profile-form";
import { ProfileSummary } from "./profile-summary";

/** Shared account page; roles can slot extra cards (e.g. rider vehicle) at the top. */
export default function ProfilePage({
  title = "Profile & security",
  description = "Update your details and keep your account secure.",
  children,
}: {
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <PageContainer>
      <DashboardHero
        title={title}
        description={description}
        aside={<ProfileSummary />}
      />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your details</CardTitle>
              <CardDescription>
                This is how you appear to others.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AvatarUploader />
              <ProfileForm />
            </CardContent>
          </Card>
          {children}
        </div>
        <Card id="security">
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription>
              Use a strong password you don&apos;t use elsewhere.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
