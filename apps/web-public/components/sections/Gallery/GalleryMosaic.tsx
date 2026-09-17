"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container/Container";
import { Badge } from "@/components/ui/Badge/Badge";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { MapPin, Maximize2, Cpu, Users, Factory, Layers, FolderSearch } from "lucide-react";
import {
  galleryCategories,
  galleryItems,
  GalleryCategory,
  GalleryItem,
} from "@/content/gallery";
import styles from "./GalleryMosaic.module.css";

interface GalleryMosaicProps {
  items?: GalleryItem[];
  onSelectItem: (item: GalleryItem) => void;
}

export const GalleryMosaic: React.FC<GalleryMosaicProps> = ({ items, onSelectItem }) => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const sectionRef = useRef<HTMLElement>(null);
  const list = items && items.length > 0 ? items : galleryItems;

  const workplaceItems = list.filter((i) => i.category === "workplace");
  const teamItems = list.filter((i) => i.category === "team");
  const deploymentItems = list.filter((i) => i.category === "deployments");

  const handleFilterChange = (catId: GalleryCategory) => {
    setActiveCategory(catId);
    if (typeof window !== "undefined" && sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < 0) {
        window.scrollTo({
          top: window.scrollY + rect.top - 20,
          behavior: "smooth",
        });
      }
    }
  };

  const renderCard = (item: GalleryItem) => {
    const isFeatured = item.aspect === "featured" || item.aspect === "wide";

    return (
      <div
        key={item.id}
        className={`${styles.galleryCard} ${isFeatured ? styles.featuredCard : ""}`}
        onClick={() => onSelectItem(item)}
        role="button"
        tabIndex={0}
        aria-label={`View ${item.title}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectItem(item);
          }
        }}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.cardImage}
        />
        <div className={styles.cardOverlay}>
          <div className={styles.cardTopRow}>
            <span className={styles.locationBadge}>
              <MapPin size={11} color="var(--color-brand-green-500)" />
              {item.location}
            </span>
            <span className={styles.zoomBtn} aria-hidden="true">
              <Maximize2 size={14} />
            </span>
          </div>

          <div className={styles.cardBottomContent}>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.description}</p>
            <div className={styles.cardTagRow}>
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={styles.cardTag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = (categoryName: string) => (
    <div className={styles.emptyState}>
      <FolderSearch size={32} color="var(--color-ink-400)" />
      <span className={styles.emptyStateTitle}>No {categoryName} Assets Found</span>
      <span className={styles.emptyStateDesc}>
        Visual records for this category are currently being indexed or updated.
      </span>
    </div>
  );

  return (
    <section ref={sectionRef} className={styles.gallerySection} aria-label="Visual Gallery Showcase">
      <Container size="wide">
        <div className={styles.filterBar}>
          {galleryCategories.map((cat) => {
            const count =
              cat.id === "all"
                ? list.length
                : list.filter((i) => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                className={`${styles.filterButton} ${
                  activeCategory === cat.id ? styles.filterButtonActive : ""
                }`}
                onClick={() => handleFilterChange(cat.id)}
              >
                {cat.id === "all" && <Layers size={15} />}
                {cat.id === "workplace" && <Cpu size={15} />}
                {cat.id === "team" && <Users size={15} />}
                {cat.id === "deployments" && <Factory size={15} />}
                <span>{cat.label}</span>
                <span className={styles.filterCount}>{count}</span>
              </button>
            );
          })}
        </div>

        {activeCategory === "workplace" && workplaceItems.length === 0 && renderEmptyState("Workplace & Labs")}
        {activeCategory === "team" && teamItems.length === 0 && renderEmptyState("Team Culture")}
        {activeCategory === "deployments" && deploymentItems.length === 0 && renderEmptyState("Onsite Deployments")}

        {((activeCategory === "all" && workplaceItems.length > 0) || (activeCategory === "workplace" && workplaceItems.length > 0)) && (
          <div className={styles.sectionBlock}>
            <Reveal>
              <div className={styles.sectionBlockHeader}>
                <Badge variant="brand" size="sm" icon={<Cpu size={12} />} style={{ width: "fit-content" }}>
                  Engineering Infrastructure
                </Badge>
                <h2 className={styles.sectionTitle}>Our Workplace & <span>Simulation Labs</span></h2>
                <p className={styles.sectionSubtitle}>
                  Hardware-in-the-loop testing bays, digital twin modeling racks, and precision hydraulic AGC calibration rigs at our Bengaluru technical headquarters.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className={styles.mosaicGrid}>
                {workplaceItems.map(renderCard)}
              </div>
            </Reveal>
          </div>
        )}

        {((activeCategory === "all" && teamItems.length > 0) || (activeCategory === "team" && teamItems.length > 0)) && (
          <div className={styles.sectionBlock}>
            <Reveal>
              <div className={styles.sectionBlockHeader}>
                <Badge variant="brand" size="sm" icon={<Users size={12} />} style={{ width: "fit-content" }}>
                  Engineering Culture
                </Badge>
                <h2 className={styles.sectionTitle}>Our Team <span>in Action</span></h2>
                <p className={styles.sectionSubtitle}>
                  Collaborative code sprints, metallurgical spare part inspections, and telemetry diagnostics driven by senior domain engineers.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className={styles.mosaicGrid}>
                {teamItems.map(renderCard)}
              </div>
            </Reveal>
          </div>
        )}

        {((activeCategory === "all" && deploymentItems.length > 0) || (activeCategory === "deployments" && deploymentItems.length > 0)) && (
          <div className={styles.sectionBlock}>
            <Reveal>
              <div className={styles.sectionBlockHeader}>
                <Badge variant="brand" size="sm" icon={<Factory size={12} />} style={{ width: "fit-content" }}>
                  Operational Verification
                </Badge>
                <h2 className={styles.sectionTitle}>Onsite Deployments & <span>Commissioning</span></h2>
                <p className={styles.sectionSubtitle}>
                  Continuous rolling mill stands, central operator pulpits, and high-velocity rebar finishing lines operating live under sysTROL supervisory control.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className={styles.mosaicGrid}>
                {deploymentItems.map(renderCard)}
              </div>
            </Reveal>
          </div>
        )}
      </Container>
    </section>
  );
};
