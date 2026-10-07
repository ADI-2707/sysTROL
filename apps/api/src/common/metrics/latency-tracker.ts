class LatencyTracker {
  private buffer: number[] = [];
  private capacity: number;
  private pointer: number = 0;
  private isFull: boolean = false;

  constructor(capacity = 1000) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }

  recordLatency(durationMs: number): void {
    if (typeof durationMs !== "number" || isNaN(durationMs) || durationMs < 0) {
      return;
    }
    const rounded = Math.round(durationMs * 10) / 10;
    this.buffer[this.pointer] = rounded;
    this.pointer = (this.pointer + 1) % this.capacity;
    if (this.pointer === 0) {
      this.isFull = true;
    }
  }

  private getSamples(): number[] {
    if (!this.isFull) {
      return this.buffer.slice(0, this.pointer);
    }
    return [...this.buffer];
  }

  getMetrics(): {
    count: number;
    avgMs: number;
    medianMs: number;
    p95Ms: number;
    p99Ms: number;
    minMs: number;
    maxMs: number;
    recentSamples: number[];
  } {
    const samples = this.getSamples();
    if (samples.length === 0) {
      return {
        count: 0,
        avgMs: 0,
        medianMs: 0,
        p95Ms: 0,
        p99Ms: 0,
        minMs: 0,
        maxMs: 0,
        recentSamples: [],
      };
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((acc, v) => acc + v, 0);
    const avgMs = Math.round((sum / count) * 10) / 10;

    const getPercentile = (pct: number) => {
      const idx = Math.min(Math.floor((pct / 100) * count), count - 1);
      return sorted[idx];
    };

    const recentSamples = samples.slice(-24);

    return {
      count,
      avgMs,
      medianMs: getPercentile(50),
      p95Ms: getPercentile(95),
      p99Ms: getPercentile(99),
      minMs: sorted[0],
      maxMs: sorted[count - 1],
      recentSamples,
    };
  }

  reset(): void {
    this.pointer = 0;
    this.isFull = false;
    this.buffer = new Array(this.capacity);
  }
}

export const latencyTracker = new LatencyTracker(1000);
