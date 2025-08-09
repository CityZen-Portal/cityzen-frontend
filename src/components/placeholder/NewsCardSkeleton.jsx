
export default function NewsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-navy-900 animate-pulse">
      <div className="h-48 w-full bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
}