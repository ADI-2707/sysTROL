export type IndustrySector =
  | "Steel Rolling Mills"
  | "Integrated Steel Plants"
  | "Process Industries"
  | "International Plants";

export type ServiceType = "Automation & Consultancy" | "Trading & Spares";

export interface ProcessStep {
  step: number;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  deliverables: string[];
}

export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  heroTagline: string;
  fullOverview: string;
  iconName: string;
  domainTags: string[];
  capabilities: {
    title: string;
    description: string;
    highlights: string[];
  }[];
  processSteps?: ProcessStep[];
  tradingCategories?: {
    category: string;
    items: string[];
    sourcingOrigin: string;
  }[];
}

export interface ProjectGalleryItem {
  url: string;
  caption: string;
  tag: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  clientRepresentative: string;
  industry: IndustrySector;
  serviceType: ServiceType;
  shortBlurb: string;
  featured: boolean;
  year: string;
  location: string;
  challenge: string;
  solution: string;
  outcomes: string[];
  technologies: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
  gallery?: ProjectGalleryItem[];
}

export interface ClientItem {
  id: string;
  name: string;
  sector: "Steel & Integrated Plants" | "Process Industries" | "International";
  location: string;
  engagement: string;
  isRepresentative: boolean;
  statusBadge?: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}
