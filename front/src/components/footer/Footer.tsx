"use clint";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-(--bg-main) text-(--text-main) border-t border-(--border)">
      <div className="px-4 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <img src="/img/logo/logo.png" alt="" className="h-10 w-auto mb-3" />

          <p>
            Play smart fantasy cricket. Create teams, join contests, and win big
            with True11Plus.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-2">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-(--puprle)">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-(--puprle)">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/how-to-play" className="hover:text-(--puprle)">
                How to Play
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-(--puprle)">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="mb-2">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/terms" className="hover:text-(--purple)">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-(--purple)">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/fairplay" className="hover:text-(--purple)">
                Fair Play
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-2">Contact</h4>
          <p>Email: support@true11plus.com</p>
          <p>Support: 24×7</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border border-(--border) text-center py-4 text-sm">
        © {new Date().getFullYear()} True11Plus. All rights reserved.
      </div>
    </footer>
  );
}
