import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts", "src/worker.ts"],
  format: ["esm"],
  dts: true,
  noExternal: ["@systrol/types", "@systrol/config"],
});
