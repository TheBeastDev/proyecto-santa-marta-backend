import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const cartService = {
  async getOrCreateCart(userId: string) {
    let cart = await prisma.shoppingCart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.shoppingCart.create({
        data: {
          userId,
        },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });
    }
    return cart;
  },

  async addItemToCart(userId: string, productId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingCartItem) {
      return prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      return prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
  },

  async updateCartItemQuantity(userId: string, itemId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    // Ensure the item belongs to the user's cart
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new Error('Cart item not found or does not belong to the user\'s cart');
    }

    if (quantity <= 0) {
      return this.removeCartItem(userId, itemId);
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  },

  async removeCartItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);

    // Ensure the item belongs to the user's cart
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new Error('Cart item not found or does not belong to the user\'s cart');
    }

    return prisma.cartItem.delete({
      where: { id: itemId },
    });
  },

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    return prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  },
};
