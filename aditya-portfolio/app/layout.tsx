import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Aditya Raj - Biotechnology Student & Data Analytics Enthusiast",
  description:
    "Personal portfolio of Aditya Raj, undergraduate Biotechnology student at Delhi Technological University, passionate about data analytics, data science and machine learning.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
