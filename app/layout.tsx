import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { Home, Users, UserPlus, Github, Twitter, Linkedin } from "lucide-react";
import Header from "@/components/header/Header";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CRUD",
  description: "CRUD app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex">
              <div className="flex flex-col gap-8 w-full mx-auto">
                {children}
              </div>
            </main>
            <footer className="border-t bg-muted/50">
              <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">About Form</h3>
                    <p className="text-sm text-muted-foreground">
                      Form is a powerful application built with Next.js and
                      Supabase, designed to streamline user management and data
                      collection processes.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">Quick Links</h3>
                    <ul className="flex flex-col gap-2 text-sm">
                      <li>
                        <Link
                          href="/"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/protected/create-user"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Create User
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/protected/dashboard"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Users Dashboard
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">Connect with Us</h3>
                    <div className="flex gap-4">
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="h-6 w-6" />
                        <span className="sr-only">GitHub</span>
                      </a>
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Twitter className="h-6 w-6" />
                        <span className="sr-only">Twitter</span>
                      </a>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Linkedin className="h-6 w-6" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t pt-8 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between sm:items-center">
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Form. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
