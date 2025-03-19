import ProjectsKnowledgeView from '@/src/features/projects/ui/views/ProjectKnowledgeContributionsView/ProjectsKnowledgeView';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return <ProjectsKnowledgeView id={id} />;
}
