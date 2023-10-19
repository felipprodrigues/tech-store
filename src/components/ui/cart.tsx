import { ShoppingCartIcon } from "lucide-react";
import { Badge } from "./badge";
import { CartContext } from "@/providers/cart";
import { useContext } from "react";
import { CartItem } from "./cart-item";
import { computeProductTotalPrice } from "@/helpers/product";

export function Cart() {
  const { products } = useContext(CartContext);

  console.log(products, "aqui");
  return (
    <div className=" flex flex-col gap-8">
      <Badge
        className="w-fit gap-1 border-2 border-primary px-3 py-[0.375rem] text-base uppercase"
        variant="outline"
      >
        <ShoppingCartIcon size={16} />
        Catálogo
      </Badge>

      <div className="flex flex-col gap-5">
        {products.map((product) => (
          <CartItem
            product={computeProductTotalPrice(product as any) as any}
            key={product.id}
          />
        ))}
      </div>
    </div>
  );
}
