'use client'

import { useState } from "react"
import { User } from "./page"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Check, X } from 'lucide-react'

interface UserRowProps {
  user: User
  index: number
  updateUser: (id: string, updatedUser: Partial<User>) => Promise<boolean>
  deleteUser: (id: string) => Promise<void>
}

export default function UserRow({ user, index, updateUser, deleteUser }: UserRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const { id, ...userDataToUpdate } = editedUser;
      const success = await updateUser(user.id, userDataToUpdate)
      if (success) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Failed to save user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedUser.name}
            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
          />
        ) : (
          user.name
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedUser.email}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
          />
        ) : (
          user.email
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editedUser.age}
            onChange={(e) => setEditedUser({ ...editedUser, age: parseInt(e.target.value) })}
          />
        ) : (
          user.age
        )}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={isLoading}
              aria-label="Save"
              className="text-green-600 hover:text-green-800"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={isLoading}
              aria-label="Cancel"
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            aria-label="Edit"
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteUser(user.id)}
          aria-label="Delete"
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}