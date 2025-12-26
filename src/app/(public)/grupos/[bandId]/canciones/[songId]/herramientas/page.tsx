import { SongToolsEditor } from './_components/SongToolsEditor';

export default async function SongToolsPage({
  params,
}: {
  params: Promise<{ bandId: string; songId: string }>;
}) {
  const { bandId, songId } = await params;

  return <SongToolsEditor bandId={bandId} songId={songId} />;
}
