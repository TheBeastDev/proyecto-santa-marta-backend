import prisma from '../lib/prisma';
import { Product } from '@prisma/client';

export const getProducts = async (): Promise<Product[]> => {
  return prisma.product.findMany();
};

export const getProductById = async (id: string): Promise<Product | null> => {
  return prisma.product.findUnique({
    where: { id },
  });
};

export const createProduct = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  return prisma.product.create({
    data,
  });
};

export const updateProduct = async (id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product | null> => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id: string): Promise<Product | null> => {
  return prisma.product.delete({
    where: { id },
  });
};
