"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import {
  Briefcase,
  MapPin,
  X,
  Send,
  Sparkles,
  ArrowUpRight,
  Search,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  Building2,
} from "lucide-react";
import { Vacancy, vacanciesData, careerDepartments } from "@/content/careers";
import styles from "./CareerPortal.module.css";

export const CareerPortal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Roles");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [activeApplyRole, setActiveApplyRole] = useState<Vacancy | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    linkedin: "",
    message: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredVacancies = vacanciesData.filter((vacancy) => {
    const matchesDept =
      selectedDept === "All Roles" || vacancy.department === selectedDept;

    const matchesLocation =
      selectedLocation === "All Locations"
        ? true
        : selectedLocation === "Bengaluru Hybrid"
        ? vacancy.location.toLowerCase().includes("hybrid")
        : selectedLocation === "Travel / Site"
        ? vacancy.location.toLowerCase().includes("travel") ||
          vacancy.location.toLowerCase().includes("mills")
        : vacancy.location.toLowerCase().includes(selectedLocation.toLowerCase());

    if (!matchesDept || !matchesLocation) return false;

    if (!debouncedSearchTerm.trim()) return true;

    const q = debouncedSearchTerm.toLowerCase().trim();
    const titleMatch = vacancy.title.toLowerCase().includes(q);
    const descMatch = vacancy.description.toLowerCase().includes(q);
    const deptMatch = vacancy.department.toLowerCase().includes(q);
    const skillMatch = vacancy.skills.some((s) => s.toLowerCase().includes(q));
    const reqMatch = vacancy.requirements.some((r) => r.toLowerCase().includes(q));
    const respMatch = vacancy.responsibilities.some((r) => r.toLowerCase().includes(q));

    return titleMatch || descMatch || deptMatch || skillMatch || reqMatch || respMatch;
  });

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedDept !== "All Roles" ||
    selectedLocation !== "All Locations";

  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedDept("All Roles");
    setSelectedLocation("All Locations");
  };

  const openApplyModal = (role: Vacancy) => {
    setActiveApplyRole(role);
    setSubmitted(false);
  };

  const closeApplyModal = () => {
    setActiveApplyRole(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const modalMarkup = activeApplyRole ? (
    <div
      className={styles.modalOverlay}
      onClick={closeApplyModal}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Apply: {activeApplyRole.title}</h3>
            <p className={styles.modalSubtitle}>
              {activeApplyRole.department} • {activeApplyRole.location}
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeApplyModal}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>
              <Sparkles size={28} />
            </div>
            <h4 style={{ fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--color-ink-900)" }}>
              Application Received
            </h4>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-700)", maxWidth: "440px" }}>
              Thank you for applying for the <strong>{activeApplyRole.title}</strong> role. Our engineering recruitment team will review your profile and contact you within 3 business days.
            </p>
            <Button variant="primary" size="md" onClick={closeApplyModal}>
              Close Window
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    required
                    className={styles.input}
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className={styles.input}
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Years of Experience *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    placeholder="e.g. 5 Years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>LinkedIn Profile or Online Portfolio</label>
                <input
                  type="url"
                  className={styles.input}
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Introduction or Key Industrial Projects *</label>
                <textarea
                  required
                  className={styles.textarea}
                  placeholder="Briefly describe your experience with rolling mills, automation software, C# programming, or industrial machinery..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="ghost" size="md" type="button" onClick={closeApplyModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                isLoading={submitting}
                leftIcon={<Send size={15} />}
              >
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div>
      <div className={styles.toolbarWrapper}>
        <div className={styles.searchFilterToolbar}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon} aria-hidden="true">
              <Search size={18} />
            </span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="keywords/job description/ job post"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search job positions"
            />
            {searchTerm && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className={styles.filtersRow}>
            <div className={styles.selectWrapper}>
              <span className={styles.selectIcon} aria-hidden="true">
                <Building2 size={15} />
              </span>
              <select
                className={styles.filterSelect}
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                aria-label="Filter by department"
              >
                {careerDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "All Roles" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
              <span className={styles.selectChevron} aria-hidden="true">
                <ChevronDown size={14} />
              </span>
            </div>

            <div className={styles.selectWrapper}>
              <span className={styles.selectIcon} aria-hidden="true">
                <MapPin size={15} />
              </span>
              <select
                className={styles.filterSelect}
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                aria-label="Filter by work location"
              >
                <option value="All Locations">All Locations</option>
                <option value="Bengaluru HQ">Bengaluru HQ</option>
                <option value="Bengaluru Hybrid">Bengaluru (Hybrid)</option>
                <option value="Travel / Site">Onsite / Field Deployments</option>
              </select>
              <span className={styles.selectChevron} aria-hidden="true">
                <ChevronDown size={14} />
              </span>
            </div>
          </div>
        </div>

        <div className={styles.resultsMetaBar}>
          <span className={styles.resultsCount}>
            Showing <strong>{filteredVacancies.length}</strong> of{" "}
            <strong>{vacanciesData.length}</strong> open engineering positions
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              className={styles.resetFiltersBtn}
              onClick={handleResetFilters}
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {filteredVacancies.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon} aria-hidden="true">
            <SlidersHorizontal size={24} />
          </div>
          <h4 className={styles.emptyStateTitle}>No matching positions found</h4>
          <p className={styles.emptyStateText}>
            We couldn&apos;t find any engineering vacancies matching your criteria. Try adjusting your search keywords or reset the filters.
          </p>
          <Button variant="secondary" size="sm" onClick={handleResetFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className={styles.jobsGrid}>
          {filteredVacancies.map((vacancy) => (
            <article key={vacancy.id} className={styles.jobCard}>
              <div className={styles.cardTop}>
                <div className={styles.badgesRow}>
                  <Badge variant="brand" size="sm">
                    {vacancy.department}
                  </Badge>
                  <Badge variant="default" size="sm">
                    {vacancy.type}
                  </Badge>
                </div>

                <h3 className={styles.jobTitle}>{vacancy.title}</h3>

                <div className={styles.metaRow}>
                  <span className={styles.metaItem}>
                    <MapPin size={13} />
                    {vacancy.location}
                  </span>
                  <span className={styles.metaItem}>
                    <Briefcase size={13} />
                    {vacancy.experience}
                  </span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <Link
                  href={`/careers/${vacancy.id}`}
                  className={styles.viewDetailsBtn}
                >
                  <span>View Details</span>
                  <ArrowUpRight size={14} />
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openApplyModal(vacancy)}
                  leftIcon={<Send size={13} />}
                >
                  Apply
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {mounted && modalMarkup ? createPortal(modalMarkup, document.body) : null}
    </div>
  );
};
