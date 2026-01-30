"use client";

import { true11SocialMedia } from "@/common/SocialMediaData";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen w-full font-sans bg-slate-50">
      <div className="hidden lg:flex w-1/2 sticky top-0 h-screen flex-col items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/img/background/auth-background.webp"
            alt="Students collaborating"
            fill
            priority
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-indigo-900/95 via-purple-900/80 to-blue-900/90 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-12 w-full max-w-xl">
          <div className="w-32 h-12 relative">
            <Image
              src={`/img/logo/logo.png`}
              alt="Logo"
              className="object-cover rounded-xl"
              fill
            />
          </div>

          <h1 className="text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-md">
            Elevate Your <span className="text-blue-300">Future.</span>
          </h1>

          <div className="space-y-4 mb-12">
            <p className="text-xl font-medium text-blue-50 tracking-wide leading-relaxed">
              The global platform for Grade 6-12 students to build a powerful
              personal brand and master leadership.
            </p>
            <p className="text-sm text-indigo-200/80 italic font-light">
              Join thousands of young leaders from across the globe.
            </p>
          </div>

          <div className="w-full border-t border-white/10 pt-8 mt-4">
            <p className="mb-6 text-xs font-bold tracking-[0.2em] text-indigo-200 uppercase">
              Join Our Global Community
            </p>
            <div className="flex gap-5 justify-center">
              {true11SocialMedia?.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    href={`${item?.href}`}
                    key={item.label}
                    target="_blank"
                    aria-label={item.label}
                    style={{ backgroundColor: item.color }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl cursor-pointer text-white shadow-lg transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-white"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 z-10 text-[10px] text-indigo-200/40 font-bold uppercase tracking-widest">
          © {currentYear} Days International. Shaping Global Leaders.
        </div>
      </div>

      <main className="flex w-full lg:w-1/2 items-center justify-center bg-white px-6 py-12 lg:px-24 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
