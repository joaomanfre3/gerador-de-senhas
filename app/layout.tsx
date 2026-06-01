import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-jb" });

export const metadata: Metadata = {
  title: "Gerador de Senhas",
  description:
    "Gere senhas fortes e seguras na hora, com tamanho e tipos de caractere ajustáveis, medidor de força e cópia em um toque. Tudo no seu navegador.",
  applicationName: "Gerador de Senhas",
  openGraph: {
    title: "Gerador de Senhas",
    description: "Senhas fortes geradas no seu navegador, com medidor de força.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0f14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
