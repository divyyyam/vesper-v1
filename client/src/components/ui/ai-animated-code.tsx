"use client"
import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import {
  Image,
  FileUp,
  Figma,
  Monitor,
  Paperclip,
  Send,
  X,
  Loader,
  Sparkles,
  User,
  Bot,
} from "lucide-react";
import * as React from "react";
import axios from "axios";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className={`relative ${containerClassName || ""}`}>
        <textarea
          className={`flex min-h-[80px] w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white transition-all duration-200 ease-in-out placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 ${showRing ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0" : ""} ${className || ""}`}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showRing && isFocused && (
          <span
            className="absolute inset-0 rounded-xl pointer-events-none ring-2 ring-offset-0 ring-blue-500 opacity-100 transition-opacity duration-200"
            style={{ animation: "fadeIn 0.2s ease-in-out" }}
          />
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export default function AnimatedAIChat() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [recentCommand, setRecentCommand] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const [inputFocused, setInputFocused] = useState(false);
  const commandPaletteRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // PDF-related state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [summary, setSummary] = useState("");
  const [showFlowchartButton, setShowFlowchartButton] = useState(false);
  const [flowchart, setFlowchart] = useState("");

  const commandSuggestions: CommandSuggestion[] = [
    {
      icon: <Image className="w-4 h-4" />,
      label: "Clone UI",
      description: "Generate a UI from a screenshot",
      prefix: "/clone",
    },
    {
      icon: <Figma className="w-4 h-4" />,
      label: "Import Figma",
      description: "Import a design from Figma",
      prefix: "/figma",
    },
    {
      icon: <Monitor className="w-4 h-4" />,
      label: "Create Page",
      description: "Generate a new web page",
      prefix: "/page",
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      label: "Improve",
      description: "Improve existing UI design",
      prefix: "/improve",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (value.startsWith("/") && !value.includes(" ")) {
      setShowCommandPalette(true);

      const matchingSuggestionIndex = commandSuggestions.findIndex((cmd) =>
        cmd.prefix.startsWith(value)
      );

      if (matchingSuggestionIndex >= 0) {
        setActiveSuggestion(matchingSuggestionIndex);
      } else {
        setActiveSuggestion(-1);
      }
    } else {
      setShowCommandPalette(false);
    }
  }, [value]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev < commandSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev > 0 ? prev - 1 : commandSuggestions.length - 1
        );
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        if (activeSuggestion >= 0) {
          const selectedCommand = commandSuggestions[activeSuggestion];
          setValue(selectedCommand.prefix + " ");
          setShowCommandPalette(false);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowCommandPalette(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() || pdfFile) {
        pdfFile ? handleSummarizePdf() : handleSendMessage();
      }
    }
  };

  const handleSendMessage = async () => {
    if (!value.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: value,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setValue("");
    adjustHeight(true);
    setIsTyping(true);

    try {
      const response = await axios.post(
        "https://model.morpheus4077.workers.dev/api/v1/chat",
        { text: value }
      );

      const result = await response.data;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.response || "Sorry, I couldn't process your request.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was an error processing your request.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setAttachments([file.name]);
    } else if (file) {
      alert("Please select a PDF file");
    }
  };

  const handleSummarizePdf = async () => {
    if (!pdfFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: `📄 Uploaded: ${pdfFile.name}`,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessingPdf(true);
    setIsTyping(true);

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await fetch(
        "https://model.morpheus4077.workers.dev/api/v1/summarize-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
     
      let aiContent = "";
      if (response.ok) {
        aiContent = `${result.summary}`;
      } else {
        aiContent = "Error processing PDF: " + result.error;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiContent,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Error uploading PDF. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessingPdf(false);
      setIsTyping(false);
      setPdfFile(null);
      setAttachments([]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setPdfFile(null);
  };

  const selectCommandSuggestion = (index: number) => {
    const selectedCommand = commandSuggestions[index];
    setValue(selectedCommand.prefix + " ");
    setShowCommandPalette(false);
  };

  return (
    <div className="h-[calc(100vh-60px)] w-full flex flex-col bg-[#0b0f19] text-slate-100 relative overflow-hidden">
      {/* Background decorative ambient glow */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[128px]"
          style={{ animation: "pulse 3s infinite" }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[128px]"
          style={{ animation: "pulse 3s infinite", animationDelay: "0.7s" }}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Messages Area - Fixed height with independent scrolling */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full pb-48" style={{ height: "calc(100vh - 220px)" }}>
        <div className="max-w-4xl mx-auto h-full">
          {messages.length === 0 && (
            <div 
              className="flex items-center justify-center h-[55vh] text-center opacity-0"
              style={{ 
                animation: "fadeInUp 0.5s ease-out forwards",
                animationDelay: "0.1s"
              }}
            >
              <div className="space-y-4 max-w-lg mx-auto">
                <div className="w-16 h-16 bg-blue-950/80 border border-blue-800/60 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-950/40">
                  <Sparkles className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  How can I assist your legal queries today?
                </h1>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Upload a legal contract (PDF) to generate a summary, or ask any question about Indian law & statutes.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {["Summarize Contract PDF", "Legal Rights Advice", "Draft Agreement"].map((action, i) => (
                    <button
                      key={i}
                      onClick={() => setValue(action)}
                      className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl transition-colors font-medium"
                    >
                      ✨ {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6 pb-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 opacity-0 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
                style={{
                  animation: "fadeInUp 0.3s ease-out forwards",
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {message.sender === "ai" && (
                  <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                    <Bot className="w-5 h-5 text-blue-400" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] flex flex-col gap-2 ${
                    message.sender === "user" ? "ml-auto" : ""
                  }`}
                >
                  <div
                    className={`rounded-2xl px-5 py-4 text-sm whitespace-pre-wrap leading-relaxed shadow-lg ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-blue-950/40"
                        : "bg-slate-900 text-slate-100 border border-slate-800"
                    }`}
                  >
                    {message.content && message.content.includes("**") ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-bold'>$1</strong>")
                            .replace(/\n\n/g, "<br><br>")
                            .replace(/\n/g, "<br>"),
                        }}
                      />
                    ) : (
                      message.content || "No content"
                    )}
                  </div>
                </div>

                {message.sender === "user" && (
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div
                className="flex gap-3 justify-start opacity-0"
                style={{
                  animation: "fadeInUp 0.3s ease-out forwards"
                }}
              >
                <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
                <div className="bg-slate-900 rounded-2xl px-5 py-4 border border-slate-800 shadow-md">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-xl p-4 sm:p-6 z-20">
        <div className="max-w-4xl mx-auto">
          <div
            className="relative bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl transition-all duration-200 focus-within:border-blue-500/80"
          >
            {showCommandPalette && (
              <div
                ref={commandPaletteRef}
                className={`absolute left-4 right-4 bottom-full mb-2 bg-slate-900 border border-slate-800 rounded-xl z-50 shadow-2xl overflow-hidden transition-all duration-200 ${
                  showCommandPalette ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                }`}
              >
                <div className="py-1">
                  {commandSuggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.prefix}
                      className={`flex items-center gap-2 px-3 py-2 text-xs cursor-pointer transition-colors ${
                        activeSuggestion === index
                          ? "bg-blue-950 text-blue-300"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                      onClick={() => selectCommandSuggestion(index)}
                    >
                      {suggestion.icon}
                      <span className="font-medium text-white">{suggestion.label}</span>
                      <span className="text-slate-400 text-xs ml-1">
                        {suggestion.prefix}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Message Vesper AI to answer your legal queries..."
                containerClassName="w-full"
                className="w-full px-4 py-2.5 resize-none bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-slate-500 min-h-[50px]"
                showRing={false}
              />
            </div>

            {attachments.length > 0 && (
              <div
                className={`px-4 pb-3 flex gap-2 flex-wrap transition-all duration-300 ${
                  attachments.length > 0 ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
                }`}
              >
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs bg-blue-950/90 py-1.5 px-3 rounded-xl text-blue-300 border border-blue-800/80 font-medium"
                  >
                    <FileUp className="w-3.5 h-3.5 text-blue-400" />
                    <span>{file}</span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 border-t border-slate-800/60 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleAttachFile}
                className="p-2 text-slate-400 hover:text-white rounded-xl transition-all duration-200 hover:bg-slate-800 flex items-center gap-2 text-xs font-medium"
              >
                <Paperclip className="w-4 h-4 text-blue-400" />
                <span>Attach PDF</span>
              </button>

              <button
                type="button"
                onClick={pdfFile ? handleSummarizePdf : handleSendMessage}
                disabled={
                  isTyping || isProcessingPdf || (!value.trim() && !pdfFile)
                }
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 shadow-lg ${
                  value.trim() || pdfFile
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-950/50 hover:from-blue-500 hover:to-indigo-500 transform hover:scale-105"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {isTyping || isProcessingPdf ? (
                  <Loader className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center">
      {[1, 2, 3].map((dot) => (
        <div
          key={dot}
          className="w-2 h-2 bg-gray-400 rounded-full mx-1"
          style={{
            animation: `typingDot 1.5s infinite`,
            animationDelay: `${dot * 0.2}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes typingDot {
          0%, 60%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          30% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}