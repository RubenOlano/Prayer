import bcypt from "bcryptjs";

export const hash = async (password: string): Promise<string> => {
  const salt = await bcypt.genSalt(10);
  const hashedPassword = await bcypt.hash(password, salt);
  return hashedPassword;
};

export const compare = async (
  unhash: string,
  hash: string
): Promise<boolean> => {
  const result = await bcypt.compare(unhash, hash);
  return result;
};
