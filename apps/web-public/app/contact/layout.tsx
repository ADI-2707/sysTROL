import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | sysTROL Engineering & Consultancy",
  description:
    "Get in touch with sysTROL's industrial engineering and Level-2 automation consultancy team in Bengaluru for project audits, mill modernization, and imported spares sourcing.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | sysTROL Engineering & Consultancy",
    description:
      "Get in touch with sysTROL's industrial engineering and Level-2 automation consultancy team in Bengaluru for project audits, mill modernization, and imported spares sourcing.",
    url: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
