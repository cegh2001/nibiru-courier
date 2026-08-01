const EMPTY_VALUE = "N/A";

const getTextValue = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const getCountryObject = (country) => {
  if (!country || typeof country !== "object") return null;
  return country;
};

export const getCountryName = (country, fallback = EMPTY_VALUE) => {
  if (typeof country === "string") {
    return getTextValue(country) || fallback;
  }

  const countryObject = getCountryObject(country);
  if (!countryObject) return fallback;

  return (
    getTextValue(countryObject.name) ||
    getTextValue(countryObject.country_name) ||
    fallback
  );
};

export const getCountryCode = (country, fallback = "") => {
  const countryObject = getCountryObject(country);
  if (!countryObject) return fallback;

  return (
    getTextValue(countryObject.abbreviation) ||
    getTextValue(countryObject.code) ||
    getTextValue(countryObject.country_code) ||
    fallback
  );
};

export const getCountryImage = (country, fallback = "") => {
  const countryObject = getCountryObject(country);
  if (!countryObject) return fallback;

  return (
    getTextValue(countryObject.image) ||
    getTextValue(countryObject.country_image) ||
    fallback
  );
};

export const getCountryDisplayLabel = (country, fallback = EMPTY_VALUE) => {
  const name = getCountryName(country, "");
  const code = getCountryCode(country, "").toUpperCase();

  if (name && code) {
    return `${name} (${code})`;
  }

  return name || code || fallback;
};