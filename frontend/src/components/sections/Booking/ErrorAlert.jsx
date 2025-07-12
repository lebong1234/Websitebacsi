import { AlertTriangle } from "lucide-react";

const ErrorAlert = ({ error }) => {
  if (!error) return null;
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6 shadow-md">
      <div className="flex items-center">
        <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
        <div>
          <p className="text-md font-semibold text-red-700">Có lỗi xảy ra</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
