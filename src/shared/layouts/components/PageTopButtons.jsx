// Components
import { TextIconButton } from "@/components/common/buttons/TextIconButton";
import { CrumbBackButton } from "@/layouts/components/CrumbBackButton";
// Next Auth
import Link from "next/link";

export const PageTopButtons = ({ leftItems, excludeIndex, otherItems }) => {
  const validExcludeIndex = excludeIndex !== undefined ? excludeIndex : -1;

  const resolveIcon = (icon) => {
    if (!icon) return null;

    if (typeof icon === "function") {
      const Icon = icon;
      return (
        <span className="mr-1.5 inline-flex h-4 w-4 shrink-0 items-center justify-center">
          <Icon className="h-4 w-4" />
        </span>
      );
    }

    return (
      <span className="mr-1.5 inline-flex h-4 w-4 shrink-0 items-center justify-center">
        {icon}
      </span>
    );
  };

  return (
    <div className="flex items-center justify-start gap-2 overflow-x-auto pb-1">
      {leftItems &&
        leftItems.map(
          (item, index) =>
            index !== validExcludeIndex && (
              <Link href={item.path} key={index}>
                <TextIconButton
                  bgColor="bg-white"
                  bgColorHover="hover:bg-navy-dark"
                  margin="m-0"
                  padding="py-1 pl-2 pr-3"
                  rounded="rounded-full"
                  text={<span className="whitespace-nowrap">{item.title}</span>}
                  textColor="text-navy"
                  shadowAndColorHover="hover:shadow-md hover:shadow-navy-light"
                  icon={resolveIcon(item.icon)}
                />
              </Link>
            )
        )}
      {otherItems}
    </div>
  );
};
