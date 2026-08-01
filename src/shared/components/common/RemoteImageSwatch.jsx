const normalizeImageUrl = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

export const RemoteImageSwatch = ({
  src,
  alt,
  className = "",
  fit = "cover",
  fallback = null,
}) => {
  const normalizedSrc = normalizeImageUrl(src);

  if (!normalizedSrc) {
    return fallback;
  }

  return (
    <span
      role="img"
      aria-label={alt}
      className={`inline-block bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url(${normalizedSrc})`,
        backgroundSize: fit,
      }}
    />
  );
};