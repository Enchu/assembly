import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import React from 'react';
import Header from '@/components/layouts/Header/Header';
import Footer from '@/components/layouts/Footer/Footer';

const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
	variable: '--font-jetbrainsMono',
});

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${jetbrainsMono.variable} antialiased`}>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
