import bcrypt from "bcryptjs";

export const hash = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

export const compare = async (unHash: string, hash: string): Promise<boolean> => {
	const result = await bcrypt.compare(unHash, hash);
	return result;
};
