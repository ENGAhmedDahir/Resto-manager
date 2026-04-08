const Row = ({ type = "vertical", children }) => {
  return (
    <div
      className={
        type === "horizontal"
          ? "flex flex-col sm:flex-row justify-between items-center gap-4 "
          : "flex flex-col gap-6"
      }
    >
      {children}
    </div>
  );
};

export default Row;
