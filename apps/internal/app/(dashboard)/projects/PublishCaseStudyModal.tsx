"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Globe,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Check,
  Star,
} from "lucide-react";
import {
  ProjectItem,
  publishProject,
  ProjectLifecycleStep,
} from "@/lib/projects-data";
import { ProjectCaseStudy, ProjectCaseStudyImage, ProjectKpiCard } from "@systrol/types";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@systrol/ui";
import { resolveMediaUrl, FALLBACK_PROJECT_IMAGE } from "@/lib/media-utils";

interface PublishCaseStudyModalProps {
  isOpen: boolean;
  project: ProjectItem | null;
  onClose: () => void;
  onSuccess: (updated: ProjectItem) => void;
}

interface ImageSlot {
  url: string;
  caption: string;
  altText: string;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PublishCaseStudyModal({
  isOpen,
  project,
  onClose,
  onSuccess,
}: PublishCaseStudyModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [projectName, setProjectName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [solutionTitle, setSolutionTitle] = useState("");
  const [solutionDescription, setSolutionDescription] = useState("");
  const [technologiesText, setTechnologiesText] = useState("");
  const [showingIndex, setShowingIndex] = useState(0);

  const [images, setImages] = useState<ImageSlot[]>([
    { url: "", caption: "", altText: "" },
    { url: "", caption: "", altText: "" },
    { url: "", caption: "", altText: "" },
  ]);

  const [kpiCards, setKpiCards] = useState<ProjectKpiCard[]>([
    { label: "Changeover Time Reduction", value: "80%", description: "Verified during commissioning" },
    { label: "Cobble Rate Reduction", value: "35%", description: "Zero downtime impact" },
  ]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!project) return;

    if (project.caseStudy) {
      const cs = project.caseStudy;
      setProjectName(cs.projectName);
      setSlug(cs.slug);
      setIsSlugCustomized(true);
      setChallengeTitle(cs.challengeTitle);
      setChallengeDescription(cs.challengeDescription);
      setSolutionTitle(cs.solutionTitle);
      setSolutionDescription(cs.solutionDescription);
      setTechnologiesText(cs.technologies.join(", "));

      const imgSlots: ImageSlot[] = cs.images.map((img) => ({
        url: img.url,
        caption: img.caption,
        altText: img.altText,
      }));
      while (imgSlots.length < 3) {
        imgSlots.push({ url: "", caption: "", altText: "" });
      }
      setImages(imgSlots.slice(0, 3));

      const cardIdx = cs.images.findIndex((img) => img.isShowingCard);
      setShowingIndex(cardIdx !== -1 ? cardIdx : 0);

      setKpiCards(cs.kpiCards.length > 0 ? cs.kpiCards : [
        { label: "Changeover Time Reduction", value: "80%", description: "" },
        { label: "Cobble Rate Reduction", value: "35%", description: "" },
      ]);
    } else {
      const title = project.name;
      setProjectName(title);
      setSlug(generateSlug(title));
      setIsSlugCustomized(false);
      setChallengeTitle(`Operational Challenges at ${project.lineName}`);
      setChallengeDescription(`The client facility in ${project.location} required complete modern Level-2 supervisory automation to replace legacy instrumentation and resolve operational bottlenecks.`);
      setSolutionTitle(`sysTROL Integrated Level-2 Automation Suite`);
      setSolutionDescription(`Engineered physics-based supervisory calculation models with sub-second PLC coordination to ensure high-accuracy continuous rolling.`);
      setTechnologiesText("C# / .NET 8, OPC UA, Industrial PLC, PostgreSQL");
      setImages([
        { url: "/images/hero-rolling-mill.jpg", caption: `${project.lineName} in active operation`, altText: `${project.name} primary line view` },
        { url: "/images/automation-control-room.jpg", caption: "Supervisory engineering pulpit console", altText: "Control room engineering pulpit" },
        { url: "/images/tungsten-carbide-rolls.jpg", caption: "Precision calibrated rolling components", altText: "Precision mill components" },
      ]);
      setShowingIndex(0);
      setKpiCards([
        { label: "Throughput Stabilization", value: "100%", description: "Full rated design speed achieved" },
        { label: "Section Accuracy", value: "±0.5%", description: "Precision gauge tolerance compliance" },
      ]);
    }
    setErrorMsg(null);
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  const handleNameChange = (val: string) => {
    setProjectName(val);
    if (!isSlugCustomized) {
      setSlug(generateSlug(val));
    }
  };

  const handleImageFieldChange = (index: number, field: keyof ImageSlot, value: string) => {
    const next = [...images];
    next[index] = { ...next[index], [field]: value };
    setImages(next);
  };

  const handleFileUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    setErrorMsg(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://systrol-api.onrender.com";
      const token = user?.token;

      if (token) {
        const presignRes = await fetch(`${apiUrl}/api/v1/media/presign`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            filename: file.name,
            mimeType: file.type || "image/jpeg",
            sizeBytes: file.size,
            category: "PROJECTS",
            projectId: project.id,
          }),
        });

        if (presignRes.ok) {
          const { uploadUrl, publicUrl, s3Key } = await presignRes.json();
          await fetch(uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": file.type || "image/jpeg",
            },
            body: file,
          });

