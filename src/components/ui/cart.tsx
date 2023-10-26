import { ShoppingCartIcon } from "lucide-react";
import { Badge } from "./badge";
import { CartContext } from "@/providers/cart";
import { useContext } from "react";
import { CartItem } from "./cart-item";
import { computeProductTotalPrice } from "@/helpers/product";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { Button } from "./button";
import { createCheckout } from "@/actions/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { createOrder } from "@/actions/order";
import { useSession } from "next-auth/react";

export function Cart() {
  const { data } = useSession();
  const { products, total, subTotal, totalDiscount } = useContext(CartContext);

  const handleFinishPurchaseClick = async () => {
    if (!data?.user) {
      return;
    }

    const order = await createOrder(products, (data.user as any).id);

    const checkout = await createCheckout(products, order.id);

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

    // add order to db

    stripe?.redirectToCheckout({
      sessionId: checkout.id,
    });
  };

  return (
    <div className=" flex h-full flex-col gap-8">
      <Badge variant="heading">
        <ShoppingCartIcon size={16} />
        Carrinho
      </Badge>

      <div className="flex flex-col gap-5 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex h-full flex-col gap-2">
            {products.length > 0 ? (
              products.map((product) => (
                <CartItem
                  product={computeProductTotalPrice(product as any) as any}
                  key={product.id}
                />
              ))
            ) : (
              <p className="pt-2 text-center text-sm opacity-60">
                Carrinho vazio
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {!products.length ? null : (
        <div className="flex flex-col gap-3">
          <Separator />
          <div className="div flex items-center justify-between text-xs">
            <p>Subtotal</p>
            <p>R$ {subTotal.toFixed(2)}</p>
          </div>

          <Separator />
          <div className="div flex items-center justify-between text-xs">
            <p>Entrega</p>
            <p>GRÁTIS</p>
          </div>

          <Separator />
          <div className="div flex items-center justify-between text-xs">
            <p>Descontos</p>
            <p>R$ {totalDiscount.toFixed(2)}</p>
          </div>

          <Separator />
          <div className="div flex items-center justify-between text-xs font-bold">
            <p>Total</p>
            <p>R$ {total.toFixed(2)}</p>
          </div>

          <Button
            className="mt-7 font-bold uppercase"
            onClick={handleFinishPurchaseClick}
          >
            Finalizar comprar
          </Button>
        </div>
      )}
    </div>
  );
}
