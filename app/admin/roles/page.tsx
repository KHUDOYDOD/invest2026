"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Shield,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Crown,
  UserCog,
  Lock,
  Unlock,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
  userCount: number
  color: string
  icon: any
}

const defaultRoles: Role[] = [
  {
    id: 1,
    name: "Супер Админ",
    description: "Полный доступ ко всем функциям системы",
    permissions: ["all"],
    userCount: 2,
    color: "from-red-500 to-pink-600",
    icon: Crown,
  },
  {
    id: 2,
    name: "Администратор",
    description: "Управление пользователями и контентом",
    permissions: ["users.manage", "content.manage", "transactions.view", "settings.manage"],
    userCount: 5,
    color: "from-purple-500 to-indigo-600",
    icon: Shield,
  },
  {
    id: 3,
    name: "Модератор",
    description: "Модерация контента и поддержка пользователей",
    permissions: ["content.moderate", "users.view", "support.manage"],
    userCount: 12,
    color: "from-blue-500 to-cyan-600",
    icon: UserCog,
  },
  {
    id: 4,
    name: "Пользователь",
    description: "Стандартные права пользователя",
    permissions: ["profile.manage", "investments.manage"],
    userCount: 15420,
    color: "from-green-500 to-emerald-600",
    icon: Users,
  },
]

const allPermissions = [
  { id: "users.manage", name: "Управление пользователями", category: "Пользователи" },
  { id: "users.view", name: "Просмотр пользователей", category: "Пользователи" },
  { id: "users.delete", name: "Удаление пользователей", category: "Пользователи" },
  { id: "content.manage", name: "Управление контентом", category: "Контент" },
  { id: "content.moderate", name: "Модерация контента", category: "Контент" },
  { id: "transactions.manage", name: "Управление транзакциями", category: "Финансы" },
  { id: "transactions.view", name: "Просмотр транзакций", category: "Финансы" },
  { id: "settings.manage", name: "Управление настройками", category: "Система" },
  { id: "support.manage", name: "Управление поддержкой", category: "Поддержка" },
  { id: "profile.manage", name: "Управление профилем", category: "Профиль" },
  { id: "investments.manage", name: "Управление инвестициями", category: "Инвестиции" },
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(defaultRoles)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateRole = () => {
    setIsCreating(true)
    setSelectedRole({
      id: Date.now(),
      name: "",
      description: "",
      permissions: [],
      userCount: 0,
      color: "from-gray-500 to-gray-600",
      icon: Shield,
    })
  }

  const handleSaveRole = () => {
    if (!selectedRole) return

    if (isCreating) {
      setRoles([...roles, selectedRole])
      toast.success("Роль успешно создана!")
    } else {
      setRoles(roles.map((r) => (r.id === selectedRole.id ? selectedRole : r)))
      toast.success("Роль успешно обновлена!")
    }

    setIsCreating(false)
    setIsEditing(false)
    setSelectedRole(null)
  }

  const handleDeleteRole = (roleId: number) => {
    if (confirm("Вы уверены, что хотите удалить эту роль?")) {
      setRoles(roles.filter((r) => r.id !== roleId))
      toast.success("Роль успешно удалена!")
    }
  }

  const togglePermission = (permissionId: string) => {
    if (!selectedRole) return

    const hasPermission = selectedRole.permissions.includes(permissionId)
    const newPermissions = hasPermission
      ? selectedRole.permissions.filter((p) => p !== permissionId)
      : [...selectedRole.permissions, permissionId]

    setSelectedRole({ ...selectedRole, permissions: newPermissions })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
            👑 Управление ролями
          </h1>
          <p className="text-slate-400 text-lg">Настройка ролей и прав доступа пользователей</p>
        </div>
        <Button onClick={handleCreateRole} className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Plus className="h-4 w-4 mr-2" />
          Создать роль
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-2 space-y-4">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 bg-gradient-to-r ${role.color} rounded-xl`}>
                        <role.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{role.name}</h3>
                          <Badge variant="secondary" className="bg-slate-700">
                            {role.userCount} {role.userCount === 1 ? "пользователь" : "пользователей"}
                          </Badge>
                        </div>
                        <p className="text-slate-400 mb-4">{role.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.includes("all") ? (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                              <Crown className="h-3 w-3 mr-1" />
                              Все права
                            </Badge>
                          ) : (
                            role.permissions.slice(0, 3).map((perm) => (
                              <Badge key={perm} variant="outline" className="border-slate-600 text-slate-300">
                                {allPermissions.find((p) => p.id === perm)?.name || perm}
                              </Badge>
                            ))
                          )}
                          {role.permissions.length > 3 && !role.permissions.includes("all") && (
                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                              +{role.permissions.length - 3} еще
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedRole(role)
                          setIsEditing(true)
                          setIsCreating(false)
                        }}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {role.id > 2 && ( // Не даем удалять системные роли
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Role Editor */}
        <div className="lg:col-span-1">
          {(isEditing || isCreating) && selectedRole ? (
            <Card className="bg-slate-800/50 border-slate-700 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  {isCreating ? "Создание роли" : "Редактирование роли"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white">Название роли</Label>
                  <Input
                    value={selectedRole.name}
                    onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                    placeholder="Введите название"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Описание</Label>
                  <Input
                    value={selectedRole.description}
                    onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                    placeholder="Введите описание"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Права доступа</Label>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {Object.entries(
                      allPermissions.reduce((acc, perm) => {
                        if (!acc[perm.category]) acc[perm.category] = []
                        acc[perm.category].push(perm)
                        return acc
                      }, {} as Record<string, typeof allPermissions>)
                    ).map(([category, perms]) => (
                      <div key={category} className="space-y-2">
                        <p className="text-sm font-medium text-slate-400">{category}</p>
                        {perms.map((perm) => (
                          <div key={perm.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                            <span className="text-sm text-slate-300">{perm.name}</span>
                            <Switch
                              checked={selectedRole.permissions.includes(perm.id)}
                              onCheckedChange={() => togglePermission(perm.id)}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveRole} className="flex-1 bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" />
                    Сохранить
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      setIsCreating(false)
                      setSelectedRole(null)
                    }}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Отмена
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-12 text-center">
                <Shield className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400">Выберите роль для редактирования или создайте новую</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
