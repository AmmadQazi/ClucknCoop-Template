import type { Metadata } from "next";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/providers";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cluck'n Coop'n — Crispy. Cheesy. Cluckin' Good.",
    template: "%s | Cluck'n Coop'n",
  },
  description:
    "Pakistani fast food in DHA Phase 3, Lahore. Order crispy fried chicken, burgers, pizzas and more. Delivery to DHA Phase 1, 2 & 3.",
  keywords: [
    "fried chicken",
    "fast food",
    "DHA Lahore",
    "Pakistani food",
    "chicken burger",
    "pizza delivery",
    "delivery Lahore",
  ],
  authors: [{ name: "Cluck'n Coop'n" }],
  openGraph: {
    title: "Cluck'n Coop'n — Crispy. Cheesy. Cluckin' Good.",
    description:
      "Pakistani fast food in DHA Phase 3, Lahore. Delivery to DHA Phase 1, 2 & 3.",
    type: "website",
    locale: "en_PK",
    siteName: "Cluck'n Coop'n",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${plusJakartaSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#1C1C1C] antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                toast: "font-sans text-sm rounded-xl border border-[#E8E0DF] shadow-md",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
