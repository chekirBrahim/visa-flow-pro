"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, getInitials, formatRelativeDate } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
  isRead: boolean;
  sender: {
    id: string;
    name?: string | null;
    avatar?: string | null;
    role: string;
  };
}

interface ApplicationMessagesProps {
  messages: Message[];
  applicationId: string;
  currentUserId: string;
}

export function ApplicationMessages({
  messages: initialMessages,
  applicationId,
  currentUserId,
}: ApplicationMessagesProps) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isSending) return;
    setIsSending(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.data]);
        setInput("");
        router.refresh();
      }
    } catch {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Messages area */}
      <div className="flex h-[480px] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card">
        <div className="border-b border-border/50 px-5 py-3.5">
          <span className="text-sm font-medium">
            Conversation avec votre conseiller
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Send className="mb-3 h-10 w-10 opacity-20" />
              <p className="text-sm">Aucun message. Démarrez la conversation.</p>
            </div>
          )}

          {messages.map((msg, index) => {
            const isOwn = msg.sender.id === currentUserId;
            const isAgent = ["ADMIN", "SUPER_ADMIN", "AGENT"].includes(msg.sender.role);

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={cn(
                  "flex gap-2.5",
                  isOwn ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={msg.sender.avatar ?? undefined} />
                  <AvatarFallback
                    className={cn(
                      "text-xs text-white font-bold",
                      isAgent
                        ? "bg-gradient-to-br from-violet-600 to-blue-600"
                        : "bg-gradient-to-br from-blue-600 to-teal-500"
                    )}
                  >
                    {getInitials(msg.sender.name ?? "?")}
                  </AvatarFallback>
                </Avatar>

                <div className={cn("max-w-[75%]", isOwn ? "items-end" : "items-start")}>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {isOwn ? "Vous" : msg.sender.name}
                    </span>
                    {isAgent && !isOwn && (
                      <Badge className="h-4 px-1.5 text-xs bg-violet-500/10 text-violet-500 border-violet-500/20">
                        Conseiller
                      </Badge>
                    )}
                  </div>

                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      isOwn
                        ? "rounded-tr-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                        : "rounded-tl-sm border border-border/50 bg-muted/40 text-foreground"
                    )}
                  >
                    {msg.content}
                  </div>

                  <div
                    className={cn(
                      "mt-1 text-xs text-muted-foreground/60",
                      isOwn ? "text-right" : "text-left"
                    )}
                  >
                    {formatRelativeDate(msg.createdAt)}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="flex gap-3 rounded-2xl border border-border/50 bg-card p-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Écrivez votre message... (Entrée pour envoyer)"
          className="min-h-[44px] max-h-32 resize-none border-0 bg-transparent p-2 shadow-none focus-visible:ring-0 text-sm"
          rows={1}
        />
        <div className="flex items-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl text-muted-foreground"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isSending}
            size="icon"
            className={cn(
              "h-10 w-10 rounded-xl transition-all",
              input.trim()
                ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md shadow-blue-500/20"
                : "bg-muted text-muted-foreground"
            )}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
