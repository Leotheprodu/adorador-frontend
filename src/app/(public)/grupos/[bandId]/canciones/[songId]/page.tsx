import { SongIdMainPage } from './_components/SongIdMainPage';

export default function SongsById({
  params,
}: {
  params: { bandId: string; songId: string };
}) {
  return (
    <main className="flex flex-col items-center p-8 pb-20 sm:p-20">
      <SongIdMainPage params={params} />
    </main>
  );
}
