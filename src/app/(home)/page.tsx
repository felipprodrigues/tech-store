// "use client";

import Image from "next/image";

import Banner from "../../assets/Banner.png";
import Categories from "./components/categories";
import { prismaClient } from "@/lib/prisma";

import ProductList from "./components/product-list";

export default async function Home() {
  const deals = await prismaClient.product.findMany({
    where: {
      discountPercentage: {
        // higher than 0
        gt: 0,
      },
    },
  });

  return (
    <div>
      <Image
        src={Banner}
        alt="até 55% de desconto esse mês"
        height={0}
        width={0}
        className="h-auto w-full "
        sizes="100vw"
      />

      <div className="mt-8 px-5">
        <Categories />
      </div>

      <div className="mt-5">
        <ProductList products={deals} />
      </div>
    </div>
  );
}
