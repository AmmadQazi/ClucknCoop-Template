import type { Metadata } from "next";
import { api } from "@/lib/api";
import { MenuPageClient } from "./MenuPageClient";
import type { CategoryWithItems } from "@/types";

export const metadata: Metadata = {
  title: "Our Menu",
  description:
    "Browse our full menu — crispy burgers, pizzas, tenders, and more. Order online for delivery or pickup in DHA Lahore.",
};

async function getMenu(): Promise<CategoryWithItems[]> {
  const [categories, items] = await Promise.all([
    api.getCategories(),
    api.getMenuItems(),
  ]);

  return categories.map((cat) => ({
    ...cat,
    items: items.filter((item) => item.category.id === cat.id),
  }));
}

export default async function MenuPage() {
  const categories = await getMenu();

  return (
    <>
      {/* Page header */}
      <section className="bg-[#8C1515] py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <nav className="text-sm text-white/60 mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li className="text-white/40">/</li>
              <li className="text-white">Menu</li>
            </ol>
          </nav>
          <h1 className="font-brand text-4xl sm:text-5xl font-semibold text-white leading-tight">
            Our Menu
          </h1>
          <p className="mt-3 text-white/80 text-base max-w-xl">
            Crispy. Cheesy. Cluckin&apos; Good. Every item is made fresh to order.
          </p>
        </div>
      </section>

      {/* Menu content */}
      <MenuPageClient categories={categories as CategoryWithItems[]} />
    </>
  );
}
