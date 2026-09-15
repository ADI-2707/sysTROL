"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Phone, Mail, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import styles from "./MobileDrawer.module.css";

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About sysTROL" },
  { href: "/services", label: "Services Overview" },
  { href: "/services/automation-consultancy", label: "Level-2 Automation" },
  { href: "/services/trading", label: "Machinery & Spares" },
  { href: "/projects", label: "Projects & Case Studies" },
  { href: "/clients", label: "Clients & Industries" },
  { href: "/careers", label: "Careers" },
  { href: "/gallery", label: "Gallery & Showcase" },
  { href: "/contact", label: "Contact Us" },
];

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className={styles.header}>
          <div style={{ height: "40px", position: "relative" }}>
            <Image
              src="/images/systrol-logo.jpeg"
              alt="sysTROL Logo"
              width={140}
              height={40}
              style={{ objectFit: "contain", height: "100%", width: "auto", borderRadius: "4px", backgroundColor: "#ffffff", padding: "2px 6px" }}
            />
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/services"
                ? pathname === "/services"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                onClick={onClose}
              >
                <span>{item.label}</span>
                <ChevronRight size={16} color="var(--color-ink-400)" />
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <Button
            href="/contact"
            variant="primary"
            size="md"
            style={{ width: "100%" }}
            onClick={onClose}
          >
            Get in Touch
          </Button>

          <div className={styles.contactSnippet}>
            <a href="tel:+919845012345" className={styles.contactItem}>
              <Phone size={14} color="var(--color-brand-green-600)" />
              <span>+91 (80) 2845-XXXX / Direct Line</span>
            </a>
            <a href="mailto:info@sys-trol.com" className={styles.contactItem}>
              <Mail size={14} color="var(--color-brand-green-600)" />
              <span>info@sys-trol.com</span>
            </a>
            <a
              href="https://wa.me/919845012345?text=Hello%20sysTROL%20Team%2C%20I%20have%20an%20automation%2Ftrading%20enquiry"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
            >
              <MessageSquare size={14} color="var(--color-brand-green-600)" />
              <span>WhatsApp Quick Enquiry</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
