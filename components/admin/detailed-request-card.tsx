"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  MapPin, 
  Globe, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Shield,
  Activity,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"

interface DetailedRequest {
  id: string
  user_id: string
  amount: number
  method: string
  payment_details?: any
  wallet_address?: string
  fee?: number
  final_amount?: number
  status: string
  admin_comment?: string
  created_at: string
  processed_at?: string
  user: {
    id: string
    full_name: string
    email: string
    balance: number
    total_invested: number
    total_earned: number
    registration_date: string
    last_login: string
    country?: string
    city?: string
    ip_address?: string
    is_verified: boolean
    kyc_status?: string
    phone?: string
  }
  user_stats: {
    total_deposits: number
    total_withdrawals: number
    successful_transactions: number
    failed_transactions: number
    average_transaction: number
    first_transaction_date: string
    last_transaction_date: string
  }
  risk_factors: {
    new_user: boolean
    large_amount: boolean
    suspicious_pattern: boolean
    multiple_requests: boolean
    different_payment_methods: boolean
    risk_score: number
  }
  similar_requests: Array<{
    id: string
    amount: number
    method: string
    status: string
    created_at: string
  }>
}

interface DetailedRequestCardProps {
  request: DetailedRequest
  onSelect: (request: DetailedRequest) => void
}

