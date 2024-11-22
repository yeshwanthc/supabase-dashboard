'use client'

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { PlusCircle, Trash2 } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const userSchema = z.object({
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

const formSchema = z.object({
  users: z.array(userSchema).min(1, {
    message: "Please add at least one user.",
  }),
})

export default function CreateMultipleUsers() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      users: [{ name: "", phone: "", email: "", age: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "users",
    control: form.control,
  })

  const addUsers = async (newUsers: z.infer<typeof userSchema>[]) => {
    const { error } = await supabase.from("contact_info").insert(newUsers)
    if (error) {
      throw new Error(error.message)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      await addUsers(values.users)
      toast({
        title: "Users created",
        description: `Successfully added ${values.users.length} new user(s).`,
      })
      form.reset({ users: [{ name: "", phone: "", email: "", age: 0 }] })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Multiple Users</h2>
        <p className="text-gray-600 mb-6">Add multiple users to the system at once.</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader>
                  <CardTitle>User {index + 1}</CardTitle>
                  <CardDescription>Enter the details for user {index + 1}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name={`users.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`users.${index}.phone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`users.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`users.${index}.age`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input placeholder="30" {...field} />
                          </FormControl>
                          <FormDescription>Must be between 18 and 120 years old.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove User
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ name: "", phone: "", email: "", age: 0 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another User
            </Button>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Users"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

