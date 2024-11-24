import React from 'react'
import { EnvVarWarning } from "@/components/env-var-warning"
import HeaderAuth from "@/components/header-auth"
import { hasEnvVars } from "@/utils/supabase/check-env-vars"
import Link from "next/link"
import { Home, Users, UserPlus, Github, Twitter, Linkedin } from 'lucide-react'

const Header = () => {
  return (
    <div>
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
    </div>
  )
}

export default Header
