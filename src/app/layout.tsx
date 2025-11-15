import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import { Footer } from "@/components/Footer";
import { getCompanyDetails } from "@/lib/company";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
    const company = await getCompanyDetails();
    const companyName = company?.company_name || 'AshishSport';
    const description = company?.description || 'Discover premium sport outfits and athletic wear. Browse our collection of high-quality sportswear.';

    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
        title: `${companyName} — Sport Outfit Gallery`,
        description,
        openGraph: {
            title: `${companyName} — Sport Outfit Gallery`,
            description,
            type: "website",
        },
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="smooth-scroll">
            <body className={inter.className}>
                <HeaderWrapper />
                <main className="min-h-screen">{children}</main>
                <Footer />
            </body>
        </html>
    );
}

