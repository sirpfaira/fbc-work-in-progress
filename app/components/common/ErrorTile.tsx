const ErrorTile = ({ error }: { error: string | undefined }) => {
  return (
    <div className="flex flex-col w-full px-4 py-2 card">
      <span className="text-destructive font-medium">
        Something went wrong!
      </span>
      {error && <span className="text-destructive text-small">{error}</span>}
    </div>
  );
};

export default ErrorTile;
