import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const POST = async (request: Request) => {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.error();
  }

  const text = await request.text();

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET_KEY!,
  );

  console.log(event, "aqui o evento");

  if (event.type === "checkout.session.completed") {
    console.log("it worked successfully, 12312412412431");
    // const session = event.data.object as any;

    // console.log(session, "aqui entrou no complete");

    // const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
    //   event.data.object.id,
    //   {
    //     expand: ["line_items"],
    //   },
    // );

    // const lineItems = sessionWithLineItems.line_items;

    // // update order
    // await prismaClient.order.update({
    //   where: {
    //     id: session.metadata.orderId,
    //   },
    //   data: {
    //     status: "PAYMENT_CONFIRMED",
    //   },
    // });
  }

  return NextResponse.json({ received: true });
};
