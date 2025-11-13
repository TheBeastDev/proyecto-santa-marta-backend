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


export const getUserProfile = async (userId: string): Promise<Omit<User, 'password'> | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      address: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const updateUserProfile = async (
  userId: string,
  data: { name?: string; address?: string; phone?: string }
): Promise<Omit<User, 'password'>> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      address: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export const changeUserPassword = async (
  userId: string,
  oldPassword,
  newPassword
): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return false;
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });

  return true;
};
