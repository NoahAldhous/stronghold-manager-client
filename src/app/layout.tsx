import NavBar from "components/NavBar/NavBar"
import { AuthProvider } from "contexts/AuthContext"
import {IBM_Plex_Mono} from "next/font/google"
import "./globals.scss";
import ScreenEffect from "components/ScreenEffect/ScreenEffect";

const plexMono = IBM_Plex_Mono({weight:"300", variable:"--font-ibm", subsets: ["latin"]});

export default function RootLayout({
    children,
}: {
    children:React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={plexMono.className}>
                <AuthProvider>
                    <ScreenEffect/>
                    <NavBar/>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}