'use client';

// COMPONENTE
/* Botón Básico */
export const TextIconButton = ({
  bgColor = "bg-gray",
  bgColorHover = "hover:bg-gray-dark",
  disabled = false,
  icon,
  margin = "m-2",
  onClick = () => {},
  padding = "px-2 py-0.5",
  rounded = "rounded-full",
  borderAndColor = "",
  shadowAndColor = "shadow-md shadow-navy-lighter",
  scale = "",
  shadowAndColorHover = "",
  borderAndColorHover = "",
  text = "",
  textColor = "text-white",
  textColorHover = "hover:text-white",
  textSize = "text-sm",
  textWeight = "font-semibold",
  textWeightHover = "",
  type = "button",
  style = {},
}) => (
  <button
    className={`${padding} ${margin} inline-flex items-center justify-center ${bgColor} ${rounded} ${shadowAndColor} ${borderAndColor} ${textColor} ${textSize} ${textWeight} transition duration-300 ${bgColorHover} ${textColorHover} ${textWeightHover} ${shadowAndColorHover} ${borderAndColorHover} ${scale} focus:outline-hidden`}
    disabled={disabled}
    onClick={onClick}
    type={type}
    style={style}
  >
    {icon}
    {text}
  </button>
);
