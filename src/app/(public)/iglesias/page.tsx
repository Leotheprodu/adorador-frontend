import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iglesias',
  description: 'Iglesias que se encuentran en la base de datos',
};
export default function Churches() {
  return (
    <div className="flex h-screen flex-col items-center p-8 pb-20 sm:p-20">
      Iglesias
    </div>
  );
}
