import Link from "next/link";
import { api } from "@/lib/api";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MapPin, Clock, Phone, Truck, Star, ShieldCheck } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  pizzas: "🍕",
  "burgers-wraps": "🍔",
  "daily-snacks": "🍗",
  beverages: "🥤",
  deals: "🎁",
};

export default async function HomePage() {
  const [featuredItems, categories] = await Promise.all([
    api.getMenuItems({ featured: true }),
    api.getCategories(),
  ]);

  return (
    <>
      {/* ─── HERO ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#8C1515]">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-6 backdrop-blur-sm border border-white/20">
              <span className="h-2 w-2 rounded-full bg-[#F5C518] animate-pulse" />
              Now delivering to DHA Phase 1, 2 &amp; 3
            </div>

            <h1 className="font-brand text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] tracking-tight">
              Crispy.{" "}
              <span className="text-[#F5C518]">Cheesy.</span>
              <br />
              Cluckin&apos; Good.
            </h1>

            <p className="mt-6 text-white/80 text-lg sm:text-xl max-w-lg leading-relaxed">
              Lahore&apos;s favourite fast food spot. Fresh burgers, pizzas &
              tenders — delivered hot to your door.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#8C1515] text-base font-bold hover:bg-[#FFF0F0] active:scale-95 transition-all duration-150 shadow-md"
              >
                Order Now
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-white/40 text-white text-base font-semibold hover:border-white hover:bg-white/10 active:scale-95 transition-all duration-150"
              >
                View Menu
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { icon: "🕐", label: "30 min delivery" },
                { icon: "💳", label: "4 payment methods" },
                { icon: "⭐", label: "Rated 4.8 / 5" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-white/80 text-sm">
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="bg-[#FFF8F5] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-brand text-3xl sm:text-4xl font-semibold text-[#1C1C1C] mb-8 text-center">
              What are you craving?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/menu#${cat.slug}`}
                  className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-[#E8E0DF] hover:border-[#8C1515]/40 hover:shadow-[0_4px_16px_0_rgba(140,21,21,0.10)] transition-all duration-200 group"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                    {CATEGORY_ICONS[cat.slug] ?? "🍴"}
                  </span>
                  <span className="font-semibold text-sm text-[#1C1C1C] text-center group-hover:text-[#8C1515] transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FEATURED ITEMS ─────────────────────────────────────────── */}
      {featuredItems.length > 0 && (
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-brand text-3xl sm:text-4xl font-semibold text-[#1C1C1C]">
                  Most Popular
                </h2>
                <p className="mt-1.5 text-[#6B6B6B]">Our customers&apos; all-time favourites</p>
              </div>
              <Link
                href="/menu"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C1515] hover:underline underline-offset-2"
              >
                See full menu →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredItems.slice(0, 6).map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C1515] hover:underline"
              >
                See full menu →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── WHY CHOOSE US ──────────────────────────────────────────── */}
      <section className="bg-[#FFF8F5] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-brand text-3xl sm:text-4xl font-semibold text-[#1C1C1C] text-center mb-10">
            Why choose us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Truck className="h-7 w-7" />,
                title: "Fast Delivery",
                desc: "Hot food delivered in ~30 min to DHA Phase 1, 2 & 3. Free delivery on orders above Rs. 1,500.",
              },
              {
                icon: <Star className="h-7 w-7" />,
                title: "Fresh Every Time",
                desc: "Every item is made fresh to order. No heat lamps. No shortcuts. Just crispy, flavourful food.",
              },
              {
                icon: <ShieldCheck className="h-7 w-7" />,
                title: "Trusted & Loved",
                desc: "Rated 4.8/5 by our customers. We take food quality and hygiene seriously — always.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="flex flex-col items-center text-center gap-4 p-7 bg-white rounded-2xl border border-[#E8E0DF]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0F0] text-[#8C1515]">
                  {card.icon}
                </div>
                <h3 className="font-brand text-xl font-semibold text-[#1C1C1C]">
                  {card.title}
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DELIVERY AREAS ─────────────────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 p-8 rounded-3xl bg-[#8C1515]">
            <div className="flex-1">
              <h2 className="font-brand text-3xl font-semibold text-white mb-2">
                We deliver to you
              </h2>
              <p className="text-white/80 text-sm mb-5">
                Currently delivering within DHA Lahore. More areas coming soon.
              </p>
              <div className="flex flex-wrap gap-3">
                {["DHA Phase 1", "DHA Phase 2", "DHA Phase 3"].map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-sm font-medium"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#F5C518]" />
                    {area}
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/menu"
              className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#8C1515] text-base font-bold hover:bg-[#FFF0F0] active:scale-95 transition-all duration-150 shadow-md"
            >
              Order Now
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CONTACT / HOURS ────────────────────────────────────────── */}
      <section id="contact" className="bg-[#FFF8F5] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-brand text-3xl sm:text-4xl font-semibold text-[#1C1C1C] mb-8 text-center">
            Find us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="flex gap-4 p-6 bg-white rounded-2xl border border-[#E8E0DF]">
              <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF0F0] text-[#8C1515]">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-[#1C1C1C] mb-2">Opening Hours</p>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">
                  Mon–Tue, Thu–Sat<br />
                  <span className="text-[#1C1C1C] font-medium">12:30pm – 11:00pm</span>
                </p>
                <p className="text-sm text-[#6B6B6B] leading-relaxed mt-1">
                  Sunday<br />
                  <span className="text-[#1C1C1C] font-medium">3:00pm – 11:00pm</span>
                </p>
                <p className="text-sm text-[#8C1515] font-semibold mt-1">Closed Wednesday</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-2xl border border-[#E8E0DF]">
              <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF0F0] text-[#8C1515]">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-[#1C1C1C] mb-2">Get in Touch</p>
                <a href="tel:+923044416620" className="text-sm text-[#8C1515] font-semibold hover:underline block">
                  0304 4416620
                </a>
                <a href="https://wa.me/923044416620" target="_blank" rel="noopener noreferrer" className="text-sm text-[#25D366] font-semibold hover:underline block mt-1">
                  WhatsApp Us
                </a>
                <a href="https://instagram.com/cluckncoop" target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6B6B] hover:text-[#8C1515] transition-colors block mt-1">
                  @cluckncoop
                </a>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-2xl border border-[#E8E0DF]">
              <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF0F0] text-[#8C1515]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-[#1C1C1C] mb-2">Location</p>
                <address className="not-italic text-sm text-[#6B6B6B] leading-relaxed">
                  838 Street No 8, Sector W<br />
                  DHA Phase 3, Lahore<br />
                  Pakistan
                </address>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#1C1C1C] p-10 sm:p-14 text-center flex flex-col items-center gap-5">
            <h2 className="font-brand text-4xl sm:text-5xl font-semibold text-white max-w-xl leading-tight">
              Ready to order?
            </h2>
            <p className="text-white/60 text-base max-w-md">
              Skip the queue. Order online and get it delivered hot to your door.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#8C1515] text-white text-base font-bold hover:bg-[#A01A1A] active:scale-95 transition-all duration-150 shadow-lg"
            >
              Order Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
