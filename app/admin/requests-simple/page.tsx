"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Calendar,
  RefreshCw,
  CreditCard,
  Smartphone,
  Bitcoin,
  Copy
} from "lucide-react"
import { toast } from "sonner"
import { AdminGuard } from "@/components/admin-guard"

interface SimpleRequest {
  id: string
  user_id: string
  amount: number
  method: string
  payment_details?: any
  wallet_address?: string
  card_number?: string
  card_holder_name?: string
  bank_name?: string
  phone_number?: string
  account_holder_name?: string
  crypto_network?: string
  status: string
  admin_comment?: string
  created_at: string
  users?: {
    full_name: string
    email: string
  }
  user_name?: string
  user_email?: string
}

export default function SimpleRequestsPage() {
  const [depositRequests, setDepositRequests] = useState<SimpleRequest[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<SimpleRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<SimpleRequest | null>(null)
  const [adminComment, setAdminComment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchRequests()
    const interval = setInterval(fetchRequests, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        window.location.href = '/admin/login'
        return
      }
      
      const [depositResponse, withdrawalResponse] = await Promise.all([
        fetch('/api/admin/deposit-requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/withdrawal-requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (depositResponse.ok) {
        const depositData = await depositResponse.json()
        setDepositRequests(depositData.requests || [])
      }

      if (withdrawalResponse.ok) {
        const withdrawalData = await withdrawalResponse.json()
        setWithdrawalRequests(withdrawalData.requests || [])
      }

    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestClick = (request: SimpleRequest) => {
    setSelectedRequest(request)
    setAdminComment(request.admin_comment || "")
    setIsDialogOpen(true)
  }

  const handleApprove = async () => {
    if (!selectedRequest) return
    
    setIsProcessing(true)
    try {
      const token = localStorage.getItem('authToken')
      const endpoint = depositRequests.find(r => r.id === selectedRequest.id)
        ? `/api/admin/deposit-requests/${selectedRequest.id}`
        : `/api/admin/withdrawal-requests/${selectedRequest.id}`

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'approved',
          admin_comment: adminComment
        })
      })

      if (response.ok) {
        toast.success('Заявка одобрена!')
        setIsDialogOpen(false)
        fetchRequests()
      } else {
        toast.error('Ошибка при одобрении')
      }
    } catch (error) {
      toast.error('Ошибка при одобрении')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest) return
    
    setIsProcessing(true)
    try {
      const token = localStorage.getItem('authToken')
      const endpoint = depositRequests.find(r => r.id === selectedRequest.id)
        ? `/api/admin/deposit-requests/${selectedRequest.id}`
        : `/api/admin/withdrawal-requests/${selectedRequest.id}`

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'rejected',
          admin_comment: adminComment
        })
      })

      if (response.ok) {
        toast.success('Заявка отклонена')
        setIsDialogOpen(false)
        fetchRequests()
      } else {
        toast.error('Ошибка при отклонении')
      }
    } catch (error) {
      toast.error('Ошибка при отклонении')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Ожидает', className: 'bg-yellow-500' },
      approved: { label: 'Одобрено', className: 'bg-green-500' },
      rejected: { label: 'Отклонено', className: 'bg-red-500' }
    }
    const { label, className } = config[status as keyof typeof config] || config.pending
    return <Badge className={className}>{label}</Badge>
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Скопировано!')
  }

  // Простая карточка - только имя и сумма
  const SimpleRequestCard = ({ request, type }: { request: SimpleRequest, type: 'deposit' | 'withdrawal' }) => {
    const userName = request.users?.full_name || request.user_name || 'Неизвестный пользователь'
    
    return (
      <div
        onClick={() => handleRequestClick(request)}
        className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all border border-white/10 hover:border-blue-400/50"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg">{userName}</h3>
            <p className="text-white/60 text-sm">{type === 'deposit' ? 'Пополнение' : 'Вывод'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-white font-bold text-xl">${request.amount.toFixed(2)}</span>
            </div>
            <div className="text-white/60 text-sm">{formatDate(request.created_at)}</div>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </div>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="w-full min-h-screen p-4 lg:p-8">
          {/* Заголовок */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2 flex items-center gap-3">
                  💼 Простые Заявки
                </h1>
                <p className="text-white/70 text-lg">Кликните на заявку для просмотра реквизитов</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <div className="text-2xl font-bold text-green-400">{depositRequests.filter(r => r.status === 'pending').length}</div>
                  <div className="text-sm text-white/70">Пополнений</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <div className="text-2xl font-bold text-red-400">{withdrawalRequests.filter(r => r.status === 'pending').length}</div>
                  <div className="text-sm text-white/70">Выводов</div>
                </div>
                <Button
                  onClick={fetchRequests}
                  disabled={isLoading}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3"
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Обновить
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="withdrawals" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20 h-14 p-1">
              <TabsTrigger 
                value="deposits" 
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-white/70 font-semibold text-lg h-full rounded-lg transition-all"
              >
                📥 Пополнения ({depositRequests.filter(r => r.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger 
                value="withdrawals" 
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-white/70 font-semibold text-lg h-full rounded-lg transition-all"
              >
                💸 Выводы ({withdrawalRequests.filter(r => r.status === 'pending').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deposits" className="space-y-4">
              {isLoading ? (
                <div className="text-center py-20">
                  <RefreshCw className="w-12 h-12 animate-spin mx-auto text-white mb-6" />
                  <p className="text-white text-xl">Загрузка заявок на пополнение...</p>
                </div>
              ) : depositRequests.length === 0 ? (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="text-center py-20">
                    <div className="text-6xl mb-4">📥</div>
                    <p className="text-white/70 text-xl">Нет заявок на пополнение</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {depositRequests.map(request => (
                    <SimpleRequestCard key={request.id} request={request} type="deposit" />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="withdrawals" className="space-y-4">
              {isLoading ? (
                <div className="text-center py-20">
                  <RefreshCw className="w-12 h-12 animate-spin mx-auto text-white mb-6" />
                  <p className="text-white text-xl">Загрузка заявок на вывод...</p>
                </div>
              ) : withdrawalRequests.length === 0 ? (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="text-center py-20">
                    <div className="text-6xl mb-4">💸</div>
                    <p className="text-white/70 text-xl">Нет заявок на вывод</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {withdrawalRequests.map(request => (
                    <SimpleRequestCard key={request.id} request={request} type="withdrawal" />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Диалог с полными реквизитами */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-slate-900 to-blue-900 border-white/20 text-white max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-2xl flex items-center gap-2">
                Детали Заявки
                <div className="text-sm bg-white/10 px-2 py-1 rounded-full text-white/70">
                  📜 Прокручиваемо
                </div>
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Полная информация о заявке и реквизиты пользователя
              </DialogDescription>
            </DialogHeader>

            {selectedRequest && (
              <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                {/* Информация о пользователе */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Пользователь
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Имя:</span>
                      <span className="text-white font-semibold">
                        {selectedRequest.users?.full_name || selectedRequest.user_name || 'Неизвестный'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Email:</span>
                      <span className="text-white">
                        {selectedRequest.users?.email || selectedRequest.user_email || 'Нет email'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Детали заявки */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Детали Заявки
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Сумма:</span>
                      <span className="text-green-400 font-bold text-2xl">${selectedRequest.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Способ:</span>
                      <span className="text-white font-semibold">{selectedRequest.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Статус:</span>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Дата создания:</span>
                      <span className="text-white">{formatDate(selectedRequest.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Реквизиты */}
                <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/30 shadow-2xl">
                  <CardHeader className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-t-lg">
                    <CardTitle className="text-white flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      💳 Реквизиты Пользователя
                    </CardTitle>
                    <p className="text-white/80 text-sm mt-2">Платежная информация для обработки заявки</p>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    {/* Способ оплаты - улучшенный дизайн */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-xl border-2 border-indigo-200 shadow-md">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-2xl">💳</span>
                          </div>
                          <div>
                            <span className="text-indigo-800 font-bold text-lg">Способ оплаты</span>
                            <div className="text-indigo-600 text-sm">Выбранный метод платежа</div>
                          </div>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg border-2 border-indigo-300 shadow-sm">
                          <span className="text-indigo-900 font-bold text-xl">{selectedRequest.method}</span>
                        </div>
                      </div>
                    </div>

                    {/* Реквизиты из payment_details (для пополнений) */}
                    {selectedRequest.payment_details && typeof selectedRequest.payment_details === 'object' && (
                      <>
                        {/* Банковская карта из payment_details - дизайн карты */}
                        {selectedRequest.payment_details.card_number && (
                          <>
                            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 rounded-2xl shadow-2xl text-white relative overflow-hidden">
                              {/* Фоновый узор */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                              
                              <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                  <div>
                                    <h4 className="text-white font-bold text-xl flex items-center gap-2 mb-2">
                                      💳 Банковская карта
                                    </h4>
                                    <div className="text-blue-200 text-sm">Данные для пополнения</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-blue-200 text-xs">CARD</div>
                                    <div className="text-white font-bold">****</div>
                                  </div>
                                </div>

                                {/* Номер карты */}
                                <div className="mb-4">
                                  <div className="text-blue-200 text-xs mb-1">НОМЕР КАРТЫ</div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-white font-mono text-2xl font-bold tracking-wider">
                                      {selectedRequest.payment_details.card_number.replace(/(.{4})/g, '$1 ').trim()}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(selectedRequest.payment_details.card_number)}
                                      className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Владелец и банк */}
                                <div className="flex justify-between items-end">
                                  <div>
                                    {selectedRequest.payment_details.card_holder_name && (
                                      <>
                                        <div className="text-blue-200 text-xs mb-1">ВЛАДЕЛЕЦ КАРТЫ</div>
                                        <div className="text-white font-semibold text-lg uppercase">
                                          {selectedRequest.payment_details.card_holder_name}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    {selectedRequest.payment_details.bank_name && (
                                      <>
                                        <div className="text-blue-200 text-xs mb-1">БАНК</div>
                                        <div className="text-white font-bold text-lg">
                                          {selectedRequest.payment_details.bank_name}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* СБП из payment_details - дизайн мобильного приложения */}
                        {selectedRequest.payment_details.phone_number && (
                          <>
                            <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-6 rounded-2xl shadow-2xl text-white relative overflow-hidden">
                              {/* Фоновые элементы */}
                              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
                              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
                              
                              <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                  <div>
                                    <h4 className="text-white font-bold text-xl flex items-center gap-2 mb-2">
                                      📱 Система быстрых платежей
                                    </h4>
                                    <div className="text-purple-200 text-sm">СБП - мгновенные переводы</div>
                                  </div>
                                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                    <span className="text-2xl">⚡</span>
                                  </div>
                                </div>

                                {/* Номер телефона */}
                                <div className="mb-4">
                                  <div className="text-purple-200 text-xs mb-2">НОМЕР ТЕЛЕФОНА</div>
                                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                      <span className="text-xl">📞</span>
                                    </div>
                                    <span className="text-white font-mono text-xl font-bold flex-1">
                                      {selectedRequest.payment_details.phone_number}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(selectedRequest.payment_details.phone_number)}
                                      className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Дополнительная информация */}
                                <div className="grid grid-cols-1 gap-3">
                                  {selectedRequest.payment_details.account_holder_name && (
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                      <div className="text-purple-200 text-xs mb-1">ВЛАДЕЛЕЦ СЧЕТА</div>
                                      <div className="text-white font-semibold text-lg">
                                        {selectedRequest.payment_details.account_holder_name}
                                      </div>
                                    </div>
                                  )}
                                  {selectedRequest.payment_details.bank_name && (
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                      <div className="text-purple-200 text-xs mb-1">БАНК СБП</div>
                                      <div className="text-white font-semibold text-lg flex items-center gap-2">
                                        🏦 {selectedRequest.payment_details.bank_name}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Криптовалюта из payment_details - блокчейн дизайн */}
                        {selectedRequest.payment_details.wallet_address && (
                          <>
                            <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 p-6 rounded-2xl shadow-2xl text-white relative overflow-hidden">
                              {/* Блокчейн паттерн */}
                              <div className="absolute inset-0 opacity-10">
                                <div className="grid grid-cols-8 gap-1 h-full">
                                  {Array.from({ length: 64 }).map((_, i) => (
                                    <div key={i} className="bg-white/20 rounded-sm"></div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                  <div>
                                    <h4 className="text-white font-bold text-xl flex items-center gap-2 mb-2">
                                      🔐 Криптовалютный кошелек
                                    </h4>
                                    <div className="text-orange-200 text-sm">Блокчейн транзакция</div>
                                  </div>
                                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                    <span className="text-2xl">₿</span>
                                  </div>
                                </div>

                                {/* Сеть */}
                                {selectedRequest.payment_details.crypto_network && (
                                  <div className="mb-4">
                                    <div className="text-orange-200 text-xs mb-2">БЛОКЧЕЙН СЕТЬ</div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold">⛓️</span>
                                      </div>
                                      <span className="text-white font-bold text-lg uppercase">
                                        {selectedRequest.payment_details.crypto_network}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Адрес кошелька */}
                                <div className="mb-4">
                                  <div className="text-orange-200 text-xs mb-2">АДРЕС КОШЕЛЬКА</div>
                                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <span className="text-xl">🔑</span>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <span className="text-white font-mono text-sm break-all">
                                          {selectedRequest.payment_details.wallet_address}
                                        </span>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(selectedRequest.payment_details.wallet_address)}
                                        className="h-8 w-8 p-0 hover:bg-white/20 text-white flex-shrink-0"
                                      >
                                        <Copy className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                {/* Хэш транзакции */}
                                {selectedRequest.payment_details.transaction_hash && (
                                  <div className="mb-4">
                                    <div className="text-orange-200 text-xs mb-2">ХЭШ ТРАНЗАКЦИИ</div>
                                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                          <span className="text-xl">📋</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <span className="text-white font-mono text-sm break-all">
                                            {selectedRequest.payment_details.transaction_hash}
                                          </span>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => copyToClipboard(selectedRequest.payment_details.transaction_hash)}
                                          className="h-8 w-8 p-0 hover:bg-white/20 text-white flex-shrink-0"
                                        >
                                          <Copy className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Статус блокчейна */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-white font-semibold">Блокчейн подтвержден</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Чек/скриншот - улучшенный дизайн */}
                        {selectedRequest.payment_details.receipt && (
                          <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-6 rounded-2xl shadow-2xl text-white relative overflow-hidden">
                            {/* Фоновые элементы */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                            
                            <div className="relative z-10">
                              <div className="flex justify-between items-start mb-6">
                                <div>
                                  <h4 className="text-white font-bold text-xl flex items-center gap-2 mb-2">
                                    📄 Чек об оплате
                                  </h4>
                                  <div className="text-green-200 text-sm">Подтверждение платежа</div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                  <span className="text-2xl">✅</span>
                                </div>
                              </div>

                              {/* Информация о файле */}
                              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">🖼️</span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-green-200 text-xs mb-1">ФАЙЛ ЧЕКА</div>
                                    <div className="text-white font-semibold text-lg">
                                      {selectedRequest.payment_details.receipt_filename || 'receipt_payment.png'}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Кнопки действий */}
                              <div className="grid grid-cols-2 gap-3">
                                <Button
                                  onClick={() => {
                                    window.open(selectedRequest.payment_details.receipt, '_blank');
                                  }}
                                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                                >
                                  👁️ Просмотреть
                                </Button>
                                <Button
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = selectedRequest.payment_details.receipt;
                                    link.download = selectedRequest.payment_details.receipt_filename || 'receipt.png';
                                    link.click();
                                  }}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  📥 Скачать
                                </Button>
                              </div>

                              {/* Статус верификации */}
                              <div className="mt-4 text-center">
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                  <span className="text-white font-semibold text-sm">Чек загружен и готов к проверке</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Реквизиты для банковской карты (для выводов) */}
                    {selectedRequest.card_number && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                        <h4 className="text-blue-800 font-bold text-lg flex items-center gap-2">
                          💳 Банковская карта (вывод)
                        </h4>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Номер карты:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-mono text-lg font-bold bg-white px-3 py-1 rounded border">
                              {selectedRequest.card_number}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(selectedRequest.card_number)}
                              className="h-8 w-8 p-0 hover:bg-blue-100"
                            >
                              <Copy className="w-4 h-4 text-blue-600" />
                            </Button>
                          </div>
                        </div>
                        {selectedRequest.card_holder_name && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Владелец карты:</span>
                            <span className="text-gray-900 font-semibold text-lg">{selectedRequest.card_holder_name}</span>
                          </div>
                        )}
                        {selectedRequest.bank_name && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Банк:</span>
                            <span className="text-gray-900 font-semibold text-lg">{selectedRequest.bank_name}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Реквизиты для СБП (для выводов) */}
                    {selectedRequest.phone_number && (
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-3">
                        <h4 className="text-purple-800 font-bold text-lg flex items-center gap-2">
                          📱 СБП (вывод)
                        </h4>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Номер телефона:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-mono text-lg font-bold bg-white px-3 py-1 rounded border">
                              {selectedRequest.phone_number}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(selectedRequest.phone_number)}
                              className="h-8 w-8 p-0 hover:bg-purple-100"
                            >
                              <Copy className="w-4 h-4 text-purple-600" />
                            </Button>
                          </div>
                        </div>
                        {selectedRequest.account_holder_name && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Владелец счета:</span>
                            <span className="text-gray-900 font-semibold text-lg">{selectedRequest.account_holder_name}</span>
                          </div>
                        )}
                        {selectedRequest.bank_name && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Банк СБП:</span>
                            <span className="text-gray-900 font-semibold text-lg">{selectedRequest.bank_name}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Реквизиты для криптовалюты (для выводов) */}
                    {selectedRequest.wallet_address && (
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 space-y-3">
                        <h4 className="text-orange-800 font-bold text-lg flex items-center gap-2">
                          🔐 Криптовалюта (вывод)
                        </h4>
                        {selectedRequest.crypto_network && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Сеть:</span>
                            <span className="text-gray-900 font-semibold text-lg uppercase bg-white px-3 py-1 rounded border">
                              {selectedRequest.crypto_network}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Адрес кошелька:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-mono text-sm font-bold bg-white px-3 py-1 rounded border break-all max-w-xs">
                              {selectedRequest.wallet_address}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(selectedRequest.wallet_address)}
                              className="h-8 w-8 p-0 hover:bg-orange-100"
                            >
                              <Copy className="w-4 h-4 text-orange-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Если нет реквизитов - красивая форма */}
                    {!selectedRequest.card_number && 
                     !selectedRequest.phone_number && 
                     !selectedRequest.wallet_address &&
                     (!selectedRequest.payment_details || 
                      typeof selectedRequest.payment_details !== 'object' ||
                      (!selectedRequest.payment_details.card_number && 
                       !selectedRequest.payment_details.phone_number && 
                       !selectedRequest.payment_details.wallet_address)) && (
                      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-2xl border-2 border-dashed border-red-300 p-8 shadow-lg">
                        {/* Заголовок с иконкой */}
                        <div className="text-center mb-6">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-4 shadow-lg">
                            <div className="text-4xl">⚠️</div>
                          </div>
                          <h3 className="text-2xl font-bold text-red-800 mb-2">Реквизиты не указаны</h3>
                          <p className="text-red-600 text-lg">Пользователь не предоставил платежные данные</p>
                        </div>

                        {/* Информационные карточки */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-200 text-center">
                            <div className="text-3xl mb-2">💳</div>
                            <div className="text-sm font-semibold text-gray-700">Банковская карта</div>
                            <div className="text-xs text-red-500 mt-1">Не указана</div>
                          </div>
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-200 text-center">
                            <div className="text-3xl mb-2">📱</div>
                            <div className="text-sm font-semibold text-gray-700">СБП</div>
                            <div className="text-xs text-red-500 mt-1">Не указан</div>
                          </div>
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-200 text-center">
                            <div className="text-3xl mb-2">🔐</div>
                            <div className="text-sm font-semibold text-gray-700">Криптовалюта</div>
                            <div className="text-xs text-red-500 mt-1">Не указана</div>
                          </div>
                        </div>

                        {/* Рекомендации */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-orange-200">
                          <h4 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
                            💡 Рекомендации администратору
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">1</div>
                              <div>
                                <div className="font-semibold text-gray-800">Свяжитесь с пользователем</div>
                                <div className="text-sm text-gray-600">Запросите корректные платежные реквизиты</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">2</div>
                              <div>
                                <div className="font-semibold text-gray-800">Отклоните заявку</div>
                                <div className="text-sm text-gray-600">С комментарием о необходимости указать реквизиты</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">3</div>
                              <div>
                                <div className="font-semibold text-gray-800">Проверьте профиль</div>
                                <div className="text-sm text-gray-600">Возможно, данные указаны в профиле пользователя</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Статус заявки */}
                        <div className="mt-6 text-center">
                          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full border border-red-300">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="font-semibold">Требует внимания администратора</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Комментарий администратора */}
                <div className="space-y-2">
                  <label className="text-white font-medium">Комментарий администратора</label>
                  <Textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Добавьте комментарий..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex-shrink-0 gap-2 pt-4 border-t border-white/10">
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Закрыть
              </Button>
              {selectedRequest?.status === 'pending' && (
                <>
                  <Button
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Отклонить
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Одобрить
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  )
}