"use client";

import NavBar from "components/NavBar/NavBar"
import { useState } from "react";
import { AuthProvider } from "contexts/AuthContext"
import {IBM_Plex_Mono} from "next/font/google"
import "./globals.scss";
import ScreenEffect from "components/ScreenEffect/ScreenEffect";
import AuthWatcher from "auth/AuthWatcher";

const plexMono = IBM_Plex_Mono({weight:["300", "400", "500", "600", "700"], variable:"--font-ibm", subsets: ["latin"]});

export default function RootLayout({
    children,
}: {
    children:React.ReactNode
}) {

    const[screenEffect, setScreenEffect] = useState(true);

    return (
        <html lang="en">
            <body className={plexMono.className}>
                <AuthProvider>
                    <AuthWatcher/>
                    { screenEffect ? <ScreenEffect/> : null}
                    <NavBar screenEffect={screenEffect} setScreenEffect={setScreenEffect}/>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}