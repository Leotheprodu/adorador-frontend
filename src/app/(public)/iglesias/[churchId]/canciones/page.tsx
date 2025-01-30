import { SongsOfChurch } from './_components/SongsOfChurch';

export default function Songs({ params }: { params: { churchId: string } }) {
  return (
    <div className="flex h-full flex-col items-center p-8 pb-20 sm:p-20">
      <SongsOfChurch params={params} />
    </div>
  );
}
