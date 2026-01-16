import "@/css/satoshi.css";
import "@/css/style.css";
// import { Sidebar } from "@/components/Layouts/sidebar";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";
// import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "../../(main)/providers";
import '@/styles/clash-display.scss';
import '@/styles/globals.css';
import Link from "next/link";

// export const metadata: Metadata = {
//   title: {
//     template: "%s | NextAdmin - Next.js Dashboard Kit",
//     default: "NextAdmin - Next.js Dashboard Kit",
//   },
//   description:
//     "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
// };

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
      </head>
      <body>
          <Providers>
            <NextTopLoader color="#5750F1" showSpinner={false} />
            <div className="flex min-h-screen">
              <div className="w-full bg-gray-2 dark:bg-[#020d1a]">

                <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden md:p-0 2xl:p-10">
                  {children}
                </main>
              </div>
            </div>
          </Providers>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossOrigin="anonymous"></script>

      </body>
    </html>
  );
}
