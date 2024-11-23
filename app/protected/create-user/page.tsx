'use client'

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { UploadComponent } from "@/components/UploadComponent"

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
  image: z.string().url().optional(),
})

export default function CreateUser() {
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      age: 0,
      image: "",
    },
  })

  const addUser = async (newUser: z.infer<typeof formSchema>) => {
    const { error } = await supabase.from("contact_info").insert([newUser])
    if (error) {
      throw new Error(error.message)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      if (imageUrl) {
        values.image = imageUrl
      }
      await addUser(values)
      toast({
        title: "User created",
        description: "The new user has been successfully added.",
      })
      form.reset()
      setImageUrl(null)
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

  const handleImageUpload = (url: string) => {
    setImageUrl(url)
    form.setValue('image', url)
  }

  return (
    <div className="w-full bg-gray-100 py-8 px-4">
      <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create User</h2>
        <p className="text-gray-600 mb-6">Add a new user to the system.</p>
    
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                type="text"
                id="name"
                placeholder="John Doe"
                {...form.register("name")}
              />
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.name?.message}</p>
            </div>
    
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                type="tel"
                id="phone"
                placeholder="1234567890"
                {...form.register("phone")}
              />
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.phone?.message}</p>
            </div>
          </div>
    
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              id="email"
              placeholder="john@example.com"
              {...form.register("email")}
            />
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.email?.message}</p>
          </div>
    
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <Input
              type="number"
              id="age"
              placeholder="30"
              {...form.register("age")}
            />
            <p className="text-sm text-gray-600 mt-1">Must be between 18 and 120 years old.</p>
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.age?.message}</p>
          </div>
    
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>
            <UploadComponent onUploadComplete={handleImageUpload} />
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Profile" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>
    
          <Button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create User"}
          </Button>
        </form>
      </div>
    </div>
  )
}

