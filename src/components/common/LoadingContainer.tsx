import LoadingSpinner from "./LoadingSpinner";

interface LoadingContainerProps {
  minHeight?: string;
  children?: React.ReactNode;
}

export default function LoadingContainer({
  minHeight = "min-h-[300px]",
  children,
}: LoadingContainerProps) {
  return (
    <div className={`flex items-center justify-center py-16 ${minHeight}`}>
      {children || <LoadingSpinner size="lg" />}
    </div>
  );
}
