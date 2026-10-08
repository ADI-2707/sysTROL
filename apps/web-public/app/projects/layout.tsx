import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects & Case Studies | sysTROL Industrial Automation",
  description:
    "Explore sysTROL's continuous rolling mill installations, L2 supervisory retrofits, and global equipment sourcing case studies across India and MENA.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects & Case Studies | sysTROL Industrial Automation",
    description:
      "Explore sysTROL's continuous rolling mill installations, L2 supervisory retrofits, and global equipment sourcing case studies across India and MENA.",
    url: "/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
