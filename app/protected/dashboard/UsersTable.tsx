import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { User } from "./page"
  import UserRow from "./UsersRow"
  
  interface UserTableProps {
    users: User[]
    updateUser: (id: string, updatedUser: Partial<User>) => Promise<void>
    deleteUser: (id: string) => Promise<void>
  }
  
  export default function UserTable({ users, updateUser, deleteUser }: UserTableProps) {
    return (
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader className="bg-blue-100">
            <TableRow>
              <TableHead className="w-[50px]">S.No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Age</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <UserRow
                key={user.id}
                user={user}
                index={index}
                updateUser={updateUser}
                deleteUser={deleteUser}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }