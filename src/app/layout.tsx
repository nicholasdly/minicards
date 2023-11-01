import "~/styles/globals.css";

import { GeistSans } from 'geist/font'
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import LoadingScreen from "./_components/loading";
import Header from "./_components/header";
import { Toaster } from "react-hot-toast";

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
    <html lang="en" className={GeistSans.className}>
      <ClerkProvider>
          <body>
            <TRPCReactProvider headers={headers()}>
              <ClerkLoading>
                <LoadingScreen />
              </ClerkLoading>
              <ClerkLoaded>
                <Header />
                {children}
              </ClerkLoaded>
              <Toaster position="bottom-center" />
            </TRPCReactProvider>
          </body>
      </ClerkProvider>
    </html>
  );
}
