import { Spinner } from "@/global/utils/Spinner";

export default function Loading(/* { label = "Cargando..." }: { label?: string } */) {
  return (
    <>
      {/* <div className=" flex items-center justify-center w-full h-screen">
      <Spinner
        size="lg"
        color="default"
        label={`${label}`}
        labelColor="foreground"
        className="my-0 mx-auto"
      />
    </div> */}
      <Spinner isLoading={true} />
    </>
  );
}
