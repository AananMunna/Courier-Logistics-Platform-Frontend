import type { Metadata } from "next";
import CreateShipmentWizard from "@/components/modules/shipments/create/create-shipment-wizard";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "New shipment" };

export default function NewShipmentPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-4 md:p-6">
      <PageHeader
        title="Send a parcel"
        description="Four quick steps. You'll see the fee before you confirm."
      />
      <CreateShipmentWizard />
    </div>
  );
}
