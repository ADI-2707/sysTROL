import { pino, type Logger as PinoLogger } from "pino";

export type Logger = PinoLogger;

export function createLogger(name: string): Logger {
  const isDev = process.env.NODE_ENV !== "production";
  const pinoFn = typeof pino === "function" ? pino : (pino as any).default;

  return pinoFn({
    level: isDev ? "debug" : "info",
    base: { service: name },
  });
}
