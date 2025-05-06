import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Maid Mayhem',
  description: 'A fun game where you collect food items as a cute minion maid!',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no', // For mobile-first layout
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`antialiased h-full`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
