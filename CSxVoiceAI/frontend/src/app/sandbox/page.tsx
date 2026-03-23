'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SCENARIOS, type CallScenario } from '@/lib/mock-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mic, Send, RotateCcw, Play, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'agent' | 'user'
  text: string
  timestamp: string
}

const MOCK_RESPONSES: Record<CallScenario, string[]> = {
  'transaction-inquiry': [
    "I can see your recent transactions. Could you tell me which charge you're inquiring about — the date, amount, or merchant name would help me look it up.",
    "That charge — the one labelled SQ* — is a Square payment terminal used by small businesses. Does the merchant name ring a bell?",
    "I've found the transaction. It posted on March 2nd for $47.80. Would you like me to send you a summary by text?",
    "I'm glad we got that sorted. Is there anything else I can help you with today?",
  ],
  'account-balance': [
    "Your current checking account balance is $4,821.50. Your available balance is $4,721.50 — there's one pending transaction of $100.",
    "Your savings account shows a balance of $12,340.00. All transactions have posted.",
    "Would you like me to send you a balance summary via SMS?",
    "Is there anything else I can help you with regarding your accounts today?",
  ],
  'loan-status': [
    "I can see your auto loan application is currently under review. Our team typically completes reviews within 2-3 business days.",
    "Your next payment of $342.00 is due on April 1st. Your remaining loan balance is $18,420.00.",
    "If you'd like a formal payoff letter sent by mail, I can arrange that right now. Shall I proceed?",
    "Is there anything else about your loan I can help you with today?",
  ],
  'payment-due': [
    "Your next auto loan payment of $342.00 is due on April 1st. I can see you're enrolled in autopay, so it will be deducted automatically.",
    "Your credit card minimum payment of $45.00 is due on March 15th. Your current statement balance is $1,247.80.",
    "Would you like me to send you a payment reminder by text?",
    "Is there anything else I can help with?",
  ],
  'card-issue': [
    "I'm sorry to hear about your card issue. Let me look into that for you right away. Can you confirm the last 4 digits of the card?",
    "I've locked your card to prevent any further unauthorized use. Let me connect you with our fraud specialist.",
    "I've prepared a full brief for the fraud team. You'll be connected momentarily.",
  ],
  'routing-account': [
    "Lakeside Credit Union's routing number is 271-081-528. This is the same for all account types.",
    "For security, I can't share your full account number verbally. Would you like me to send it to you via secure text?",
    "Done! The secure text has been sent to your number on file. Is there anything else?",
  ],
  'cd-rates': [
    "Our current CD rates are: 6-month at 4.25% APY, 12-month at 4.50% APY, 24-month at 4.15% APY, and 36-month at 3.95% APY.",
    "Our regular savings account offers 3.10% APY, and our money market account offers 3.85% APY.",
    "Rates are subject to change. Would you like me to connect you with a member services representative to open an account?",
  ],
  'loan-payoff': [
    "Your current auto loan payoff amount is $18,420.00 as of today. This includes per-diem interest of $2.14 per day.",
    "Payoff amounts are valid for 10 business days. Would you like me to mail a formal payoff letter? It's required for title release.",
    "I've submitted the request. You should receive the payoff letter within 3-5 business days.",
  ],
}

const GREETINGS: Record<CallScenario, string> = {
  'transaction-inquiry': "Hi there! Thanks for calling Lakeside Credit Union. I'm your CSxAI assistant here to help with transaction questions. What can I help you with today?",
  'account-balance': "Hi! Thanks for calling Lakeside Credit Union. I can help you check your account balances right away. Which account would you like to check?",
  'loan-status': "Hello! Thanks for calling Lakeside Credit Union. I'm here to help with your loan questions. Could you confirm your name so I can look up your application?",
  'payment-due': "Hi! Thanks for calling Lakeside Credit Union. I can help you check your upcoming payment due dates. Which account are you asking about?",
  'card-issue': "Hi, thanks for calling Lakeside Credit Union. I can help with card-related issues. Can you tell me what's going on with your card?",
  'routing-account': "Hi! Thanks for calling Lakeside Credit Union. I can help you with routing numbers and account information. What do you need?",
  'cd-rates': "Hello! Thanks for calling Lakeside Credit Union. I can provide you with our current deposit rates. What are you interested in?",
  'loan-payoff': "Hi! Thanks for calling Lakeside Credit Union. I can help you with loan payoff information. Which loan are you asking about?",
}

