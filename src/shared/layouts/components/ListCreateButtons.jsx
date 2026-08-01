import { useMemo } from "react";
import { TbList } from "react-icons/tb";
import { RiAddLine } from "react-icons/ri";

export const ListCreateButtons = ({
  buttonStates,
  setButtonStates,
  onlyList,
  isPermiss,
  isRolesUsers,
  isAssignView,
  addOnClickHandlers = {},
  setDirection,
  buttonLabels = {
    list: "Lista",
    create: "Crear",
    asign: "Asignar",
  }, // Prop para personalizar los labels
}) => {
  // Derivar la vista actual directamente del estado externo (sin estado interno)
  const currentView = useMemo(() => {
    if (buttonStates.asign) return "asign";
    if (buttonStates.create) return "create";
    return "list";
  }, [buttonStates]);

  const handleButtonClick = (view) => {
    // Calcular dirección basada en la vista actual vs la nueva
    if (view === "list") {
      setDirection(currentView === "create" || currentView === "asign" ? -1 : 1);
    } else if (view === "create") {
      setDirection(currentView === "list" ? 1 : currentView === "asign" ? -1 : 1);
    } else if (view === "asign") {
      setDirection(currentView === "list" || currentView === "create" ? 1 : -1);
    }

    setButtonStates({
      list: view === "list",
      create: view === "create",
      asign: view === "asign",
    });

    if (addOnClickHandlers[view]) {
      addOnClickHandlers[view]();
    }
  };

  // Determinar si es una vista dual (list + asign, sin create)
  const showAssign = isPermiss || isRolesUsers || isAssignView;
  const showCreate = !onlyList && !isRolesUsers && !isAssignView;

  const buttonsConfig = [
    {
      condition: true,
      label: buttonLabels.list,
      icon: <TbList />,
      activeState: buttonStates.list,
      onClick: () => handleButtonClick("list"),
      className: buttonStates.list
        ? "text-white bg-navy shadow-none"
        : "bg-white text-navy shadow-xs shadow-navy-light hover:text-white hover:bg-navy hover:shadow-md hover:shadow-navy-light",
    },
    {
      condition: showCreate,
      label: buttonLabels.create,
      icon: <RiAddLine />,
      activeState: buttonStates.create,
      onClick: () => handleButtonClick("create"),
      className: buttonStates.create
        ? "text-white bg-green-500 shadow-none"
        : "bg-white text-green-600 shadow-xs shadow-green-600 hover:text-white hover:bg-emerald hover:shadow-md hover:shadow-green-400",
    },
    {
      condition: showAssign,
      label: buttonLabels.asign,
      icon: <RiAddLine />,
      activeState: buttonStates.asign,
      onClick: () => handleButtonClick("asign"),
      className: buttonStates.asign
        ? "text-white bg-cyan-500 shadow-none"
        : "bg-white text-cyan-600 shadow-xs shadow-cyan-600 hover:text-white hover:bg-cyan-500 hover:shadow-md hover:shadow-cyan-400",
    },
  ];

  return (
    <div className="mt-1">
      <ul className="my-1 flex items-center flex-row gap-2">
        {buttonsConfig
          .filter((btn) => btn.condition)
          .map((btn, index) => (
            <li key={index}>
              <button
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium duration-300 ${btn.className}`}
                onClick={btn.onClick}
              >
                {btn.icon} {btn.label}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};
