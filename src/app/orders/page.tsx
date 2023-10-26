import { authOptions } from "@/lib/auth";
import { ShapesIcon } from "lucide-react";
import { getServerSession } from "next-auth";

import { Badge } from "../../components/ui/badge";
import { prismaClient } from "@/lib/prisma";
import { OrderItem } from "./components/order-item";

export const dynamic = "force-dynamic";

export default async function OrderPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return <p>Acesso negado!</p>;
  }

  const orders = await prismaClient.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="p-5">
      <Badge variant="heading">
        <ShapesIcon size={16} />
        Meus Pedidos
      </Badge>

      <div className="mt-5 flex flex-col gap-5">
        {orders.map((order) => (
          <OrderItem order={order} key={order.id} />
        ))}
      </div>
    </div>
  );
}
