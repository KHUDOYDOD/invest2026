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

export default function AdminRequestsPage() {
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

  // Полная карточка с реквизитами
  const FullRequestCard = ({ request, type }: { request: SimpleRequest, type: 'deposit' | 'withdrawal' }) => {
    const userName = request.users?.full_name || request.user_name || 'Неизвестный пользователь'
    
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{userName}</h3>
                <p className="text-white/60 text-sm">{type === 'deposit' ? 'Пополнение' : 'Вывод'}</p>
                <p className="text-white/60 text-xs">{formatDate(request.created_at)}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-white font-bold text-xl">${request.amount.toFixed(2)}</span>
              </div>
              {getStatusBadge(request.status)}
            </div>
          </div>

          {/* Реквизиты */}
          <div className="space-y-3 mt-4">
            <h4 className="text-white font-medium">Реквизиты:</h4>
            
            {/* Способ оплаты */}
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
              <span className="text-white/70">Способ:</span>
              <span className="text-white font-semibold">{request.method}</span>
            </div>

            {/* Реквизиты из payment_details (для пополнений) */}
            {request.payment_details && typeof request.payment_details === 'object' && (
              <>
                {request.payment_details.card_number && (
                  <div className="flex justify-between items-center p-3 bg-blue-500/20 rounded-lg">
                    <span className="text-white/70">💳 Номер карты:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-sm">{request.payment_details.card_number}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(request.payment_details.card_number)}
                        className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                {request.payment_details.phone_number && (
                  <div className="flex justify-between items-center p-3 bg-purple-500/20 rounded-lg">
                    <span className="text-white/70">📱 Телефон (СБП):</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-sm">{request.payment_details.phone_number}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(request.payment_details.phone_number)}
                        className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                {request.payment_details.wallet_address && (
                  <div className="flex justify-between items-center p-3 bg-orange-500/20 rounded-lg">
                    <span className="text-white/70">🔐 Кошелек:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-xs break-all">{request.payment_details.wallet_address}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(request.payment_details.wallet_address)}
                        className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Реквизиты для банковской карты (для выводов) */}
            {request.card_number && (
              <>
                <div className="flex justify-between items-center p-3 bg-blue-500/20 rounded-lg">
                  <span className="text-white/70">💳 Номер карты:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">{request.card_number}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(request.card_number)}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {request.card_holder_name && (
                  <div className="flex justify-between items-center p-3 bg-blue-500/20 rounded-lg">
                    <span className="text-white/70">👤 Владелец карты:</span>
                    <span className="text-white">{request.card_holder_name}</span>
                  </div>
                )}
                {request.bank_name && (
                  <div className="flex justify-between items-center p-3 bg-blue-500/20 rounded-lg">
                    <span className="text-white/70">🏦 Банк:</span>
                    <span className="text-white">{request.bank_name}</span>
                  </div>
                )}
              </>
            )}

            {/* Реквизиты для СБП */}
            {request.phone_number && (
              <>
                <div className="flex justify-between items-center p-3 bg-purple-500/20 rounded-lg">
                  <span className="text-white/70">📱 Телефон (СБП):</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">{request.phone_number}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(request.phone_number)}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {request.account_holder_name && (
                  <div className="flex justify-between items-center p-3 bg-purple-500/20 rounded-lg">
                    <span className="text-white/70">👤 Владелец:</span>
                    <span className="text-white">{request.account_holder_name}</span>
                  </div>
                )}
                {request.bank_name && (
                  <div className="flex justify-between items-center p-3 bg-purple-500/20 rounded-lg">
                    <span className="text-white/70">🏦 Банк СБП:</span>
                    <span className="text-white">{request.bank_name}</span>
                  </div>
                )}
              </>
            )}

            {/* Реквизиты для криптовалюты */}
            {request.wallet_address && (
              <>
                {request.crypto_network && (
                  <div className="flex justify-between items-center p-3 bg-orange-500/20 rounded-lg">
                    <span className="text-white/70">🌐 Сеть:</span>
                    <span className="text-white uppercase">{request.crypto_network}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-orange-500/20 rounded-lg">
                  <span className="text-white/70">🔐 Адрес кошелька:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-xs break-all">{request.wallet_address}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(request.wallet_address)}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Кнопки действий */}
          {request.status === 'pending' && (
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => handleRequestClick(request)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Одобрить
              </Button>
              <Button
                onClick={() => handleRequestClick(request)}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Отклонить
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
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
                  💼 Админ Панель - Заявки
                </h1>
                <p className="text-white/70 text-lg">Управление заявками на пополнение и вывод средств</p>
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
                    <FullRequestCard key={request.id} request={request} type="deposit" />
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
                    <FullRequestCard key={request.id} request={request} type="withdrawal" />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Диалог для действий с заявкой */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-slate-900 to-blue-900 border-white/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Действие с заявкой</DialogTitle>
              <DialogDescription className="text-white/70">
                Выберите действие для заявки на сумму ${selectedRequest?.amount.toFixed(2)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
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

            <DialogFooter className="gap-2">
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Отмена
              </Button>
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
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  )
}