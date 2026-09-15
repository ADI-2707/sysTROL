import { PostingEditor } from "../../PostingEditor";

async function getJob(id: string) {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/public/jobs/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data.job;
    }
  } catch {
    // offline fallback
  }

  return {
    id,
    title: "Lead Level-2 Automation Engineer (C# / .NET 8)",
    slug: id,
    department: "L2 Software Engineering",
    location: "Bengaluru HQ (Hybrid)",
    employmentType: "FULL_TIME",
    experienceMin: 5,
    experienceMax: 8,
    description: "Architect and deploy high-performance Level-2 mathematical mill-tracking engines.",
    responsibilities: [
      "Develop multithreaded C# microservices communicating via OPC UA",
      "Formulate mathematical roll force and torque models",
    ],
    requirements: [
      "5+ years C# .NET engineering",
      "Background in steel rolling mills",
    ],
    status: "PUBLISHED",
  };
}

export default async function EditPostingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);

  return <PostingEditor initialData={job} isEdit={true} />;
}
