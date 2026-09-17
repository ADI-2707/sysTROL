"use client";

import React, { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon, AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ALLOWED_MIME_TYPES = ["image/webp", "image/jpeg", "image/png", "image/avif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const MIN_WIDTH = 1200;
const MIN_HEIGHT = 800;
const MAX_WIDTH = 4096;
const MAX_HEIGHT = 4096;

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token?: string;
  apiUrl: string;
}

interface ImageMetadata {
  width: number;
  height: number;
  aspectRatio: string;
  sizeFormatted: string;
}

export function UploadModal({ isOpen, onClose, onSuccess, token, apiUrl }: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<ImageMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("GALLERY");
  const [gallerySection, setGallerySection] = useState("DEPLOYMENTS");
  const [tagsInput, setTagsInput] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const calculateAspectRatio = (w: number, h: number): string => {
    const ratio = w / h;
    if (Math.abs(ratio - 16 / 9) < 0.1) return "16:9 (Landscape)";
    if (Math.abs(ratio - 4 / 3) < 0.1) return "4:3 (Standard)";
    if (Math.abs(ratio - 1) < 0.05) return "1:1 (Square)";
    if (Math.abs(ratio - 3 / 2) < 0.1) return "3:2 (Classic)";
    return `${w}:${h}`;
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    setFile(null);
    setPreviewUrl(null);
    setMeta(null);

    if (!ALLOWED_MIME_TYPES.includes(selectedFile.type)) {
      setError("Invalid file format. Allowed formats: WebP, JPEG, PNG, AVIF.");
      return;
    }

    if (selectedFile.size > MAX_SIZE_BYTES) {
      setError(`File size exceeds 5MB limit (${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB). Please compress before upload.`);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img;
      if (w < MIN_WIDTH || h < MIN_HEIGHT) {
        setError(`Resolution ${w}×${h}px is below required minimum of ${MIN_WIDTH}×${MIN_HEIGHT}px. High resolution is required for crisp display.`);
        URL.revokeObjectURL(objectUrl);
        return;
      }
      if (w > MAX_WIDTH || h > MAX_HEIGHT) {
        setError(`Resolution ${w}×${h}px exceeds maximum allowed ${MAX_WIDTH}×${MAX_HEIGHT}px.`);
        URL.revokeObjectURL(objectUrl);
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(objectUrl);
      setMeta({
        width: w,
        height: h,
        aspectRatio: calculateAspectRatio(w, h),
        sizeFormatted: `${(selectedFile.size / 1024).toFixed(1)} KB`,
      });

      if (!title) {
        const rawName = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(rawName.charAt(0).toUpperCase() + rawName.slice(1));
      }
    };

    img.onerror = () => {
      setError("Failed to read image dimensions. File may be corrupted.");
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      validateAndSetFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !meta) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(10);
    setUploadStep("Generating secure storage ticket...");

    try {
      const presignRes = await fetch(`${apiUrl}/api/v1/media/presign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          width: meta.width,
          height: meta.height,
          category,
        }),
      });

      if (!presignRes.ok) {
        const errData = await presignRes.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to generate presigned upload URL.");
      }

      const { uploadUrl, s3Key, publicUrl } = await presignRes.json();

      setUploadStep("Uploading binary directly to Supabase S3...");
      setUploadProgress(40);

      const s3UploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!s3UploadRes.ok) {
        throw new Error("Direct storage upload failed. Please verify storage permissions.");
      }

      setUploadProgress(80);
      setUploadStep("Verifying asset and updating CMS index...");

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const confirmRes = await fetch(`${apiUrl}/api/v1/media/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: title.trim(),
          altText: altText.trim() || undefined,
          caption: caption.trim() || undefined,
          category,
          gallerySection: category === "GALLERY" ? gallerySection : undefined,
          tags,
          fileUrl: publicUrl,
          s3Key,
          mimeType: file.type,
          sizeBytes: file.size,
          width: meta.width,
          height: meta.height,
        }),
      });

      if (!confirmRes.ok) {
        const errData = await confirmRes.json().catch(() => ({}));
        throw new Error(errData.message || "Confirmation failed after upload.");
      }

      setUploadProgress(100);
      setUploadStep("Uploaded successfully!");

      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setMeta(null);
    setError(null);
    setTitle("");
    setAltText("");
    setCaption("");
    setCategory("GALLERY");
    setGallerySection("DEPLOYMENTS");
    setTagsInput("");
    setIsUploading(false);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(5, 8, 17, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                backgroundColor: "var(--sys-green-subtle)",
                color: "var(--sys-green-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Upload size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--text-heading)" }}>
                Upload Media Asset
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
                Direct cloud upload with automatic resolution & size validation
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isUploading}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: isUploading ? "not-allowed" : "pointer",
              padding: "6px",
              borderRadius: "6px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleUpload} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed var(--border-subtle)",
                borderRadius: "10px",
                padding: "36px 20px",
                textAlign: "center",
                backgroundColor: "var(--bg-canvas)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".webp,.jpg,.jpeg,.png,.avif"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "var(--bg-hover)",
                  color: "var(--sys-blue-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <ImageIcon size={24} />
              </div>
              <p style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: 600, color: "var(--text-heading)" }}>
                Drag & drop your industrial photo here, or click to browse
              </p>
              <p style={{ margin: "0 0 10px", fontSize: "12px", color: "var(--text-muted)" }}>
                Supports WebP, JPEG, PNG, AVIF (Max 5MB)
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  backgroundColor: "var(--sys-green-subtle)",
                  color: "var(--sys-green-accent)",
                  fontWeight: 600,
                }}
              >
                <Sparkles size={12} /> Minimum 1200×800px required
              </div>
            </div>
          ) : (
            <div
              style={{
                border: "1px solid var(--border-subtle)",
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "var(--bg-canvas)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "180px",
                  backgroundColor: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                    setMeta(null);
                  }}
                  disabled={isUploading}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: "rgba(5, 8, 17, 0.8)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  Change File
                </button>
              </div>

              {meta && (
                <div
                  style={{
                    padding: "10px 14px",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "12px",
                    borderTop: "1px solid var(--border-subtle)",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                  }}
                >
                  <span style={{ color: "var(--sys-green-accent)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={13} /> {meta.width} × {meta.height} px
                  </span>
                  <span>Size: {meta.sizeFormatted}</span>
                  <span>Ratio: {meta.aspectRatio}</span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
                fontSize: "12px",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
              <div>{error}</div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "6px" }}>
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Continuous Bar Mill L2 Pulpit"
                disabled={isUploading}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "6px" }}>
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isUploading}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                  outline: "none",
                }}
              >
                <option value="GALLERY">Gallery (Public Showcase)</option>
                <option value="PROJECTS">Project Case Studies</option>
                <option value="PRODUCTS">Machinery & Spares Catalog</option>
                <option value="FACILITIES">Facilities & Labs</option>
                <option value="BRANDING">Branding & Identity</option>
              </select>
            </div>

            {category === "GALLERY" && (
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "6px" }}>
                  Gallery Section *
                </label>
                <select
                  value={gallerySection}
                  onChange={(e) => setGallerySection(e.target.value)}
                  disabled={isUploading}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--text-heading)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                >
                  <option value="WORKPLACE">Workplace & Simulation Labs</option>
                  <option value="TEAM">Our Team in Action</option>
                  <option value="DEPLOYMENTS">Onsite Deployments & Commissioning</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "6px" }}>
              SEO Alt Text (Recommended)
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descriptive text for accessibility and search engines"
              disabled={isUploading}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-heading)",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "6px" }}>
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. rolling-mill, pulpit, l2-automation, hot-metal"
              disabled={isUploading}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-heading)",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-heading)", marginBottom: "6px" }}>
              Caption / Technical Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Detailed technical specifications or context..."
              disabled={isUploading}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-heading)",
                fontSize: "13px",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          {isUploading && (
            <div style={{ padding: "10px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                <span style={{ color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Loader2 size={13} className="animate-spin" /> {uploadStep}
                </span>
                <span style={{ fontWeight: 600, color: "var(--sys-green-accent)" }}>{uploadProgress}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", backgroundColor: "var(--border-subtle)", borderRadius: "3px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: "100%",
                    backgroundColor: "var(--sys-green-accent)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              paddingTop: "12px",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={!file || !meta || !title.trim() || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" style={{ marginRight: "6px" }} /> Uploading...
                </>
              ) : (
                <>
                  <Upload size={15} style={{ marginRight: "6px" }} /> Upload & Publish
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
