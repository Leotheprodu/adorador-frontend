import { Input } from "@heroui/react";

interface FormAddNewEventProps {
  form: {
    title: string;
    date: string;
  };
  setForm: (form: { title: string; date: string }) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormAddNewEvent = ({
  form,
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
    </div>
  );
};
