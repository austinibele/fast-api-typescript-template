
export const formatDateTime = (date: Date): string => {
  const padZero = (num: number) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  return `${year}-${month}-${day}`;
};

export const currentFormattedDateTime = (): string => {
  return formatDateTime(new Date());
}

export const getNestedValue = (obj: any, key: string): any => {
  return key.split('|').reduce((o, i) => o? o[i] : '', obj);
}
