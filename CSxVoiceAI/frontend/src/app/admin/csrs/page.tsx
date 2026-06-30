'use client'

import { useState } from 'react'
import { CSRS, type CSR, type CsrRole } from '@/lib/csxiq-data'
import PresenceDot, { PRESENCE_META } from '@/components/PresenceDot'
import {
  Users,
  Plus,
  Search,
  X,
  Mail,
  Calendar,
  Phone,
  CheckCircle2,
  Star,
  Clock,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const roleMeta: Record<CsrRole, string> = {
  CSR: 'bg-[#E9F1F7] text-[#487CA5]',
  'Senior CSR': 'bg-[#EDF3EC] text-[#4F7A4A]',
  'Team Lead': 'bg-[#F4ECF7] text-[#8A5C9E]',
  Admin: 'bg-[#FBF3DB] text-[#9B7B2E]',
}

const ROLES: CsrRole[] = ['CSR', 'Senior CSR', 'Team Lead', 'Admin']

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function CsrsPage() {
  const [roster, setRoster] = useState<CSR[]>(CSRS)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<CSR | null>(null)
  const [onboarding, setOnboarding] = useState(false)

  // onboard form
  const [form, setForm] = useState({ name: '', email: '', role: 'CSR' as CsrRole, bio: '' })

  function onboard() {
    if (!form.name.trim() || !form.email.trim()) return
    const csr: CSR = {
      id: `csr-${roster.length + 1}`,
      name: form.name.trim(),
      role: form.role,
      email: form.email.trim(),
      status: 'away',
      activeCount: 0,
      onboardedAt: new Date().toISOString(),
      callsToday: 0,
      queriesResolved: 0,
      avgHandleMinutes: 0,
      csat: 0,
      tenure: 'just now',
      bio: form.bio.trim() || 'New hire — onboarding in progress.',
    }
    setRoster((prev) => [csr, ...prev])
    setForm({ name: '', email: '', role: 'CSR', bio: '' })
    setOnboarding(false)
  }

  const filtered = roster.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="h-screen overflow-y-auto">
      <div className="max-w-5xl mx-auto px-10 py-9">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F1F0EE] flex items-center justify-center text-[#787774]">
            <Users className="w-[18px] h-[18px]" />
          </div>
          <div className="flex-1">
            <h1 className="text-[28px] font-bold text-[#37352F] tracking-tight leading-tight">Customer Support Reps</h1>
            <p className="text-[#787774] text-[14px] mt-1">Onboard reps, assign roles, and review what each one has been doing.</p>
          </div>
          <button
            onClick={() => setOnboarding(true)}
            className="px-3.5 py-2 rounded-lg bg-[#37352F] text-white text-[13px] font-medium hover:bg-[#2A2925] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Onboard CSR
          </button>
        </div>

        {/* Search */}
        <div className="relative w-72 mt-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9A97]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reps…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E9E9E7] bg-white text-[13px] text-[#37352F] placeholder:text-[#9B9A97] focus:outline-none focus:ring-2 focus:ring-[#37352F]/10 focus:border-[#D6D5D2]"
          />
        </div>

        {/* Roster table */}
        <div className="mt-4 rounded-xl border border-[#E9E9E7] bg-white overflow-hidden">
          <div className="grid grid-cols-[1.6fr_1fr_0.7fr_0.7fr_0.7fr_0.8fr] px-4 py-2.5 border-b border-[#EFEEEC] text-[11px] font-medium text-[#9B9A97] uppercase tracking-wide">
            <span>Rep</span><span>Role</span><span className="text-right">Calls</span><span className="text-right">Resolved</span><span className="text-right">CSAT</span><span className="text-right">Onboarded</span>
          </div>
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="w-full grid grid-cols-[1.6fr_1fr_0.7fr_0.7fr_0.7fr_0.8fr] items-center px-4 py-3 border-b border-[#EFEEEC] last:border-0 hover:bg-[#F7F6F5] transition-colors text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#EAEAE8] flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-semibold text-[#787774]">{c.name.split(' ').map((n) => n[0]).join('')}</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white rounded-full"><PresenceDot status={c.status} size="sm" /></span>
                </div>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium text-[#37352F] truncate">{c.name}</p>
                  <p className="text-[11.5px] text-[#9B9A97] truncate">{c.email}</p>
                </div>
              </div>
              <span><span className={cn('px-2 py-0.5 rounded text-[11.5px] font-medium', roleMeta[c.role])}>{c.role}</span></span>
              <span className="text-right text-[13px] text-[#37352F] tabular-nums">{c.callsToday}</span>
              <span className="text-right text-[13px] text-[#37352F] tabular-nums">{c.queriesResolved}</span>
              <span className="text-right text-[13px] text-[#37352F] tabular-nums">{c.csat || '—'}</span>
              <span className="text-right text-[12px] text-[#9B9A97]">{fmtDate(c.onboardedAt)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Onboard modal ───────────────────────────────────────── */}
      {onboarding && (
        <>
          <div className="fixed inset-0 bg-[#37352F]/25 z-40" onClick={() => setOnboarding(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] bg-white rounded-2xl border border-[#E9E9E7] z-50 shadow-[0_16px_48px_rgba(15,15,15,0.18)]">
            <div className="px-5 py-4 border-b border-[#EFEEEC] flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-[#37352F]">Onboard a new CSR</h2>
              <button onClick={() => setOnboarding(false)} className="w-7 h-7 rounded-md hover:bg-[#F1F0EE] flex items-center justify-center text-[#9B9A97]"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-5 py-4 space-y-3.5">
              <Field label="Full name">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Jordan Lee" className={inputCls} />
              </Field>
              <Field label="Work email">
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@lakesidecu.org" className={inputCls} />
              </Field>
              <Field label="Role">
                <div className="flex gap-1.5">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      onClick={() => setForm({ ...form, role: r })}
                      className={cn('px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium border transition-colors',
                        form.role === r ? 'bg-[#37352F] text-white border-[#37352F]' : 'bg-white text-[#787774] border-[#E9E9E7] hover:bg-[#F7F6F5]')}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Short bio (optional)">
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Background, focus area, languages…" className={cn(inputCls, 'h-20 resize-none')} />
              </Field>
            </div>
            <div className="px-5 py-4 border-t border-[#EFEEEC] flex items-center justify-end gap-2">
              <button onClick={() => setOnboarding(false)} className="px-3.5 py-2 rounded-lg text-[13px] font-medium text-[#787774] hover:bg-[#F1F0EE]">Cancel</button>
              <button onClick={onboard} disabled={!form.name.trim() || !form.email.trim()} className="px-3.5 py-2 rounded-lg bg-[#37352F] text-white text-[13px] font-medium hover:bg-[#2A2925] disabled:opacity-40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Add to team
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── CSR bio drawer ──────────────────────────────────────── */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-[#37352F]/20 z-40" onClick={() => setSelected(null)} />
          <div className="fixed top-0 right-0 h-screen w-[480px] bg-white border-l border-[#E9E9E7] z-50 flex flex-col shadow-[0_0_48px_rgba(15,15,15,0.12)]">
            <div className="px-5 py-4 border-b border-[#EFEEEC] flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-[#EAEAE8] flex items-center justify-center">
                    <span className="text-[14px] font-semibold text-[#787774]">{selected.name.split(' ').map((n) => n[0]).join('')}</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white rounded-full"><PresenceDot status={selected.status} /></span>
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-[#37352F] leading-tight">{selected.name}</h2>
                  <p className="text-[12.5px] text-[#9B9A97]">{PRESENCE_META[selected.status].label} · {selected.tenure} at Lakeside</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-md hover:bg-[#F1F0EE] flex items-center justify-center text-[#9B9A97]"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* identity */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn('px-2 py-0.5 rounded text-[11.5px] font-medium', roleMeta[selected.role])}>{selected.role}</span>
                <span className="inline-flex items-center gap-1.5 text-[12.5px] text-[#787774]"><Mail className="w-3.5 h-3.5 text-[#9B9A97]" /> {selected.email}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[12.5px] text-[#787774]"><Calendar className="w-3.5 h-3.5 text-[#9B9A97]" /> Onboarded {fmtDate(selected.onboardedAt)}</div>

              {/* bio */}
              <div>
                <p className="text-[11px] font-semibold text-[#9B9A97] uppercase tracking-wide mb-1.5">Bio</p>
                <p className="text-[13.5px] text-[#37352F] leading-relaxed">{selected.bio}</p>
              </div>

              {/* activity */}
              <div>
                <p className="text-[11px] font-semibold text-[#9B9A97] uppercase tracking-wide mb-2">Today’s activity</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { icon: Phone, label: 'Calls taken', value: selected.callsToday },
                    { icon: CheckCircle2, label: 'Queries resolved', value: selected.queriesResolved },
                    { icon: Clock, label: 'Avg handle', value: selected.avgHandleMinutes ? `${selected.avgHandleMinutes}m` : '—' },
                    { icon: Star, label: 'CSAT', value: selected.csat || '—' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg border border-[#E9E9E7] bg-[#FBFBFA] p-3">
                      <div className="flex items-center gap-1.5 text-[#9B9A97]"><s.icon className="w-3.5 h-3.5" /><span className="text-[11.5px]">{s.label}</span></div>
                      <p className="text-[18px] font-semibold text-[#37352F] tabular-nums mt-1.5">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* permissions */}
              <div>
                <p className="text-[11px] font-semibold text-[#9B9A97] uppercase tracking-wide mb-2">Access (role-based)</p>
                <div className="rounded-lg border border-[#E9E9E7] divide-y divide-[#EFEEEC]">
                  {[
                    { label: 'Handle chats & callbacks', on: true },
                    { label: 'Join live escalations', on: true },
                    { label: 'Manage Knowledge Base', on: selected.role !== 'CSR' },
                    { label: 'Approve wires & refunds', on: selected.role === 'Team Lead' || selected.role === 'Admin' },
                    { label: 'Admin portal & onboarding', on: selected.role === 'Admin' || selected.role === 'Team Lead' },
                  ].map((p) => (
                    <div key={p.label} className="flex items-center gap-2 px-3 py-2 text-[13px]">
                      <Shield className={cn('w-3.5 h-3.5', p.on ? 'text-[#4F7A4A]' : 'text-[#C7C6C2]')} />
                      <span className={p.on ? 'text-[#37352F]' : 'text-[#9B9A97] line-through'}>{p.label}</span>
                      {p.on && <CheckCircle2 className="w-3.5 h-3.5 text-[#4F7A4A] ml-auto" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const inputCls =
  'w-full h-9 px-3 rounded-lg border border-[#E9E9E7] bg-white text-[13px] text-[#37352F] placeholder:text-[#9B9A97] focus:outline-none focus:ring-2 focus:ring-[#37352F]/10 focus:border-[#D6D5D2]'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-[#787774] mb-1.5">{label}</label>
      {children}
    </div>
  )
}
