import type { Metadata } from "next";
import HubDetail from "@/components/modules/hubs/hub-detail";

export const metadata: Metadata = {
  title: "Hub details",
  description:
    "Address, contact number and zone for this courier hub, plus other hubs nearby.",
};

export default async function HubDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <HubDetail id={id} />;
}
