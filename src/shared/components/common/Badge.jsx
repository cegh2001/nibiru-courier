/* Icons */
import { FaCircleXmark } from "react-icons/fa6";

const bgColor = {
  white: "bg-[#EDF2F7] text-[#293344]",
  red: "bg-[#FED7D7] text-[#9C2E2E]",
  orange: "bg-[#FEEBC8] text-[#973918]",
  yellow: "bg-[#FEFCBF] text-[#92510D]",
  green: "bg-[#C6F6D5] text-[#1F6042]",
  cyan: "bg-[#B2F5EA] text-[#2C6366]",
  blue: "bg-[#BEE3F8] text-[#274E7E]",
  indigo: "bg-[#E9D8FD] text-[#5A429E]",
  purple: "bg-[#C3DAFE] text-[#474694]",
  pink: "bg-[#FED7E2] text-[#A33B7B]",
};

export const Badge = ({ children, color, margin, padding = "px-2", textSize = "text-xs", effects = "", isRemovable = false, onRemove }) => {
  const colorClass = bgColor[color] || "bg-green-100 text-green-800";

  const handleRemoveClick = (event) => {
    event.preventDefault();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="relative group flex flex-wrap">
      <span
        className={`truncate ${margin} ${padding} inline-flex ${textSize} leading-5 font-semibold rounded-full ${effects} ${colorClass} items-center`}
      >
        {children}
      </span>
      {isRemovable && (
        <button
          onClick={handleRemoveClick}
          className="absolute right-0 translate-x-1 -translate-y-1 text-xs text-red-500 hover:text-red-700 focus:outline-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <FaCircleXmark />
        </button>
      )}
      {isRemovable && (
        <button
          onClick={handleRemoveClick}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      )}
    </div>
  );
};