'use client'

import Link from 'next/link'
import { INTEGRATIONS, type IntegrationChannel } from '@/lib/csxiq-data'
import {
  MessageCircle,
  Smartphone,
  Mail,
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Copy,
  Plug,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const channelMeta: Record<IntegrationChannel, { icon: any; tint: string; ring: string }> = {
  whatsapp: { icon: MessageCircle, tint: 'bg-[#EDF3EC] text-[#4F7A4A]', ring: 'ring-[#CFE3CD]' },
  sms: { icon: Smartphone, tint: 'bg-[#E9F1F7] text-[#487CA5]', ring: 'ring-[#CFE0EC]' },
  email: { icon: Mail, tint: 'bg-[#FBF3DB] text-[#9B7B2E]', ring: 'ring-[#ECE1C0]' },
}

export default function IntegrationDetail({ channel }: { channel: IntegrationChannel }) {
  const integ = INTEGRATIONS.find((i) => i.channel === channel)!
  const meta = channelMeta[channel]
  const Icon = meta.icon
  const connected = integ.status === 'connected'

  return (
    <div className="h-screen overflow-y-auto">
      <div className="max-w-3xl mx-auto px-10 py-9">
        <Link href="/admin/integrations" className="inline-flex items-center gap-1.5 text-[12.5px] text-[#787774] hover:text-[#37352F] mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> Integrations
        </Link>

        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center ring-1', meta.tint, meta.ring)}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-[26px] font-bold text-[#37352F] tracking-tight leading-tight">{integ.name}</h1>
            <p className="text-[#787774] text-[13.5px] mt-0.5">{integ.provider}</p>
          </div>
          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium',
            connected ? 'bg-[#EDF3EC] text-[#4F7A4A]' : 'bg-[#F1F0EE] text-[#787774]')}>
            {connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
            {connected ? 'Connected' : 'Not connected'}
          </span>
        </div>

        <p className="text-[14px] text-[#4B4A45] mt-4">{integ.blurb}</p>
        {connected && integ.connectedAccount && (
          <p className="text-[12.5px] text-[#787774] mt-1.5">Connected: <span className="text-[#37352F] font-medium">{integ.connectedAccount}</span></p>
        )}

        {/* Inbound / outbound flow */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="rounded-xl border border-[#E9E9E7] bg-white p-4">
            <div className="flex items-center gap-1.5 text-[#4F7A4A] mb-1.5">
              <ArrowDownLeft className="w-4 h-4" /><span className="text-[12px] font-semibold uppercase tracking-wide">Inbound</span>
            </div>
            <p className="text-[13px] text-[#5F5E5B] leading-relaxed">{integ.inbound}</p>
          </div>
          <div className="rounded-xl border border-[#E9E9E7] bg-white p-4">
            <div className="flex items-center gap-1.5 text-[#487CA5] mb-1.5">
              <ArrowUpRight className="w-4 h-4" /><span className="text-[12px] font-semibold uppercase tracking-wide">Outbound</span>
            </div>
            <p className="text-[13px] text-[#5F5E5B] leading-relaxed">{integ.outbound}</p>
          </div>
        </div>

        {/* How it works */}
        <h2 className="text-[15px] font-semibold text-[#37352F] mt-8 mb-3">How it works</h2>
        <div className="space-y-0">
          {integ.howItWorks.map((s, i) => (
            <div key={i} className="flex gap-3 pb-4 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#37352F] text-white text-[12px] font-semibold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                {i < integ.howItWorks.length - 1 && <div className="w-px flex-1 bg-[#E9E9E7] my-1" />}
              </div>
              <div className="pb-1">
                <p className="text-[13.5px] font-medium text-[#37352F]">{s.title}</p>
                <p className="text-[13px] text-[#787774] leading-relaxed mt-0.5">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Prerequisites */}
        <h2 className="text-[15px] font-semibold text-[#37352F] mt-7 mb-2.5">Prerequisites</h2>
        <div className="rounded-xl border border-[#E9E9E7] bg-[#FBFBFA] divide-y divide-[#EFEEEC]">
          {integ.prerequisites.map((p) => (
            <div key={p} className="flex items-start gap-2 px-4 py-2.5 text-[13px] text-[#4B4A45]">
              <CheckCircle2 className="w-4 h-4 text-[#9B9A97] mt-px flex-shrink-0" /> {p}
            </div>
          ))}
        </div>

        {/* Connection form */}
        <h2 className="text-[15px] font-semibold text-[#37352F] mt-7 mb-2.5">Connection</h2>
        <div className="rounded-xl border border-[#E9E9E7] bg-white p-4 space-y-3.5">
          {integ.fields.map((f) => (
            <div key={f.label}>
              <label className="block text-[12px] font-medium text-[#787774] mb-1.5">{f.label}</label>
              <input
                type={f.secret ? 'password' : 'text'}
                placeholder={f.placeholder}
                defaultValue={f.value}
                className="w-full h-9 px-3 rounded-lg border border-[#E9E9E7] bg-white text-[13px] text-[#37352F] placeholder:text-[#9B9A97] focus:outline-none focus:ring-2 focus:ring-[#37352F]/10 focus:border-[#D6D5D2]"
              />
            </div>
          ))}

          {/* Webhook */}
          <div>
            <label className="block text-[12px] font-medium text-[#787774] mb-1.5">Inbound webhook URL (set this in {integ.provider.split(' ')[0]})</label>
            <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#E9E9E7] bg-[#F7F6F5]">
              <code className="flex-1 text-[12.5px] text-[#37352F] truncate font-mono">{integ.webhookUrl}</code>
              <button className="text-[#9B9A97] hover:text-[#37352F]"><Copy className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button className="px-3.5 py-2 rounded-lg bg-[#37352F] text-white text-[13px] font-medium hover:bg-[#2A2925] flex items-center gap-2">
              <Plug className="w-4 h-4" /> {connected ? 'Reconnect' : 'Connect'}
            </button>
            <button className="px-3.5 py-2 rounded-lg border border-[#E9E9E7] text-[13px] font-medium text-[#787774] hover:bg-[#F7F6F5]">Send test message</button>
          </div>
        </div>

        {/* Notes */}
        {integ.notes.length > 0 && (
          <div className="mt-5 rounded-xl bg-[#F7F6F5] border border-[#E9E9E7] p-4">
            <div className="flex items-center gap-1.5 text-[#787774] mb-1.5"><Info className="w-3.5 h-3.5" /><span className="text-[12px] font-semibold uppercase tracking-wide">Good to know</span></div>
            <ul className="space-y-1">
              {integ.notes.map((n) => (
                <li key={n} className="text-[12.5px] text-[#5F5E5B] flex gap-2"><span className="text-[#C7C6C2]">•</span> {n}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="h-10" />
      </div>
    </div>
  )
}
