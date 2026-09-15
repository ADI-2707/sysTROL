import React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container/Container";
import { Badge } from "@/components/ui/Badge/Badge";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { Cpu, ShieldCheck, Wrench, Quote, Linkedin, ExternalLink } from "lucide-react";
import styles from "./TeamSection.module.css";

interface TeamMember {
  id: string;
  role: string;
  discipline: string;
  description: string;
  image: string;
  tags: string[];
}

const teamDisciplines: TeamMember[] = [
  {
    id: "software-simulation",
    role: "Level-2 Software Engineering",
    discipline: "Process Modeling Core",
    description:
      "Mathematical modelers and C# software engineers designing stand-by-stand speed cascades, hydraulic AGC algorithms, and real-time physics-based pass schedule engines.",
    image: "/images/about/team/team-software.jpg",
    tags: ["C# / .NET", "Python Modeling", "HIL Simulation", "OPC UA"],
  },
  {
    id: "spares-metallurgy",
    role: "Mill Spares & Metallurgical Sourcing",
    discipline: "Global Procurement & QC",
    description:
      "Procurement specialists and metallurgists managing factory audits, ultrasonic defect tests, and EN 10204 3.1 certification across certified European and Japanese manufacturers.",
    image: "/images/about/team/team-spares.jpg",
    tags: ["EN 10204 3.1", "Tungsten Carbide", "Servo Valves", "Global QC"],
  },
  {
    id: "field-commissioning",
    role: "Field Commissioning & PLC Integration",
    discipline: "Site Systems Deployment",
    description:
      "Senior field automation engineers handling mill pulpit integration, shadow commissioning, Level-1 PLC interfacing, and zero-downtime hot metal cutovers.",
    image: "/images/about/team/team-field.jpg",
    tags: ["Siemens S7/TIA", "ABB 800xA", "Rockwell", "FAT/SAT Protocol"],
  },
];

export const TeamSection: React.FC = () => {
  return (
    <section className={styles.teamSection} aria-label="Our Team & Leadership">
      <Container size="wide">
        <div className={styles.headerWrap}>
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: "700px" }}>
              <Badge variant="brand" size="md" style={{ width: "fit-content" }}>
                Leadership & Engineering Team
              </Badge>
              <h2 style={{ fontSize: "var(--text-3xl)", fontWeight: 700, color: "var(--color-brand-sys-navy)", lineHeight: "var(--leading-tight)" }}>
                Guided by Mill Automation Pioneers & <span style={{ color: "var(--color-brand-green-600)" }}>Metallurgical Practitioners</span>
              </h2>
              <p style={{ fontSize: "var(--text-base)", color: "var(--color-ink-700)", lineHeight: "var(--leading-relaxed)" }}>
                sysTROL is powered by senior engineers, mathematical modelers, and industrial supply specialists who combine deep computational capability with hands-on steel rolling mill floor experience.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className={styles.directorCard}>
            <div className={styles.directorImageWrap}>
              <Image
                src="/images/about/team/preet-tripathi.jpg"
                alt="Preet Tripathi - Founder, Managing Director & CEO, sysTROL Engineering & Consultancy"
                fill
                sizes="(max-width: 900px) 100vw, 360px"
                className={styles.directorImage}
                priority
              />
            </div>
            <div className={styles.directorContent}>
              <div className={styles.directorHeader}>
                <div className={styles.directorBadgeRow}>
                  <Badge variant="brand" size="sm" icon={<Cpu size={12} />}>
                    Founder & Managing Director
                  </Badge>
                  <Badge variant="accent" size="sm" icon={<ShieldCheck size={12} />}>
                    21+ Years Industry Experience
                  </Badge>
                </div>
                <div className={styles.nameRow}>
                  <h3 className={styles.directorName}>Preet Tripathi</h3>
                  <a
                    href="https://www.linkedin.com/in/preet-tripathi-25972921/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Preet Tripathi on LinkedIn"
                    className={styles.linkedinProfileBtn}
                  >
                    <Linkedin size={14} fill="currentColor" stroke="none" />
                    <span>LinkedIn Profile</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <div className={styles.directorRole}>
                  Founder, Managing Director & CEO | B.E. Electrical (SVNIT)
                </div>
                <div className={styles.pedigreeRow}>
                  <span className={styles.pedigreeChip}>NIT Surat (SVNIT) Alum</span>
                  <span className={styles.pedigreeChip}>Ex-ABB Metals Lead Engineer</span>
                  <span className={styles.pedigreeChip}>Ex-Alstom Domain Leader (7+ Yrs)</span>
                  <span className={styles.pedigreeChip}>Ex-Jindal Stainless</span>
                </div>
              </div>

              <div className={styles.directorBio}>
                <p>
                  Preet Tripathi brings over 21 years of specialized engineering leadership across Industrial Automation & Control Systems, Rolling Stock, and Real-Time Software Design. An Electrical Engineering alumnus of the National Institute of Technology Surat (SVNIT, 1999–2003), he founded sysTROL to bridge deep computational software engineering with rugged steel rolling mill floor operations.
                </p>
                <p>
                  His technical pedigree spans senior engineering tenures at global industrial automation and engineering leaders. As Lead Engineer at ABB&apos;s Metals Business Unit, Metsys Engineering, and Jindal Stainless, he spearheaded mill drive controls, Level-1/Level-2 automation systems, and hot metal pulpit commissioning. He subsequently spent over seven years at Alstom as Domain Leader for Train Control Systems and Software Development Leader, architecting mission-critical, deterministic software systems under stringent international reliability and safety standards.
                </p>
                <p>
                  Under his direction, sysTROL delivers modern, transparent C# Level-2 process automation systems, advanced physics-based pass schedule modeling, and factory-certified OEM machinery spares—eliminating opaque black-box vendor lock-in and empowering continuous steel rolling mills with complete operational autonomy.
                </p>
              </div>

              <div className={styles.directorQuote}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <Quote size={18} color="var(--color-brand-green-700)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    &quot;Steel manufacturing demands zero tolerance for process ambiguity. Having spent over two decades commissioning drives on hot mill floors and architecting mission-critical control software, our guiding principle at sysTROL is absolute transparency: deterministic code, rock-solid metallurgical kinetics, and standing shoulder-to-shoulder with plant operators until every coil and bar rolls to precision.&quot;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className={styles.teamGrid}>
          {teamDisciplines.map((team, idx) => (
            <Reveal key={team.id} delay={150 + idx * 100}>
              <div className={styles.teamCard}>
                <div className={styles.teamImageWrap}>
                  <Image
                    src={team.image}
                    alt={team.role}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.teamImage}
                  />
                </div>
                <div className={styles.teamCardBody}>
                  <span className={styles.teamPill}>{team.discipline}</span>
                  <h4 className={styles.teamTitle}>{team.role}</h4>
                  <p className={styles.teamDesc}>{team.description}</p>
                  <div className={styles.techTagRow}>
                    {team.tags.map((tag) => (
                      <span key={tag} className={styles.techTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
