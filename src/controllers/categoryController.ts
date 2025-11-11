import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryService';
import { Prisma } from '@prisma/client';

export const categoryController = {
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }
      const category = await categoryService.createCategory(name);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // P2002: Unique constraint failed on the {constraint}
        return res.status(409).json({ message: 'Category with this name already exists' });
      }
      next(error);
    }
  },

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }
      const category = await categoryService.updateCategory(id, name);
      res.json(category);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          // P2025: An operation failed because it depends on one or more records that were required but not found.
          return res.status(404).json({ message: 'Category not found' });
        }
        if (error.code === 'P2002') {
          // P2002: Unique constraint failed on the {constraint}
          return res.status(409).json({ message: 'Category with this name already exists' });
        }
      }
      next(error);
    }
  },

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      res.status(204).send(); // No Content
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(404).json({ message: 'Category not found' });
      }
      next(error);
    }
  },
};
