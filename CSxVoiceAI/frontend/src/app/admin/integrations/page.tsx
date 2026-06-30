'use client'

import Link from 'next/link'
import { INTEGRATIONS } from '@/lib/csxiq-data'
import { Plug, CheckCircle2, Circle, ChevronRight } from 'lucide-react'
import { channelMeta } from '@/components/IntegrationDetail'
import { cn } from '@/lib/utils'

export default function IntegrationsHub() {
  const connected = INTEGRATIONS.filter((i) => i.status === 'connected').length

  return (
    <div className="h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto px-10 py-9">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F1F0EE] flex items-center justify-center text-[#787774]">
            <Plug className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h1 className="text-[28px] font-bold text-[#37352F] tracking-tight leading-tight">Integrations</h1>
            <p className="text-[#787774] text-[14px] mt-1">
              Connect the channels members reach you on. Each one feeds the same omnichannel inbox.
            </p>
          </div>
        </div>

        <p className="text-[13px] text-[#787774] mt-5">
          <span className="text-[#37352F] font-semibold">{connected}</span> of {INTEGRATIONS.length} channels connected
        </p>

        {/* Channel cards */}
        <div className="mt-4 space-y-2.5">
          {INTEGRATIONS.map((i) => {
            const meta = channelMeta[i.channel]
            const Icon = meta.icon
            const isOn = i.status === 'connected'
            return (
              <Link
                key={i.channel}
                href={`/admin/integrations/${i.channel}`}
                className="group flex items-center gap-4 rounded-xl border border-[#E9E9E7] bg-white p-4 hover:bg-[#FBFBFA] hover:border-[#D6D5D2] transition-colors"
              >
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center ring-1', meta.tint, meta.ring)}>
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-semibold text-[#37352F]">{i.name}</p>
                    <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium',
                      isOn ? 'bg-[#EDF3EC] text-[#4F7A4A]' : 'bg-[#F1F0EE] text-[#787774]')}>
                      {isOn ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      {isOn ? 'Connected' : 'Not connected'}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-[#787774] mt-0.5 truncate">{i.provider} · {i.blurb}</p>
                </div>
                <span className="text-[12.5px] text-[#787774] group-hover:text-[#37352F] flex items-center gap-0.5 flex-shrink-0">
                  {isOn ? 'Manage' : 'Set up'} <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            )
          })}
        </div>

        <p className="text-[12px] text-[#9B9A97] mt-5">
          The connection flow isn’t finalized — these screens document how each integration works so we can decide the wiring.
        </p>
      </div>
    </div>
  )
}
