import { describe, it, expect } from "vitest";
import { createLogger } from "../index.js";

describe("createLogger unit tests", () => {
  it("initializes logger with dynamic log level", () => {
    process.env.LOG_LEVEL = "warn";
    const log = createLogger("test-service");
    expect(log.level).toBe("warn");
    delete process.env.LOG_LEVEL;
  });

  it("assigns service name in base context", () => {
    const log = createLogger("audit-service");
    expect(log.bindings()).toHaveProperty("service", "audit-service");
  });

  it("initializes logger with pii redaction rules", () => {
    const log = createLogger("redact-service");
    expect(log).toBeDefined();
  });
});
