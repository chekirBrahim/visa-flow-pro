"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ApplicationsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export function useApplications(params: ApplicationsParams = {}) {
  const { page = 1, limit = 10, status, search } = params;
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(status && { status }),
    ...(search && { search }),
  });

  return useQuery({
    queryKey: ["applications", params],
    queryFn: async () => {
      const res = await fetch(`/api/applications?${searchParams}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message ?? "Erreur");
      return json.data;
    },
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ["applications", id],
    queryFn: async () => {
      const res = await fetch(`/api/applications/${id}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message ?? "Erreur");
      return json.data;
    },
    enabled: !!id,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: string; note?: string }) => {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message ?? "Erreur");
      return json.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications", id] });
      toast.success("Statut mis à jour");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
