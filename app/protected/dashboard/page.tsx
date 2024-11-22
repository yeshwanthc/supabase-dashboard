'use client'

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast, useToast } from "@/hooks/use-toast"
import { Loader2, X } from 'lucide-react'
import UserTable from "./UsersTable"
import Pagination from "./Pagination"
import debounce from 'lodash.debounce'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface User {
  id: string
  name: string
  email: string
  age: number
  created_at: string
}

export interface SortConfig {
  key: keyof User
  direction: 'asc' | 'desc'
}

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const itemsPerPage = 10

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      let query = supabase
        .from("contact_info")
        .select("*", { count: 'exact' })
        .order(sortConfig.key, { ascending: sortConfig.direction === 'asc' })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)

      if (filter) {
        query = query.ilike('name', `%${filter}%`)
      }

      const { data, error, count } = await query

      if (error) throw error

      setUsers(data || [])
      setTotalPages(Math.ceil((count || 0) / itemsPerPage))
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filter, sortConfig, currentPage, toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilter(value)
      setCurrentPage(1)
    }, 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchInput(value)
    debouncedSearch(value)
  }

  const handleSort = (key: keyof User) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  async function updateUser(id: string, updatedUser: Partial<User>) {
    try {
      const { id: _, ...userDataToUpdate } = updatedUser;
      const { error } = await supabase
        .from("contact_info")
        .update(userDataToUpdate)
        .eq("id", id)

      if (error) throw error

      setUsers(users.map((user) => (user.id === id ? { ...user, ...userDataToUpdate } : user)))
      toast({
        title: "Success",
        description: "User updated successfully.",
      })
      return true
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  async function deleteUser(id: string) {
    try {
      const { error } = await supabase.from("contact_info").delete().eq("id", id)

      if (error) throw error

      setUsers(users.filter((user) => user.id !== id))
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearFilters = () => {
    setSearchInput("")
    setFilter("")
    setSortConfig({ key: 'name', direction: 'asc' })
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Users Dashboard</h1>
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-grow max-w-sm">
          <Input
            placeholder="Search by name"
            value={searchInput}
            onChange={handleSearchChange}
            className="pr-8"
          />
          {searchInput && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => {
                setSearchInput("")
                setFilter("")
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
      <UserTable
        users={users}
        updateUser={updateUser}
        deleteUser={deleteUser}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}