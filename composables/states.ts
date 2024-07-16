export const useUser = () => {
  return useState<string>("user", () => "user 2");
};
