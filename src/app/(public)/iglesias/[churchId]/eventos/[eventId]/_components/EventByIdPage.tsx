export const EventByIdPage = ({
  params,
}: {
  params: { churchId: string; eventId: string };
}) => {
  return (
    <>
      <h1>
        evento id: {params.eventId} de la Iglesia id: {params.churchId}
      </h1>
    </>
  );
};
