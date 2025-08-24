// src/utils/utilities.ts

export const isBusinessDay = (date: Date): boolean => {
  const day = date.getDay();
  return day !== 0 && day !== 6; // Sun=0, Sat=6
};

export const getBusinessDatesBetween = (
  startDate: Date,
  endDate: Date
): Date[] => {
  let dates: Date[] = [];
  let current = new Date(startDate);
  while (current <= endDate) {
    if (isBusinessDay(current)) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const formatDateForBackend = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return dd + mm + yyyy;
};
