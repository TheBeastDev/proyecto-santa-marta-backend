import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/productService';
import * as yup from 'yup';

const productSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required().positive(),
  stock: yup.number().required().integer().min(0),
  image: yup.string().url(),
});

const updateProductSchema = yup.object({
  name: yup.string(),
  description: yup.string(),
  price: yup.number().positive(),
  stock: yup.number().integer().min(0),
  image: yup.string().url(),
});

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = await productSchema.validate(req.body);
    const product = await productService.createProduct(validatedData);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = await updateProductSchema.validate(req.body);
    const product = await productService.updateProduct(id, validatedData);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;
    const products = await productService.getProductsByCategoryId(categoryId);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
