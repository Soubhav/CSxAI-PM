'use client'

import { TEST_CASES, TEST_SUITE_RUNS, SCENARIO_LABELS } from '@/lib/mock-data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Play, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const passRate = TEST_SUITE_RUNS.map((r) => ({
  date: r.runDate,
  rate: Math.round((r.passed / r.totalCases) * 100),
  passed: r.passed,
  failed: r.failed,
}))

export default function EvaluationsPage() {
  const totalCases = TEST_CASES.length
  const passing = TEST_CASES.filter((t) => t.status === 'pass').length
  const failing = TEST_CASES.filter((t) => t.status === 'fail').length
  const currentRate = Math.round((passing / totalCases) * 100)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Evaluations</h1>
          <p className="text-muted-foreground mt-1 text-sm">Test suite results and agent quality tracking</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Play className="w-4 h-4" /> Run All Tests
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Total Test Cases</p>
          <p className="text-2xl font-bold text-foreground">{totalCases}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Passing</p>
          <p className="text-2xl font-bold text-emerald-400">{passing}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Failing</p>
          <p className="text-2xl font-bold text-red-400">{failing}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Pass Rate</p>
          <p className={cn('text-2xl font-bold', currentRate >= 80 ? 'text-emerald-400' : currentRate >= 60 ? 'text-amber-400' : 'text-red-400')}>{currentRate}%</p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <p className="text-sm font-semibold text-foreground mb-4">Pass Rate Trend</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={passRate}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} formatter={(v) => [`${v}%`, 'Pass Rate']} />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
              {passRate.map((entry, i) => (
                <Cell key={i} fill={entry.rate >= 80 ? '#34d399' : entry.rate >= 60 ? '#fbbf24' : '#f87171'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Test Cases Table */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-foreground mb-3">Test Cases</p>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/40 border-b border-border/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Test</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Scenario</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Input</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Expected</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actual</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Last Run</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {TEST_CASES.map((tc) => (
                <tr key={tc.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{tc.name}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{SCENARIO_LABELS[tc.scenario]}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground italic max-w-[150px] truncate">&ldquo;{tc.input}&rdquo;</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[150px]">{tc.expectedOutcome}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[150px]">{tc.actualOutcome}</td>
                  <td className="px-4 py-3">
                    {tc.status === 'pass' ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium"><CheckCircle className="w-3.5 h-3.5" /> Pass</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-400 font-medium"><XCircle className="w-3.5 h-3.5" /> Fail</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{tc.lastRun}</td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                      <Play className="w-3 h-3" /> Run
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Suite Runs */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">Recent Test Runs</p>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/40 border-b border-border/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Cases</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Passed</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Failed</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Pass Rate</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Duration</th>
              </tr>
            </thead>
            <tbody>
              {TEST_SUITE_RUNS.map((run) => {
                const rate = Math.round((run.passed / run.totalCases) * 100)
                return (
                  <tr key={run.id} className="border-b border-border/50">
                    <td className="px-4 py-3 text-sm text-foreground">{run.runDate}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{run.totalCases}</td>
                    <td className="px-4 py-3 text-sm text-emerald-400 font-medium">{run.passed}</td>
                    <td className="px-4 py-3 text-sm text-red-400 font-medium">{run.failed}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${rate}%` }} />
                        </div>
                        <span className="text-xs text-foreground font-medium">{rate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{run.duration}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
