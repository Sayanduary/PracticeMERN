import bcrypt from "bcryptjs";


export const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (error) {

    console.log('Hash Password Error', error)
  }
};

export const comparePassword = async (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};