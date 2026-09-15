import React from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import styles from "./ClientLogoMarquee.module.css";

interface EnterpriseClient {
  id: string;
  name: string;
  division: string;
  sectorTag: string;
  logoSrc: string;
  logoAlt: string;
  width: number;
  height: number;
}

const enterpriseBrands: EnterpriseClient[] = [
  {
    id: "tata",
    name: "TATA STEEL",
    division: "Jamshedpur & Kalinganagar Works",
    sectorTag: "Tier-1 Integrated",
    logoSrc: "/images/clients/tata-steel-full.svg",
    logoAlt: "Tata Steel Official Corporate Logo",
    width: 200,
    height: 40,
  },
  {
    id: "jsw",
    name: "JSW STEEL",
    division: "Vijayanagar & Dolvi Hot Mills",
    sectorTag: "Strip & Wire Rod",
    logoSrc: "/images/clients/jsw.svg",
    logoAlt: "JSW Steel Official Corporate Logo",
    width: 140,
    height: 52,
  },
  {
    id: "sail",
    name: "SAIL",
    division: "Bhilai, Bokaro & Rourkela Plants",
    sectorTag: "Central PSU Core",
    logoSrc: "/images/clients/sail.svg",
    logoAlt: "Steel Authority of India Limited Official Logo",
    width: 58,
    height: 58,
  },
  {
    id: "jspl",
    name: "JINDAL STEEL & POWER",
    division: "Angul & Raigarh Heavy Mills",
    sectorTag: "Rails & Heavy Plates",
    logoSrc: "/images/clients/jspl.svg",
    logoAlt: "Jindal Steel and Power Official Corporate Logo",
    width: 155,
    height: 52,
  },
  {
    id: "amns",
    name: "AM / NS INDIA",
    division: "Hazira Hot Strip Complex",
    sectorTag: "Automotive Grades",
    logoSrc: "/images/clients/amns.png",
    logoAlt: "ArcelorMittal Nippon Steel India Official Logo",
    width: 135,
    height: 48,
  },
  {
    id: "vedanta",
    name: "VEDANTA / ESL STEEL",
    division: "Bokaro Long Products Works",
    sectorTag: "Continuous Bar Mill",
    logoSrc: "/images/clients/vedanta.svg",
    logoAlt: "Vedanta Official Corporate Logo",
    width: 150,
    height: 42,
  },
  {
    id: "jsl",
    name: "JINDAL STAINLESS",
    division: "Jajpur & Hisar Cold Rolling Works",
    sectorTag: "Special Stainless",
    logoSrc: "/images/clients/jindal-stainless.png",
    logoAlt: "Jindal Stainless Official Corporate Logo",
    width: 155,
    height: 42,
  },
  {
    id: "rinl",
    name: "RINL / VIZAG STEEL",
    division: "Visakhapatnam Special Bar Mill",
    sectorTag: "Wire Rod & Rebar",
    logoSrc: "/images/clients/rinl.svg",
    logoAlt: "Rashtriya Ispat Nigam Limited (RINL) Official Logo",
    width: 54,
    height: 56,
  },
];

export const ClientLogoMarquee: React.FC = () => {
  const marqueeBrands = [...enterpriseBrands, ...enterpriseBrands];

  return (
    <section className={styles.section} aria-label="Enterprise Client Roster">
      <div className={styles.header}>
        <div className={styles.eyebrow}>
          <ShieldCheck size={14} />
          <span>Tier-1 Enterprise Engagements</span>
        </div>
        <h3 className={styles.title}>Premier Steel & Process Manufacturers</h3>
      </div>

      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {marqueeBrands.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className={styles.logoPlaque3d}
              title={`${brand.name} — ${brand.division}`}
            >
              <div className={styles.gleamEffect} />
              
              <div className={styles.logoStage}>
                <div className={styles.logoWrapper3d}>
                  <Image
                    src={brand.logoSrc}
                    alt={brand.logoAlt}
                    width={brand.width}
                    height={brand.height}
                    className={styles.brandLogoImage}
                    unoptimized
                    priority={idx < 8}
                  />
                  {brand.id === "sail" && (
                    <div className={styles.sailLabelLockup}>
                      <span className={styles.sailPrimary}>SAIL</span>
                      <span className={styles.sailSecondary}>STEEL AUTHORITY</span>
                    </div>
                  )}
                  {brand.id === "rinl" && (
                    <div className={styles.rinlLabelLockup}>
                      <span className={styles.rinlPrimary}>RINL</span>
                      <span className={styles.rinlSecondary}>VIZAG STEEL</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.sectorTag}>{brand.sectorTag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
