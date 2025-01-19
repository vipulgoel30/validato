export const getTime = (date: Date | string | number, change?: string, isInc: boolean = true): number => {
  const parsedChange: number[] =
    change?.split(" ").map((factor: string) => parseInt(factor)) ?? [];

  const [days, hours, minutes, seconds] = parsedChange;

  const changeInMs =
    ((((days ?? 0) * 24 + (hours ?? 0)) * 60 + (minutes ?? 0)) * 60 +
      (seconds ?? 0)) *
    1000;

  return new Date(date).getTime() + (isInc ? changeInMs : -changeInMs);
};
