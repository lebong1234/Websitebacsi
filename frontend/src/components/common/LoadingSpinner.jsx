const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex justify-center items-center p-8">
      <div 
        className={`animate-spin rounded-full border-solid border-t-blue-500 border-gray-200 ${sizes[size]}`}
      />
    </div>
  );
};

export default LoadingSpinner;