"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast, useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Trash2 } from "lucide-react";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface User {
  id: string;
  email: string;
  created_at: string;
}

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_info")
        .select("id, email, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(id: string, updatedEmail: string) {
    try {
      const { error } = await supabase
        .from("contact_info")
        .update({ email: updatedEmail })
        .eq("id", id);

      if (error) throw error;

      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, email: updatedEmail } : user
        )
      );
      setEditingId(null);
      toast({
        title: "Success",
        description: "User updated successfully.",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function deleteUser(id: string) {
    try {
      const { error } = await supabase.from("contact_info").delete().eq("id", id);

      if (error) throw error;

      setUsers(users.filter((user) => user.id !== id));
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Users Dashboard</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {editingId === user.id ? (
                  <Input
                    defaultValue={user.email}
                    onBlur={(e) => updateUser(user.id, e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      updateUser(user.id, e.currentTarget.value)
                    }
                  />
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setEditingId(editingId === user.id ? null : user.id)
                  }
                  aria-label={editingId === user.id ? "Save" : "Edit"}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteUser(user.id)}
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
