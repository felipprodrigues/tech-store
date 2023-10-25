"use server";

import { CartProduct } from "@/providers/cart";
import Stripe from "stripe";

export async function createCheckout(products: CartProduct[], orderId: string) {
  // create checkout
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
  });

  const checkout = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: process.env.HOST_URL
      ? process.env.HOST_URL
      : process.env.SUCCESS_URL_DEVELOPMENT,
    cancel_url: "http://localhost:3000",
    metadata: { orderId },
    line_items: products.map((product) => {
      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: product.name,
            images: product.imageUrls,
            description: product.description,
          },
          unit_amount: product.totalPrice * 100,
        },
        quantity: product.quantity,
      };
    }),
  });

  // return checkout
  return checkout;
}
