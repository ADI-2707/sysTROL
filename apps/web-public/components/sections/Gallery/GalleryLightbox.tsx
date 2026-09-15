"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MapPin, Tag } from "lucide-react";
import { Badge } from "@/components/ui/Badge/Badge";
import { GalleryItem } from "@/content/gallery";
import styles from "./GalleryLightbox.module.css";

interface GalleryLightboxProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onNavigate: (item: GalleryItem) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  item,
  items,
  onClose,
  onNavigate,
}) => {
  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(items[currentIndex - 1]);
    } else {
      onNavigate(items[items.length - 1]);
    }
  }, [currentIndex, items, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      onNavigate(items[currentIndex + 1]);
    } else {
      onNavigate(items[0]);
    }
  }, [currentIndex, items, onNavigate]);

  useEffect(() => {
    if (!item) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose, handlePrev, handleNext]);

  if (!item) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <X size={20} />
        </button>

        {items.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className={styles.imageContainer}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="100vw"
            priority
            className={styles.lightboxImage}
          />
        </div>

        <div className={styles.detailsPanel}>
          <div className={styles.metaTopRow}>
            <div className={styles.metaBadges}>
              <Badge variant="brand" size="sm">
                {item.categoryLabel}
              </Badge>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", color: "#94A3B8" }}>
                <MapPin size={12} color="var(--color-brand-green-500)" />
                {item.location}
              </span>
            </div>
            <div className={styles.counterBadge}>
              {currentIndex + 1} / {items.length}
            </div>
          </div>

          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.description}>{item.description}</p>

          <div className={styles.tagRow}>
            {item.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                <Tag size={10} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
