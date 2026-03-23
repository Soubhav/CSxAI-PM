'use client'

import { useState } from 'react'
import { KNOWLEDGE_DOCS, SCENARIO_LABELS } from '@/lib/mock-data'
import { Search, Upload, FileText, File, BookOpen, ScrollText } from 'lucide-react'
import { cn } from '@/lib/utils'

const typeIcon = {
  pdf: FileText,
  faq: BookOpen,
  'rate-sheet': ScrollText,
  policy: File,
}

const typeLabel = {
  pdf: 'PDF',
  faq: 'FAQ',
  'rate-sheet': 'Rate Sheet',
  policy: 'Policy',
}

export default function KnowledgePage() {
  const [search, setSearch] = useState('')
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)

  const filtered = KNOWLEDGE_DOCS.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.excerpt.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1 text-sm">Upload and manage documents for AI agent retrieval</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center mb-6 hover:border-primary/30 transition-colors cursor-pointer">
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-foreground font-medium">Drag files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOCX, TXT, and CSV files up to 25MB</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Total Documents</p>
          <p className="text-2xl font-bold text-foreground">{KNOWLEDGE_DOCS.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Linked to Scenarios</p>
          <p className="text-2xl font-bold text-emerald-400">{KNOWLEDGE_DOCS.filter((d) => d.linkedScenarios.length > 0).length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Unlinked</p>
          <p className="text-2xl font-bold text-amber-400">{KNOWLEDGE_DOCS.filter((d) => d.linkedScenarios.length === 0).length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Document Types</p>
          <p className="text-2xl font-bold text-foreground">{new Set(KNOWLEDGE_DOCS.map((d) => d.type)).size}</p>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {filtered.map((doc) => {
          const Icon = typeIcon[doc.type]
          const isExpanded = selectedDoc === doc.id
          return (
            <div key={doc.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setSelectedDoc(isExpanded ? null : doc.id)}
                className="w-full text-left px-5 py-4 hover:bg-accent/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{doc.title}</p>
                      <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full border border-border">{typeLabel[doc.type]}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground/60">{doc.fileSize}</span>
                      <span className="text-xs text-muted-foreground/60">Updated {doc.lastUpdated}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {doc.linkedScenarios.length > 0 ? (
                        doc.linkedScenarios.map((s) => (
                          <span key={s} className="text-xs bg-primary/10 text-primary border border-primary/25 px-2 py-0.5 rounded-full">{SCENARIO_LABELS[s]}</span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground/50 italic">Not linked to any scenario</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
              {isExpanded && (
                <div className="px-5 pb-4 pt-0 border-t border-border mt-0">
                  <div className="pt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Content Preview</p>
                    <p className="text-sm text-muted-foreground leading-relaxed bg-secondary border border-border rounded-lg p-3">{doc.excerpt}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button className="text-xs text-primary font-medium hover:underline">Edit linked scenarios</button>
                      <button className="text-xs text-muted-foreground hover:text-foreground">Re-upload</button>
                      <button className="text-xs text-red-400 hover:text-red-300">Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
