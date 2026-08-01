import { MdDoneAll } from 'react-icons/md';
import { SearchCombobox } from '../combobox/SearchCombobox';

export const Header = ({ url, setResults, options, selected, handleSelectAll, deselect }) => {
  return (
    <div className="flex items-center justify-between py-2 bg-blue-50 rounded-t-xl shadow-sm-xt shadow-navy-light">
      {/* Buscador */}
      <h2 className="ml-2">
        <SearchCombobox
          url={url}
          setResults={setResults}
          selected={selected}
          options={options}
        />
      </h2>
      {/* Seleccionar todos */}
      <button
        onClick={handleSelectAll}
        className="flex items-center gap-1 px-2 py-1 mr-2 text-xs text-navy font-medium bg-white border rounded-full shadow-xs shadow-navy-rgba hover:scale-105 duration-300"
        type="button"
        aria-label="Seleccionar todos los elementos de la página"
      >
        <MdDoneAll /> {!deselect ? "Selec. Pág." : "Deselec. Pág."}
      </button>
    </div>
  );
};