export const getGreeting = () => {
  let horas = new Date().getHours();

  if (horas > 4 && horas <= 12) return "Buenos días";

  if (horas > 12 && horas <= 19) return "Buenas tardes";

  return "Buenas noches";
};

export const getPackageUnit = (count) => count >= 2 ? "uds." : "ud.";
