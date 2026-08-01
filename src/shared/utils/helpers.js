import { createVariants, transition } from "@/shared/utils/animation";

export const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;

export const images = {
  gonavi: "/assets/gonavi-logo.png",
  gonaviSolo: "/assets/gonavi-logo.png",
};

export { createVariants, transition };

export { parseDateString, formatDateTime, formatDate, formatTime, formatDateToMySQLFormat } from "@/shared/utils/dates";
export { toUpperCase, capitalize, hexToRgb } from "@/shared/utils/strings";
export { normalizeImageSrc, getSafeImageSrc } from "@/shared/utils/images";
export { formatRIF, getRawRIFFormat, extractRIFNumbers } from "@/shared/utils/rif";
export { getGreeting, getPackageUnit } from "@/shared/utils/ui";
