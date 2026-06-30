'use client'

import { ADMIN_METRICS, CSRS } from '@/lib/csxiq-data'
import { Users, Phone, CheckCircle2, Star, UserCheck, ArrowRight } from 'lucide-react'
import PresenceDot from '@/components/PresenceDot'
import Link from 'next/link'

export default function AdminOverview() {
  const m = ADMIN_METRICS
  const maxCalls = Math.max(...m.history.map((d) => d.calls))

  const cards = [
    { label: 'CSRs onboarded', value: m.csrsOnboarded, sub: `${m.activeNow} active now`, icon: Users },
    { label: 'Calls taken today', value: m.callsToday, sub: 'across all reps', icon: Phone },
    { label: 'Queries resolved today', value: m.queriesResolvedToday, sub: `${Math.round((m.queriesResolvedToday / m.callsToday) * 100)}% of calls`, icon: CheckCircle2 },
    { label: 'Avg CSAT', value: m.avgCsat, sub: 'out of 5.0', icon: Star },
  ]

  return (
    <div className="h-screen overflow-y-auto">
      <div className="max-w-5xl mx-auto px-10 py-9">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F1F0EE] flex items-center justify-center text-[#787774]">
            <UserCheck className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h1 className="text-[28px] font-bold text-[#37352F] tracking-tight leading-tight">Admin Overview</h1>
            <p className="text-[#787774] text-[14px] mt-1">Manage your support team and watch the desk at a glance.</p>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-3 mt-7">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl border border-[#E9E9E7] bg-white p-4">
              <div className="flex items-center gap-2 text-[#9B9A97]">
                <c.icon className="w-4 h-4" />
                <span className="text-[12px] font-medium text-[#787774]">{c.label}</span>
              </div>
              <p className="text-[28px] font-bold text-[#37352F] tabular-nums leading-none mt-3">{c.value}</p>
              <p className="text-[12px] text-[#9B9A97] mt-1.5">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* History glimpse */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#37352F]">Last 7 days</h2>
            <span className="text-[12px] text-[#9B9A97]">Calls handled · queries resolved</span>
          </div>
          <div className="mt-4 rounded-xl border border-[#E9E9E7] bg-white p-5">
            <div className="flex items-end justify-between gap-3 h-44">
              {m.history.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <div className="w-1/2 rounded-t-md bg-[#37352F]" style={{ height: `${(d.calls / maxCalls) * 100}%` }} title={`${d.calls} calls`} />
                    <div className="w-1/2 rounded-t-md bg-[#D9D8D4]" style={{ height: `${(d.resolved / maxCalls) * 100}%` }} title={`${d.resolved} resolved`} />
                  </div>
                  <span className="text-[11px] text-[#9B9A97]">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#EFEEEC]">
              <span className="flex items-center gap-1.5 text-[12px] text-[#787774]"><span className="w-2.5 h-2.5 rounded-sm bg-[#37352F]" /> Calls handled</span>
              <span className="flex items-center gap-1.5 text-[12px] text-[#787774]"><span className="w-2.5 h-2.5 rounded-sm bg-[#D9D8D4]" /> Queries resolved</span>
            </div>
          </div>
        </div>

        {/* Team snapshot */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#37352F]">Team right now</h2>
            <Link href="/admin/csrs" className="text-[12.5px] text-[#787774] hover:text-[#37352F] flex items-center gap-1">
              Manage CSRs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="mt-3 rounded-xl border border-[#E9E9E7] bg-white overflow-hidden">
            {CSRS.map((c, i) => (
              <Link
                key={c.id}
                href="/admin/csrs"
                className={cn('flex items-center gap-3 px-4 py-3 hover:bg-[#F7F6F5] transition-colors', i > 0 && 'border-t border-[#EFEEEC]')}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#EAEAE8] flex items-center justify-center">
                    <span className="text-[11px] font-semibold text-[#787774]">{c.name.split(' ').map((n) => n[0]).join('')}</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white rounded-full"><PresenceDot status={c.status} size="sm" /></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-medium text-[#37352F]">{c.name}</p>
                  <p className="text-[11.5px] text-[#9B9A97]">{c.role}</p>
                </div>
                <div className="text-right w-20"><p className="text-[13px] font-semibold text-[#37352F] tabular-nums">{c.callsToday}</p><p className="text-[11px] text-[#9B9A97]">calls</p></div>
                <div className="text-right w-20"><p className="text-[13px] font-semibold text-[#37352F] tabular-nums">{c.queriesResolved}</p><p className="text-[11px] text-[#9B9A97]">resolved</p></div>
                <div className="text-right w-16"><p className="text-[13px] font-semibold text-[#37352F] tabular-nums">{c.csat}</p><p className="text-[11px] text-[#9B9A97]">CSAT</p></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(' ')
}
