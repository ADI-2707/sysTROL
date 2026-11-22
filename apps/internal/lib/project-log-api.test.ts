import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchLogWeeks,
  fetchCurrentWeek,
  fetchWeekWithEntries,
  fetchLogEntries,
  fetchStepEntryCounts,
  postLogEntry,
  lockWeek,
  unlockWeek,
  deleteLogEntry,
} from "./project-log-api.js";
import { apiClient } from "./api-client.js";
import { LogEntryCategory } from "@systrol/types";

vi.mock("./api-client.js", () => ({
  apiClient: vi.fn(),
}));

describe("project-log-api client helper functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchLogWeeks", () => {
    it("calls endpoint and returns weeks array on success", async () => {
      const mockWeeks = [
        { id: "w-1", weekNumber: 47, year: 2026, status: "OPEN" },
      ];
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockWeeks }),
      } as any);

      const result = await fetchLogWeeks("proj-1");
      expect(apiClient).toHaveBeenCalledWith("/api/v1/projects/proj-1/log/weeks");
      expect(result).toEqual(mockWeeks);
    });

    it("throws error when response is not ok", async () => {
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
      } as any);

      await expect(fetchLogWeeks("proj-1")).rejects.toThrow(
        "Failed to fetch log weeks"
      );
    });
  });

  describe("fetchCurrentWeek", () => {
    it("calls current week endpoint and returns week data", async () => {
      const mockWeek = { id: "w-current", weekNumber: 47, year: 2026 };
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: async () => mockWeek,
      } as any);

      const result = await fetchCurrentWeek("proj-1");
      expect(apiClient).toHaveBeenCalledWith(
        "/api/v1/projects/proj-1/log/weeks/current"
      );
      expect(result).toEqual(mockWeek);
    });

    it("throws error when response is not ok", async () => {
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
      } as any);

      await expect(fetchCurrentWeek("proj-1")).rejects.toThrow(
        "Failed to fetch current log week"
      );
    });
  });

  describe("fetchWeekWithEntries", () => {
    it("calls specific week endpoint and returns week with entries", async () => {
      const mockWeek = { id: "w-2", weekNumber: 46, entries: [] };
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: async () => mockWeek,
      } as any);

      const result = await fetchWeekWithEntries("proj-1", "w-2");
      expect(apiClient).toHaveBeenCalledWith(
        "/api/v1/projects/proj-1/log/weeks/w-2"
      );
      expect(result).toEqual(mockWeek);
    });

    it("throws error when response fails", async () => {
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
      } as any);

      await expect(fetchWeekWithEntries("proj-1", "w-2")).rejects.toThrow(
        "Failed to fetch week details"
      );
    });
  });

  describe("fetchLogEntries", () => {
    it("serializes filter params properly into query string", async () => {
      const mockPaginated = {
        data: [{ id: "e-1", content: "Test log" }],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: async () => mockPaginated,
      } as any);

      const result = await fetchLogEntries("proj-1", {
        stepId: "step-10",
        category: LogEntryCategory.MILESTONE,
        authorId: "user-5",
        weekId: "week-2",
        page: 2,
        limit: 25,
      });

      expect(apiClient).toHaveBeenCalledWith(
        "/api/v1/projects/proj-1/log/entries?stepId=step-10&category=MILESTONE&authorId=user-5&weekId=week-2&page=2&limit=25"
      );
      expect(result).toEqual(mockPaginated);
    });

    it("handles empty filters without query string", async () => {
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [], meta: {} }),
      } as any);

      await fetchLogEntries("proj-1");
      expect(apiClient).toHaveBeenCalledWith("/api/v1/projects/proj-1/log/entries");
    });

    it("throws error when fetchLogEntries response is not ok", async () => {
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
      } as any);

      await expect(fetchLogEntries("proj-1")).rejects.toThrow(
        "Failed to fetch log entries"
      );
    });
  });

  describe("fetchStepEntryCounts", () => {
    it("returns step log count mapping", async () => {
      const mockCounts = { "step-1": 4, "step-2": 1 };
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: async () => mockCounts,
      } as any);

      const result = await fetchStepEntryCounts("proj-1");
      expect(apiClient).toHaveBeenCalledWith(
        "/api/v1/projects/proj-1/log/steps/entry-counts"
      );
      expect(result).toEqual(mockCounts);
    });

    it("throws error when fetchStepEntryCounts fails", async () => {
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
      } as any);

      await expect(fetchStepEntryCounts("proj-1")).rejects.toThrow(
        "Failed to fetch step entry counts"
      );
    });
  });

  describe("postLogEntry", () => {
    it("sends POST request with serialized payload and returns created entry", async () => {
      const payload = {
        category: LogEntryCategory.PROGRESS,
        content: "Commissioning stage 2 verified",
        stepId: "step-1",
      };
      const createdEntry = { id: "entry-99", ...payload };
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: async () => createdEntry,
      } as any);

      const result = await postLogEntry("proj-1", payload);
      expect(apiClient).toHaveBeenCalledWith(
        "/api/v1/projects/proj-1/log/entries",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      expect(result).toEqual(createdEntry);
    });

    it("throws error with server message when post fails", async () => {
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Only current active week entries permitted" }),
      } as any);

      await expect(
        postLogEntry("proj-1", {
          category: LogEntryCategory.PROGRESS,
          content: "Valid length content here",
        })
      ).rejects.toThrow("Only current active week entries permitted");
    });
  });

  describe("lockWeek", () => {
    it("sends lock request with optional reason", async () => {
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as any);

      await lockWeek("proj-1", "w-1", "Weekly signoff completed");
      expect(apiClient).toHaveBeenCalledWith(
        "/api/v1/projects/proj-1/log/weeks/w-1/lock",
        {
          method: "PATCH",
          body: JSON.stringify({ reason: "Weekly signoff completed" }),
        }
      );
    });

    it("throws error when lock fails", async () => {
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Unauthorized to lock week" }),
      } as any);

      await expect(lockWeek("proj-1", "w-1")).rejects.toThrow(
        "Unauthorized to lock week"
      );
    });
  });

  describe("unlockWeek", () => {
    it("sends unlock request and returns unlocked week", async () => {
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as any);

      await unlockWeek("proj-1", "w-1");
      expect(apiClient).toHaveBeenCalledWith(
        "/api/v1/projects/proj-1/log/weeks/w-1/unlock",
        {
          method: "PATCH",
        }
      );
    });

    it("throws error when unlock fails", async () => {
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Only SUPER_ADMIN can unlock weeks" }),
      } as any);

      await expect(unlockWeek("proj-1", "w-1")).rejects.toThrow(
        "Only SUPER_ADMIN can unlock weeks"
      );
    });
  });

  describe("deleteLogEntry", () => {
    it("sends DELETE request for specified entry", async () => {
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as any);

      await deleteLogEntry("proj-1", "entry-1");
      expect(apiClient).toHaveBeenCalledWith(
        "/api/v1/projects/proj-1/log/entries/entry-1",
        {
          method: "DELETE",
        }
      );
    });

    it("throws error when delete fails", async () => {
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Cannot delete entry in locked week" }),
      } as any);

      await expect(deleteLogEntry("proj-1", "entry-1")).rejects.toThrow(
        "Cannot delete entry in locked week"
      );
    });
  });
});
