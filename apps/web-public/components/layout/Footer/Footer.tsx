import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Container } from "../Container/Container";
import styles from "./Footer.module.css";

export const Footer: React.FC = () => {
  const currentYear = 2026;

  return (
    <footer className={styles.footer} role="contentinfo">
      <Container size="wide">
        <div className={styles.topGrid}>
          <div className={styles.brandCol}>
            <div className={styles.logoWrapper}>
              <Image
                src="/images/systrol-logo.jpeg"
                alt="sysTROL Engineering & Consultancy Pvt. Ltd."
                width={180}
                height={52}
                className={styles.logoImage}
              />
            </div>
            <p className={styles.brandDesc}>
              Precision Level-2 (L2) process automation software engineered in C#
              and OEM-grade imported machinery spares trading for steel rolling
              mills and continuous process plants.
            </p>
            <div className={styles.socialLinks}>
              <a
                href="https://www.linkedin.com/company/systrol-engineering-consultancy-pvt-ltd/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="sysTROL on LinkedIn"
                className={styles.linkedinBtn}
              >
                <Linkedin size={18} fill="currentColor" stroke="none" />
              </a>
            </div>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Business Divisions</h4>
            <ul className={styles.linkList}>
              <li>
                <Link
                  href="/services/automation-consultancy"
                  className={styles.footerLink}
                >
                  <span>Level-2 Automation</span>
                  <ArrowUpRight size={12} />
                </Link>
              </li>
              <li>
                <Link
                  href="/services/automation-consultancy"
                  className={styles.footerLink}
                >
                  <span>Mathematical Models</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services/automation-consultancy"
                  className={styles.footerLink}
                >
                  <span>C# / .NET Services</span>
                </Link>
              </li>
              <li>
                <Link href="/services/trading" className={styles.footerLink}>
                  <span>Imported Mill Spares</span>
                  <ArrowUpRight size={12} />
                </Link>
              </li>
              <li>
                <Link href="/services/trading" className={styles.footerLink}>
                  <span>Tungsten Carbide Rolls</span>
                </Link>
              </li>
              <li>
                <Link href="/services/trading" className={styles.footerLink}>
                  <span>Hydraulic AGC Valves</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Company & Work</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/about" className={styles.footerLink}>
                  About sysTROL
                </Link>
              </li>
              <li>
                <Link href="/projects" className={styles.footerLink}>
                  Project Portfolio
                </Link>
              </li>
              <li>
                <Link href="/gallery" className={styles.footerLink}>
                  Visual Showcase
                </Link>
              </li>
              <li>
                <Link href="/clients" className={styles.footerLink}>
                  Clients & Industries
                </Link>
              </li>
              <li>
                <Link href="/services" className={styles.footerLink}>
                  Capabilities Overview
                </Link>
              </li>
              <li>
                <Link href="/careers" className={styles.footerLink}>
                  Careers at sysTROL
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.footerLink}>
                  Contact Engineering
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Corporate Office</h4>
            <div className={styles.contactGrid}>
              <div className={styles.contactSubCol}>
                <div className={styles.contactItem}>
                  <MapPin size={16} className={styles.contactIcon} />
                  <span>
                    Bengaluru, Karnataka, India
                    <br />
                    <span style={{ fontSize: "11px", color: "var(--color-ink-500)" }}>
                      Serving clients across India & GCC
                    </span>
                  </span>
                </div>

                <div className={styles.registeredBadge}>
                  <ShieldCheck size={14} color="var(--color-success-500)" />
                  <span>Registered Engineering Firm</span>
                </div>
              </div>

              <div className={styles.contactSubCol}>
                <a href="tel:+919845012345" className={styles.contactItem}>
                  <Phone size={16} className={styles.contactIcon} />
                  <span>+91 (80) 2845-XXXX / Direct</span>
                </a>

                <a href="mailto:info@sys-trol.com" className={styles.contactItem}>
                  <Mail size={16} className={styles.contactIcon} />
                  <span>info@sys-trol.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div>
            © {currentYear} sysTROL Engineering & Consultancy Pvt. Ltd. All rights
            reserved.
          </div>
          <div className={styles.legalLinks}>
            <Link href="/contact" className={styles.legalLink}>
              Enquiry
            </Link>
            <Link href="/about" className={styles.legalLink}>
              Leadership Note
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
