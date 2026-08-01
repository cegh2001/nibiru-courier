import { RemoteImageSwatch } from "@/components/common/RemoteImageSwatch";
import {
  getCountryCode,
  getCountryImage,
  getCountryName,
} from "@/shared/utils/countryDisplay";

export const CountryOptionContent = ({ country, compact = false }) => {
  const countryName = getCountryName(country, "Sin país");
  const countryCode = getCountryCode(country, "").toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-2">
      <RemoteImageSwatch
        src={getCountryImage(country)}
        alt={`Bandera de ${countryName}`}
        className={compact ? "h-5 w-7 rounded-[4px] border border-slate-200 bg-slate-50 shadow-sm" : "h-6 w-9 rounded-md border border-slate-200 bg-slate-50 shadow-sm"}
        fallback={
          <span className={compact ? "inline-flex h-5 w-7 items-center justify-center rounded-[4px] border border-slate-200 bg-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm" : "inline-flex h-6 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm"}>
            {countryCode || "--"}
          </span>
        }
      />

      {compact ? (
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm text-slate-900">{countryName}</span>
          {countryCode ? (
            <span className="inline-flex shrink-0 items-center rounded-full border border-navy/10 bg-navy/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-dark">
              {countryCode}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-slate-900">{countryName}</div>
          {countryCode ? (
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{countryCode}</div>
          ) : null}
        </div>
      )}
    </div>
  );
};