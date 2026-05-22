"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export function useNotifications(unreadOnly = false) {
  return useQuery<NotificationsResponse>({
    queryKey: ["notifications", unreadOnly],
    queryFn: async () => {
      const url = `/api/notifications${unreadOnly ? "?unread=true" : ""}`;
      const res = await fetch(url);
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 30_000, // Poll every 30 seconds
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids?: string[]) => {
      const url = ids ? "/api/notifications" : "/api/notifications?markAll=true";
      const options: RequestInit = { method: "PATCH" };
      if (ids) {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify({ ids });
      }
      await fetch(url, options);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
