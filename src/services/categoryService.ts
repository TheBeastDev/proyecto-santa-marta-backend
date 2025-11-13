import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const categoryService = {
  // TODO: Implement category-related service methods here
  async getAllCategories() {
    return prisma.category.findMany();
  },

  async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  },

  async createCategory(name: string) {
    return prisma.category.create({
      data: { name },
    });
  },

  async updateCategory(id: string, name: string) {
    return prisma.category.update({
      where: { id },
      data: { name },
    });
  },

  async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  },
};