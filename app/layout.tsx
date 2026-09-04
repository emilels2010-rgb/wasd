import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'Element SMP | Official Tier List',description:'The official Element SMP combat rankings.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
