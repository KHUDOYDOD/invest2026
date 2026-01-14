"use client"
import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CreditCard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Calendar,
  DollarSign,
  AlertCircle
} from "lucide-react"

interface Request {
  id: string
  amount: number
  method: string
  status: string
  createdAt: string
  adminComment?: string
  paymentDetails?: any
}

export default function RequestsPage() {
  const [depositRequests, setDepositRequests] = useState<Request[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    setLoading(true)
    const token = localStorage.getItem("authToken")
    const userId = localStorage.getItem("userId")
    
    if (token && userId) {
      try {
        // Загружаем заявки на пополнение
        const depositResponse = await fetch(`/api/user/deposit-requests?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const depositData = await depositResponse.json()
        setDepositRequests(depositData.requests || [])

        // Загружаем заявки на вывод
        const withdrawalResponse = await fetch(`/api/user/withdrawal-requests?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const withdrawalData = await withdrawalResponse.json()
        setWithdrawalRequests(withdrawalData.requests || [])
      } catch (error) {
        console.error('Ошибка загрузки заявок:', error)
      }
    }
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { 
        label: 'Ожидает', 
        variant: 'secondary' as const, 
        icon: Clock,
        color: 'text-yellow-600 bg-yellow-100'
      },
      approved: { 
        label: 'Одобрена', 
        variant: 'default' as const, 
        icon: CheckCircle,
        color: 'text-green-600 bg-green-100'
      },
      rejected: { 
        label: 'Отклонена', 
        variant: 'destructive' as const, 
        icon: XCircle,
        color: 'text-red-600 bg-red-100'
      },
      processing: { 
        label: 'Обрабатывается', 
        variant: 'outline' as const, 
        icon: RefreshCw,
        color: 'text-blue-600 bg-blue-100'
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} border-0 font-medium`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const RequestCard = ({ request, type }: { request: Request, type: 'deposit' | 'withdrawal' }) => (
    <Card className="bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-200 border-2 border-white/30 hover:border-blue-400/50">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {type === 'deposit' ? (
              <div className="p-2 bg-green-100 rounded-full">
                <ArrowUpCircle className="w-5 h-5 text-green-600" />
              </div>
            ) : (
              <div className="p-2 bg-red-100 rounded-full">
                <ArrowDownCircle className="w-5 h-5 text-red-600" />
              </div>
            )}
            {type === 'deposit' ? 'Пополнение' : 'Вывод средств'}
          </CardTitle>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <span className="text-xs text-gray-600 block">Сумма:</span>
              <span className="font-bold text-xl text-gray-900">
                {formatAmount(request.amount)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <div>
              <span className="text-xs text-gray-600 block">Способ:</span>
              <span className="font-semibold text-gray-900">{request.method}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <Calendar className="w-5 h-5 text-gray-600" />
          <div>
            <span className="text-xs text-gray-600 block">Создана:</span>
            <span className="text-sm font-medium text-gray-900">{formatDate(request.createdAt)}</span>
          </div>
        </div>

        {request.adminComment && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-900 mb-1">Комментарий администратора:</p>
                <p className="text-sm text-blue-800 leading-relaxed">{request.adminComment}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-600 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-3 border border-gray-200 font-mono">
          <span className="font-semibold">ID заявки:</span> {request.id}
        </div>
      </CardContent>
    </Card>
  )

  const EmptyState = ({ type }: { type: 'deposit' | 'withdrawal' }) => (
    <Card className="text-center py-12 bg-white/95 backdrop-blur-sm border-2 border-white/30">
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
            {type === 'deposit' ? (
              <ArrowUpCircle className="w-16 h-16 text-gray-400" />
            ) : (
              <ArrowDownCircle className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {type === 'deposit' ? 'Нет заявок на пополнение' : 'Нет заявок на вывод'}
            </h3>
            <p className="text-gray-600 mb-6 text-base">
              {type === 'deposit' 
                ? 'Вы еще не создавали заявок на пополнение баланса'
                : 'Вы еще не создавали заявок на вывод средств'
              }
            </p>
            <Button 
              onClick={() => window.location.href = type === 'deposit' ? '/dashboard/deposit' : '/dashboard/withdraw'}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 text-base shadow-lg hover:shadow-xl transition-all"
            >
              {type === 'deposit' ? '💰 Пополнить баланс' : '💸 Вывести средства'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <DashboardHeader />
        <div className="flex">
          <DashboardNav activeItem="requests" />
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Заголовок */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">💳 Мои заявки</h1>
                <p className="text-blue-200">Управляйте своими заявками на пополнение и вывод средств</p>
              </div>

              {/* Кнопка обновления */}
              <div className="mb-6">
                <Button 
                  onClick={loadRequests}
                  disabled={loading}
                  className="bg-white/95 backdrop-blur-sm border-2 border-white/30 text-gray-800 hover:bg-white hover:shadow-lg font-semibold transition-all"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Обновить
                </Button>
              </div>

              {/* Вкладки */}
              <Tabs defaultValue="deposits" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-white/95 backdrop-blur-sm border-2 border-white/30 p-1 shadow-lg">
                  <TabsTrigger 
                    value="deposits" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white text-gray-700 font-semibold data-[state=active]:shadow-lg transition-all"
                  >
                    <ArrowUpCircle className="w-4 h-4 mr-2" />
                    Пополнения ({depositRequests.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="withdrawals"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-600 data-[state=active]:text-white text-gray-700 font-semibold data-[state=active]:shadow-lg transition-all"
                  >
                    <ArrowDownCircle className="w-4 h-4 mr-2" />
                    Выводы ({withdrawalRequests.length})
                  </TabsTrigger>
                </TabsList>

                {/* Заявки на пополнение */}
                <TabsContent value="deposits" className="space-y-4">
                  {loading ? (
                    <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
                      <CardContent className="flex items-center justify-center py-12">
                        <RefreshCw className="w-6 h-6 animate-spin mr-2 text-blue-600" />
                        <span className="text-gray-800 font-medium">Загрузка заявок...</span>
                      </CardContent>
                    </Card>
                  ) : depositRequests.length > 0 ? (
                    <div className="grid gap-4">
                      {depositRequests.map(request => (
                        <RequestCard key={request.id} request={request} type="deposit" />
                      ))}
                    </div>
                  ) : (
                    <EmptyState type="deposit" />
                  )}
                </TabsContent>

                {/* Заявки на вывод */}
                <TabsContent value="withdrawals" className="space-y-4">
                  {loading ? (
                    <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
                      <CardContent className="flex items-center justify-center py-12">
                        <RefreshCw className="w-6 h-6 animate-spin mr-2 text-blue-600" />
                        <span className="text-gray-800 font-medium">Загрузка заявок...</span>
                      </CardContent>
                    </Card>
                  ) : withdrawalRequests.length > 0 ? (
                    <div className="grid gap-4">
                      {withdrawalRequests.map(request => (
                        <RequestCard key={request.id} request={request} type="withdrawal" />
                      ))}
                    </div>
                  ) : (
                    <EmptyState type="withdrawal" />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
