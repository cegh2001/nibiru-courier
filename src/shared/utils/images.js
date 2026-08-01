const decodeImageUrl = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const unwrapNestedImageUrl = (value) => {
  const decodedValue = decodeImageUrl(value);
  const protocolIndexes = [
    decodedValue.indexOf("https://", 8),
    decodedValue.indexOf("http://", 7),
  ].filter((index) => index >= 0);

  if (protocolIndexes.length > 0) {
    return decodedValue.slice(Math.min(...protocolIndexes));
  }

  try {
    const parsedUrl = new URL(decodedValue);
    const decodedPathname = decodeImageUrl(parsedUrl.pathname || "");
    const pathProtocolIndexes = [
      decodedPathname.indexOf("https://"),
      decodedPathname.indexOf("http://"),
    ].filter((index) => index >= 0);

    if (pathProtocolIndexes.length > 0) {
      return decodedPathname.slice(Math.min(...pathProtocolIndexes));
    }
  } catch {
    return decodedValue;
  }

  return decodedValue;
};

const isAbsoluteHttpImageUrl = (value) => {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

export const normalizeImageSrc = (value) => {
  if (typeof value !== "string") return "";

  const normalizedValue = unwrapNestedImageUrl(value.trim());

  if (!normalizedValue) return "";
  if (normalizedValue.startsWith("/")) return normalizedValue;

  return isAbsoluteHttpImageUrl(normalizedValue) ? normalizedValue : "";
};

export const getSafeImageSrc = (value, fallback = "/assets/gonavi-logo.png") => {
  if (!value) {
    return fallback;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    const normalizedValue = normalizeImageSrc(trimmed);
    return normalizedValue || fallback;
  }

  if (typeof value === "object") {
    if (value && typeof value.src === "string" && value.src.trim()) {
      return value;
    }
    if (value && typeof value.url === "string" && value.url.trim()) {
      const normalizedValue = normalizeImageSrc(value.url.trim());
      return normalizedValue || fallback;
    }
    if (value && typeof value.path === "string" && value.path.trim()) {
      const normalizedValue = normalizeImageSrc(value.path.trim());
      return normalizedValue || fallback;
    }
  }

  return fallback;
};
