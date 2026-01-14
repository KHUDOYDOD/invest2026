"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  TrendingUp,
  DollarSign,
  Calendar,
  Percent,
  CheckCircle,
  XCircle
} from "lucide-react"
import { toast } from "sonner"

interface InvestmentPlan {
  id: number
  name: string
  description: string
  min_amount: number
  max_amount: number
  daily_profit: number
  duration_days: number
  payout_interval_hours: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function InvestmentsPage() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    min_amount: "",
    max_amount: "",
    daily_profit: "",
    duration_days: "",
    payout_interval_hours: "24",
    is_active: true,
  })

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/investment-plans")
      const data = await response.json()

      if (data.success) {
        setPlans(data.plans)
      } else {
        toast.error("Ошибка при загрузке планов")
      }
    } catch (error) {
      console.error("Error fetching plans:", error)
      toast.error("Ошибка при загрузке планов")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = "/api/admin/investment-plans"
      const method = editingPlan ? "PUT" : "POST"
      const body = editingPlan
        ? { id: editingPlan.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingPlan ? "План обновлен" : "План создан")
        fetchPlans()
        resetForm()
      } else {
        toast.error(data.error || "Ошибка при сохранении")
      }
    } catch (error) {
      console.error("Error saving plan:", error)
      toast.error("Ошибка при сохранении плана")
    }
  }

  const handleEdit = (plan: any) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description || "",
      min_amount: plan.min_amount.toString(),
      max_amount: plan.max_amount.toString(),
      daily_profit: plan.daily_profit.toString(),
      duration_days: plan.duration_days.toString(),
      payout_interval_hours: (plan.payout_interval_hours || 24).toString(),
      is_active: plan.is_active,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот план?")) return

    try {
      const response = await fetch(`/api/admin/investment-plans?id=${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast.success("План удален")
        fetchPlans()
      } else {
        toast.error(data.error || "Ошибка при удалении")
      }
    } catch (error) {
      console.error("Error deleting plan:", error)
      toast.error("Ошибка при удалении плана")
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingPlan(null)
    setFormData({
      name: "",
      description: "",
      min_amount: "",
      max_amount: "",
      daily_profit: "",
      duration_days: "",
      payout_interval_hours: "24",
      is_active: true,
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Управление тарифами</h1>
          <p className="text-slate-600 mt-1">Создавайте и редактируйте инвестиционные планы</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Новый тариф
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="border-2 border-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center justify-between">
              <span>{editingPlan ? "Редактировать тариф" : "Создать новый тариф"}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Название тарифа *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Например: Премиум"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration_days">Срок (дней) *</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                    placeholder="30"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Описание тарифа"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_amount">Минимальная сумма ($) *</Label>
                  <Input
                    id="min_amount"
                    type="number"
                    step="0.01"
                    value={formData.min_amount}
                    onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })}
                    placeholder="100"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="max_amount">Максимальная сумма ($) *</Label>
                  <Input
                    id="max_amount"
                    type="number"
                    step="0.01"
                    value={formData.max_amount}
                    onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })}
                    placeholder="999"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="daily_profit">Дневная доходность (%) *</Label>
                  <Input
                    id="daily_profit"
                    type="number"
                    step="0.01"
                    value={formData.daily_profit}
                    onChange={(e) => setFormData({ ...formData, daily_profit: e.target.value })}
                    placeholder="1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="payout_interval_hours">Интервал выплат (часы)</Label>
                  <Input
                    id="payout_interval_hours"
                    type="number"
                    value={formData.payout_interval_hours}
                    onChange={(e) => setFormData({ ...formData, payout_interval_hours: e.target.value })}
                    placeholder="24"
                  />
                </div>
              </div>

              {/* Предварительный расчет */}
              {formData.daily_profit && formData.duration_days && formData.min_amount && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    Предварительный расчет
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Общая доходность:</span>
                      <span className="font-bold text-blue-600">
                        {(parseFloat(formData.daily_profit) * parseInt(formData.duration_days)).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Пример (${formData.min_amount}):</span>
                      <span className="font-bold text-green-600">
                        ${(
                          parseFloat(formData.min_amount) +
                          (parseFloat(formData.min_amount) * parseFloat(formData.daily_profit) * parseInt(formData.duration_days)) / 100
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Прибыль:</span>
                      <span className="font-bold text-purple-600">
                        ${((parseFloat(formData.min_amount) * parseFloat(formData.daily_profit) * parseInt(formData.duration_days)) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_active">Активный тариф</Label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Plans List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Загрузка тарифов...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-1">{plan.description}</CardDescription>
                  </div>
                  <Badge className={plan.is_active ? "bg-green-500" : "bg-gray-500"}>
                    {plan.is_active ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> Активен</>
                    ) : (
                      <><XCircle className="h-3 w-3 mr-1" /> Неактивен</>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm text-slate-600">Сумма</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      ${plan.min_amount.toLocaleString()} - ${plan.max_amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Percent className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-slate-600">Доходность</span>
                    </div>
                    <span className="font-bold text-green-600">{plan.daily_profit}% в день</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="text-sm text-slate-600">Срок</span>
                    </div>
                    <span className="font-bold text-slate-900">{plan.duration_days} дней</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="text-sm text-slate-600">Общая прибыль</span>
                    </div>
                    <span className="font-bold text-orange-600">
                      {(plan.daily_profit * plan.duration_days).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-6">
                  <Button
                    onClick={() => handleEdit(plan)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>
                  <Button
                    onClick={() => handleDelete(plan.id)}
                    variant="outline"
                    className="flex-1 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
