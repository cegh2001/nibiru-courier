/* Components */
import { Badge } from "@/components/common/Badge";
import { Header } from "@/components/common/headless-boxes/listbox/Header";
import { Footer } from "@/components/common/headless-boxes/listbox/Footer";

/* Hooks */
import { useSelectedBigListbox } from "@/hooks/useBigList";

/* Utils */
import { capitalize } from "@/shared/utils/helpers";

export function SelectedBigListbox({
  selected,
  handleDeselect,
  preSelected = [],
  preSelected2 = [],
  ruleColor = { preSelected: "purple", preSelected2: "cyan" },
}) {
  const {
    currentPage,
    isExpanded,
    itemsPerPage,
    combinedItems,
    totalPages,
    currentItems,
    setResults,
    setIsExpanded,
    handlePageChange,
    handleExpand,
    handleDeselectAll,
  } = useSelectedBigListbox(selected, preSelected, preSelected2, handleDeselect);

  return (
    <div className="my-8 transition-all duration-300 ease-in-out">
      <Header
        setResults={setResults}
        selected={selected}
        handleSelectAll={handleDeselectAll}
      />

      <div className="px-1.5 min-h-[172px] overflow-y-auto shadow-xs shadow-navy-light">
        <div
          className={`flex flex-wrap ${
            combinedItems.length === 0
              ? "justify-center items-center min-h-[172px]"
              : ""
          } gap-1 py-6 focus:outline-hidden duration-300`}
        >
          {combinedItems.length === 0 ? (
            <Badge color="red" margin="" padding="px-2 py-1">
              No hay elementos seleccionados
            </Badge>
          ) : (
            currentItems.map((item) => {
              const isPreSelected = preSelected.some(
                (preItem) => preItem.name === item.name
              );
              const isPreSelected2 = preSelected2.some(
                (preItem) => preItem.name === item.name
              );
              const badgeColor =
                isPreSelected
                  ? ruleColor.preSelected
                  : isPreSelected2
                  ? ruleColor.preSelected2
                  : "white";

              return (
                <div
                  key={item.name}
                  onClick={() => handleDeselect(item)}
                  className="group select-none cursor-pointer hover:scale-105 duration-300"
                >
                  <Badge
                    color={badgeColor}
                    margin=""
                    padding="px-2 py-1"
                    isRemovable={true}
                  >
                    {capitalize(item.name)}
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Footer
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        itemsPerPage={itemsPerPage}
        availableOptionsLength={combinedItems.length}
        currentPage={currentPage}
        totalPages={totalPages}
        handleExpand={handleExpand}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}