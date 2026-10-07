import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildServer } from "../src/server.js";
import { AuditService } from "../src/modules/audit/audit.service.js";
import { prisma } from "@systrol/database";
import { UserRole } from "@systrol/types";

vi.mock("@systrol/database", () => ({
  prisma: {
    auditLog: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}));

describe("Audit Logs Module & Service Tests", () => {
  let server: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    server = await buildServer();
  });

  describe("AuditService Unit Tests", () => {
    it("returns paginated audit logs with default pagination", async () => {
      const mockItems = [
        {
          id: "log-1",
          actorId: "usr-admin",
          action: "POST /api/v1/projects",
          entityType: "projects",
          entityId: "p-101",
          projectId: "p-101",
          diff: { before: null, after: { name: "Hot Mill Revamp" } },
          createdAt: new Date("2026-10-01T10:00:00Z"),
          project: { id: "p-101", projectCode: "PRJ-HOT-01", name: "Hot Mill Revamp" },
        },
      ];

      (prisma.auditLog.findMany as any).mockResolvedValueOnce(mockItems);
      (prisma.auditLog.count as any).mockResolvedValueOnce(1);

      const result = await AuditService.listAuditLogs({});

      expect(result.items).toHaveLength(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    it("applies filters correctly for entityType, actorId, and projectId", async () => {
      (prisma.auditLog.findMany as any).mockResolvedValueOnce([]);
      (prisma.auditLog.count as any).mockResolvedValueOnce(0);

      await AuditService.listAuditLogs({
        entityType: "projects",
        actorId: "usr-1",
        projectId: "p-101",
        action: "UPDATE",
        startDate: "2026-10-01",
        endDate: "2026-10-05",
      });

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            entityType: "projects",
            actorId: "usr-1",
            projectId: "p-101",
            action: { contains: "UPDATE", mode: "insensitive" },
          }),
        })
      );
    });

    it("fetches a single audit log by id", async () => {
      const mockItem = {
        id: "log-99",
        actorId: "usr-admin",
        action: "PATCH /api/v1/projects/p-1",
        entityType: "projects",
        entityId: "p-1",
        diff: { before: { stage: "ERECTION" }, after: { stage: "COMMISSIONING" } },
        createdAt: new Date(),
        project: null,
      };

      (prisma.auditLog.findUnique as any).mockResolvedValueOnce(mockItem);

      const item = await AuditService.getAuditLogById("log-99");
      expect(item).toEqual(mockItem);
    });
  });

  describe("Audit Endpoints Access Control & Integration Tests", () => {
    it("returns 401 Unauthorized when requesting audit logs without token", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/api/v1/audit-logs",
      });

      expect(res.statusCode).toBe(401);
    });

    it("returns 403 Forbidden when requesting audit logs with non-admin role", async () => {
      const nonAdminToken = server.jwt.sign({
        sub: "usr-field-engineer",
        role: UserRole.FIELD_ENGINEER,
      });

      const res = await server.inject({
        method: "GET",
        url: "/api/v1/audit-logs",
        headers: {
          authorization: `Bearer ${nonAdminToken}`,
        },
      });

      expect(res.statusCode).toBe(403);
    });

    it("returns 200 OK and logs list when requesting with SUPER_ADMIN token", async () => {
      const superAdminToken = server.jwt.sign({
        sub: "usr-superadmin",
        role: UserRole.SUPER_ADMIN,
      });

      (prisma.auditLog.findMany as any).mockResolvedValueOnce([]);
      (prisma.auditLog.count as any).mockResolvedValueOnce(0);

      const res = await server.inject({
        method: "GET",
        url: "/api/v1/audit-logs",
        headers: {
          authorization: `Bearer ${superAdminToken}`,
        },
      });

      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.body);
      expect(data).toHaveProperty("items");
      expect(data).toHaveProperty("pagination");
    });

    it("returns 404 Not Found when audit log id does not exist", async () => {
      const superAdminToken = server.jwt.sign({
        sub: "usr-superadmin",
        role: UserRole.SUPER_ADMIN,
      });

      (prisma.auditLog.findUnique as any).mockResolvedValueOnce(null);

      const res = await server.inject({
        method: "GET",
        url: "/api/v1/audit-logs/non-existent-id",
        headers: {
          authorization: `Bearer ${superAdminToken}`,
        },
      });

      expect(res.statusCode).toBe(404);
    });

    it("returns 200 OK with audit detail when valid id is requested by SUPER_ADMIN", async () => {
      const superAdminToken = server.jwt.sign({
        sub: "usr-superadmin",
        role: UserRole.SUPER_ADMIN,
      });

      const mockLog = {
        id: "log-101",
        actorId: "usr-superadmin",
        action: "POST /api/v1/trials",
        entityType: "trials",
        entityId: "tr-1",
        diff: { before: null, after: { result: "PASS" } },
        createdAt: new Date().toISOString(),
        project: null,
      };

      (prisma.auditLog.findUnique as any).mockResolvedValueOnce(mockLog);

      const res = await server.inject({
        method: "GET",
        url: "/api/v1/audit-logs/log-101",
        headers: {
          authorization: `Bearer ${superAdminToken}`,
        },
      });

      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res.body);
      expect(data.id).toBe("log-101");
    });
  });
});
