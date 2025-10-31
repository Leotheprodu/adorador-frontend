import { Input, Select, SelectItem } from '@nextui-org/react';
import { handleOnClear } from '@global/utils/formUtils';
import { songKeys } from '@global/config/constants';
import { SongPropsWithoutId } from '@bands/[bandId]/canciones/_interfaces/songsInterface';
export const FormAddNewSong = ({ form, setForm, handleChange }) => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-1">
        <Input
          onChange={handleChange}
          value={form.title}
          name="title"
          type="text"
          placeholder="Nombre de la canción"
          isClearable
          onClear={() => handleOnClear('title', setForm)}
        />
        <Input
          onChange={handleChange}
          value={form.artist}
          name="artist"
          type="text"
          placeholder="Artista"
          isClearable
          onClear={() => handleOnClear('artist', setForm)}
        />
        <Select
          label="Tipo de canción"
          selectedKeys={form.songType ? [form.songType] : []}
          onSelectionChange={(e) => {
            const selectedValue = Array.from(e).join('');

            setForm((prev) => ({
              ...prev,
              songType: selectedValue as SongPropsWithoutId['songType'],
            }));
          }}
        >
          <SelectItem key="praise">Alabanza</SelectItem>
          <SelectItem key="worship">Adoración</SelectItem>
        </Select>
        <Select
          label="Tonalidad"
          selectedKeys={form.key ? [form.key] : []}
          onSelectionChange={(e) => {
            const selectedValue = Array.from(e).join('');

            setForm((prev) => ({
              ...prev,
              key: selectedValue,
            }));
          }}
        >
          {songKeys.map((key) => (
            <SelectItem key={key}>{key}</SelectItem>
          ))}
        </Select>
        <Input
          onChange={(e) => {
            setForm((prev) => ({
              ...prev,
              tempo: parseInt(e.target.value),
            }));
          }}
          value={form.tempo === 0 ? '' : form.tempo?.toString()}
          name="tempo"
          type="number"
          placeholder="Tempo"
          isClearable
          onClear={() => handleOnClear('tempo', setForm)}
          endContent={<span className="text-small text-slate-500">bpm</span>}
        />
        <Input
          onChange={handleChange}
          value={form.youtubeLink}
          name="youtubeLink"
          type="text"
          placeholder="Link de YouTube"
          isClearable
          onClear={() => handleOnClear('youtubeLink', setForm)}
        />
      </div>
    </div>
  );
};
