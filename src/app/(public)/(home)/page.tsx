import { Metadata } from 'next';
import { ChurchesShowCase } from '@home/_components/ChurchesShowCase';

export const metadata: Metadata = {
  title: 'Inicio',
};
export default function Home() {
  return (
    <div className="flex h-full flex-col items-center p-8 pb-20 sm:p-20">
      <ChurchesShowCase />
    </div>
  );
}
