"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Send, Sparkles } from "lucide-react";
import { Vacancy } from "@/content/careers";
import styles from "./JobDetails.module.css";

interface JobApplicationFormProps {
  vacancy: Vacancy;
}

export const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ vacancy }) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    linkedin: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      experience: "",
      linkedin: "",
      message: "",
    });
  };

  if (submitted) {
    return (
      <div className={styles.successBox}>
        <div className={styles.successIcon}>
          <Sparkles size={28} />
        </div>
        <h3 style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--color-ink-900)" }}>
          Application Successfully Received
        </h3>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-700)", maxWidth: "480px", lineHeight: 1.6 }}>
          Thank you for applying for the <strong>{vacancy.title}</strong> position. Our engineering recruitment team will review your qualifications and contact you within 3 business days.
        </p>
        <Button variant="primary" size="md" onClick={handleReset}>
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} id="apply-form">
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="applicant-name">
            Full Name *
          </label>
          <input
            id="applicant-name"
            type="text"
            required
            className={styles.input}
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="applicant-email">
            Email Address *
          </label>
          <input
            id="applicant-email"
            type="email"
            required
            className={styles.input}
            placeholder="rahul@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="applicant-phone">
            Phone Number *
          </label>
          <input
            id="applicant-phone"
            type="tel"
            required
            className={styles.input}
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="applicant-exp">
            Years of Relevant Experience *
          </label>
          <input
            id="applicant-exp"
            type="text"
            required
            className={styles.input}
            placeholder="e.g. 5 Years"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          />
        </div>

        <div className={styles.formGroupFull}>
          <label className={styles.label} htmlFor="applicant-linkedin">
            LinkedIn Profile or Online Portfolio
          </label>
          <input
            id="applicant-linkedin"
            type="url"
            className={styles.input}
            placeholder="https://linkedin.com/in/username"
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
          />
        </div>

        <div className={styles.formGroupFull}>
          <label className={styles.label} htmlFor="applicant-message">
            Key Industrial Projects & Relevant Experience *
          </label>
          <textarea
            id="applicant-message"
            required
            className={styles.textarea}
            placeholder="Briefly describe your background with rolling mills, C# .NET automation, PLC interfaces, or industrial drive kinematics..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <div className={styles.formGroupFull} style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            isLoading={submitting}
            leftIcon={<Send size={16} />}
          >
            Submit Application
          </Button>
        </div>
      </div>
    </form>
  );
};
