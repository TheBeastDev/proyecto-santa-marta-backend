import { PrismaClient, OrderStatus, PaymentMethod } from '@prisma/client';
import { notificationService } from './notificationService';

const prisma = new PrismaClient();

export const orderService = {
  async createOrderFromCart(
    userId: string,
    paymentMethod: PaymentMethod,
    deliveryAddress: string,
    phone: string
  ) {
    const cart = await prisma.shoppingCart.findUnique({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const total = cart.cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        paymentMethod,
        deliveryAddress,
        phone,
        orderItems: {
          create: cart.cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    // Clear the cart after creating the order
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Create a notification for the user
    await notificationService.createNotification(
      userId,
      `Your order #${order.orderNumber} has been placed successfully!`
    );

    return order;
  },

  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getAllOrders() {
    return prisma.order.findMany({
      include: { user: true, orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getOrderById(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, orderItems: { include: { product: true } } },
    });
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { user: true } // Include user to get userId for notification
    });

    // Create a notification for the user about the status update
    await notificationService.createNotification(
      updatedOrder.userId,
      `Your order #${updatedOrder.orderNumber} status has been updated to ${status}.`
    );

    return updatedOrder;
  },
};
