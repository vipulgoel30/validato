export const getTime = (date: Date | string, change?: string, isInc: boolean = true): number => {
  const parsedChange: number[] = change
    ?.split(" ")
    .map((factor: string) => parseInt(factor))
    .concat([0, 0, 0, 0])
    .slice(0, 4) ?? [0, 0, 0, 0];
  const [days, hours, minutes, seconds] = parsedChange;
  const inc = (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;

  return new Date(date).getTime() + (isInc ? inc : -inc);
};
