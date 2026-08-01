import axios from "axios";
import toast from "react-hot-toast";
import { broadcastLogout } from "@/services/channels/authChannel";

export const apiClient = axios.create({
  baseURL: "/api/mock",
});

const MAX_RETRIES = 2;

let lastUnauthorizedMessage = null;
let lastUnauthorizedTime = 0;
const UNAUTHORIZED_COOLDOWN = 5000;

const handleUnauthorized = (errorMessage, error) => {
  const now = Date.now();
  const translatedMessage = errorMessage?.toLowerCase().includes('unauthenticated') 
    ? "Su sesión ha expirado. Por favor, inicie sesión nuevamente."
    : errorMessage || "No autorizado, autentíquese.";
  
  if (now - lastUnauthorizedTime > UNAUTHORIZED_COOLDOWN || lastUnauthorizedMessage !== translatedMessage) {
    toast.error(translatedMessage);
    lastUnauthorizedMessage = translatedMessage;
    lastUnauthorizedTime = now;
  }
  
  broadcastLogout("sessionExpired");
  return Promise.reject(error);
};

const handleForbidden = (errorMessage, error) => {
  toast.error(
    errorMessage || "Acceso denegado, no tienes permisos para esta acción."
  );
  window.location.href = "/unauthorized";
  return Promise.reject(error);
};

const handleNetworkError = (config, error) => {
  console.error("Error 0: Problema de red.");
  toast.error("Error de red. Verifica tu conexión.");

  config._retry = config._retry || 0;

  if (config._retry < MAX_RETRIES) {
    config._retry += 1;
    return apiClient(config);
  } else {
    return Promise.reject(error);
  }
};

const handleValidationErrors = (errorMessage, error) => {
  const data = error.response.data;
  if (data) {
    const validationErrors = data.message || data.messages;
    Object.keys(validationErrors).forEach((field) => {
      validationErrors[field].forEach((msg) => {
        toast.error(msg);
      });
    });
  } else {
    toast.error(errorMessage || "Error de validación.");
  }
  return Promise.reject(error);
};

const handleNotFound = (errorMessage, error) => {
  const match = errorMessage.match(/The route (.+) could not be found\./);
  if (match) {
    const route = match[1];
    toast.error(`La ruta ${route} no fue encontrada.`);
  } else {
    toast.error(errorMessage || "Recurso no encontrado.");
  }
  return Promise.reject(error);
};

const handleServerError = (errorMessage, error) => {
  console.error("Error 500: Problema con el servidor.");
  toast.error(errorMessage || "Ocurrió un problema con el servidor.");
  return Promise.reject(error);
};

const handleDefaultError = (errorMessage, error) => {
  toast.error(errorMessage || "Ocurrió un error.");
  return Promise.reject(error);
};

const errorHandlers = {
  401: handleUnauthorized,
  403: handleForbidden,
  400: handleValidationErrors,
  422: handleValidationErrors,
  404: handleNotFound,
  500: handleServerError,
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    const errorMessage =
      response?.data?.messages ||
      response?.data?.message ||
      "Ocurrió un error.";

    if (error.request?.status === 0) {
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
        return Promise.reject(error);
      }
      return handleNetworkError(config, error);
    }

    if (!response) {
      toast.error("No se recibió respuesta del servidor.");
      return Promise.reject(error);
    }

    const handler = errorHandlers[response.status] || handleDefaultError;
    return handler(errorMessage, error);
  }
);
