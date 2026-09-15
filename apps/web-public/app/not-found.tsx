import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { Container } from "@/components/layout/Container/Container";
import { Button } from "@/components/ui/Button/Button";
import { Badge } from "@/components/ui/Badge/Badge";
import { Home, Compass, ArrowRight, Phone } from "lucide-react";
import styles from "./NotFound.module.css";

const suggestedLinks = [
  {
    title: "Level-2 Automation & Models",
    subtitle: "Real-time pass schedules & C# .NET",
    href: "/services/automation-consultancy",
  },
  {
    title: "Imported Machinery & Spares",
    subtitle: "Tungsten Carbide rolls & OEM valves",
    href: "/services/trading",
  },
  {
    title: "Case Studies & Track Record",
    subtitle: "50+ rolling mill installations",
    href: "/projects",
  },
  {
    title: "Engineering Support Desk",
    subtitle: "Bengaluru HQ & direct inquiries",
    href: "/contact",
  },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <Container size="normal">
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <Compass size={28} />
            </div>

            <Badge variant="accent" size="sm">
              ROUTING STATUS: 404 NOT_FOUND
            </Badge>

            <div className={styles.code}>404</div>

            <h1 className={styles.title}>
              Plant Route or Specification Not Located
            </h1>

            <p className={styles.description}>
              The route you requested could not be resolved within the active sysTROL architecture.
              The resource may have been relocated or updated during our system enhancement.
            </p>

            <div className={styles.quickLinksTitle}>
              Verified Primary Industrial Corridors
            </div>

            <div className={styles.linksGrid}>
              {suggestedLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.linkCard}>
                  <div>
                    <div className={styles.linkCardTitle}>{link.title}</div>
                    <div className={styles.linkCardSubtitle}>{link.subtitle}</div>
                  </div>
                  <ArrowRight size={14} color="var(--color-brand-green-600)" />
                </Link>
              ))}
            </div>

            <div className={styles.actions}>
              <Button href="/" variant="primary" size="md" leftIcon={<Home size={16} />}>
                Return to Homepage
              </Button>
              <Button href="/contact" variant="secondary" size="md" leftIcon={<Phone size={16} />}>
                Contact Desk
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
