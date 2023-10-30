import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import LoadingScreen from "./_components/loading";
import Header from "./_components/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "minicards - online flashcards simplified",
  description: "Make remembering things easy with minicards, a free and open source flashcard web application.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
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
            <TRPCReactProvider headers={headers()}>
              <ClerkLoading>
                <LoadingScreen />
              </ClerkLoading>
              <ClerkLoaded>
                <Header />
                {children}
              </ClerkLoaded>
            </TRPCReactProvider>
          </body>
      </ClerkProvider>
    </html>
  );
}