export function DetailedRequestCard({ request, onSelect }: DetailedRequestCardProps) {
  const getRiskBadge = (riskScore: number) => {
    if (riskScore >= 80) {
      return <Badge className="bg-red-500 text-white">🚨 Высокий риск ({riskScore}%)</Badge>
    } else if (riskScore >= 50) {
      return <Badge className="bg-yellow-500 text-white">⚠️ Средний риск ({riskScore}%)</Badge>
    } else {
      return <Badge className="bg-green-500 text-white">✅ Низкий риск ({riskScore}%)</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 text-white"><Clock className="w-3 h-3 mr-1" />Ожидает</Badge>
      case "approved":
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Одобрено</Badge>
      case "rejected":
        return <Badge className="bg-red-500 text-white"><XCircle className="w-3 h-3 mr-1" />Отклонено</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white text-xl flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-400" />
              Заявка #{request.id}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              {getStatusBadge(request.status)}
              {getRiskBadge(request.risk_factors.risk_score)}
            </div>
          </div>
          <Button
            onClick={() => onSelect(request)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Eye className="w-4 h-4 mr-2" />
            Подробнее
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Основная информация о заявке */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-lg border border-green-500/30">
            <div className="text-green-300 text-sm font-medium">Сумма заявки</div>
            <div className="text-white text-2xl font-bold">{formatCurrency(request.amount)}</div>
            {request.final_amount && (
              <div className="text-green-200 text-sm">К выплате: {formatCurrency(request.final_amount)}</div>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-lg border border-blue-500/30">
            <div className="text-blue-300 text-sm font-medium">Способ</div>
            <div className="text-white text-lg font-semibold">{request.method}</div>
            <div className="text-blue-200 text-sm">{formatDate(request.created_at)}</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30">
            <div className="text-purple-300 text-sm font-medium">Комиссия</div>
            <div className="text-white text-lg font-semibold">
              {request.fee ? formatCurrency(request.fee) : 'Без комиссии'}
            </div>
            <div className="text-purple-200 text-sm">
              {request.fee ? `${((request.fee / request.amount) * 100).toFixed(1)}%` : '0%'}
            </div>
          </div>
        </div>

        {/* Информация о пользователе */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/30">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-400" />
            Информация о пользователе
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Имя:</span>
                <span className="text-white font-medium">{request.user.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Email:</span>
                <span className="text-white font-medium">{request.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Баланс:</span>
                <span className="text-white font-medium">{formatCurrency(request.user.balance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Статус:</span>
                <span className={`font-medium ${request.user.is_verified ? 'text-green-400' : 'text-yellow-400'}`}>
                  {request.user.is_verified ? '✅ Верифицирован' : '⏳ Не верифицирован'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Регистрация:</span>
                <span className="text-white font-medium">{formatDate(request.user.registration_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Последний вход:</span>
                <span className="text-white font-medium">{formatDate(request.user.last_login)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Локация:</span>
                <span className="text-white font-medium">
                  {request.user.city && request.user.country 
                    ? `${request.user.city}, ${request.user.country}` 
                    : 'Не указано'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">IP адрес:</span>
                <span className="text-white font-medium font-mono">
                  {request.user.ip_address || 'Не записан'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика пользователя */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/30">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Статистика транзакций
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{request.user_stats.total_deposits}</div>
              <div className="text-white/60 text-sm">Пополнений</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{request.user_stats.total_withdrawals}</div>
              <div className="text-white/60 text-sm">Выводов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{request.user_stats.successful_transactions}</div>
              <div className="text-white/60 text-sm">Успешных</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {formatCurrency(request.user_stats.average_transaction)}
              </div>
              <div className="text-white/60 text-sm">Средняя сумма</div>
            </div>
          </div>
        </div>

        {/* Факторы риска */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/30">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-red-400" />
            Анализ рисков
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className={`flex items-center justify-between p-2 rounded ${request.risk_factors.new_user ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                <span className="text-white">Новый пользователь</span>
                <span className={request.risk_factors.new_user ? 'text-yellow-400' : 'text-green-400'}>
                  {request.risk_factors.new_user ? '⚠️ Да' : '✅ Нет'}
                </span>
              </div>
              
              <div className={`flex items-center justify-between p-2 rounded ${request.risk_factors.large_amount ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                <span className="text-white">Крупная сумма</span>
                <span className={request.risk_factors.large_amount ? 'text-red-400' : 'text-green-400'}>
                  {request.risk_factors.large_amount ? '🚨 Да' : '✅ Нет'}
                </span>
              </div>
              
              <div className={`flex items-center justify-between p-2 rounded ${request.risk_factors.suspicious_pattern ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                <span className="text-white">Подозрительная активность</span>
                <span className={request.risk_factors.suspicious_pattern ? 'text-red-400' : 'text-green-400'}>
                  {request.risk_factors.suspicious_pattern ? '🚨 Да' : '✅ Нет'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className={`flex items-center justify-between p-2 rounded ${request.risk_factors.multiple_requests ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                <span className="text-white">Множественные заявки</span>
                <span className={request.risk_factors.multiple_requests ? 'text-yellow-400' : 'text-green-400'}>
                  {request.risk_factors.multiple_requests ? '⚠️ Да' : '✅ Нет'}
                </span>
              </div>
              
              <div className={`flex items-center justify-between p-2 rounded ${request.risk_factors.different_payment_methods ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                <span className="text-white">Разные способы оплаты</span>
                <span className={request.risk_factors.different_payment_methods ? 'text-yellow-400' : 'text-green-400'}>
                  {request.risk_factors.different_payment_methods ? '⚠️ Да' : '✅ Нет'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded bg-slate-700/50">
                <span className="text-white font-semibold">Общий риск</span>
                <span className={`font-bold ${
                  request.risk_factors.risk_score >= 80 ? 'text-red-400' :
                  request.risk_factors.risk_score >= 50 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {request.risk_factors.risk_score}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Похожие заявки */}
        {request.similar_requests.length > 0 && (
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/30">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-orange-400" />
              Похожие заявки ({request.similar_requests.length})
            </h3>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {request.similar_requests.map((similar, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                  <span className="text-white/80 text-sm">#{similar.id}</span>
                  <span className="text-white font-medium">{formatCurrency(similar.amount)}</span>
                  <span className="text-white/60 text-sm">{similar.method}</span>
                  <Badge className={`text-xs ${
                    similar.status === 'approved' ? 'bg-green-500' :
                    similar.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>
                    {similar.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Реквизиты */}
        {request.wallet_address && (
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/30">
            <h3 className="text-white font-semibold mb-2">Реквизиты для вывода</h3>
            <div className="bg-slate-900/50 p-3 rounded font-mono text-sm text-white break-all">
              {request.wallet_address}
            </div>
          </div>
        )}

        {/* Комментарий админа */}
        {request.admin_comment && (
          <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/30">
            <h3 className="text-red-300 font-semibold mb-2">Комментарий администратора</h3>
            <p className="text-red-200">{request.admin_comment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}