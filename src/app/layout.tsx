import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Queso - flashcards simplified",
  description: "Queso is a free and open-source flashcard application.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={`font-sans ${inter.variable}`}>
          <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