          await fetch(`${apiUrl}/api/v1/media/confirm`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: `${projectName} - Photo ${index + 1}`,
              altText: images[index].altText || `${projectName} view ${index + 1}`,
              caption: images[index].caption || "",
              category: "PROJECTS",
              tags: ["project-case-study", project.projectCode],
              fileUrl: publicUrl,
              s3Key,
              mimeType: file.type || "image/jpeg",
              sizeBytes: file.size,
              projectId: project.id,
            }),
          });

          handleImageFieldChange(index, "url", publicUrl);
          setUploadingIndex(null);
          return;
        }
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        handleImageFieldChange(index, "url", dataUrl);
        setUploadingIndex(null);
      };
      reader.onerror = () => {
        setErrorMsg("Failed to read selected image file.");
        setUploadingIndex(null);
      };
      reader.readAsDataURL(file);
    } catch {
      setErrorMsg("Failed to upload image. You can also paste an image URL directly.");
      setUploadingIndex(null);
    }
  };

  const handleKpiChange = (index: number, field: keyof ProjectKpiCard, value: string) => {
    const next = [...kpiCards];
    next[index] = { ...next[index], [field]: value };
    setKpiCards(next);
  };

  const handleAddKpi = () => {
    if (kpiCards.length >= 4) return;
    setKpiCards([...kpiCards, { label: "New KPI Metric", value: "95%", description: "Verified metric" }]);
  };

  const handleRemoveKpi = (index: number) => {
    if (kpiCards.length <= 2) {
      setErrorMsg("A minimum of 2 custom KPI cards is required.");
      return;
    }
    setKpiCards(kpiCards.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!projectName.trim()) {
      setErrorMsg("Project display name is required.");
      return;
    }
    if (!slug.trim()) {
      setErrorMsg("Valid URL slug is required.");
      return;
    }
    if (!challengeTitle.trim() || !challengeDescription.trim()) {
      setErrorMsg("Challenge title and description are required.");
      return;
    }
    if (!solutionTitle.trim() || !solutionDescription.trim()) {
      setErrorMsg("Solution title and description are required.");
      return;
    }

    const emptyImage = images.find((img) => !img.url.trim());
    if (emptyImage) {
      setErrorMsg("All 3 project image slots must contain a valid image URL or uploaded photo.");
      return;
    }

    if (kpiCards.length < 2) {
      setErrorMsg("At least 2 custom KPI cards are required.");
      return;
    }

    for (let i = 0; i < kpiCards.length; i++) {
      if (!kpiCards[i].label.trim() || !kpiCards[i].value.trim()) {
        setErrorMsg(`KPI Card ${i + 1} must have a valid label and value.`);
        return;
      }
    }

    const caseStudyImages: ProjectCaseStudyImage[] = images.map((img, idx) => ({
      url: img.url.trim(),
      caption: img.caption.trim(),
      altText: img.altText.trim() || `${projectName} Technical Photo ${idx + 1}`,
      isShowingCard: idx === showingIndex,
    }));

    const technologies = technologiesText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const caseStudyPayload: ProjectCaseStudy = {
      projectName: projectName.trim(),
      slug: slug.trim(),
      challengeTitle: challengeTitle.trim(),
      challengeDescription: challengeDescription.trim(),
      solutionTitle: solutionTitle.trim(),
      solutionDescription: solutionDescription.trim(),
      technologies,
      kpiCards,
      images: caseStudyImages,
    };

    setIsSubmitting(true);

    try {
      const updated = publishProject(project.id, caseStudyPayload);

      try {
        await apiClient(`/api/v1/projects/${project.id}/publish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caseStudy: caseStudyPayload }),
        });
      } catch {}

      if (updated) {
        toast.success("Case study published to public website!");
        onSuccess(updated);
      }
      onClose();
    } catch {
      toast.error("Failed to publish case study. Please review your entries and try again.");
      setErrorMsg("Failed to publish case study. Please review your entries and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "880px",
          maxHeight: "90vh",
          backgroundColor: "var(--bg-card)",
          borderRadius: "14px",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "var(--bg-canvas)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "var(--sys-green-subtle)",
                color: "var(--sys-green-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--sys-green-border)",
              }}
            >
              <Globe size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "var(--text-heading)" }}>
                Publish Case Study to Public Website
              </h2>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {project.projectCode} • {project.clientName} ({project.lineName})
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "6px",
              display: "flex",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "22px",
          }}
        >
          {errorMsg && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "#ef4444",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div
            style={{
              padding: "16px",
              borderRadius: "10px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "var(--text-heading)" }}>
                1. Project Images & Card Thumbnail Selection (Strictly 3 Images)
              </h3>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Showing card image marked with <Star size={12} style={{ display: "inline", verticalAlign: "middle", color: "#eab308" }} />
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
              {images.map((img, idx) => {
                const isCardHero = showingIndex === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      border: `2px solid ${isCardHero ? "var(--sys-green-accent)" : "var(--border-subtle)"}`,
                      borderRadius: "10px",
                      padding: "12px",
                      backgroundColor: isCardHero ? "var(--sys-green-subtle)" : "var(--bg-card)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      position: "relative",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-heading)" }}>
                        Image #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowingIndex(idx)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "3px 8px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: 600,
                          backgroundColor: isCardHero ? "var(--sys-green-accent)" : "var(--bg-hover)",
                          color: isCardHero ? "#ffffff" : "var(--text-muted)",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {isCardHero ? <Check size={12} /> : null}
                        <span>{isCardHero ? "Showing Card" : "Set As Showing"}</span>
                      </button>
                    </div>

                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "110px",
                        borderRadius: "6px",
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {img.url ? (
                        <img
                          src={resolveMediaUrl(img.url)}
                          alt={img.altText || `Slot ${idx + 1}`}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_PROJECT_IMAGE;
                          }}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                          <ImageIcon size={22} />
                          <span>No Image Loaded</span>
                        </div>
                      )}

                      {uploadingIndex === idx && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          Uploading...
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          backgroundColor: "var(--bg-card)",
                          border: "1px solid var(--border-subtle)",
                          color: "var(--text-heading)",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <Upload size={13} />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/webp,image/jpeg,image/png,image/avif"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(idx, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <input
                      type="text"
                      placeholder="Image URL..."
                      value={img.url}
                      onChange={(e) => handleImageFieldChange(idx, "url", e.target.value)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "5px 8px",
                        borderRadius: "5px",
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-heading)",
                        fontSize: "11px",
                      }}
                    />

                    <input
                      type="text"
                      placeholder="Caption (e.g. Rolling Mill Pulpit)"
                      value={img.caption}
                      onChange={(e) => handleImageFieldChange(idx, "caption", e.target.value)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "5px 8px",
                        borderRadius: "5px",
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-heading)",
                        fontSize: "11px",
                      }}
                    />

                    <input
                      type="text"
                      placeholder="Alt Text for SEO"
                      value={img.altText}
                      onChange={(e) => handleImageFieldChange(idx, "altText", e.target.value)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "5px 8px",
                        borderRadius: "5px",
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-heading)",
                        fontSize: "11px",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "4px" }}>
                Public Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Level-2 Automation Modernization for 650,000 TPA Bar Mill"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "4px" }}>
                Case Study URL Slug (/projects/[slug])
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugCustomized(true);
                }}
                placeholder="e.g. rolling-mill-l2-automation-upgrade"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "4px" }}>
                Challenge Title
              </label>
              <input
                type="text"
                value={challengeTitle}
                onChange={(e) => setChallengeTitle(e.target.value)}
                placeholder="e.g. Legacy VMS Cobble Rates and Section Inaccuracies"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "4px" }}>
                Challenge Description
              </label>
              <textarea
                value={challengeDescription}
                onChange={(e) => setChallengeDescription(e.target.value)}
                rows={3}
                placeholder="Describe the operational, metallurgical, and automation bottlenecks faced by the mill..."
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "4px" }}>
                Solution Title
              </label>
              <input
                type="text"
                value={solutionTitle}
                onChange={(e) => setSolutionTitle(e.target.value)}
                placeholder="e.g. Physics-Based Dynamic Pass Scheduling & Stand Stiffness Feedback"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "4px" }}>
                Solution Description
              </label>
              <textarea
                value={solutionDescription}
                onChange={(e) => setSolutionDescription(e.target.value)}
                rows={3}
                placeholder="Describe the architecture, PLC integration, algorithms, and supervisory models deployed..."
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  resize: "vertical",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "4px" }}>
                Technologies & Protocols (Comma-Separated)
              </label>
              <input
                type="text"
                value={technologiesText}
                onChange={(e) => setTechnologiesText(e.target.value)}
                placeholder="e.g. C# / .NET 8, OPC UA Client, Siemens S7-400, Python Models"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "10px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "var(--text-heading)" }}>
                  2. Custom KPI Outcome Cards (Min 2, Max 4)
                </h3>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Displayed on the public project card and the top of the case study page
                </div>
              </div>

              {kpiCards.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddKpi}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-heading)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Plus size={14} />
                  <span>Add KPI Card</span>
                </button>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: `repeat(${kpiCards.length}, 1fr)`, gap: "10px" }}>
              {kpiCards.map((kpi, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                      Card #{idx + 1}
                    </span>
                    {kpiCards.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveKpi(idx)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: "2px",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px" }}>
                      Metric Label
                    </label>
                    <input
                      type="text"
                      value={kpi.label}
                      onChange={(e) => handleKpiChange(idx, "label", e.target.value)}
                      placeholder="e.g. Cobble Rate Reduction"
                      required
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "5px 8px",
                        borderRadius: "5px",
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-heading)",
                        fontSize: "12px",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px" }}>
                      Metric Value / Outcome
                    </label>
                    <input
                      type="text"
                      value={kpi.value}
                      onChange={(e) => handleKpiChange(idx, "value", e.target.value)}
                      placeholder="e.g. 38% or 650k TPA"
                      required
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "5px 8px",
                        borderRadius: "5px",
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--sys-green-accent)",
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px" }}>
                      Context Description
                    </label>
                    <input
                      type="text"
                      value={kpi.description || ""}
                      onChange={(e) => handleKpiChange(idx, "description", e.target.value)}
                      placeholder="e.g. Continuous PG test"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "5px 8px",
                        borderRadius: "5px",
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-body)",
                        fontSize: "11px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "12px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "transparent",
                color: "var(--text-muted)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                borderRadius: "6px",
                backgroundColor: "var(--sys-green-accent)",
                color: "#ffffff",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Globe size={15} />
              <span>{isSubmitting ? "Publishing to Website..." : "Publish Case Study"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
