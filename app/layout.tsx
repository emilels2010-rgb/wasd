import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'Inferno Rankings | Minecraft Tier List',description:'A fire-forged Minecraft points leaderboard.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
