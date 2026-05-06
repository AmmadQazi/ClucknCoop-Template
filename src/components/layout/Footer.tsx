import React from "react";
import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1C1C1C] text-white">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="font-brand text-3xl font-semibold text-white leading-tight">
                Cluck&apos;n
              </div>
              <div className="font-brand text-3xl font-semibold text-[#F5C518] leading-tight">
                Coop&apos;n
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[220px]">
              Crispy. Cheesy. Cluckin&apos; Good. Your favourite fast food spot
              in DHA Phase 3, Lahore.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://instagram.com/cluckncoop"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-gray-300 hover:bg-[#8C1515] hover:text-white transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a
                href="https://wa.me/923044416620"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-gray-300 hover:bg-[#25D366] hover:text-white transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/menu", label: "Our Menu" },
                { href: "/#contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours & Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Hours &amp; Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 mt-0.5 text-[#8C1515] shrink-0" />
                <div className="text-sm text-gray-400 leading-relaxed">
                  <div>Mon–Tue, Thu–Sat</div>
                  <div className="text-white font-medium">12:30pm – 11:00pm</div>
                  <div className="mt-1">Sunday</div>
                  <div className="text-white font-medium">3:00pm – 11:00pm</div>
                  <div className="mt-1 text-[#F5C518] font-medium">Closed Wednesday</div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 mt-0.5 text-[#8C1515] shrink-0" />
                <a
                  href="tel:+923044416620"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  0304 4416620
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-[#8C1515] shrink-0" />
                <address className="text-sm text-gray-400 not-italic leading-relaxed">
                  838 Street No 8, Sector W<br />
                  DHA Phase 3, Lahore
                </address>
              </li>
            </ul>
          </div>

          {/* Delivery Areas */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Delivery Areas
            </h3>
            <ul className="flex flex-col gap-2">
              {["DHA Phase 1", "DHA Phase 2", "DHA Phase 3"].map((area) => (
                <li key={area} className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#8C1515] shrink-0" />
                  <span className="text-sm text-gray-400">{area}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl bg-[#8C1515]/20 border border-[#8C1515]/30 p-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                Free delivery on orders above{" "}
                <span className="text-white font-semibold">Rs. 1,500</span>.
                Minimum order{" "}
                <span className="text-white font-semibold">Rs. 500</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-gray-500">
            &copy; {currentYear} Cluck&apos;n Coop&apos;n. All rights reserved.
            Made with ❤️ in Lahore, Pakistan.
          </p>
        </div>
      </div>
    </footer>
  );
}
