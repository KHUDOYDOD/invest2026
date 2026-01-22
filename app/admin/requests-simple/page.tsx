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

  const RequestRow = ({ request, type }: { request: SimpleRequest, type: 'deposit' | 'withdrawal' }) => {
    const userName = request.users?.full_name || request.user_name || 'Неизвестный пользователь'
    const userEmail = request.users?.email || request.user_email || 'Нет email'
    
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
            <p className="text-white/60 text-sm">{userEmail}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
              <Calendar className="w-4 h-4" />
              {formatDate(request.created_at)}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-white font-bold text-xl">${request.amount.toFixed(2)}</span>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </div>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">💼 Управление Заявками</h1>
              <p className="text-white/70">Простой просмотр заявок на пополнение и вывод</p>
            </div>
            <Button
              onClick={fetchRequests}
              disabled={isLoading}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>

          <Tabs defaultValue="deposits" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger value="deposits" className="data-[state=active]:bg-green-600">
                📥 Пополнения ({depositRequests.filter(r => r.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="withdrawals" className="data-[state=active]:bg-red-600">
                💸 Выводы ({withdrawalRequests.filter(r => r.status === 'pending').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deposits" className="space-y-3">
              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-white mb-4" />
                  <p className="text-white">Загрузка...</p>
                </div>
              ) : depositRequests.length === 0 ? (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="text-center py-12">
                    <p className="text-white/70">Нет заявок на пополнение</p>
                  </CardContent>
                </Card>
              ) : (
                depositRequests.map(request => (
                  <RequestRow key={request.id} request={request} type="deposit" />
                ))
              )}
            </TabsContent>

            <TabsContent value="withdrawals" className="space-y-3">
              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-white mb-4" />
                  <p className="text-white">Загрузка...</p>
                </div>
              ) : withdrawalRequests.length === 0 ? (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="text-center py-12">
                    <p className="text-white/70">Нет заявок на вывод</p>
                  </CardContent>
                </Card>
              ) : (
                withdrawalRequests.map(request => (
                  <RequestRow key={request.id} request={request} type="withdrawal" />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Диалог с деталями заявки */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-slate-900 to-blue-900 border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Детали Заявки</DialogTitle>
              <DialogDescription className="text-white/70">
                Полная информация о заявке и реквизиты пользователя
              </DialogDescription>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-6">
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
                <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Реквизиты Пользователя
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Способ оплаты */}
                    <div className="flex justify-between items-center p-3 bg-white/90 rounded-lg">
                      <span className="text-gray-700 font-medium">Способ оплаты:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-bold">{selectedRequest.method}</span>
                      </div>
                    </div>

                    {/* Реквизиты из payment_details (для пополнений) */}
                    {selectedRequest.payment_details && typeof selectedRequest.payment_details === 'object' && (
                      <>
                        {selectedRequest.payment_details.card_number && (
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="text-gray-700 font-medium">💳 Номер карты:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900 font-mono text-sm font-bold">{selectedRequest.payment_details.card_number}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(selectedRequest.payment_details.card_number)}
                                className="h-8 w-8 p-0 hover:bg-blue-100"
                              >
                                <Copy className="w-4 h-4 text-blue-600" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {selectedRequest.payment_details.phone_number && (
                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <span className="text-gray-700 font-medium">📱 Телефон (СБП):</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900 font-mono text-sm font-bold">{selectedRequest.payment_details.phone_number}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(selectedRequest.payment_details.phone_number)}
                                className="h-8 w-8 p-0 hover:bg-blue-100"
                              >
                                <Copy className="w-4 h-4 text-blue-600" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {selectedRequest.payment_details.wallet_address && (
                          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <span className="text-gray-700 font-medium">🔐 Адрес кошелька:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900 font-mono text-xs font-bold break-all">{selectedRequest.payment_details.wallet_address}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(selectedRequest.payment_details.wallet_address)}
                                className="h-8 w-8 p-0 hover:bg-blue-100"
                              >
                                <Copy className="w-4 h-4 text-blue-600" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {selectedRequest.payment_details.transaction_hash && (
                          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <span className="text-gray-700 font-medium">🔗 Хэш транзакции:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900 font-mono text-xs font-bold break-all">{selectedRequest.payment_details.transaction_hash}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(selectedRequest.payment_details.transaction_hash)}
                                className="h-8 w-8 p-0 hover:bg-blue-100"
                              >
                                <Copy className="w-4 h-4 text-blue-600" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Реквизиты для банковской карты (для выводов) */}
                    {selectedRequest.card_number && (
                      <>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="text-gray-700 font-medium">💳 Номер карты:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-mono text-sm font-bold">{selectedRequest.card_number}</span>
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
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="text-gray-700 font-medium">👤 Владелец карты:</span>
                            <span className="text-gray-900 font-semibold">{selectedRequest.card_holder_name}</span>
                          </div>
                        )}
                        {selectedRequest.bank_name && (
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="text-gray-700 font-medium">🏦 Банк:</span>
                            <span className="text-gray-900 font-semibold">{selectedRequest.bank_name}</span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Реквизиты для СБП */}
                    {selectedRequest.phone_number && (
                      <>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <span className="text-gray-700 font-medium">📱 Телефон (СБП):</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-mono text-sm font-bold">{selectedRequest.phone_number}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(selectedRequest.phone_number)}
                              className="h-8 w-8 p-0 hover:bg-blue-100"
                            >
                              <Copy className="w-4 h-4 text-blue-600" />
                            </Button>
                          </div>
                        </div>
                        {selectedRequest.account_holder_name && (
                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <span className="text-gray-700 font-medium">👤 Владелец:</span>
                            <span className="text-gray-900 font-semibold">{selectedRequest.account_holder_name}</span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Реквизиты для криптовалюты */}
                    {selectedRequest.wallet_address && (
                      <>
                        {selectedRequest.crypto_network && (
                          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <span className="text-gray-700 font-medium">🌐 Сеть:</span>
                            <span className="text-gray-900 font-semibold uppercase">{selectedRequest.crypto_network}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <span className="text-gray-700 font-medium">🔐 Адрес кошелька:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-mono text-xs font-bold break-all">{selectedRequest.wallet_address}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(selectedRequest.wallet_address)}
                              className="h-8 w-8 p-0 hover:bg-blue-100"
                            >
                              <Copy className="w-4 h-4 text-blue-600" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Если нет реквизитов */}
                    {!selectedRequest.card_number && 
                     !selectedRequest.phone_number && 
                     !selectedRequest.wallet_address &&
                     (!selectedRequest.payment_details || 
                      typeof selectedRequest.payment_details !== 'object' ||
                      (!selectedRequest.payment_details.card_number && 
                       !selectedRequest.payment_details.phone_number && 
                       !selectedRequest.payment_details.wallet_address)) && (
                      <div className="text-center py-4 text-gray-600 bg-white/50 rounded-lg">
                        Реквизиты не указаны
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

            <DialogFooter className="gap-2">
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
