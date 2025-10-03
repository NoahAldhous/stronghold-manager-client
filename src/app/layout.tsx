import NavBar from "components/NavBar/NavBar"
import { useState } from "react";
import { AuthProvider } from "contexts/AuthContext"
import {IBM_Plex_Mono} from "next/font/google"
import type { Metadata } from "next";
import "./globals.scss";
import AuthWatcher from "auth/AuthWatcher";

const plexMono = IBM_Plex_Mono({weight:["300", "400", "500", "600", "700"], variable:"--font-ibm", subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Stronghold Manager",
    description: "Digital stronghold builder and stronghold sheet.",
  };

export default function RootLayout({
    children,
}: {
    children:React.ReactNode
}) {

    return (
        <html lang="en">
            <body className={plexMono.className}>
                <AuthProvider>
                    <AuthWatcher/>
                    <NavBar/>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}