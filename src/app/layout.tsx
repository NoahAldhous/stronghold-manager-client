import NavBar from "components/NavBar/NavBar"
import { AuthProvider } from "contexts/AuthContext"
import "./globals.scss";

export default function RootLayout({
    children,
}: {
    children:React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <NavBar/>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}