
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function isDateInThisWeek(targetDate: Date | null) {
  if(!targetDate) return false
  
  const today = new Date();
  
  // 1. Calculate Sunday (start of the week) at 00:00:00
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // 2. Calculate next Sunday (exclusive upper bound) at 00:00:00
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  // 3. Compare the target date's time
  return targetDate >= startOfWeek && targetDate < endOfWeek;
}