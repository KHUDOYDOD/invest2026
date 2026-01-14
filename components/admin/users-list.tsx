"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Ban, Mail, Users, Loader2, DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface User {
  id: number
  name: string
  email: string
  registrationDate: string
  lastLogin: string
  status: string
  balance: number
}

interface UsersListProps {
  searchQuery?: string
  filter?: string
}

export function UsersList({ searchQuery = "", filter = "all" }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [balanceAmount, setBalanceAmount] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [messageText, setMessageText] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      
      if (!response.ok) {
        throw new Error('Failed to load users')
      }
      
      const data = await response.json()
      
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users.map((user: any) => ({
          id: user.id,
          name: user.full_name || user.email,
          email: user.email,
          registrationDate: user.created_at,
          lastLogin: user.last_login || user.created_at,
          status: user.status || 'active',
          balance: parseFloat(user.balance || 0)
        })))
      }
    } catch (err) {
      console.error('Error loading users:', err)
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  // Filter users based on search query and filter
  const filteredUsers = users.filter((user) => {
    // Filter by search query
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && user.status === "active") ||
      (filter === "blocked" && user.status === "blocked") ||
      (filter === "new" && user.status === "new")

    return matchesSearch && matchesFilter
  })

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditedName(user.name)
    setEditedEmail(user.email)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedUser || !editedName || !editedEmail) {
      toast.error("Заполните все поля")
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedName,
          email: editedEmail
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      const data = await response.json()

      if (data.success) {
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, name: editedName, email: editedEmail }
            : user
        ))
        toast.success("Пользователь обновлен")
        setEditDialogOpen(false)
        setSelectedUser(null)
      } else {
        throw new Error(data.error || 'Failed to update user')
      }
    } catch (err) {
      console.error('Error updating user:', err)
      toast.error(err instanceof Error ? err.message : 'Ошибка при обновлении пользователя')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSendMessage = (user: User) => {
    setSelectedUser(user)
    setMessageText("")
    setMessageDialogOpen(true)
  }

  const handleSendMessageSubmit = async () => {
    if (!selectedUser || !messageText.trim()) {
      toast.error("Введите текст сообщения")
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          message: messageText
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      if (data.success) {
        toast.success("Сообщение отправлено")
        setMessageDialogOpen(false)
        setSelectedUser(null)
        setMessageText("")
      } else {
        throw new Error(data.error || 'Failed to send message')
      }
    } catch (err) {
      console.error('Error sending message:', err)
      toast.error(err instanceof Error ? err.message : 'Ошибка при отправке сообщения')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBlockUser = async (user: User) => {
    const newStatus = user.status === "blocked" ? "active" : "blocked"
    
    try {
      const response = await fetch('/api/admin/users/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          status: newStatus
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update user status')
      }

      const data = await response.json()

      if (data.success) {
        setUsers(users.map(u => 
          u.id === user.id 
            ? { ...u, status: newStatus }
            : u
        ))
        toast.success(newStatus === "blocked" ? "Пользователь заблокирован" : "Пользователь разблокирован")
      } else {
        throw new Error(data.error || 'Failed to update user status')
      }
    } catch (err) {
      console.error('Error updating user status:', err)
      toast.error(err instanceof Error ? err.message : 'Ошибка при изменении статуса')
    }
  }

  const handleDeleteUser = async (user: User) => {
    if (!confirm("Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      const data = await response.json()

      if (data.success) {
        setUsers(users.filter(u => u.id !== user.id))
        toast.success("Пользователь удален")
      } else {
        throw new Error(data.error || 'Failed to delete user')
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      toast.error(err instanceof Error ? err.message : 'Ошибка при удалении пользователя')
    }
  }

  const handleAddBalance = async () => {
    if (!selectedUser || !balanceAmount) {
      toast.error("Введите сумму")
      return
    }

    const amount = parseFloat(balanceAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Введите корректную сумму")
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch('/api/admin/users/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: amount
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update balance')
      }

      const data = await response.json()

      if (data.success) {
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, balance: data.newBalance }
            : user
        ))
        toast.success(`Баланс пополнен на $${amount}`)
        setSelectedUser(null)
        setBalanceAmount("")
      } else {
        throw new Error(data.error || 'Failed to update balance')
      }
    } catch (err) {
      console.error('Error updating balance:', err)
      toast.error(err instanceof Error ? err.message : 'Ошибка при пополнении баланса')
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <span className="ml-3 text-slate-600">Загрузка пользователей...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadUsers} variant="outline">
          Попробовать снова
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50">
            <th className="h-12 px-4 text-left font-medium">ID</th>
            <th className="h-12 px-4 text-left font-medium">Имя</th>
            <th className="h-12 px-4 text-left font-medium">Email</th>
            <th className="h-12 px-4 text-left font-medium">Регистрация</th>
            <th className="h-12 px-4 text-left font-medium">Последний вход</th>
            <th className="h-12 px-4 text-left font-medium">Статус</th>
            <th className="h-12 px-4 text-left font-medium">Баланс</th>
            <th className="h-12 px-4 text-left font-medium">Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-4 align-middle">{user.id}</td>
                <td className="p-4 align-middle">{user.name}</td>
                <td className="p-4 align-middle">{user.email}</td>
                <td className="p-4 align-middle">{new Date(user.registrationDate).toLocaleDateString("ru-RU")}</td>
                <td className="p-4 align-middle">{new Date(user.lastLogin).toLocaleDateString("ru-RU")}</td>
                <td className="p-4 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : user.status === "blocked"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.status === "active" ? "Активен" : user.status === "blocked" ? "Заблокирован" : "Новый"}
                  </span>
                </td>
                <td className="p-4 align-middle">${user.balance.toFixed(2)}</td>
                <td className="p-4 align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span>Пополнить баланс</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Редактировать</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendMessage(user)}>
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Отправить сообщение</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBlockUser(user)}>
                        <Ban className="mr-2 h-4 w-4" />
                        <span>{user.status === "blocked" ? "Разблокировать" : "Заблокировать"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Удалить</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-8 text-center">
                <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Нет пользователей</h3>
                <p className="text-slate-500">Пользователи будут отображаться здесь после регистрации</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Balance Dialog */}
      <Dialog open={!!selectedUser && !editDialogOpen && !messageDialogOpen} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Пополнить баланс</DialogTitle>
            <DialogDescription>
              Пополнение баланса пользователя {selectedUser?.name} ({selectedUser?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Текущий баланс</Label>
              <div className="text-2xl font-bold text-green-600">
                ${selectedUser?.balance.toFixed(2)}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Сумма пополнения</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Введите сумму"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            {balanceAmount && parseFloat(balanceAmount) > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-900">
                  Новый баланс: <span className="font-bold">${(selectedUser?.balance + parseFloat(balanceAmount)).toFixed(2)}</span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)} disabled={isUpdating}>
              Отмена
            </Button>
            <Button onClick={handleAddBalance} disabled={isUpdating || !balanceAmount}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Обработка...
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Пополнить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать пользователя</DialogTitle>
            <DialogDescription>
              Изменение данных пользователя
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Имя</Label>
              <Input
                id="edit-name"
                type="text"
                placeholder="Введите имя"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Введите email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={isUpdating}>
              Отмена
            </Button>
            <Button onClick={handleSaveEdit} disabled={isUpdating || !editedName || !editedEmail}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Сохранить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отправить сообщение</DialogTitle>
            <DialogDescription>
              Отправка сообщения пользователю {selectedUser?.name} ({selectedUser?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message-text">Текст сообщения</Label>
              <textarea
                id="message-text"
                className="w-full min-h-[120px] px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите текст сообщения..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)} disabled={isUpdating}>
              Отмена
            </Button>
            <Button onClick={handleSendMessageSubmit} disabled={isUpdating || !messageText.trim()}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Отправить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