const TEST_SCRIPTS = [
  { name: 'Happy path — balance check', input: "What's my checking balance?" },
  { name: 'Fraud escalation', input: "Someone stole my card and made charges I didn't authorize" },
  { name: 'Angry member', input: "I've been charged twice and nobody is helping me. This is ridiculous!" },
  { name: 'Rate shopping', input: "What's the best CD rate you have? Should I go with 12 months?" },
  { name: 'Human request', input: "I just want to talk to a real person please" },
]

function getCurrentTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
}

function TypingIndicator() {
  return (
    <div className="self-start items-start flex flex-col max-w-[80%]">
      <span className="text-xs font-semibold text-muted-foreground mb-1 px-1">CSxAI Agent</span>
      <div className="bg-secondary border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 150, 300].map((delay) => (
          <span key={delay} className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: `${delay}ms`, animationDuration: '600ms' }} />
        ))}
      </div>
    </div>
  )
}

function SandboxContent() {
  const searchParams = useSearchParams()
  const scenarioParam = searchParams.get('scenario') as CallScenario | null
  const validScenario = scenarioParam && SCENARIOS.find((s) => s.id === scenarioParam) ? scenarioParam : 'transaction-inquiry'

  const [selectedScenarioId, setSelectedScenarioId] = useState<CallScenario>(validScenario)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [responseIndex, setResponseIndex] = useState(0)
  const [promptText, setPromptText] = useState('')
  const [guardrailsEnabled, setGuardrailsEnabled] = useState<Record<number, boolean>>({})
  const [isTyping, setIsTyping] = useState(false)
  const [testMetrics, setTestMetrics] = useState<{ resolution: number; guardrailViolations: number; latency: number } | null>(null)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const scenario = SCENARIOS.find((s) => s.id === selectedScenarioId)!

  useEffect(() => {
    setPromptText(scenario.prompt)
    const initial: Record<number, boolean> = {}
    scenario.guardrails.forEach((_, i) => { initial[i] = true })
    setGuardrailsEnabled(initial)
    setMessages([{ role: 'agent', text: GREETINGS[scenario.id as CallScenario], timestamp: getCurrentTime() }])
    setResponseIndex(0)
    setInput('')
    setIsTyping(false)
    setTestMetrics(null)
  }, [selectedScenarioId])

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  function handleSend(text?: string) {
    const trimmed = (text || input).trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { role: 'user', text: trimmed, timestamp: getCurrentTime() }])
    setInput('')
    setIsTyping(true)
    const responses = MOCK_RESPONSES[scenario.id as CallScenario]
    const idx = responseIndex % responses.length
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [...prev, { role: 'agent', text: responses[idx], timestamp: getCurrentTime() }])
      setResponseIndex((prev) => prev + 1)
      setTestMetrics({ resolution: 70 + Math.random() * 25, guardrailViolations: Math.floor(Math.random() * 2), latency: 200 + Math.floor(Math.random() * 300) })
    }, 1000)
  }

  function handleReset() {
    setMessages([{ role: 'agent', text: GREETINGS[scenario.id as CallScenario], timestamp: getCurrentTime() }])
    setResponseIndex(0)
    setInput('')
    setIsTyping(false)
    setTestMetrics(null)
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Sandbox</h1>
        <p className="text-muted-foreground mt-1 text-sm">Test your AI agent before deploying to production</p>
      </div>

      <div className="flex gap-5">
        {/* Config Panel */}
        <div className="w-[38%] flex-shrink-0 space-y-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Configuration</p>
            </div>
            <div className="p-5">
              <div className="mb-5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">Scenario</label>
                <select value={selectedScenarioId} onChange={(e) => setSelectedScenarioId(e.target.value as CallScenario)}
                  className="w-full h-9 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {SCENARIOS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <Tabs defaultValue="prompt">
                <TabsList className="w-full mb-4 bg-secondary rounded-lg p-1 border border-border">
                  <TabsTrigger value="prompt" className="flex-1 rounded-md text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground">Prompt</TabsTrigger>
                  <TabsTrigger value="guardrails" className="flex-1 rounded-md text-xs data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground">Guardrails</TabsTrigger>
                </TabsList>
                <TabsContent value="prompt">
                  <textarea className="w-full min-h-[220px] rounded-xl border border-border bg-secondary p-3 text-xs text-foreground font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 leading-relaxed" value={promptText} onChange={(e) => setPromptText(e.target.value)} />
                </TabsContent>
                <TabsContent value="guardrails">
                  <div className="flex flex-col gap-3">
                    {scenario.guardrails.map((rule, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-secondary">
                        <input type="checkbox" checked={guardrailsEnabled[i] ?? true} onChange={(e) => setGuardrailsEnabled((prev) => ({ ...prev, [i]: e.target.checked }))} className="mt-0.5 accent-violet-500 flex-shrink-0" />
                        <p className={cn('text-xs leading-relaxed', guardrailsEnabled[i] !== false ? 'text-foreground/80' : 'text-muted-foreground line-through')}>{rule}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              <button className="w-full mt-4 py-2 text-sm font-medium rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">Apply Changes</button>
            </div>
          </div>

          {/* Test Scripts */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Test Scripts</p>
            </div>
            <div className="p-3 space-y-1">
              {TEST_SCRIPTS.map((ts, i) => (
                <button key={i} onClick={() => handleSend(ts.input)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-accent transition-colors group">
                  <p className="text-foreground font-medium">{ts.name}</p>
                  <p className="text-muted-foreground/60 mt-0.5 italic truncate">&ldquo;{ts.input}&rdquo;</p>
                </button>
              ))}
            </div>
          </div>

          {/* Test Metrics */}
          {testMetrics && (
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Last Response Metrics</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <p className="text-sm font-bold text-foreground">{testMetrics.resolution.toFixed(0)}%</p>
                  <p className="text-[10px] text-muted-foreground">Resolution</p>
                </div>
                <div className="text-center">
                  <AlertTriangle className={cn('w-4 h-4 mx-auto mb-1', testMetrics.guardrailViolations > 0 ? 'text-red-400' : 'text-emerald-400')} />
                  <p className="text-sm font-bold text-foreground">{testMetrics.guardrailViolations}</p>
                  <p className="text-[10px] text-muted-foreground">Violations</p>
                </div>
                <div className="text-center">
                  <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-sm font-bold text-foreground">{testMetrics.latency}ms</p>
                  <p className="text-[10px] text-muted-foreground">Latency</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <div className="flex-1">
          <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col" style={{ minHeight: '580px' }}>
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Test Conversation</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Testing:</span>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/25">{scenario.name}</span>
              </div>
            </div>

            <div className="flex-1 bg-secondary flex flex-col" style={{ minHeight: '440px' }}>
              <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-5" style={{ maxHeight: '440px' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={cn('flex flex-col max-w-[80%]', msg.role === 'user' ? 'self-end items-end' : 'self-start items-start')}>
                    {msg.role === 'agent' && <span className="text-xs font-semibold text-muted-foreground mb-1 px-1">CSxAI Agent</span>}
                    <div className={cn('rounded-2xl px-4 py-3 text-sm leading-relaxed',
                      msg.role === 'agent' ? 'bg-card text-foreground rounded-tl-sm border border-border' : 'bg-primary text-primary-foreground rounded-tr-sm')}>
                      {msg.text}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 px-1">{msg.role === 'user' ? 'You · ' : ''}{msg.timestamp}</span>
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={chatBottomRef} />
              </div>

              <div className="flex items-center gap-2 p-4 border-t border-border">
                <input type="text" placeholder="Type a message as the member..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 h-10 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <button className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex-shrink-0" title="Microphone">
                  <Mic className="w-4 h-4" />
                </button>
                <button onClick={() => handleSend()} disabled={!input.trim()}
                  className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 flex-shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-border">
              <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Reset Conversation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SandboxPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading sandbox...</div>}>
      <SandboxContent />
    </Suspense>
  )
}
