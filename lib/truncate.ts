export const truncate = (string: string, n: number) => {
  return string?.length > n ? string.substr(0, n - 1) + "..." : string;
};
