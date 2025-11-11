import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { User } from '@prisma/client';

export const createUser = async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role'>): Promise<User> => {
  const { email, name, password } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  return user;
};

export const loginUser = async (data: Pick<User, 'email' | 'password'>): Promise<User | null> => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return user;
};
