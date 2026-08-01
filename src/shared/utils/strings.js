export const toUpperCase = (text) => {
  return text ? text.toString().toUpperCase() : '';
};

export const capitalize = (word) => {
  if (word) {
    return word
      .split(/(\s|-|\/)/g)
      .map((word) =>
        word.match(/(\s|-|\/)/g)
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("");
  }
};

export const hexToRgb = (hex) => {
  hex = hex?.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};
