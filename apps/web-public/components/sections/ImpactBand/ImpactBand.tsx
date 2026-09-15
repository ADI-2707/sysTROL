import React from "react";
import { Container } from "@/components/layout/Container/Container";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { CountUp } from "@/components/ui/CountUp/CountUp";
import styles from "./ImpactBand.module.css";

export const ImpactBand: React.FC = () => {
  return (
    <section className={styles.section} aria-label="Corporate Philosophy & Operational Impact">
      <Container size="wide">
        <Reveal>
          <div className={styles.inner}>
            <span className={styles.quoteMark}>“</span>
            <blockquote className={styles.quoteText}>
              We do not consider a project complete when code compiles. We sign off only when hot metal clears the cooling bed and dimensional tolerances meet ASTM standards.
            </blockquote>
            <span className={styles.attribution}>
              sysTROL Engineering & Operational Philosophy
            </span>

            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <span className={styles.statVal}><CountUp value="35%" /></span>
                <span className={styles.statDesc}>Cobble Reduction Average</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statVal}><CountUp value="110 m/s" /></span>
                <span className={styles.statDesc}>Synchronized Finishing Speed</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statVal}><CountUp value="100%" /></span>
                <span className={styles.statDesc}>FAT Mill Simulation Testing</span>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
