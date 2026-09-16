import pino from "pino";

export type Logger = pino.Logger;

export function createLogger(name: string): Logger {
  const isDev = process.env.NODE_ENV !== "production";

  return pino({
    level: isDev ? "debug" : "info",
    base: { service: name },
  });
}
