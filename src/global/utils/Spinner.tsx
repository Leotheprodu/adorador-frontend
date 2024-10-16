export const Spinner = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-primario z-[60]">
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
