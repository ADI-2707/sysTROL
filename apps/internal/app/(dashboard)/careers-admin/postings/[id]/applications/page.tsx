import { ApplicationsKanban, CandidateApplication } from "./ApplicationsKanban";

async function getApplications(jobId: string): Promise<CandidateApplication[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/admin/jobs/${jobId}/applications`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return data.applications || [];
    }
  } catch {
    // offline fallback
  }

  return [
    {
      id: "app-1",
      applicantName: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      resumeUrl: "https://systrol-documents.s3.us-east-1.amazonaws.com/careers/resumes/rahul-sharma.pdf",
      coverNote: "6 years C# / OPC UA experience in JSW rolling mills.",
      status: "SHORTLISTED",
      createdAt: new Date().toISOString(),
    },
    {
      id: "app-2",
      applicantName: "Ananya Iyer",
      email: "ananya.iyer@example.com",
      phone: "+91 98111 22334",
      resumeUrl: "https://systrol-documents.s3.us-east-1.amazonaws.com/careers/resumes/ananya-iyer.pdf",
      coverNote: "Automated hydraulic roll gap cascade control for high-speed bar mills.",
      status: "INTERVIEW_SCHEDULED",
      createdAt: new Date().toISOString(),
    },
    {
      id: "app-3",
      applicantName: "Vikram Patil",
      email: "vikram.patil@example.com",
      phone: "+91 99887 76655",
      resumeUrl: "https://systrol-documents.s3.us-east-1.amazonaws.com/careers/resumes/vikram-patil.pdf",
      coverNote: "Interested in FAT and on-site trials at client steel plants.",
      status: "RECEIVED",
      createdAt: new Date().toISOString(),
    },
  ];
}

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const applications = await getApplications(id);

  return <ApplicationsKanban jobId={id} initialApplications={applications} />;
}
