const ErrorsTile = ({ errors }: { errors: string[] }) => {
  return (
    <div className="flex flex-col w-full px-4 py-2 card">
      <span className="text-destructive font-medium">
        Something went wrong!
      </span>
      <div className="flex flex-col w-full">
        {errors && errors.map((item) => (
          <span className="text-destructive text-small">{item}</span>
        ))}
      </div>
    </div>
  );
};

export default ErrorsTile;
