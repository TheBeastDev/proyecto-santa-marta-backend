import express, { Request, Response } from 'express';
import errorHandler from './middlewares/errorHandler';
import authRoutes from './routes/auth';
import productRoutes from './routes/product';
import categoryRoutes from './routes/category';
import cartRoutes from './routes/cart';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
