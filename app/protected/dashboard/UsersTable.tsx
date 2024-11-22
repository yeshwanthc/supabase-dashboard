import { User, SortConfig } from "./page"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import UserRow from "./UsersRow"

interface UserTableProps {
  users: User[]
  updateUser: (id: string, updatedUser: Partial<User>) => Promise<boolean>
  deleteUser: (id: string) => Promise<void>
  sortConfig: SortConfig
  onSort: (key: keyof User) => void
}

export default function UserTable({ users, updateUser, deleteUser, sortConfig, onSort }: UserTableProps) {
  const renderSortIcon = (key: keyof User) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
    }
    return <ArrowUpDown className="h-4 w-4" />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">S.No.</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort('name')} className="font-bold">
                Name {renderSortIcon('name')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort('email')} className="font-bold">
                Email {renderSortIcon('email')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort('age')} className="font-bold">
                Age {renderSortIcon('age')}
              </Button>
            </TableHead>
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