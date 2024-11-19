import DeployButton from "@/components/deploy-button"
import { EnvVarWarning } from "@/components/env-var-warning"
import HeaderAuth from "@/components/header-auth"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { hasEnvVars } from "@/utils/supabase/check-env-vars"
import { GeistSans } from "geist/font/sans"
import { ThemeProvider } from "next-themes"
import Link from "next/link"
import "./globals.css"
import { Button } from "@/components/ui/button"
import { Home, Users, UserPlus, Github, Twitter, Linkedin } from 'lucide-react'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Form",
  description: "The fastest way to build apps with Next.js and Supabase",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
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
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <nav className="container flex h-16 items-center">
                <div className="mr-4 hidden md:flex">
                  <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Home className="h-6 w-6" />
                    <span className="hidden font-bold sm:inline-block">
                      Form
                    </span>
                  </Link>
                  <div className="flex gap-6 text-sm">
                    <Link
                      href="/protected/create-user"
                      className="flex items-center text-foreground/60 transition-colors hover:text-foreground/80"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create User
                    </Link>
                    <Link
                      href="/protected/dashboard"
                      className="flex items-center text-foreground/60 transition-colors hover:text-foreground/80"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Users
                    </Link>
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                  <div className="w-full flex-1 md:w-auto md:flex-none">
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  </div>
                </div>
              </nav>
            </header>
            <main className="flex-1 container py-6">
              <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                {children}
              </div>
            </main>
            <footer className="border-t bg-muted/50">
              <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">About Form</h3>
                    <p className="text-sm text-muted-foreground">
                      Form is a powerful application built with Next.js and Supabase, 
                      designed to streamline user management and data collection processes.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">Quick Links</h3>
                    <ul className="flex flex-col gap-2 text-sm">
                      <li>
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link href="/protected/create-user" className="text-muted-foreground hover:text-foreground transition-colors">
                          Create User
                        </Link>
                      </li>
                      <li>
                        <Link href="/protected/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                          Users Dashboard
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">Connect with Us</h3>
                    <div className="flex gap-4">
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Github className="h-6 w-6" />
                        <span className="sr-only">GitHub</span>
                      </a>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Twitter className="h-6 w-6" />
                        <span className="sr-only">Twitter</span>
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
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
  )
}