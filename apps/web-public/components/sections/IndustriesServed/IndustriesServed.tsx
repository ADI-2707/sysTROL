import React from "react";
import { Factory, Flame, Pipette as Pipe, Cog, Layers, Globe } from "lucide-react";
import { Container } from "@/components/layout/Container/Container";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import styles from "./IndustriesServed.module.css";

const sectors = [
  { label: "Steel Rolling Mills (Bar, Wire Rod, Section)", icon: <Factory size={15} /> },
  { label: "Integrated Primary Steel Plants", icon: <Flame size={15} /> },
  { label: "Continuous Reheating Furnaces", icon: <Flame size={15} /> },
  { label: "ERW & Seamless Tube Mills", icon: <Pipe size={15} /> },
  { label: "Special & Alloy Steel Processors", icon: <Layers size={15} /> },
  { label: "Heavy Machinery & Mill EPC Partners", icon: <Cog size={15} /> },
  { label: "International Middle East & Asian Plants", icon: <Globe size={15} /> },
];

export const IndustriesServed: React.FC = () => {
  return (
    <section className={styles.section} aria-label="Industries Served">
      <Container size="wide">
        <Reveal>
          <div className={styles.inner}>
            <span className={styles.label}>Industries & Mill Segments Served</span>
            <div className={styles.chipList}>
              {sectors.map((item, idx) => (
                <div key={idx} className={styles.chip}>
                  <span style={{ color: "var(--color-brand-green-600)" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
