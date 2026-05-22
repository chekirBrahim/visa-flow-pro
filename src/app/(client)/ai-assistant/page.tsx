"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, BrainCircuit, Loader2, RefreshCw, Sparkles, User, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelativeDate } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

const QUICK_QUESTIONS = [
  "Quels documents pour un visa France depuis Tunis ?",
  "Quel est le délai pour un visa Schengen ?",
  "Comment maximiser mes chances d'obtenir un visa USA ?",
  "Que faire en cas de refus de visa ?",
  "TLSContact ou VFS Global, quelle est la différence ?",
  "Puis-je voyager avec un visa de transit ?",
];

const SYSTEM_CONTEXT = `Tu es un expert en visas internationaux depuis la Tunisie, travaillant pour l'agence VisaFlow Pro.

Tu maîtrises parfaitement :
- Les procédures pour tous les types de visas (France, Schengen, USA, Canada, UK...)
- Les centres de visa en Tunisie : TLSContact (France, UK, Canada), VFS Global (Allemagne, Italie, Espagne...)
- Les documents requis selon chaque ambassade
- Les délais de traitement habituels
- Les causes fréquentes de refus et comment les éviter
- Les procédures d'appel en cas de refus
- Les spécificités pour les Tunisiens (profils à risque, garanties financières...)

Tu réponds en français, de façon professionnelle mais accessible. Tes réponses sont précises, complètes et adaptées au contexte tunisien.`;

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant IA spécialisé dans les visas depuis la Tunisie. 🇹🇳\n\nJe peux vous aider avec :\n- Les documents nécessaires pour chaque visa\n- Les procédures TLSContact et VFS Global\n- Les délais et frais consulaires\n- L'analyse de votre dossier\n- Les conseils pour maximiser vos chances\n\nQue puis-je faire pour vous aujourd'hui ?",
      createdAt: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).slice(2),
      role: "user",
      content: content.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.slice(-10).map((m) => ({
              role: m.role,
              content: m.content,
            })),
            { role: "user", content: content.trim() },
          ],
        }),
      });

      if (!res.ok) throw new Error("Erreur API");

      const data = await res.json();

      const assistantMessage: Message = {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: data.content,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: "Désolé, je rencontre une difficulté technique. Veuillez réessayer dans quelques instants.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copié dans le presse-papiers");
  };

  const clearConversation = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Conversation réinitialisée. Comment puis-je vous aider ?",
        createdAt: new Date(),
      },
    ]);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-md shadow-violet-500/25">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Assistant IA Visa</h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
              Spécialisé visas depuis la Tunisie · GPT-4
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="rounded-xl gap-2" onClick={clearConversation}>
          <RefreshCw className="h-4 w-4" />
          Nouvelle conversation
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-border/50 bg-card">
        <div className="flex flex-col p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-white text-sm font-bold",
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-500"
                      : "bg-gradient-to-br from-violet-600 to-blue-600"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <BrainCircuit className="h-4 w-4" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "group relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    message.role === "user"
                      ? "rounded-tr-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                      : "rounded-tl-sm border border-border/50 bg-muted/30 text-foreground"
                  )}
                >
                  {/* Content */}
                  <div className="whitespace-pre-wrap">{message.content}</div>

                  {/* Timestamp */}
                  <div
                    className={cn(
                      "mt-1.5 text-xs",
                      message.role === "user" ? "text-blue-200/70" : "text-muted-foreground/60"
                    )}
                  >
                    {formatRelativeDate(message.createdAt)}
                  </div>

                  {/* Actions */}
                  {message.role === "assistant" && (
                    <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-lg text-muted-foreground hover:text-foreground"
                        onClick={() => copyMessage(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-muted-foreground hover:text-teal-500">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-muted-foreground hover:text-red-500">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-border/50 bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <Sparkles className="h-3 w-3 text-violet-400" />
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative flex items-end gap-3 rounded-2xl border border-border/50 bg-card p-3">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question sur les visas... (Entrée pour envoyer)"
          className="max-h-40 min-h-[44px] resize-none border-0 bg-transparent p-2 shadow-none focus-visible:ring-0"
          rows={1}
        />
        <Button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          size="icon"
          className={cn(
            "h-10 w-10 flex-shrink-0 rounded-xl transition-all",
            input.trim() && !isLoading
              ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md shadow-blue-500/25"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
