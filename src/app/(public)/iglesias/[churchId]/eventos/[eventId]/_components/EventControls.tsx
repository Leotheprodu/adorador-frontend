import { EventSongsProps } from '../../_interfaces/eventsInterface';

export const EventControls = ({ songs }: { songs: EventSongsProps[] }) => {
  return (
    <section className="flex h-full w-full items-center justify-center">
      <div>
        <h4>Canciones</h4>
        <div className="flex flex-col justify-center gap-2">
          {songs &&
            songs.length > 0 &&
            songs.map((song) => (
              <div key={song.id}>
                <p>{song.title}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
