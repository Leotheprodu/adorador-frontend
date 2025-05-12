import { UpdateIcon } from '@global/icons/UpdateIcon';

export const RefetchButtonUpdateIcon = ({
  refetch,
}: {
  refetch: () => void;
}) => {
  return (
    <button
      className="rounded-full p-2 duration-200 hover:bg-slate-300"
      onClick={() => {
        refetch();
      }}
    >
      <UpdateIcon className="text-primary-500" />
    </button>
  );
};
