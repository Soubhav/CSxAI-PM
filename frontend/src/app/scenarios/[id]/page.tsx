import { AGENTS } from '@/lib/mock-data'
import AgentCanvasPage from './client-page'

export function generateStaticParams() {
  return AGENTS.map((agent) => ({ id: agent.id }))
}

export default function Page() {
  return <AgentCanvasPage />
}
