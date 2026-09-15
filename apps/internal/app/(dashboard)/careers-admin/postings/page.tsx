import Link from "next/link";
import { Plus, Users, ExternalLink, Edit, Briefcase } from "lucide-react";

interface JobPostingItem {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  status: "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED";
  publishedAt: string | null;
  createdAt: string;
  _count?: { applications: number };
}

async function getPostings(): Promise<JobPostingItem[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/public/jobs`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data.jobs || [];
    }
  } catch {
    // Return sample seeded records if API is offline
  }

  return [
    {
      id: "l2-lead-engineer",
      slug: "l2-lead-engineer",
      title: "Lead Level-2 Automation Engineer (C# / .NET 8)",
      department: "L2 Software Engineering",
      location: "Bengaluru, India (Hybrid)",
      employmentType: "FULL_TIME",
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      _count: { applications: 3 },
    },
    {
      id: "commissioning-specialist",
      slug: "commissioning-specialist",
      title: "Rolling Mill Level-1 & Level-2 Commissioning Specialist",
      department: "Field Engineering & Commissioning",
      location: "Bengaluru HQ (Travel ~40%)",
      employmentType: "FULL_TIME",
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      _count: { applications: 5 },
    },
    {
      id: "process-metallurgist",
      slug: "process-metallurgist",
      title: "Process Metallurgist & Roll Pass Schedule Designer",
      department: "Process Engineering",
      location: "Bengaluru HQ",
      employmentType: "FULL_TIME",
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      _count: { applications: 2 },
    },
  ];
}

export default async function PostingsListPage() {
  const postings = await getPostings();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return { bg: "rgba(16, 185, 129, 0.15)", text: "#10b981", border: "rgba(16, 185, 129, 0.3)" };
      case "DRAFT":
        return { bg: "rgba(245, 158, 11, 0.15)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" };
      case "PAUSED":
        return { bg: "rgba(59, 130, 246, 0.15)", text: "#3b82f6", border: "rgba(59, 130, 246, 0.3)" };
      default:
        return { bg: "rgba(107, 114, 128, 0.15)", text: "#9ca3af", border: "rgba(107, 114, 128, 0.3)" };
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
            Careers CMS & Job Postings
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Publish engineering vacancies to sysTROL public portal and monitor candidate pipelines.
          </p>
        </div>

        <Link
          href="/careers-admin/postings/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--accent-green)",
            color: "#0b0f19",
            fontWeight: 600,
            fontSize: "14px",
            padding: "10px 18px",
            borderRadius: "6px",
            transition: "opacity 0.2s ease",
          }}
        >
          <Plus size={16} />
          <span>Create New Posting</span>
        </Link>
      </div>

      {/* Table Card */}
      <div
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "8px",
          border: "1px solid var(--border-color)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border-color)" }}>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Role Title & Slug
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Department
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Status
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Applications
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Published
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {postings.map((job) => {
              const badge = getStatusBadge(job.status);
              return (
                <tr
                  key={job.id}
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{job.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                      /{job.slug}
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", color: "var(--text-secondary)" }}>
                    {job.department}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                      }}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <Link
                      href={`/careers-admin/postings/${job.id}/applications`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "var(--accent-blue)",
                        fontWeight: 600,
                      }}
                    >
                      <Users size={15} />
                      <span>{job._count?.applications ?? 0} candidates</span>
                    </Link>
                  </td>
                  <td style={{ padding: "16px 20px", color: "var(--text-muted)", fontSize: "13px" }}>
                    {job.publishedAt ? new Date(job.publishedAt).toLocaleDateString() : "Draft"}
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "10px", alignItems: "center" }}>
                      <Link
                        href={`/careers-admin/postings/${job.id}/edit`}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "4px",
                          backgroundColor: "var(--bg-card)",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-primary)",
                          fontSize: "12px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </Link>
                      <a
                        href={`http://localhost:3000/careers/${job.slug || job.id}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: "6px 12px",
                          borderRadius: "4px",
                          backgroundColor: "var(--bg-card)",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-secondary)",
                          fontSize: "12px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>View</span>
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
