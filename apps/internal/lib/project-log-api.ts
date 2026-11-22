import { apiClient } from "./api-client.js";
import {
  CreateLogEntryDto,
  LogEntryCategory,
  ProjectLogEntryDto,
  ProjectLogWeekDto,
} from "@systrol/types";

export interface LogEntryFilters {
  stepId?: string;
  category?: LogEntryCategory;
  authorId?: string;
  weekId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedLogEntries {
  data: ProjectLogEntryDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function fetchLogWeeks(projectId: string): Promise<ProjectLogWeekDto[]> {
  const res = await apiClient(`/api/v1/projects/${projectId}/log/weeks`);
  if (!res.ok) throw new Error("Failed to fetch log weeks");
  const json = await res.json();
  return json.data || [];
}

export async function fetchCurrentWeek(projectId: string): Promise<ProjectLogWeekDto> {
  const res = await apiClient(`/api/v1/projects/${projectId}/log/weeks/current`);
  if (!res.ok) throw new Error("Failed to fetch current log week");
  return res.json();
}

export async function fetchWeekWithEntries(
  projectId: string,
  weekId: string
): Promise<ProjectLogWeekDto> {
  const res = await apiClient(`/api/v1/projects/${projectId}/log/weeks/${weekId}`);
  if (!res.ok) throw new Error("Failed to fetch week details");
  return res.json();
}

export async function fetchLogEntries(
  projectId: string,
  filters: LogEntryFilters = {}
): Promise<PaginatedLogEntries> {
  const params = new URLSearchParams();
  if (filters.stepId) params.set("stepId", filters.stepId);
  if (filters.category) params.set("category", filters.category);
  if (filters.authorId) params.set("authorId", filters.authorId);
  if (filters.weekId) params.set("weekId", filters.weekId);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const qs = params.toString() ? `?${params.toString()}` : "";
  const res = await apiClient(`/api/v1/projects/${projectId}/log/entries${qs}`);
  if (!res.ok) throw new Error("Failed to fetch log entries");
  return res.json();
}

export async function fetchStepEntryCounts(projectId: string): Promise<Record<string, number>> {
  const res = await apiClient(`/api/v1/projects/${projectId}/log/steps/entry-counts`);
  if (!res.ok) throw new Error("Failed to fetch step entry counts");
  return res.json();
}

export async function postLogEntry(
  projectId: string,
  dto: CreateLogEntryDto
): Promise<ProjectLogEntryDto> {
  const res = await apiClient(`/api/v1/projects/${projectId}/log/entries`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to post log entry");
  }
  return res.json();
}

export async function lockWeek(projectId: string, weekId: string, reason?: string): Promise<void> {
  const res = await apiClient(`/api/v1/projects/${projectId}/log/weeks/${weekId}/lock`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to lock week");
  }
}

export async function unlockWeek(projectId: string, weekId: string): Promise<void> {
  const res = await apiClient(`/api/v1/projects/${projectId}/log/weeks/${weekId}/unlock`, {
    method: "PATCH",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to unlock week");
  }
}

export async function deleteLogEntry(projectId: string, entryId: string): Promise<void> {
  const res = await apiClient(`/api/v1/projects/${projectId}/log/entries/${entryId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete log entry");
  }
}
