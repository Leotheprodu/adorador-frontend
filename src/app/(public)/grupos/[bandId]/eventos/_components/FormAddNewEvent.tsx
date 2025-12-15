import { Input, Select, SelectItem } from '@heroui/react';

interface FormAddNewEventProps {
  form: {
    title: string;
    date: string;
    eventMode: 'live' | 'videolyrics';
  };
  setForm: (form: {
    title: string;
    date: string;
    eventMode: 'live' | 'videolyrics';
  }) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormAddNewEvent = ({
  form,
  setForm,
  handleChange,
}: FormAddNewEventProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        label="Título del evento"
        placeholder="Ej: Culto de adoración"
        name="title"
        value={form.title}
        onChange={handleChange}
        isRequired
      />
      <Input
        type="datetime-local"
        label="Fecha y hora del evento"
        name="date"
        value={form.date}
        onChange={handleChange}
        isRequired
      />
      <Select
        label="Modo del evento"
        placeholder="Selecciona el modo"
        selectedKeys={[form.eventMode]}
        onChange={(e) => {
          setForm({
            ...form,
            eventMode: e.target.value as 'live' | 'videolyrics',
          });
        }}
        description="Live = Música en vivo con letras, VideoLyrics = Videos con letras"
      >
        <SelectItem key="live">Live - Música en vivo</SelectItem>
        <SelectItem key="videolyrics">
          VideoLyrics - Videos con letras
        </SelectItem>
      </Select>
    </div>
  );
};
