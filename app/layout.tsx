import type { Metadata } from 'next';
import { Geist, Geist_Mono, EB_Garamond } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'First, Do No Harm — An Ethics Decision Simulator',
  description:
    'A scenario-based simulator exploring the ethical dilemmas of deploying AI diagnostic tools in healthcare. Play the role of a hospital administrator navigating real tradeoffs between lives saved, equity, consent, and accountability.',
  openGraph: {
    title: 'First, Do No Harm',
    description: 'An ethics decision simulator for the AI age.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ebGaramond.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
