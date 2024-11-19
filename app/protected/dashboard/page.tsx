'use client'

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast, useToast } from "@/hooks/use-toast"
import { Loader2, X } from 'lucide-react'
import UserTable from "./UsersTable"
import Pagination from "./Pagination"
import debounce from 'lodash.debounce'

// Initialize Supabase client
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

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [sortBy, setSortBy] = useState("name")
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
        .order(sortBy, { ascending: true })
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
  }, [filter, sortBy, currentPage, toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilter(value)
      setCurrentPage(1)
    }, 800),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchInput(value)
    debouncedSearch(value)
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
    setSortBy("name")
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
    <div className="container lg:w-[900px] mx-auto py-10 bg-blue-50">
      <h1 className="text-2xl font-bold mb-5 text-blue-800">Users Dashboard</h1>
      <div className="mb-4 flex gap-4 items-center">
        <div className="relative flex-grow max-w-sm">
          <Input
            placeholder="Filter by name"
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
        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value)
          }}
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="email">Sort by Email</SelectItem>
            <SelectItem value="age">Sort by Age</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
      <UserTable
        users={users}
        updateUser={updateUser}
        deleteUser={deleteUser}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}