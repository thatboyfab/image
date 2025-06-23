import { MissionDetail } from "@/components/mission-detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MissionDetailPage({ params }: PageProps) {
  const { id } = await params
  return <MissionDetail missionId={id} />
}
