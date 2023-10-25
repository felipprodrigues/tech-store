import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { OrderProductItem } from "./order-product-item";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";
import { computeProductTotalPrice } from "@/helpers/product";
import { getOrderStatus } from "../helpers/status";

interface OrderItemProps {
  order: Prisma.OrderGetPayload<{
    include: {
      orderProducts: {
        include: {
          product: true;
        };
      };
    };
  }>;
}

export function OrderItem({ order }: OrderItemProps) {
  // const statusParser = [
  //   'WAITING_FOR_PAYMENT': "Em processamento",
  //   'COMPLETED': "Pago",
  // ]

  const subtotal = useMemo(() => {
    return order.orderProducts.reduce((acc, curr) => {
      return acc + Number(curr.product.basePrice) * curr.quantity;
    }, 0);
  }, [order.orderProducts]);

  const total = useMemo(() => {
    return order.orderProducts.reduce((acc, product) => {
      const productWithTotalPrice = computeProductTotalPrice(product.product);

      return acc + productWithTotalPrice.totalPrice * product.quantity;
    }, 0);
  }, [order.orderProducts]);

  const totalDiscounts = total - subtotal;

  return (
    <Card className="px-5">
      <Accordion type="single" className="w-full" collapsible>
        <AccordionItem value={order.id}>
          <AccordionTrigger>
            <div className="flex flex-col gap-1 text-left">
              <p className="flex flex-col">
                Pedido com {order.orderProducts.length} produto(s){" "}
                <span className="text-[10px] opacity-60">
                  Feito em {format(order.createdAt, "d/MM/y 'às' HH:mm")}
                </span>
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="font-bold ">
                  <p>Status</p>
                  <p className="text-[#8192ff] text-primary">
                    {getOrderStatus(order.status)}
                  </p>
                </div>

                <div>
                  <p className="font-bold">Data</p>
                  <p className="opacity-60">
                    {format(order.createdAt, "d/MM/y")}
                  </p>
                </div>

                <div>
                  <p className="font-bold">Pagamento</p>
                  <p className="opacity-60">Cartão</p>
                </div>
              </div>

              {order.orderProducts.map((orderProduct) => (
                <OrderProductItem
                  orderProduct={orderProduct}
                  key={orderProduct.id}
                />
              ))}

              <div className="flex flex-col gap-2 text-xs">
                <Separator />
                <div className="flex w-full justify-between py-2">
                  <p>Subtotal</p>
                  <p>R$ {subtotal.toFixed(2)}</p>
                </div>

                <Separator />
                <div className="flex w-full justify-between py-2">
                  <p>Entrega</p>
                  <p>GRÁTIS</p>
                </div>

                <Separator />
                <div className="flex w-full justify-between py-2">
                  <p>Total</p>
                  <p>R$ {total.toFixed(2)}</p>
                </div>

                <Separator />
                <div className="flex w-full justify-between py-2">
                  <p>Descontos</p>
                  <p>R$ {totalDiscounts.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
