import React from "react";
import Image from "next/image";
import { ProjectGalleryItem } from "@/types";
import styles from "./ProjectGallery.module.css";

interface ProjectGalleryProps {
  gallery?: ProjectGalleryItem[];
  projectTitle: string;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  gallery,
  projectTitle,
}) => {
  if (!gallery || gallery.length === 0) {
    return null;
  }

  const primaryItem = gallery[0];
  const secondaryItems = gallery.slice(1, 3);

  return (
    <section className={styles.gallerySection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Field Execution & Technical Media</h2>
        <p className={styles.sectionSubtitle}>
          Photographic documentation from site integration, supervisory desks, and verified plant trials for {projectTitle}.
        </p>
      </div>

      <div className={styles.bentoGrid}>
        {primaryItem && (
          <div className={styles.primaryCol}>
            <div className={`${styles.card} ${styles.primaryCard}`.trim()}>
              <Image
                src={primaryItem.url}
                alt={primaryItem.caption}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className={styles.image}
              />
              <div className={styles.tagBadge}>{primaryItem.tag}</div>
              <div className={styles.captionOverlay}>
                <p className={styles.captionText}>{primaryItem.caption}</p>
              </div>
            </div>
          </div>
        )}

        {secondaryItems.length > 0 && (
          <div className={styles.secondaryCol}>
            {secondaryItems.map((item, idx) => (
              <div
                key={idx}
                className={`${styles.card} ${styles.secondaryCard}`.trim()}
              >
                <Image
                  src={item.url}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className={styles.image}
                />
                <div className={styles.tagBadge}>{item.tag}</div>
                <div className={styles.captionOverlay}>
                  <p className={styles.captionText}>{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
