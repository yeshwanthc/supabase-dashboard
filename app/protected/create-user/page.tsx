'use client'

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().regex(/^\d+$/, {
    message: "Please enter a valid phone number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  age: z.string().regex(/^\d+$/, {
    message: "Please enter a valid age.",
  }).transform(Number).refine((n) => n >= 18 && n <= 120, {
    message: "Age must be between 18 and 120.",
  }),
})

export default function CreateUser() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      age: 0,
    },
  })

  const addNote = async (newNote: z.infer<typeof formSchema>) => {
    const { error } = await supabase.from("contact_info").insert([newNote])
    if (error) {
      throw new Error(error.message)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      await addNote(values)
      toast({
        title: "User created",
        description: "The new user has been successfully added.",
      })
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full bg-gray-100 py-8 px-4">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Create User</h2>
      <p className="text-gray-600 mb-6">Add a new user to the system.</p>
  
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              {...form.control.register("name")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.name?.message}</p>
          </div>
  
          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="1234567890"
              {...form.control.register("phone")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.phone?.message}</p>
          </div>
        </div>
  
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="john@example.com"
            {...form.control.register("email")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.email?.message}</p>
        </div>
  
        {/* Age Field */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            placeholder="30"
            {...form.control.register("age")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="text-sm text-gray-600 mt-1">Must be between 18 and 120 years old.</p>
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.age?.message}</p>
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  </div>
  

  )
}