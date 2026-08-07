import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Why is this vendor high risk?",
  "Summarize GDPR compliance.",
  "Explain the breach history.",
  "What documents should Legal request?",
  "Compare this vendor with Slack.",
];

const WELCOME_MESSAGE = {
  role: "bot" as const,
  text: "👋 I'm VendorGuard AI Assistant. Ask me anything about vendor compliance, risk analysis, or what to do next.",
};

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function handleSend(text: string) {
    const msg = text.trim() || input.trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "Why is this vendor high risk?":
          "The vendor scored high risk due to: a misconfigured storage bucket incident (2021), missing cookie policy, and lack of HIPAA attestation. Their GDPR wording was also flagged as incomplete.",
        "Summarize GDPR compliance.":
          "GDPR compliance appears partial. A Data Processing Addendum is available, but cross-border transfer mechanisms are not clearly documented. User rights (access, deletion, portability) are stated but response timelines are unclear.",
        "Explain the breach history.":
          "Our scan found 2 incidents: a 2021 storage bucket misconfiguration exposing internal logs for ~6 hours (severity: high), and a 2023 third-party analytics vendor exposure (severity: medium). Both were remediated within 48 hours.",
        "What documents should Legal request?":
          "I recommend requesting: 1) Latest SOC2 Type II report, 2) Signed DPA with SCCs, 3) Penetration test results (last 12 months), 4) Incident response policy, 5) Subprocessor list with due diligence reports.",
        "Compare this vendor with Slack.":
          "I can compare based on available data. Key differences: both have SOC2 and ISO27001 certs, but this vendor has a breach history while Slack has none. Slack also has more mature GDPR documentation. Run a separate audit on Slack for a side-by-side comparison.",
      };

      const reply = responses[text] || responses[Object.keys(responses).find((k) => text.toLowerCase().includes(k.toLowerCase())) || ""] ||
        `Good question! Based on our compliance data, I recommend running a full audit for detailed analysis. Key areas to investigate: certifications, privacy policy, and breach history.`;

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend("");
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 cursor-pointer flex items-center justify-center w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.97] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : ""
        }`}
        aria-label="Open AI chat assistant"
      >
        <MessageCircle className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Panel */}
      <div
        className={`fixed bottom-6 right-6 z-40 w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-surface shadow-xl transition-all duration-300 ease-out flex flex-col ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
        style={{ maxHeight: "min(600px, calc(100vh - 3rem))" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">AI Assistant</span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-lg text-foreground/40 hover:text-foreground hover:bg-muted transition-colors duration-150"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ minHeight: 0 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 mt-0.5 ${
                  msg.role === "user"
                    ? "bg-secondary/10 text-secondary"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Bot className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </span>
              <div
                className={`rounded-lg px-3 py-2 text-sm max-w-[260px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-on-primary"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary shrink-0">
                <Bot className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <div className="rounded-lg px-3 py-2 bg-muted">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="mt-2">
              <p className="text-xs text-foreground/40 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                Suggested questions
              </p>
              <div className="flex flex-col gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSend(s)}
                    className="cursor-pointer text-left text-xs text-foreground/60 hover:text-foreground hover:bg-muted rounded-lg px-2.5 py-1.5 transition-colors duration-150"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors duration-200"
            />
            <button
              type="button"
              onClick={() => handleSend("")}
              disabled={!input.trim() || isTyping}
              className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-on-primary hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.97] shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}