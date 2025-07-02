import { toast } from 'react-toastify';

const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showToast = {
  success: (message) => {
    toast.success(message, {
      ...toastConfig,
      className: 'bg-green-50 border-l-4 border-green-500',
    });
  },

  error: (message) => {
    toast.error(message, {
      ...toastConfig,
      className: 'bg-red-50 border-l-4 border-red-500',
    });
  },

  warning: (message) => {
    toast.warning(message, {
      ...toastConfig,
      className: 'bg-yellow-50 border-l-4 border-yellow-500',
    });
  },

  info: (message) => {
    toast.info(message, {
      ...toastConfig,
      className: 'bg-blue-50 border-l-4 border-blue-500',
    });
  },
};