"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadModal } from "./UploadModal";
import { useAuth } from "@/lib/auth-context";

interface MediaAsset {
  id: string;
  title: string;
  altText: string | null;
  caption: string | null;
  category: "GALLERY" | "PROJECTS" | "PRODUCTS" | "FACILITIES" | "BRANDING";
  tags: string[];
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  createdAt: string;
}

const CATEGORIES = [
  { id: "ALL", label: "All Assets" },
  { id: "GALLERY", label: "Gallery" },
  { id: "PROJECTS", label: "Project Case Studies" },
  { id: "PRODUCTS", label: "Products & Spares" },
  { id: "FACILITIES", label: "Facilities & Labs" },
  { id: "BRANDING", label: "Branding" },
];

export default function MediaPage() {
  const { user } = useAuth();
  const token = user?.token;
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://systrol-api.onrender.com";

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "18",
      });

      if (activeCategory !== "ALL") {
        params.append("category", activeCategory);
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const res = await fetch(`${apiUrl}/api/v1/media?${params.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        setAssets(data.items || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        const publicRes = await fetch(`${apiUrl}/api/v1/public/media${activeCategory !== "ALL" ? `?category=${activeCategory}` : ""}`);
        if (publicRes.ok) {
          const pubData = await publicRes.json();
          setAssets(pubData.media || []);
          setTotal((pubData.media || []).length);
          setTotalPages(1);
        }
      }
    } catch {
      try {
        const fallbackRes = await fetch(`${apiUrl}/api/v1/public/media${activeCategory !== "ALL" ? `?category=${activeCategory}` : ""}`);
        if (fallbackRes.ok) {
          const pubData = await fallbackRes.json();
          setAssets(pubData.media || []);
          setTotal((pubData.media || []).length);
          setTotalPages(1);
        }
      } catch {}
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, token, page, activeCategory, searchQuery]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this media asset?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${apiUrl}/api/v1/media/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
      }
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ padding: "20px 24px", maxWidth: "1600px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "var(--text-heading)" }}>
              Media Library & CMS
            </h1>
            <Badge variant="neutral">{total} Assets</Badge>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted)" }}>
            Cloud-backed industrial imagery with direct CDN delivery to systrol.vercel.app
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button variant="outline" onClick={fetchAssets} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} style={{ marginRight: "6px" }} /> Refresh
          </Button>
          <Button variant="accent" onClick={() => setIsUploadOpen(true)}>
            <Upload size={15} style={{ marginRight: "6px" }} /> Upload Media
          </Button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "12px 16px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setPage(1);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: activeCategory === cat.id ? 600 : 500,
                backgroundColor: activeCategory === cat.id ? "var(--sys-green-accent)" : "transparent",
                color: activeCategory === cat.id ? "#ffffff" : "var(--text-body)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "240px", flex: "1", maxWidth: "340px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search by title, tag, alt..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "7px 12px 7px 30px",
              borderRadius: "6px",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-heading)",
              fontSize: "12px",
              outline: "none",
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div
          style={{
            padding: "80px 20px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "13px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <RefreshCw size={24} className="animate-spin" />
          <span>Loading media assets from cloud storage...</span>
        </div>
      ) : assets.length === 0 ? (
        <div
          style={{
            padding: "80px 20px",
            textAlign: "center",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              backgroundColor: "var(--bg-hover)",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <ImageIcon size={26} />
          </div>
          <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: 600, color: "var(--text-heading)" }}>
            No Media Assets Found
          </h3>
          <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--text-muted)" }}>
            {searchQuery
              ? `No assets matching "${searchQuery}". Try adjusting your filters.`
              : "Upload your first high-resolution industrial rolling mill photo to get started."}
          </p>
          <Button variant="accent" onClick={() => setIsUploadOpen(true)}>
            <Upload size={15} style={{ marginRight: "6px" }} /> Upload First Asset
          </Button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "18px",
          }}
        >
          {assets.map((asset) => (
            <div
              key={asset.id}
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "var(--shadow-card)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "170px",
                  backgroundColor: "#000000",
                  overflow: "hidden",
                }}
              >
                <img
                  src={asset.fileUrl}
                  alt={asset.altText || asset.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    display: "flex",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(5, 8, 17, 0.8)",
                      backdropFilter: "blur(4px)",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {asset.category}
                  </span>
                </div>

                {asset.width && asset.height && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(5, 8, 17, 0.85)",
                      color: "#22c55e",
                      fontSize: "10px",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                    }}
                  >
                    {asset.width}×{asset.height}
                  </div>
                )}
              </div>

              <div style={{ padding: "14px", display: "flex", flexDirection: "column", flex: 1 }}>
                <h4
                  style={{
                    margin: "0 0 4px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-heading)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={asset.title}
                >
                  {asset.title}
                </h4>

                {asset.altText && (
                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      lineHeight: "1.4",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                    title={asset.altText}
                  >
                    {asset.altText}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginBottom: "12px",
                    marginTop: "auto",
                  }}
                >
                  {asset.tags?.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        backgroundColor: "var(--bg-hover)",
                        color: "var(--text-muted)",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                  {asset.sizeBytes && (
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        backgroundColor: "var(--bg-hover)",
                        color: "var(--text-muted)",
                        marginLeft: "auto",
                      }}
                    >
                      {formatFileSize(asset.sizeBytes)}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                    borderTop: "1px solid var(--border-subtle)",
                    gap: "6px",
                  }}
                >
                  <button
                    onClick={() => handleCopyUrl(asset.id, asset.fileUrl)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "5px 10px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-subtle)",
                      backgroundColor: copiedId === asset.id ? "var(--sys-green-subtle)" : "var(--bg-surface)",
                      color: copiedId === asset.id ? "var(--sys-green-accent)" : "var(--text-heading)",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check size={13} /> Copied CDN
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Copy CDN URL
                      </>
                    )}
                  </button>

                  <a
                    href={asset.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open Full Image"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-muted)",
                      backgroundColor: "var(--bg-surface)",
                    }}
                  >
                    <ExternalLink size={13} />
                  </a>

                  <button
                    onClick={() => handleDelete(asset.id)}
                    disabled={deletingId === asset.id}
                    title="Delete Asset"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                      color: "#ef4444",
                      backgroundColor: "rgba(239, 68, 68, 0.06)",
                      cursor: deletingId === asset.id ? "not-allowed" : "pointer",
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginTop: "30px",
          }}
        >
          <Button
            variant="outline"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={fetchAssets}
        token={token || undefined}
        apiUrl={apiUrl}
      />
    </div>
  );
}
