import { EnquiryDetailClient } from "./EnquiryDetailClient";

async function getEnquiry(id: string) {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/enquiries/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data.enquiry;
    }
  } catch {
    // offline fallback
  }

  return {
    id,
    enquiryCode: "ENQ-2026-0001",
    source: "WEB_RFQ",
    status: "OPEN",
    requirement: "Bar Mill L2 automation upgrade with high-speed shear synchronization.",
    estimatedValue: 18500000,
    contactEmail: "procurement@jsw.in",
    contactPhone: "+91 98765 43210",
    prospectName: "JSW Steel Ltd",
    client: { name: "JSW Steel Ltd", country: "India" },
    salesVisits: [],
    createdAt: new Date().toISOString(),
  };
}

export default async function EnquiryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const enquiry = await getEnquiry(id);

  return <EnquiryDetailClient enquiry={enquiry} />;
}
