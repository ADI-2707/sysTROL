import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact/FloatingContact";
import { Container } from "@/components/layout/Container/Container";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { PageHero } from "@/components/sections/PageHero/PageHero";
import { CTASection } from "@/components/sections/CTASection/CTASection";
import { CapabilitiesTimeline } from "@/components/sections/CapabilitiesTimeline/CapabilitiesTimeline";
import { servicesData } from "@/content/services";
import { ArrowRight, Cpu, Truck, CheckCircle2 } from "lucide-react";
import styles from "./Services.module.css";

export const metadata: Metadata = {
  title: "Engineering Services & Trading | sysTROL",
  description:
    "Explore sysTROL's two divisions: Level-2 Process Automation software for steel rolling mills and Global Machinery Spares Trading.",
};

const automationFlowSteps: Record<number, string[]> = {
  0: ["L1 Field PLC", "C# Mill Service", "Real-Time Tracking", "Supervisory HMI / MES"],
  1: ["Roll Force & Torque", "Pass Deformation Model", "Thermal Rundown Pacing", "Adaptive Feedback"],
  2: ["Shopfloor PLCs", "OPC UA / Modbus Broker", "Billet Genealogy", "Enterprise MES"],
  3: ["Kinematics Audit", "FAT Shadow Run", "Cold / Hot Trials", "24/7 Remote Telemetry"],
};

const tradingFlowSteps: Record<number, string[]> = {
  0: ["Tungsten Carbide Ring", "Precision Roller Guide", "Universal Drive Spindle", "Mill Stand Assembly"],
  1: ["Fiber-Optic HMD", "Laser Velocimeter", "High-Precision Load Cell", "L1 Automation Rack"],
  2: ["Proportional Servo Valve", "3μm Micro-Filtration", "Hydraulic AGC Cylinder", "Looper Actuation"],
  3: ["EN 10204 3.1 Cert", "Pre-Shipment Metrology", "Export Freight", "Plant Site Delivery"],
};

export default function ServicesPage() {
  const [automation, trading] = servicesData;

  const automationCapabilities = automation.capabilities.map((cap, idx) => ({
    ...cap,
    flowSteps: automationFlowSteps[idx],
  }));

  const tradingCapabilities = trading.capabilities.map((cap, idx) => ({
    ...cap,
    flowSteps: tradingFlowSteps[idx],
  }));

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          image="/images/automation-control-room.jpg"
          imageAlt="Level-2 automation control room"
        >
          <Reveal>
            <SectionHeading
              eyebrow="Specialized Capabilities"
              eyebrowVariant="dark"
              theme="dark"
              title="End-to-End Industrial Process Solutions"
              subtitle="From custom Level-2 supervisory algorithms and thermal pacing models to the urgent air-freight of certified European servo valves, we support the operational heartbeat of steel manufacturing plants."
              align="left"
            />
          </Reveal>
        </PageHero>

        <section className={styles.overviewSection}>
          <Container size="wide">
            <Reveal delay={100}>
              <div className={styles.divisionCard}>
                <div className={styles.divisionLeft}>
                  <div className={styles.cardBanner}>
                    <Image
                      src="/images/automation-control-room.jpg"
                      alt="Level-2 Automation Control Room"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.cardBannerImage}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--color-brand-green-100)",
                        color: "var(--color-brand-green-700)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Cpu size={22} />
                    </div>
                    <Badge variant="brand" size="sm">
                      Division 01 • Core Engineering
                    </Badge>
                  </div>

                  <h2 className={styles.divisionTitle}>{automation.title}</h2>
                  <p className={styles.divisionText}>{automation.fullOverview}</p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                    {automation.domainTags.slice(0, 5).map((tag, idx) => (
                      <Badge key={idx} variant="mono" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div style={{
                    marginTop: "var(--space-2)",
                    padding: "var(--space-4)",
                    backgroundColor: "var(--color-brand-green-100)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2)",
                  }}>
                    {[
                      "Microsecond-deterministic C#/.NET execution — no black-box AI",
                      "HIL simulation tested before any live hot-metal deployment",
                      "Direct PLC integration: Siemens, ABB, Rockwell — no middleware",
                    ].map((point, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <CheckCircle2 size={15} style={{ color: "var(--color-brand-green-700)", flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ fontSize: "var(--text-sm)", color: "var(--color-brand-green-800)", lineHeight: 1.5 }}>{point}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "var(--space-4)" }}>
                    <Button
                      href={`/services/${automation.slug}`}
                      variant="primary"
                      size="md"
                      rightIcon={<ArrowRight size={16} />}
                    >
                      View Automation Scope & Stepper
                    </Button>
                  </div>
                </div>

                <CapabilitiesTimeline
                  title="Key Engineering Capabilities"
                  theme="brand"
                  items={automationCapabilities}
                />
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className={styles.divisionCard}>
                <div className={styles.divisionLeft}>
                  <div className={styles.cardBanner}>
                    <Image
                      src="/images/hydraulic-agc-system.jpg"
                      alt="Precision Hydraulic AGC System and Spares"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.cardBannerImage}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--color-accent-teal-100)",
                        color: "var(--color-accent-teal-600)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Truck size={22} />
                    </div>
                    <Badge variant="accent" size="sm">
                      Division 02 • Global Sourcing
                    </Badge>
                  </div>

                  <h2 className={styles.divisionTitle}>{trading.title}</h2>
                  <p className={styles.divisionText}>{trading.fullOverview}</p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                    {trading.domainTags.slice(0, 5).map((tag, idx) => (
                      <Badge key={idx} variant="mono" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div style={{
                    marginTop: "var(--space-2)",
                    padding: "var(--space-4)",
                    backgroundColor: "var(--color-accent-teal-100)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2)",
                  }}>
                    {[
                      "OEM-certified parts from Europe & Japan — EN 10204 3.1 on every batch",
                      "Pre-shipment dimensional inspection & protective export packaging",
                      "Emergency air-freight capability for zero-downtime mill restarts",
                    ].map((point, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <CheckCircle2 size={15} style={{ color: "var(--color-accent-teal-600)", flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ fontSize: "var(--text-sm)", color: "var(--color-accent-teal-600)", lineHeight: 1.5 }}>{point}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "var(--space-4)" }}>
                    <Button
                      href={`/services/${trading.slug}`}
                      variant="teal"
                      size="md"
                      rightIcon={<ArrowRight size={16} />}
                    >
                      View Sourcing Categories & Origins
                    </Button>
                  </div>
                </div>

                <CapabilitiesTimeline
                  title="Sourcing & Inspection Guarantees"
                  theme="accent"
                  items={tradingCapabilities}
                />
              </div>
            </Reveal>
          </Container>
        </section>

        <CTASection />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
