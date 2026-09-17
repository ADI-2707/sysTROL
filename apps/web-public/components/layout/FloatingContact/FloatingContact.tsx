"use client";

import React from "react";
import { Phone, MessageSquare } from "lucide-react";
import { trackCtaEvent } from "@/lib/attribution";
import styles from "./FloatingContact.module.css";

export const FloatingContact: React.FC = () => {
  const handleCallClick = () => {
    trackCtaEvent({
      eventType: "PHONE_CLICK",
      ctaId: "floating_call",
    });
  };

  const handleWhatsappClick = () => {
    trackCtaEvent({
      eventType: "WHATSAPP_CLICK",
      ctaId: "floating_whatsapp",
    });
  };

  return (
    <aside className={styles.floatingBar} aria-label="Quick contact actions">
      <a
        href="tel:+919845012345"
        className={`${styles.actionButton} ${styles.call}`}
        aria-label="Call sysTROL directly"
        onClick={handleCallClick}
      >
        <span className={styles.icon}>
          <Phone size={14} />
        </span>
        <span>Call sysTROL</span>
      </a>

      <a
        href="https://wa.me/919845012345?text=Hello%20sysTROL%20Team%2C%20I%20have%20an%20automation%20%2F%20trading%20requirement."
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.actionButton} ${styles.whatsapp}`}
        aria-label="Chat with sysTROL on WhatsApp"
        onClick={handleWhatsappClick}
      >
        <span className={styles.icon}>
          <MessageSquare size={14} />
        </span>
        <span>WhatsApp</span>
      </a>
    </aside>
  );
};
