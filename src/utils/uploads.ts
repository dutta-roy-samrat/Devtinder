export const getImageUrlFromPath = (path: string) => {
  return `${process.env.BASE_URL}/${path.replace(/\\/g, "/")}`;
};
