// "use client";

import Image from "next/image";

import Categories from "./components/categories";
import { prismaClient } from "@/lib/prisma";

import ProductList from "../../components/ui/product-list";

import Banner from "../../assets/Banner.png";
import BannerMouse from "../../assets/banner-mouses.png";
import BannerHeadphone from "../../assets/banner-fones.png";

import { SectionTitle } from "./components/section-title";
import { PromoBanner } from "./components/promo-banner";

export default async function Home() {
  const deals = await prismaClient.product.findMany({
    where: {
      discountPercentage: {
        // higher than 0
        gt: 0,
      },
    },
  });

  const keyboards = await prismaClient.product.findMany({
    where: {
      category: {
        slug: "keyboards",
      },
    },
  });

  const mouses = await prismaClient.product.findMany({
    where: {
      category: {
        slug: "mouses",
      },
    },
  });

  return (
    <div className="flex flex-col gap-8 py-8">
      <PromoBanner src={Banner} alt="até 55% de desconto esse mês" />

      <div className="px-5">
        <Categories />
      </div>

      <div>
        <SectionTitle>Ofertas</SectionTitle>
        <ProductList products={deals} />
      </div>

      <PromoBanner src={BannerMouse} alt="até 55% de desconto esse mês" />

      <div>
        <SectionTitle>Teclados</SectionTitle>
        <ProductList products={keyboards} />
      </div>

      <PromoBanner src={BannerHeadphone} alt="até 55% de desconto esse mês" />

      <div>
        <SectionTitle>Mouses</SectionTitle>
        <ProductList products={mouses} />
      </div>
    </div>
  );
}
