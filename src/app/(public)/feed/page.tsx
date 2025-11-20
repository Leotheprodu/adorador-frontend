import { Metadata } from 'next';
import { FeedClient } from './_components/FeedClient';

export const metadata: Metadata = {
  title: 'Feed Social - zamr',
  description:
    'Comparte y descubre canciones con otros grupos de alabanza. Pide canciones y bendice las compartidas por la comunidad.',
};

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="px-4 py-12 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100 sm:text-5xl">
            Feed <span className="text-gradient-simple">Social</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Comparte canciones y bendice a otros grupos de alabanza
          </p>
        </div>

        {/* Feed Content */}
        <FeedClient />
      </div>
    </div>
  );
}
