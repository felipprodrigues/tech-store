import { prismaClient } from "@/lib/prisma";
import CategoryItem from "./category-item";

export default async function Categories() {
  const categories = await prismaClient.category.findMany({});

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
      {categories.map((category) => (
        <CategoryItem category={category} key={category.id} />
      ))}
    </div>
  );
}
