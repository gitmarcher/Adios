import { toast } from "react-toastify";

const defaultToastOptions = {
    position: "top-center", 
    autoClose: 1000, 
    hideProgressBar: false, 
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined, 
};

export const showSuccessToast = (message) => {
    toast.success(message, defaultToastOptions);
};

export const showErrorToast = (message) => {
    toast.error(message, defaultToastOptions);
};

