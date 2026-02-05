import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/theme';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
    title: 'My Local Shop - Quality Products for Every Occasion',
    description: 'Discover amazing products from your trusted local business. Jewelry, gifts, prints, and custom items.',
    keywords: 'ecommerce, local shop, jewelry, gifts, prints, custom items',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider>
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                            },
                            success: {
                                iconTheme: {
                                    primary: 'var(--success)',
                                    secondary: 'white',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: 'var(--error)',
                                    secondary: 'white',
                                },
                            },
                        }}
                    />
                </ThemeProvider>
            </body>
        </html>
    );
}
