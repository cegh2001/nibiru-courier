/* Components */
import { Badge } from "@/components/common/Badge";
import { Header } from "@/components/common/headless-boxes/listbox/Header";
import { Footer } from "@/components/common/headless-boxes/listbox/Footer";

/* Hooks */
import { useBigListbox } from "@/hooks/useBigList";

/* Utils */
import { capitalize } from "@/shared/utils/helpers";

export function BigListbox({
  options,
  selected,
  setSelected,
  preSelected = [],
  preSelected2 = [],
  toShow,
  ruleColor = { preSelected: "purple", preSelected2: "cyan" },
  ruleDisable = { preSelected: false, preSelected2: true, message: "Este elemento está asociado a otro, para asignarlo elija el otro." }
}) {
  const {
    currentPage,
    isExpanded,
    itemsPerPage,
    setResults,
    combinedOptions,
    totalPages,
    currentItems,
    handlePageChange,
    handleExpand,
    handleSelect,
    handleSelectAll,
    allSelected,
    setIsExpanded,
  } = useBigListbox({
    options,
    selected,
    setSelected,
    preSelected,
    preSelected2,
  });

  return (
    <div className={`my-8 transition-all ease-in-out duration-300 ${toShow}`}>
      <Header
        options={options}
        setResults={setResults}
        selected={selected}
        handleSelectAll={handleSelectAll}
      />

      {/* Body */}
      <div className="px-1.5 min-h-[172px] max-h-[172px] shadow-xs shadow-navy-light overflow-y-auto">
        {allSelected ? (
          <div className="flex justify-center items-center min-h-[172px]">
            <Badge color="green" margin="" padding="px-2 py-1">
              Todos los elementos están seleccionados
            </Badge>
          </div>
        ) : (
          <div
            className={`flex flex-wrap gap-1 ${
              allSelected ? "justify-center items-center" : ""
            } py-6 focus:outline-hidden`}
          >
            {currentItems.map((item) => {
              const badgeColor = preSelected.some(
                (preItem) => preItem.id === item.id
              )
                ? ruleColor.preSelected
                : preSelected2.some((preItem2) => preItem2.id === item.id)
                ? ruleColor.preSelected2
                : "white";
              const isDisabled = ruleDisable.preSelected
                ? preSelected.some((preItem) => preItem.id === item.id)
                : preSelected2.some((preItem2) => preItem2.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => !isDisabled && handleSelect(item)}
                  className={`group select-none hover:scale-105 duration-300 ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  title={
                    isDisabled
                      ? ruleDisable.message
                      : ""
                  }
                >
                  <Badge color={badgeColor} margin="" padding="px-2 py-1">
                    {capitalize(item.name)}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer
        isExpanded={isExpanded}
        isModificable={false}
        setIsExpanded={setIsExpanded}
        itemsPerPage={itemsPerPage}
        availableOptionsLength={combinedOptions.length}
        currentPage={currentPage}
        totalPages={totalPages}
        handleExpand={handleExpand}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}