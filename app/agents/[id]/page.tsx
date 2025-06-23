import { AgentDetail } from "@/components/agent-detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AgentDetailPage({ params }: PageProps) {
  const { id } = await params
  return <AgentDetail agentId={id} />
}
