import { authOptions } from "@/lib/auth";
import { ShapesIcon } from "lucide-react";
import { getServerSession } from "next-auth";

import { Badge } from "../../components/ui/badge";
import { prismaClient } from "@/lib/prisma";
import { OrderItem } from "./components/order-item";

export default async function OrderPage() {
  const user = getServerSession(authOptions);

  if (!user) {
    return <p>Acesso negado!</p>;
  }

  const orders = await prismaClient.order.findMany({
    where: {
      userId: (user as any).id,
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
      <Badge
        className="w-fit gap-1 border-2 border-primary px-3 py-[0.375rem] text-base uppercase"
        variant="outline"
      >
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
