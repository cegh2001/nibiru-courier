import { format } from "date-fns";
import { es } from "date-fns/locale";

export const parseDateString = (dateString) => {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;

  const str = String(dateString).trim();

  const matchDmy = str.match(/^(\d{2})-(\d{2})-(\d{4})(?: (\d{2}):(\d{2}):(\d{2}))?$/);
  if (matchDmy) {
    const [, day, month, year, hour = "0", minute = "0", second = "0"] = matchDmy;
    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hour, 10),
      parseInt(minute, 10),
      parseInt(second, 10)
    );
  }

  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d;
  }

  return null;
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = parseDateString(dateString);
  if (!date) {
    return typeof dateString === 'string' ? dateString : '';
  }
  return format(date, 'PPpp', { locale: es });
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = parseDateString(dateString);
  if (!date) return '';
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = parseDateString(dateString);
  if (!date) return '';
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateToMySQLFormat = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
