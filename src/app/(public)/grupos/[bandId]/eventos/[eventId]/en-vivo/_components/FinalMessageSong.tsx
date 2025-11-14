import { worshipVerses } from '@global/config/constants';

export const FinalMessageSong = () => {
  const verse = worshipVerses[Math.floor(Math.random() * worshipVerses.length)];
  return (
    <div className="font-kalam">
      <div
        key={verse.message}
        className="flex flex-col items-center justify-center"
      >
        <p className="text-center text-2xl md:text-4xl lg:text-5xl">
          {verse.message}
        </p>
        <p>
          <em className="text-lg md:text-xl lg:text-2xl">{verse.source}</em>
        </p>
      </div>
    </div>
  );
};
