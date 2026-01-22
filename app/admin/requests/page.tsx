"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  CreditCard,
  User,
  Calendar,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"

interface DepositRequest {
  id: string
  user_id: string
  amount: number
  method: string
  payment_details: any
  status: string
  admin_comment?: string
  created_at: string
  processed_at?: string
  users?: {
    id: string
    full_name: string
    email: string
  }
}

interface WithdrawalRequest {
  id: string
  user_id: string
  amount: number
  method: string
  wallet_address: string
  card_number?: string
  card_holder_name?: string
  bank_name?: string
  phone_number?: string
  account_holder_name?: string
  crypto_network?: string
  fee: number
  final_amount: number
  status: string
  admin_comment?: string
  created_at: string
  processed_at?: string
  users?: {
    id: string
    full_name: string
    email: string
  }
}

export default function RequestsPage() {
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
    // Обновляем каждые 30 секунд
    const interval = setInterval(fetchRequests, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Fetching admin requests...")

      const token = localStorage.getItem("authToken")
      if (!token) {
        console.error("No token found, redirecting to login...")
        window.location.href = "/login"
        return
      }

      // Проверяем токен
      if (token.length < 50) {
        console.error("❌ Token is corrupted (length:", token.length, "), clearing and redirecting...")
        localStorage.clear()
        window.location.href = "/login"
        return
      }

      // Fetch deposit requests
      const depositResponse = await fetch("/api/admin/deposit-requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("Deposit response status:", depositResponse.status)

      if (!depositResponse.ok) {
        const errorText = await depositResponse.text()
        console.error("Deposit error:", errorText)
        throw new Error(`HTTP error! status: ${depositResponse.status}`)
      }

      const depositData = await depositResponse.json()
      console.log("✅ Deposit requests loaded:", depositData.requests?.length || 0)
      setDepositRequests(depositData.requests || [])

      // Fetch withdrawal requests
      const withdrawalResponse = await fetch("/api/admin/withdrawal-requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("Withdrawal response status:", withdrawalResponse.status)

      if (!withdrawalResponse.ok) {
        const errorText = await withdrawalResponse.text()
        console.error("Withdrawal error:", errorText)
        throw new Error(`HTTP error! status: ${withdrawalResponse.status}`)
      }

      const withdrawalData = await withdrawalResponse.json()
      console.log("✅ Withdrawal response data:", withdrawalData)
      console.log("✅ Withdrawal requests loaded:", withdrawalData.requests?.length || 0)
      
      if (withdrawalData.requests && withdrawalData.requests.length > 0) {
        console.log("📋 First withdrawal request:", withdrawalData.requests[0])
        
        // Проверяем наличие реквизитов
        const firstReq = withdrawalData.requests[0]
        console.log("🔍 Checking payment details:", {
          has_card_number: !!firstReq.card_number,
          has_phone_number: !!firstReq.phone_number,
          has_wallet_address: !!firstReq.wallet_address,
          card_number: firstReq.card_number,
          card_holder_name: firstReq.card_holder_name,
          phone_number: firstReq.phone_number,
          wallet_address: firstReq.wallet_address
        })
      } else {
        console.log("⚠️  No withdrawal requests in response")
      }
      
      setWithdrawalRequests(withdrawalData.requests || [])
    } catch (error) {
      console.error("❌ Error fetching requests:", error)
      setError("Ошибка подключения к серверу")
      toast.error("Ошибка загрузки запросов")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveDeposit = async (requestId: string) => {
    setProcessing(requestId)
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Не авторизован")
      }

      const response = await fetch(`/api/admin/deposit-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "approved",
        }),
      })

      if (response.ok) {
        setDepositRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "approved", processed_at: new Date().toISOString() } : req,
          ),
        )
        toast.success("Запрос на пополнение одобрен")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to approve request")
      }
    } catch (error) {
      console.error("Error approving deposit:", error)
      toast.error("Ошибка при одобрении запроса")
    } finally {
      setProcessing(null)
    }
  }

  const handleRejectDeposit = async (requestId: string, reason: string) => {
    setProcessing(requestId)
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Не авторизован")
      }

      const response = await fetch(`/api/admin/deposit-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "rejected",
          admin_comment: reason,
        }),
      })

      if (response.ok) {
        setDepositRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? { ...req, status: "rejected", admin_comment: reason, processed_at: new Date().toISOString() }
              : req,
          ),
        )
        toast.success("Запрос на пополнение отклонен")
        // Перезагружаем данные
        fetchRequests()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to reject request")
      }
    } catch (error) {
      console.error("Error rejecting deposit:", error)
      toast.error("Ошибка при отклонении запроса")
    } finally {
      setProcessing(null)
    }
  }

  const handleApproveWithdrawal = async (requestId: string) => {
    console.log('🔄 Starting withdrawal approval for:', requestId)
    setProcessing(requestId)
    try {
      const token = localStorage.getItem("authToken")
      console.log('🎫 Token found:', token ? 'YES' : 'NO')
      console.log('🎫 Token length:', token?.length || 0)
      
      if (!token) {
        throw new Error("Не авторизован")
      }

      console.log('📤 Sending PATCH request to:', `/api/admin/withdrawal-requests/${requestId}`)
      console.log('📤 Request body:', { status: "approved" })

      const response = await fetch(`/api/admin/withdrawal-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "approved",
        }),
      })

      console.log('📥 Response status:', response.status)
      console.log('📥 Response ok:', response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log('📥 Response data:', data)
        
        setWithdrawalRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "approved", processed_at: new Date().toISOString() } : req,
          ),
        )
        toast.success("Запрос на вывод одобрен")
        fetchRequests()
      } else {
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
        const errorData = JSON.parse(errorText)
        throw new Error(errorData.error || "Failed to approve request")
      }
    } catch (error) {
      console.error("Error approving withdrawal:", error)
      toast.error("Ошибка при одобрении запроса")
    } finally {
      setProcessing(null)
    }
  }

  const handleRejectWithdrawal = async (requestId: string, reason: string) => {
    setProcessing(requestId)
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Не авторизован")
      }

      const response = await fetch(`/api/admin/withdrawal-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "rejected",
          admin_comment: reason,
        }),
      })

      if (response.ok) {
        setWithdrawalRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? { ...req, status: "rejected", admin_comment: reason, processed_at: new Date().toISOString() }
              : req,
          ),
        )
        toast.success("Запрос на вывод отклонен")
        fetchRequests()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to reject request")
      }
    } catch (error) {
      console.error("Error rejecting withdrawal:", error)
      toast.error("Ошибка при отклонении запроса")
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Ожидает
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Одобрено
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Отклонено
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const RequestCard = ({ request, type, onApprove, onReject }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-400 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-400/10 to-orange-500/10 rounded-tr-full"></div>
        
        <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${type === "deposit" ? "bg-gradient-to-br from-green-400 to-emerald-500" : "bg-gradient-to-br from-red-400 to-pink-500"} shadow-lg`}>
              {type === "deposit" ? (
                <DollarSign className="w-6 h-6 text-white" />
              ) : (
                <CreditCard className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-900">#{request.id}</h3>
              <p className="text-sm text-gray-600 flex items-center font-medium">
                <User className="w-4 h-4 mr-1" />
                {request.users?.full_name || request.users?.email || "Пользователь"}
              </p>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>

        <div className="space-y-3 mb-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">💰 Сумма:</span>
              <span className="font-bold text-2xl text-blue-600">${request.amount}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">Способ:</span>
            <span className="font-semibold text-gray-900">{request.method}</span>
          </div>
          
          {type === "withdrawal" && (
            <>
              {/* Реквизиты для банковской карты */}
              {request.card_number && (
                <>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-gray-700 font-medium">💳 Номер карты:</span>
                    <span className="text-sm font-mono text-gray-900">{request.card_number}</span>
                  </div>
                  {request.card_holder_name && (
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-gray-700 font-medium">👤 Владелец карты:</span>
                      <span className="text-sm font-semibold text-gray-900">{request.card_holder_name}</span>
                    </div>
                  )}
                  {request.bank_name && (
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-gray-700 font-medium">🏦 Банк:</span>
                      <span className="text-sm font-semibold text-gray-900">{request.bank_name}</span>
                    </div>
                  )}
                </>
              )}
              
              {/* Реквизиты для СБП */}
              {request.phone_number && (
                <>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-gray-700 font-medium">📱 Телефон (СБП):</span>
                    <span className="text-sm font-mono text-gray-900">{request.phone_number}</span>
                  </div>
                  {request.account_holder_name && (
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <span className="text-gray-700 font-medium">👤 Владелец:</span>
                      <span className="text-sm font-semibold text-gray-900">{request.account_holder_name}</span>
                    </div>
                  )}
                  {request.bank_name && (
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <span className="text-gray-700 font-medium">🏦 Банк СБП:</span>
                      <span className="text-sm font-semibold text-gray-900">{request.bank_name}</span>
                    </div>
                  )}
                    </div>
                  )}
                </>
              )}
              
              {/* Реквизиты для криптовалюты */}
              {request.wallet_address && (
                <>
                  {request.crypto_network && (
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <span className="text-gray-700 font-medium">🌐 Сеть:</span>
                      <span className="text-sm font-semibold text-gray-900 uppercase">{request.crypto_network}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-gray-700 font-medium">🔐 Адрес кошелька:</span>
                    <span className="text-xs font-mono text-gray-900 break-all">{request.wallet_address}</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-gray-700 font-medium">К выплате:</span>
                <span className="font-bold text-xl text-green-600">${request.final_amount}</span>
              </div>
            </>
          )}
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">📅 Дата:</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(request.created_at).toLocaleString("ru-RU")}
            </span>
          </div>
          
          {request.admin_comment && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-gray-700 font-medium mb-1">💬 Комментарий:</div>
              <div className="text-sm text-red-700">{request.admin_comment}</div>
            </div>
          )}
        </div>

        {request.status === "pending" && (
          <div className="flex space-x-3">
            <Button
              onClick={() => onApprove(request.id)}
              disabled={processing === request.id}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {processing === request.id ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5 mr-2" />
              )}
              Одобрить
            </Button>
            <Dialog open={isDialogOpen && selectedRequest?.id === request.id} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50 font-semibold shadow-lg hover:shadow-xl transition-all"
                  onClick={() => setSelectedRequest(request)}
                  disabled={processing === request.id}
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Отклонить
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Отклонить запрос #{request.id}</DialogTitle>
                  <DialogDescription>
                    Укажите причину отклонения запроса пользователя {request.users?.full_name || request.users?.email}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reason">Причина отклонения</Label>
                    <Textarea
                      id="reason"
                      placeholder="Введите причину отклонения..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onReject(request.id, rejectReason)}
                    disabled={!rejectReason.trim() || processing === request.id}
                  >
                    {processing === request.id ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Отклонить запрос
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  )

  const pendingDeposits = depositRequests.filter((req) => req.status === "pending").length
  const pendingWithdrawals = withdrawalRequests.filter((req) => req.status === "pending").length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Загрузка запросов...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">💼 Управление заявками</h1>
            <p className="text-blue-100">Обработка запросов на пополнение и вывод средств</p>
          </div>
          <div className="flex space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{pendingDeposits}</div>
              <div className="text-sm text-blue-100">Пополнений</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{pendingWithdrawals}</div>
              <div className="text-sm text-blue-100">Выводов</div>
            </div>
            <Button 
              onClick={fetchRequests} 
              variant="outline" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Обновить
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="deposits" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 bg-gradient-to-r from-slate-100 to-slate-200 p-1 rounded-xl">
          <TabsTrigger 
            value="deposits" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-semibold rounded-lg transition-all"
          >
            <DollarSign className="w-5 h-5" />
            <span>💰 Пополнения ({pendingDeposits})</span>
          </TabsTrigger>
          <TabsTrigger 
            value="withdrawals" 
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-600 data-[state=active]:text-white font-semibold rounded-lg transition-all"
          >
            <CreditCard className="w-5 h-5" />
            <span>💸 Выводы ({pendingWithdrawals})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposits" className="space-y-6 mt-6">
          <Card className="border-2 border-green-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="text-2xl flex items-center">
                <DollarSign className="w-7 h-7 mr-2 text-green-600" />
                Запросы на пополнение
              </CardTitle>
              <CardDescription className="text-base">
                Управление запросами пользователей на пополнение баланса
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {depositRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {depositRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      type="deposit"
                      onApprove={handleApproveDeposit}
                      onReject={handleRejectDeposit}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">Нет запросов на пополнение</p>
                  <p className="text-gray-400 text-sm mt-2">Все заявки обработаны</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-6 mt-6">
          <Card className="border-2 border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
              <CardTitle className="text-2xl flex items-center">
                <CreditCard className="w-7 h-7 mr-2 text-red-600" />
                Запросы на вывод
              </CardTitle>
              <CardDescription className="text-base">
                Управление запросами пользователей на вывод средств
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {withdrawalRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {withdrawalRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      type="withdrawal"
                      onApprove={handleApproveWithdrawal}
                      onReject={handleRejectWithdrawal}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">Нет запросов на вывод</p>
                  <p className="text-gray-400 text-sm mt-2">Все заявки обработаны</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}