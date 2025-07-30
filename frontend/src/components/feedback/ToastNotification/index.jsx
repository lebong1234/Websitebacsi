import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName="relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer shadow-lg"
      bodyClassName="text-sm font-medium text-gray-800"
      progressClassName="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
    />
  );
};

export default ToastProvider;