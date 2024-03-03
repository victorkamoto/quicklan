export const displayTitleHelper = (path: string) => {
  let title;
  let paths = path.split("/");
  let last = paths.slice(paths.length - 1, paths.length);
  let chunks = last.toString().split(" ");
  if (chunks.length > 5) {
    let first = chunks.slice(0, 5).join(" ");
    let ext = last.toString().split(".")[1];
    return (title = `${first}.${ext}`);
  }
  title = last.toString();

  return title;
};
