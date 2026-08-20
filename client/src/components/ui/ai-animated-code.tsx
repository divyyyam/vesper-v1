"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  ArrowUp,
  Check,
  FileText,
  LoaderCircle,
  MessageSquareText,
  Paperclip,
  Plus,
  Scale,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const prompts = [
  {
    icon: FileText,
    title: "Review a contract",
    prompt: "Review my contract and identify clauses I should pay attention to.",
  },
  {
    icon: Scale,
    title: "Understand my rights",
    prompt: "Help me understand my legal rights in this situation.",
  },
  {
    icon: MessageSquareText,
    title: "Prepare for a consultation",
    prompt: "Help me prepare the right questions for a lawyer consultation.",
  },
];

function useAutoResizeTextarea(minHeight = 48, maxHeight = 180) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback((reset = false) => {
    if (!ref.current) return;
    ref.current.style.height = `${minHeight}px`;
    if (!reset) {
      ref.current.style.height = `${Math.min(ref.current.scrollHeight, maxHeight)}px`;
    }
  }, [maxHeight, minHeight]);

  return { ref, resize };
}

export default function AnimatedAIChat() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { ref: textareaRef, resize } = useAutoResizeTextarea();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function sendMessage() {
    const question = value.trim();
    if (!question || busy) return;

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), content: question, sender: "user", timestamp: new Date() },
    ]);
    setValue("");
    resize(true);
    setBusy(true);

    try {
      const response = await axios.post(
        "https://model.morpheus4077.workers.dev/api/v1/chat",
        { text: question },
      );
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          content: response.data?.response || "I couldn’t prepare an answer for that. Please try rephrasing your question.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          content: "I’m having trouble connecting right now. Please try again in a moment.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function summarizePdf() {
    if (!pdfFile || busy) return;

    const file = pdfFile;
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), content: `Uploaded ${file.name}`, sender: "user", timestamp: new Date() },
    ]);
    setPdfFile(null);
    setBusy(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://model.morpheus4077.workers.dev/api/v1/summarize-pdf",
        { method: "POST", body: formData },
      );
      const result = await response.json();
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          content: response.ok ? result.summary : `I couldn’t process that PDF: ${result.error || "unknown error"}`,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("PDF upload error:", error);
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), content: "The PDF upload failed. Please try again.", sender: "ai", timestamp: new Date() },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setFileError("Vesper currently accepts PDF documents only.");
      return;
    }
    setFileError("");
    setPdfFile(file);
    event.target.value = "";
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      pdfFile ? summarizePdf() : sendMessage();
    }
  }

  function newConversation() {
    setMessages([]);
    setPdfFile(null);
    setValue("");
    setSidebarOpen(false);
  }

  return (
    <main className="flex h-[100dvh] overflow-hidden bg-[#0d0d0d] text-[#f4f1ea]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[286px] flex-col border-r border-white/10 bg-[#111] p-4 transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-12 items-center justify-between px-2">
          <BrandMark />
          <button type="button" onClick={() => setSidebarOpen(false)} className="grid size-8 place-items-center rounded-full border border-white/10 text-[#89857e] lg:hidden"><X size={15} /></button>
        </div>

        <button type="button" onClick={newConversation} className="mt-5 flex h-11 items-center justify-between rounded-full border border-white/15 bg-white/[0.035] px-4 text-sm text-[#d8d4cc] transition-colors hover:bg-white/[0.07]">
          New conversation <Plus size={16} />
        </button>

        <div className="mt-8">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-[#67635d]">Workspace</p>
          <div className="mt-3 rounded-xl bg-white/[0.045] p-3">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-[#ff6b3d]/15 text-[#ff7a50]"><Sparkles size={16} /></span>
              <div>
                <p className="text-sm font-medium">Legal assistant</p>
                <p className="mt-0.5 text-[11px] text-[#77736d]">Current conversation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.025] p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-[#bcb8b0]"><ShieldCheck size={14} className="text-[#ff7a50]" /> Private workspace</div>
          <p className="mt-2 text-[11px] leading-5 text-[#6f6b65]">Your conversation is intended to help you understand legal information.</p>
        </div>
        <Link href="/" className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#77736d] transition-colors hover:bg-white/5 hover:text-white"><ArrowLeft size={14} /> Back to Vesper</Link>
      </aside>

      <section className="relative flex min-w-0 flex-1 flex-col bg-[#0d0d0d]">
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setSidebarOpen(true)} className="grid size-9 place-items-center rounded-full border border-white/10 lg:hidden" aria-label="Open sidebar"><Plus size={16} /></button>
            <div>
              <p className="text-sm font-medium text-[#e8e4dc]">Vesper counsel</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[.13em] text-[#716d67]"><span className="size-1.5 rounded-full bg-[#ff6b3d]" /> Ready</p>
            </div>
          </div>
          <p className="hidden text-[11px] text-[#6f6b65] sm:block">AI-generated legal information · Verify critical advice</p>
        </header>

        <div className="relative min-h-0 flex-1 overflow-y-auto">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(109,53,255,.1),transparent_26%),radial-gradient(circle_at_82%_80%,rgba(255,91,43,.08),transparent_25%)]" />

          <div className="relative mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
            {messages.length === 0 ? (
              <div className="my-auto py-10 animate-rise-in">
                <div className="mb-8 flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-[#ff6b3d] text-[#170b07]"><Sparkles size={19} /></span>
                  <span className="text-xs uppercase tracking-[.18em] text-[#77736d]">Legal clarity, on demand</span>
                </div>
                <h1 className="max-w-2xl text-balance text-[clamp(2.8rem,6vw,5.4rem)] font-medium leading-[.92] tracking-[-.06em]">What can we make clearer today?</h1>
                <p className="mt-6 max-w-xl text-sm leading-6 text-[#8b8780] sm:text-base">Ask about a legal situation or attach a PDF. Vesper will organize the issue into language you can act on.</p>

                <div className="mt-10 grid gap-2 sm:grid-cols-3">
                  {prompts.map(({ icon: Icon, title, prompt }) => (
                    <button key={title} type="button" onClick={() => { setValue(prompt); setTimeout(() => textareaRef.current?.focus(), 0); }} className="group rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-left transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]">
                      <Icon size={17} className="text-[#ff7a50]" />
                      <p className="mt-8 text-sm font-medium text-[#d8d4cc]">{title}</p>
                      <p className="mt-1 text-[11px] leading-5 text-[#6e6a64]">Start with a guided prompt</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-10 py-4">
                {messages.map((message) => (
                  <article key={message.id} className={`flex gap-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {message.sender === "ai" && <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-[#ff6b3d] text-[#170b07]"><Sparkles size={14} /></span>}
                    <div className={`max-w-[86%] ${message.sender === "user" ? "rounded-2xl rounded-tr-sm bg-[#242424] px-5 py-3.5" : "pt-1"}`}>
                      {message.sender === "ai" && <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#ff7a50]">Vesper</p>}
                      <p className={`whitespace-pre-wrap text-sm leading-7 ${message.sender === "user" ? "text-[#e5e1d9]" : "text-[#c9c5bd]"}`}>{message.content}</p>
                    </div>
                  </article>
                ))}

                {busy && (
                  <div className="flex items-center gap-4">
                    <span className="grid size-8 place-items-center rounded-full bg-[#ff6b3d] text-[#170b07]"><Sparkles size={14} /></span>
                    <div className="flex items-center gap-2 text-xs text-[#77736d]"><LoaderCircle size={14} className="animate-spin" /> Vesper is reviewing…</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-white/10 bg-[#0d0d0d]/95 px-4 pb-4 pt-3 backdrop-blur-xl sm:px-6 sm:pb-5">
          <div className="mx-auto max-w-3xl">
            {pdfFile && (
              <div className="mb-2 flex items-center justify-between rounded-xl border border-[#ff6b3d]/25 bg-[#ff6b3d]/8 px-3 py-2 text-xs text-[#d9b4a6]">
                <span className="flex min-w-0 items-center gap-2"><FileText size={14} className="shrink-0 text-[#ff7a50]" /><span className="truncate">{pdfFile.name}</span></span>
                <button type="button" onClick={() => setPdfFile(null)} className="ml-3 text-[#9b7669] hover:text-white" aria-label="Remove attachment"><X size={14} /></button>
              </div>
            )}
            {fileError && (
              <div role="alert" className="mb-2 rounded-xl border border-red-400/20 bg-red-400/8 px-3 py-2 text-xs text-red-200">{fileError}</div>
            )}

            <div className="rounded-2xl border border-white/15 bg-[#171717] p-2 shadow-[0_12px_40px_rgba(0,0,0,.35)] transition-colors focus-within:border-white/25">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(event) => { setValue(event.target.value); resize(); }}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask a legal question…"
                className="block min-h-12 w-full resize-none bg-transparent px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-[#625f5a]"
              />
              <div className="flex items-center justify-between border-t border-white/8 px-1 pt-2">
                <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" onChange={handleFile} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex h-9 items-center gap-2 rounded-full px-3 text-xs text-[#817d76] transition-colors hover:bg-white/5 hover:text-white"><Paperclip size={15} /> Attach PDF</button>
                <button
                  type="button"
                  onClick={pdfFile ? summarizePdf : sendMessage}
                  disabled={busy || (!value.trim() && !pdfFile)}
                  className="grid size-9 place-items-center rounded-full bg-[#ff6b3d] text-[#170b07] transition-all hover:bg-[#ff7a50] disabled:cursor-not-allowed disabled:bg-[#303030] disabled:text-[#68645f]"
                  aria-label={pdfFile ? "Summarize PDF" : "Send message"}
                >
                  {busy ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowUp size={17} />}
                </button>
              </div>
            </div>
            <p className="mt-2 text-center text-[10px] text-[#5f5c57]">Vesper can make mistakes. Confirm important decisions with a qualified professional.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
