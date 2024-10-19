export const Spinner = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <>
      {isLoading && (
        <div className="fixed left-0 top-0 z-[60] flex h-screen w-screen items-center justify-center bg-blanco">
          <div className="sk-cube-grid">
            <div className="sk-cube sk-cube1"></div>
            <div className="sk-cube sk-cube2"></div>
            <div className="sk-cube sk-cube3"></div>
            <div className="sk-cube sk-cube4"></div>
            <div className="sk-cube sk-cube5"></div>
            <div className="sk-cube sk-cube6"></div>
            <div className="sk-cube sk-cube7"></div>
            <div className="sk-cube sk-cube8"></div>
            <div className="sk-cube sk-cube9"></div>
          </div>
        </div>
      )}
    </>
  );
};
