import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge/Badge";
import { clientsData } from "@/content/clients";
import styles from "./TrustStrip.module.css";

export const TrustStrip: React.FC = () => {
  const marqueeClients = [...clientsData, ...clientsData];

  return (
    <section className={styles.trustStrip} aria-label="Client Trust Strip">
      <p className={styles.caption}>
        Proven Engineering & Spares Deployments Across Process Plants
      </p>

      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {marqueeClients.map((client, idx) => (
            <Link
              key={`${client.id}-${idx}`}
              href="/clients"
              className={styles.card3d}
              title={`${client.name} — ${client.engagement}`}
            >
              <div className={styles.cardTopRow}>
                <Badge variant={client.sector === "International" ? "accent" : "brand"} size="sm">
                  {client.statusBadge || "Verified Client"}
                </Badge>
                <span className={styles.cardLocation}>{client.location}</span>
              </div>

              <div>
                <div className={styles.clientName}>{client.name}</div>
                <div className={styles.engagementText}>{client.engagement}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
