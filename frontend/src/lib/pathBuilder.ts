export const pathBuilder = (path: string) => {
  const chunks = path.split("/");
  if (chunks.length === 2) {
    return ["back"];
  } else {
    return chunks.slice(1, chunks.length - 1);
  }
};
