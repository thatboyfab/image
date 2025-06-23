import { SubgoalDetail } from "@/components/subgoal-detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SubgoalDetailPage({ params }: PageProps) {
  const { id } = await params
  return <SubgoalDetail subgoalId={id} />
}
