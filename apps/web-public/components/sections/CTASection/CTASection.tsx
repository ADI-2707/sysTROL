import React from "react";
import { ArrowRight, Phone, Mail, MessageSquare } from "lucide-react";
import { Container } from "@/components/layout/Container/Container";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import styles from "./CTASection.module.css";

export const CTASection: React.FC = () => {
  return (
    <section className={styles.ctaSection} aria-label="Call to Action">
      <Container size="wide">
        <Reveal>
          <div className={styles.inner}>
            <Badge variant="accent" size="md">
              Direct Engineering Consultation
            </Badge>

            <h2 className={styles.title}>
              Have a Plant Automation or Rolling Mill Requirement?
            </h2>

            <p className={styles.description}>
              Whether you are planning a brownfield Level-2 modernization, tackling mill
              cobbles, or expediting critical imported spares, connect directly with our
              senior engineering team in Bengaluru.
            </p>

            <div className={styles.buttonGroup}>
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
              >
                Initiate Enquiry
              </Button>
              <Button
                href="https://wa.me/919845012345?text=Hello%20sysTROL%2C%20I%20would%20like%20to%20discuss%20an%20automation%2Fspares%20requirement"
                external
                variant="outlineDark"
                size="lg"
                leftIcon={<MessageSquare size={18} />}
              >
                WhatsApp Us
              </Button>
            </div>

            <div className={styles.directStrip}>
              <span>
                Direct Desk:{" "}
                <a href="tel:+919845012345" className={styles.directLink}>
                  <Phone size={12} /> +91 (80) 2845-XXXX
                </a>
              </span>
              <span>•</span>
              <span>
                Email:{" "}
                <a href="mailto:info@sys-trol.com" className={styles.directLink}>
                  <Mail size={12} /> info@sys-trol.com
                </a>
              </span>
              <span>•</span>
              <span>Bengaluru HQ • Fast 24-Hour Engineering Turnaround</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
