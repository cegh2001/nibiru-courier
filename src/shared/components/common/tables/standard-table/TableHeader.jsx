export const TableHeader = ({ columns }) => {
  return (
    <thead className="relative z-0 bg-linear-to-b from-navy/95 to-navy">
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            className={`px-6 py-3 font-medium text-left text-xs text-white uppercase tracking-wider ${index === columns.length - 1 ? "flex items-center justify-center" : ""}`}
            scope="col"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
};
