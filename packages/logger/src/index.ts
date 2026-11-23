import { pino, type Logger as PinoLogger } from "pino";

export type Logger = PinoLogger;

export function createLogger(name: string): Logger {
  const isDev = process.env.NODE_ENV !== "production";
  const defaultLevel = isDev ? "debug" : "info";
  const level = process.env.LOG_LEVEL || defaultLevel;
  const pinoFn = typeof pino === "function" ? pino : (pino as any).default;

  return pinoFn({
    level,
    timestamp: pino.stdTimeFunctions.isoTime,
    base: { service: name },
  });
}
