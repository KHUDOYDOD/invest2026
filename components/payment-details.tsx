"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, CreditCard, Smartphone, Bitcoin, Check, QrCode } from "lucide-react"
import { toast } from "sonner"

interface PaymentDetailsProps {
  method: string
  amount: number
  type: 'deposit' | 'withdrawal'
}

export function PaymentDetails({ method, amount, type }: PaymentDetailsProps) {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => new Set(prev).add(label))
      toast.success(`${label} скопирован`)
      
      // Убираем индикатор через 2 секунды
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(label)
          return newSet
        })
      }, 2000)
    } catch (err) {
      toast.error("Ошибка копирования")
    }
  }

  const getPaymentDetails = () => {
    switch (method) {
      case 'card':
        if (type === 'deposit') {
          return {
            title: '💳 Пополнение банковской картой',
            icon: <CreditCard className="h-6 w-6 text-blue-500" />,
            mainDetails: [
              { 
                label: 'Номер карты', 
                value: '2202 2063 4567 8901', 
                copyable: true,
                primary: true,
                description: 'Основная карта Сбербанк'
              },
              { 
                label: 'Владелец', 
                value: 'IVANOV IVAN IVANOVICH', 
                copyable: true,
                primary: false 
              }
            ],
            additionalInfo: [
              { label: 'Банк', value: 'Сбербанк России' },
              { label: 'Комиссия', value: '2%' },
              { label: 'К доплате', value: `$${(amount * 1.02).toFixed(2)}` }
            ],
            instructions: [
              '1. Переведите указанную сумму на карту',
              '2. В комментарии укажите ваш ID',
              '3. Сохраните чек об оплате',
              '4. Средства поступят в течение 15 минут'
            ]
          }
        } else {
          return {
            title: '💳 Вывод на банковскую карту',
            icon: <CreditCard className="h-6 w-6 text-green-500" />,
            mainDetails: [],
            additionalInfo: [
              { label: 'Комиссия', value: '3%' },
              { label: 'К выплате', value: `$${(amount * 0.97).toFixed(2)}` },
              { label: 'Время', value: '1-3 рабочих дня' }
            ],
            instructions: [
              '1. Укажите номер вашей карты',
              '2. Проверьте правильность данных',
              '3. Подтвердите заявку',
              '4. Ожидайте поступления средств'
            ]
          }
        }

      case 'sbp':
        if (type === 'deposit') {
          return {
            title: '📱 Пополнение через СБП',
            icon: <Smartphone className="h-6 w-6 text-green-500" />,
            mainDetails: [
              { 
                label: 'Номер телефона', 
                value: '+7 (999) 123-45-67', 
                copyable: true,
                primary: true,
                description: 'Основной номер СБП'
              },
              { 
                label: 'Получатель', 
                value: 'Иванов Иван Иванович', 
                copyable: true,
                primary: false 
              }
            ],
            additionalInfo: [
              { label: 'Банк', value: 'Сбербанк' },
              { label: 'Комиссия', value: '1%' },
              { label: 'К доплате', value: `$${(amount * 1.01).toFixed(2)}` }
            ],
            instructions: [
              '1. Откройте приложение банка',
              '2. Выберите "Переводы по номеру"',
              '3. Введите номер получателя',
              '4. Отправьте перевод'
            ]
          }
        } else {
          return {
            title: '📱 Вывод через СБП',
            icon: <Smartphone className="h-6 w-6 text-blue-500" />,
            mainDetails: [],
            additionalInfo: [
              { label: 'Комиссия', value: '1.5%' },
              { label: 'К выплате', value: `$${(amount * 0.985).toFixed(2)}` },
              { label: 'Время', value: '15-30 минут' }
            ],
            instructions: [
              '1. Укажите номер телефона',
              '2. Проверьте правильность',
              '3. Подтвердите заявку',
              '4. Средства поступят на карту'
            ]
          }
        }

      case 'crypto':
        if (type === 'deposit') {
          return {
            title: '₿ Пополнение криптовалютой',
            icon: <Bitcoin className="h-6 w-6 text-orange-500" />,
            mainDetails: [
              { 
                label: 'USDT TRC-20 (Рекомендуем)', 
                value: 'TYN5CrEMj4hJcGpZHRq1qPgWwzfCVtJnEF', 
                copyable: true,
                primary: true,
                description: 'Низкая комиссия 0.5%'
              },
              { 
                label: 'Bitcoin BTC', 
                value: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 
                copyable: true,
                primary: false,
                description: 'Комиссия 1.5%'
              },
              { 
                label: 'TON', 
                value: 'UQBFn2HwWvDRfYKCg2UNwBZUUPJG7Z3R1XGZS4SB-TW4Xneu', 
                copyable: true,
                primary: false,
                description: 'Комиссия 0.8%'
              }
            ],
            additionalInfo: [
              { label: 'Рекомендуем', value: 'USDT TRC-20' },
              { label: 'Комиссия', value: '0.5%' },
              { label: 'К доплате', value: `${(amount * 1.005).toFixed(2)} USDT` }
            ],
            instructions: [
              '1. Выберите сеть (TRC-20 дешевле)',
              '2. Скопируйте адрес кошелька',
              '3. Отправьте точную сумму',
              '4. Ждите подтверждения сети'
            ]
          }
        } else {
          return {
            title: '₿ Вывод криптовалюты',
            icon: <Bitcoin className="h-6 w-6 text-purple-500" />,
            mainDetails: [],
            additionalInfo: [
              { label: 'TRC-20', value: '1% комиссия' },
              { label: 'К выплате', value: `${(amount * 0.99).toFixed(2)} USDT` },
              { label: 'Время', value: '5-15 минут' }
            ],
            instructions: [
              '1. Укажите адрес кошелька',
              '2. Выберите сеть',
              '3. Проверьте адрес 3 раза',
              '4. Подтвердите заявку'
            ]
          }
        }

      default:
        return {
          title: 'Способ не выбран',
          icon: null,
          mainDetails: [],
          additionalInfo: [],
          instructions: []
        }
    }
  }

  const paymentInfo = getPaymentDetails()

  return (
    <div className="space-y-4">
      {/* Основная карточка с реквизитами */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-blue-800">
            {paymentInfo.icon}
            {paymentInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Основные реквизиты */}
          {paymentInfo.mainDetails.map((detail, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border-2 transition-all ${
                detail.primary 
                  ? 'bg-green-50 border-green-300 shadow-md' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{detail.label}</span>
                  {detail.primary && <Badge className="bg-green-500 text-white text-xs">Основной</Badge>}
                </div>
                {detail.copyable && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(detail.value, detail.label)}
                    className={`transition-all ${
                      copiedItems.has(detail.label) 
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'hover:bg-blue-50'
                    }`}
                  >
                    {copiedItems.has(detail.label) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              
              <div className="font-mono text-sm bg-gray-100 p-3 rounded border break-all">
                {detail.value}
              </div>
              
              {detail.description && (
                <div className="text-xs text-gray-600 mt-1">
                  {detail.description}
                </div>
              )}
            </div>
          ))}

          {/* Дополнительная информация */}
          {paymentInfo.additionalInfo.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {paymentInfo.additionalInfo.map((info, index) => (
                <div key={index} className="bg-white p-3 rounded border text-center">
                  <div className="text-xs text-gray-600">{info.label}</div>
                  <div className="font-semibold text-gray-900">{info.value}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Инструкции */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-800 text-lg">📋 Пошаговая инструкция</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {paymentInfo.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="text-green-700 text-sm">{instruction}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Быстрые действия */}
      {type === 'deposit' && (
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-800 text-lg">⚡ Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  const userID = Math.random().toString(36).substr(2, 9).toUpperCase()
                  copyToClipboard(userID, 'ID пользователя')
                }}
                className="justify-start"
              >
                <Copy className="h-4 w-4 mr-2" />
                Скопировать ID пользователя
              </Button>
              
              <Button
                variant="outline"
                onClick={() => copyToClipboard(`$${(amount * (method === 'card' ? 1.02 : method === 'sbp' ? 1.01 : 1.005)).toFixed(2)}`, 'Сумма к доплате')}
                className="justify-start"
              >
                <Copy className="h-4 w-4 mr-2" />
                Скопировать сумму к доплате
              </Button>
            </div>
            
            <div className="mt-3 p-3 bg-yellow-100 rounded border border-yellow-300">
              <div className="text-xs text-yellow-800 font-medium">💡 Совет:</div>
              <div className="text-xs text-yellow-700 mt-1">
                Укажите скопированный ID в комментарии к переводу для быстрого зачисления
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* QR коды для криптовалют */}
      {method === 'crypto' && type === 'deposit' && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-800 text-lg">📱 QR-коды для оплаты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-24 h-24 bg-white border-2 border-purple-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <QrCode className="h-12 w-12 text-purple-400" />
                </div>
                <p className="text-sm text-purple-600 font-medium">USDT TRC-20</p>
                <p className="text-xs text-purple-500">Рекомендуем</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-white border-2 border-purple-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <QrCode className="h-12 w-12 text-purple-400" />
                </div>
                <p className="text-sm text-purple-600 font-medium">Bitcoin</p>
                <p className="text-xs text-purple-500">Надежно</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-white border-2 border-purple-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <QrCode className="h-12 w-12 text-purple-400" />
                </div>
                <p className="text-sm text-purple-600 font-medium">TON</p>
                <p className="text-xs text-purple-500">Быстро</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Поддержка */}
      <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-800 mb-2">📞 Нужна помощь?</div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600">
              <span>Telegram: @investpro_support</span>
              <span>•</span>
              <span>Email: support@investpro.com</span>
              <span>•</span>
              <span>24/7</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}