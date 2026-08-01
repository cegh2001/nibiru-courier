import { CountryOptionContent } from "@/components/common/CountryOptionContent";
import { getCountryCode, getCountryName } from "@/shared/utils/countryDisplay";

export const CountrySelectionCard = ({
  country,
  title = "País seleccionado",
  emptyLabel = "Sin seleccionar",
  className = "",
}) => {
  const hasCountry = Boolean(getCountryName(country, "")) || Boolean(getCountryCode(country, ""));

  return (
    <div className={`rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm ${className}`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </div>

      <div className="mt-2">
        {hasCountry ? (
          <CountryOptionContent country={country} />
        ) : (
          <div className="text-sm text-slate-500">{emptyLabel}</div>
        )}
      </div>
    </div>
  );
};