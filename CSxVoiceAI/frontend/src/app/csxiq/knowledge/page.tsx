'use client'

import { useState } from 'react'
import { KNOWLEDGE, type KbDoc, type KbDocType } from '@/lib/csxiq-data'
import {
  BookOpen,
  Upload,
  FileText,
  Search,
  Sparkles,
  CheckCircle2,
  Loader2,
  Trash2,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const typeMeta: Record<KbDocType, string> = {
  SOP: 'bg-[#EDF3EC] text-[#4F7A4A]',
  Policy: 'bg-[#F4ECF7] text-[#8A5C9E]',
  FAQ: 'bg-[#E9F1F7] text-[#487CA5]',
  Product: 'bg-[#FBF3DB] text-[#9B7B2E]',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function KnowledgePage() {
  const [docs] = useState<KbDoc[]>(KNOWLEDGE)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | KbDocType>('all')

  const filtered = docs.filter((d) => {
    if (typeFilter !== 'all' && d.type !== typeFilter) return false
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const indexed = docs.filter((d) => d.status === 'indexed').length
  const citedToday = docs.reduce((n, d) => n + d.usedToday, 0)

  return (
    <div className="h-screen overflow-y-auto">
      <div className="max-w-5xl mx-auto px-10 py-9">
        {/* Page header — Notion style */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F1F0EE] flex items-center justify-center text-[#787774]">
            <BookOpen className="w-[18px] h-[18px]" />
          </div>
          <div className="flex-1">
            <h1 className="text-[28px] font-bold text-[#37352F] tracking-tight leading-tight">Knowledge Base</h1>
            <p className="text-[#787774] text-[14px] mt-1">
              Drop in your SOPs, policies, and FAQs. The Copilot retrieves from these to suggest answers inside every chat.
            </p>
          </div>
        </div>

        {/* Inline meta line */}
        <div className="flex items-center gap-5 mt-5 text-[13px] text-[#787774]">
          <span><span className="text-[#37352F] font-semibold tabular-nums">{docs.length}</span> documents</span>
          <span className="text-[#E9E9E7]">·</span>
          <span><span className="text-[#37352F] font-semibold tabular-nums">{indexed}</span> indexed</span>
          <span className="text-[#E9E9E7]">·</span>
          <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-[#9B9A97]" /> cited <span className="text-[#37352F] font-semibold tabular-nums">{citedToday}</span> times today</span>
        </div>

        {/* Upload dropzone */}
        <button className="w-full mt-5 rounded-xl border border-dashed border-[#D6D5D2] bg-[#FBFBFA] hover:bg-[#F7F6F5] transition-colors px-5 py-6 flex items-center justify-center gap-3 text-[#787774]">
          <Upload className="w-4 h-4" />
          <span className="text-[13.5px]">Drag SOP / policy files here, or <span className="text-[#37352F] font-medium underline underline-offset-2">browse</span></span>
          <span className="text-[12px] text-[#9B9A97]">PDF, DOCX · up to 25 MB</span>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-2 mt-6">
          <div className="flex items-center bg-[#F7F6F5] rounded-lg p-0.5">
            {(['all', 'SOP', 'Policy', 'FAQ', 'Product'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn('px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors capitalize',
                  typeFilter === t ? 'bg-white text-[#37352F] shadow-sm' : 'text-[#787774] hover:text-[#37352F]')}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>
          <div className="relative ml-auto w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9A97]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E9E9E7] bg-white text-[13px] text-[#37352F] placeholder:text-[#9B9A97] focus:outline-none focus:ring-2 focus:ring-[#37352F]/10 focus:border-[#D6D5D2]"
            />
          </div>
        </div>

        {/* Document list — Notion database rows */}
        <div className="mt-3 border-t border-[#E9E9E7]">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="group flex items-center gap-3 px-2 py-2.5 border-b border-[#EFEEEC] hover:bg-[#F7F6F5] rounded-md transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-md bg-white border border-[#E9E9E7] flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-[#9B9A97]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-[#37352F] truncate">{d.title}</p>
                <p className="text-[12px] text-[#9B9A97]">{d.format} · {d.sizeLabel} · {d.uploadedBy} · {fmtDate(d.updatedAt)}</p>
              </div>
              <span className={cn('px-2 py-0.5 rounded text-[11.5px] font-medium', typeMeta[d.type])}>{d.type}</span>
              <div className="w-28 text-right">
                {d.status === 'indexed' ? (
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-[#4F7A4A]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {d.chunks} chunks
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-[#9B7B2E]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Indexing…
                  </span>
                )}
              </div>
              <div className="w-16 text-right text-[12px] text-[#9B9A97] tabular-nums">{d.usedToday}× today</div>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-7 h-7 rounded-md hover:bg-[#EAEAE8] flex items-center justify-center text-[#9B9A97]"><MoreHorizontal className="w-4 h-4" /></button>
                <button className="w-7 h-7 rounded-md hover:bg-[#F4E9E9] flex items-center justify-center text-[#B0726F]"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-2 py-10 text-center text-[13px] text-[#9B9A97]">No documents match these filters.</p>
          )}
        </div>
      </div>
    </div>
  )
}
