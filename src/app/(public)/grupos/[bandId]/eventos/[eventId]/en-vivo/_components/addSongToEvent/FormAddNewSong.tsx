import { Input, Select, SelectItem } from '@nextui-org/react';
import {
  handleOnClear,
  extractYouTubeId,
  isValidYouTubeId,
} from '@global/utils/formUtils';
import { songKeys } from '@global/config/constants';
import { SongPropsWithoutId } from '@bands/[bandId]/canciones/_interfaces/songsInterface';
import { MicrophoneIcon, MusicNoteIcon } from '@global/icons';

export const FormAddNewSong = ({ form, setForm, handleChange }) => {
  const handleYouTubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const videoId = extractYouTubeId(inputValue);

    setForm((prev) => ({
      ...prev,
      youtubeLink: videoId,
    }));
  };
  return (
    <div className="flex justify-center">
      <div className="flex w-full flex-col gap-2.5">
        <Input
          onChange={handleChange}
          value={form.title}
          name="title"
          type="text"
          label="Título de la canción"
          placeholder="Ej: Amazing Grace"
          isClearable
          onClear={() => handleOnClear('title', setForm)}
          isRequired
          size="sm"
          classNames={{
            label: 'font-semibold text-slate-700 text-xs',
            input: 'text-slate-800 text-sm',
            inputWrapper:
              'border-2 border-slate-200 hover:border-brand-purple-300 focus-within:border-brand-purple-600 transition-colors',
          }}
          startContent={<MusicNoteIcon className="h-4 w-4 text-slate-400" />}
        />
        <Input
          onChange={handleChange}
          value={form.artist}
          name="artist"
          type="text"
          label="Artista"
          placeholder="Ej: Hillsong"
          isClearable
          onClear={() => handleOnClear('artist', setForm)}
          size="sm"
          classNames={{
            label: 'font-semibold text-slate-700 text-xs',
            input: 'text-slate-800 text-sm',
            inputWrapper:
              'border-2 border-slate-200 hover:border-brand-purple-300 focus-within:border-brand-purple-600 transition-colors',
          }}
          startContent={<MicrophoneIcon className="h-4 w-4 text-slate-400" />}
        />
        <div className="grid grid-cols-2 gap-2.5">
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
            size="sm"
            classNames={{
              label: 'font-semibold text-slate-700 text-xs',
              trigger:
                'border-2 border-slate-200 hover:border-brand-purple-300 data-[focus=true]:border-brand-purple-600 transition-colors',
            }}
          >
            <SelectItem key="praise">🙌 Alabanza</SelectItem>
            <SelectItem key="worship">🙏 Adoración</SelectItem>
          </Select>
          <Select
            label="Tonalidad"
            placeholder="Seleccionar"
            selectedKeys={form.key ? [form.key] : []}
            onSelectionChange={(e) => {
              const selectedValue = Array.from(e).join('');

              setForm((prev) => ({
                ...prev,
                key: selectedValue,
              }));
            }}
            size="sm"
            classNames={{
              label: 'font-semibold text-slate-700 text-xs',
              trigger:
                'border-2 border-slate-200 hover:border-brand-purple-300 data-[focus=true]:border-brand-purple-600 transition-colors',
            }}
          >
            {songKeys.map((key) => (
              <SelectItem key={key}>{key}</SelectItem>
            ))}
          </Select>
        </div>
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
          label="Tempo (opcional)"
          placeholder="120"
          isClearable
          onClear={() => handleOnClear('tempo', setForm)}
          size="sm"
          classNames={{
            label: 'font-semibold text-slate-700 text-xs',
            input: 'text-slate-800 text-sm',
            inputWrapper:
              'border-2 border-slate-200 hover:border-brand-purple-300 focus-within:border-brand-purple-600 transition-colors',
          }}
          startContent={<span className="text-sm text-slate-400">⏱️</span>}
          endContent={
            <span className="text-xs font-medium text-slate-500">bpm</span>
          }
        />
        <Input
          onChange={handleYouTubeChange}
          value={form.youtubeLink}
          name="youtubeLink"
          type="text"
          label="ID o Link de YouTube (opcional)"
          placeholder="https://youtube.com/watch?v=... o aPV3ddbtpE0"
          isClearable
          onClear={() => handleOnClear('youtubeLink', setForm)}
          size="sm"
          description={
            form.youtubeLink && isValidYouTubeId(form.youtubeLink)
              ? '✓ ID válido'
              : 'Pega el link completo o solo el ID del video'
          }
          classNames={{
            label: 'font-semibold text-slate-700 text-xs',
            input: 'text-slate-800 text-sm',
            inputWrapper:
              'border-2 border-slate-200 hover:border-brand-purple-300 focus-within:border-brand-purple-600 transition-colors',
            description:
              form.youtubeLink && isValidYouTubeId(form.youtubeLink)
                ? 'text-green-600 font-medium'
                : 'text-slate-500',
          }}
          startContent={<span className="text-sm text-slate-400">🎬</span>}
        />
      </div>
    </div>
  );
};
