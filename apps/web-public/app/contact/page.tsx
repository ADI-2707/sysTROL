"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact/FloatingContact";
import { Container } from "@/components/layout/Container/Container";
import { PageHero } from "@/components/sections/PageHero/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { TextField, TextArea, Select } from "@/components/ui/Forms";
import { Toast } from "@/components/ui/Toast/Toast";
import { contactFormSchema, ContactFormValues } from "@/lib/validations";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Building,
} from "lucide-react";
import styles from "./Contact.module.css";

const serviceOptions = [
  { value: "L2 Automation Consultancy", label: "Level-2 Automation Software & Mathematical Models" },
  { value: "Rolling Mill Modernization", label: "Rolling Mill Commissioning / Retrofit Audit" },
  { value: "Imported Spares Sourcing", label: "Imported Mill Spares (TC Rolls, Servos, Sensors)" },
  { value: "General Technical Inquiry", label: "General Industrial Engineering Inquiry" },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastData, setToastData] = useState<{
    title: string;
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setIsSubmitting(false);
      setToastData({
        type: "success",
        title: "Enquiry Registered Successfully",
        message: `Thank you, ${data.name}. Your enquiry for '${data.service}' has been routed to our Bengaluru engineering desk.`,
      });
      reset();
    } catch {
      setIsSubmitting(false);
      setToastData({
        type: "error",
        title: "Transmission Interruption",
        message: "Unable to route enquiry. Please retry or contact info@sys-trol.com directly.",
      });
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          image="/images/hero-rolling-mill.jpg"
          imageAlt="sysTROL engineering team on the mill floor"
        >
          <Reveal>
            <SectionHeading
              eyebrow="Direct Engineering Desk"
              eyebrowVariant="dark"
              theme="dark"
              title="Connect with sysTROL Engineering"
              subtitle="Whether you require emergency replacement of imported mill spares or wish to audit your Level-2 rolling schedule algorithms, our Bengaluru team is ready to assist."
              align="left"
            />
          </Reveal>
        </PageHero>

        <section className={styles.mainSection}>
          <Container size="wide">
            <div className={styles.splitGrid}>
              <Reveal>
                <div className={styles.formCard}>
                  <div className={styles.formHeader}>
                    <Badge variant="brand" size="sm" style={{ marginBottom: "8px" }}>
                      Phase 1 Interactive Form
                    </Badge>
                    <h2 className={styles.formTitle}>Initiate Technical Enquiry</h2>
                    <p className={styles.formDesc}>
                      Complete the details below and a senior automation engineer will review
                      your requirements.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className={styles.formGrid}>
                      <div className={styles.formGrid2Col}>
                        <TextField
                          label="Full Name"
                          required
                          placeholder="e.g. Rajesh Sharma"
                          error={errors.name?.message}
                          {...register("name")}
                        />
                        <TextField
                          label="Plant / Company Name"
                          required
                          placeholder="e.g. Integrated Steel Plant / Rolling Mill"
                          error={errors.company?.message}
                          {...register("company")}
                        />
                      </div>

                      <div className={styles.formGrid2Col}>
                        <TextField
                          label="Professional Email"
                          type="email"
                          required
                          placeholder="e.g. r.sharma@plant.com"
                          error={errors.email?.message}
                          {...register("email")}
                        />
                        <TextField
                          label="Phone / Mobile Number"
                          type="tel"
                          required
                          placeholder="e.g. +91 98450 12345"
                          error={errors.phone?.message}
                          {...register("phone")}
                        />
                      </div>

                      <Select
                        label="Service / Sparing Interest"
                        required
                        options={serviceOptions}
                        placeholderOption="Select your area of interest"
                        error={errors.service?.message}
                        {...register("service")}
                      />

                      <TextArea
                        label="Requirement Summary"
                        required
                        placeholder="Please share mill details, stand configuration, roll sizes, or specific parts required..."
                        error={errors.message?.message}
                        {...register("message")}
                      />

                      <div className={styles.submitBar}>
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          isLoading={isSubmitting}
                          rightIcon={<Send size={16} />}
                        >
                          {isSubmitting ? "Transmitting Enquiry..." : "Transmit Technical Enquiry"}
                        </Button>
                        <div className={styles.mockNotice}>
                          * Phase 1 Client-Side Validation: Validated with Zod schema. Form is ready
                          for Phase 2 API / SMTP webhook ingestion.
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Reveal>

              <Reveal delay={150}>
                <div className={styles.detailsCard}>
                  <div className={styles.infoBox}>
                    <h3 className={styles.boxTitle}>Direct Contact Channels</h3>

                    <div className={styles.contactList}>
                      <div className={styles.contactItem}>
                        <div className={styles.contactIcon}>
                          <MapPin size={20} />
                        </div>
                        <div>
                          <div className={styles.contactLabel}>Corporate Headquarters</div>
                          <div className={styles.contactText}>
                            sysTROL Engineering & Consultancy Pvt. Ltd.
                            <br />
                            Bengaluru, Karnataka 560001, India
                          </div>
                        </div>
                      </div>

                      <a href="tel:+919845012345" className={styles.contactItem}>
                        <div className={styles.contactIcon}>
                          <Phone size={20} />
                        </div>
                        <div>
                          <div className={styles.contactLabel}>Phone (Direct Line)</div>
                          <div className={styles.contactText}>+91 (80) 2845-XXXX / Direct Line</div>
                        </div>
                      </a>

                      <a href="mailto:info@sys-trol.com" className={styles.contactItem}>
                        <div className={styles.contactIcon}>
                          <Mail size={20} />
                        </div>
                        <div>
                          <div className={styles.contactLabel}>Email (Technical Desk)</div>
                          <div className={styles.contactText}>info@sys-trol.com</div>
                        </div>
                      </a>

                      <a
                        href="https://wa.me/919845012345?text=Hello%20sysTROL%20Team%2C%20I%20have%20an%20automation%20%2F%20trading%20requirement"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactItem}
                      >
                        <div
                          className={styles.contactIcon}
                          style={{ backgroundColor: "#DCFCE7", color: "#16A34A" }}
                        >
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <div className={styles.contactLabel}>WhatsApp Instant Chat</div>
                          <div className={styles.contactText} style={{ color: "#16A34A" }}>
                            +91 98450 XXXXX (Quick Response)
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>

                  <div className={styles.infoBox} style={{ padding: "var(--space-6)", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div className={styles.mapContainer}>
                      <Image
                        src="/images/contact/bengaluru-tech-map.jpg"
                        alt="Bengaluru Engineering Center Geographic Location"
                        fill
                        className={styles.mapImage}
                        sizes="(max-width: 1024px) 100vw, 450px"
                      />
                      <div className={styles.mapBadge}>
                        <Building size={16} color="var(--color-accent-teal-500)" />
                        <div>
                          <div style={{ fontWeight: 600 }}>Bengaluru Engineering Center</div>
                          <div style={{ fontSize: "10px", color: "var(--color-ink-300)" }}>
                            12.9716° N • 77.5946° E • Whitefield Tech Corridor
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.hoursStrip} style={{ marginTop: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                        <Clock size={14} color="var(--color-brand-green-600)" />
                        <span>Operating Hours:</span>
                      </div>
                      <div>Monday – Saturday: 09:00 AM – 06:30 PM IST</div>
                      <div style={{ fontSize: "11px", color: "var(--color-ink-500)" }}>
                        Emergency mill breakdown hotlines active 24/7 for contracted clients.
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {toastData && (
          <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 999 }}>
            <Toast
              type={toastData.type}
              title={toastData.title}
              message={toastData.message}
              onClose={() => setToastData(null)}
            />
          </div>
        )}
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
