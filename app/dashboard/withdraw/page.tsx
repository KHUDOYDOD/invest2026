"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/nav"
import { PaymentDetails } from "@/components/payment-details"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Smartphone,
  Bitcoin,
  RefreshCw,
  Clock,
  Info,
  AlertTriangle,
  Check,
} from "lucide-react"

export default function WithdrawPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [amount, setAmount] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState<string>("")

  // Данные для банковской карты
  const [cardNumber, setCardNumber] = useState<string>("")
  const [cardName, setCardName] = useState<string>("")
  const [bankName, setBankName] = useState<string>("")

  // Данные для СБП
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [sbpName, setSbpName] = useState<string>("")

  // Данные для криптовалюты
  const [cryptoNetwork, setCryptoNetwork] = useState<string>("trc20")
  const [cryptoAddress, setCryptoAddress] = useState<string>("")

  // Комиссия и общая сумма
  const [commission, setCommission] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [availableBalance, setAvailableBalance] = useState<number>(10000) // Пример баланса

  useEffect(() => {
    // Проверяем авторизацию пользователя
    const checkAuth = () => {
      try {
        const userEmail = localStorage.getItem("userEmail")
        if (!userEmail) {
          window.location.href = "/login"
          return
        }
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check error:", error)
        window.location.href = "/login"
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Расчет комиссии в зависимости от метода вывода
  useEffect(() => {
    if (!amount || !selectedMethod) {
      setCommission(0)
      setTotalAmount(0)
      return
    }

    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue)) {
      setCommission(0)
      setTotalAmount(0)
      return
    }

    let commissionRate = 0
    switch (selectedMethod) {
      case "card":
        commissionRate = 0.03 // 3% для карт
        break
      case "sbp":
        commissionRate = 0.015 // 1.5% для СБП
        break
      case "crypto":
        commissionRate = 0.01 // 1% для крипты
        break
      default:
        commissionRate = 0
    }

    const calculatedCommission = amountValue * commissionRate
    setCommission(calculatedCommission)
    setTotalAmount(amountValue - calculatedCommission)
  }, [amount, selectedMethod])

  // Форматирование номера карты
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Форматирование номера телефона
  const formatPhoneNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (!v) return ""
    if (v.length <= 1) return `+${v}`
    if (v.length <= 4) return `+${v.substring(0, 1)} (${v.substring(1)}`
    if (v.length <= 7) return `+${v.substring(0, 1)} (${v.substring(1, 4)}) ${v.substring(4)}`
    if (v.length <= 10) return `+${v.substring(0, 1)} (${v.substring(1, 4)}) ${v.substring(4, 7)}-${v.substring(7)}`
    return `+${v.substring(0, 1)} (${v.substring(1, 4)}) ${v.substring(4, 7)}-${v.substring(7, 9)}-${v.substring(9, 11)}`
  }

  // Копирование в буфер обмена
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Скопировано в буфер обмена")
  }

  // Обработка нажатия кнопки "Далее"
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedMethod) {
        toast.error("Выберите способ вывода")
        return
      }
      if (!amount || Number.parseFloat(amount) <= 0) {
        toast.error("Введите корректную сумму")
        return
      }
      if (Number.parseFloat(amount) > availableBalance) {
        toast.error("Недостаточно средств на балансе")
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // Валидация в зависимости от метода вывода
      if (selectedMethod === "card") {
        if (cardNumber.replace(/\s/g, "").length !== 16) {
          toast.error("Введите корректный номер карты")
          return
        }
        if (!cardName) {
          toast.error("Введите ФИО владельца карты")
          return
        }
        if (!bankName) {
          toast.error("Выберите банк")
          return
        }
      } else if (selectedMethod === "sbp") {
        if (phoneNumber.replace(/\D/g, "").length !== 11) {
          toast.error("Введите корректный номер телефона")
          return
        }
        if (!sbpName) {
          toast.error("Введите ФИО владельца")
          return
        }
      } else if (selectedMethod === "crypto") {
        if (!cryptoAddress) {
          toast.error("Введите адрес кошелька")
          return
        }
        // Простая валидация адреса в зависимости от сети
        if (cryptoNetwork === "trc20" && !cryptoAddress.startsWith("T")) {
          toast.error("Введите корректный TRC-20 адрес")
          return
        }
        if (cryptoNetwork === "ton" && !cryptoAddress.startsWith("UQ")) {
          toast.error("Введите корректный TON адрес")
          return
        }
      }
      setCurrentStep(3)
    } else if (currentStep === 3) {
      handleSubmitWithdrawal()
    }
  }

  // Обработка отправки заявки на вывод
  const handleSubmitWithdrawal = async () => {
    setIsProcessing(true)

    try {
      // Получаем токен из localStorage
      const token = localStorage.getItem('authToken')
      if (!token) {
        toast.error('Необходима авторизация')
        window.location.href = '/login'
        return
      }

      // Отправляем запрос на создание вывода
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          payment_method: selectedMethod,
          wallet_address: selectedMethod === 'crypto' ? cryptoAddress : null,
          card_number: selectedMethod === 'card' ? cardNumber.replace(/\s/g, '') : null,
          card_holder_name: selectedMethod === 'card' ? cardName : null,
          bank_name: selectedMethod === 'card' ? bankName : null,
          phone_number: selectedMethod === 'sbp' ? phoneNumber.replace(/\D/g, '') : null,
          account_holder_name: selectedMethod === 'sbp' ? sbpName : null,
          crypto_network: selectedMethod === 'crypto' ? cryptoNetwork : null
        })
      })

      const data = await response.json()

      if (data.success) {
        setTransactionId(data.transaction?.id || 'unknown')
        setIsSuccess(true)
        toast.success('Заявка на вывод создана!')
      } else {
        // Показываем детальную информацию об ошибке
        if (data.details && data.details.message) {
          toast.error(data.details.message)
        } else {
          toast.error(data.error || 'Ошибка создания заявки')
        }
        
        // Логируем детали для отладки
        if (data.details) {
          console.log('Детали ошибки:', data.details)
        }
      }

    } catch (error) {
      console.error("Withdrawal error:", error)
      toast.error("Произошла ошибка при обработке заявки на вывод")
    } finally {
      setIsProcessing(false)
    }
  }

  // Сброс формы и возврат к первому шагу
  const resetForm = () => {
    setCurrentStep(1)
    setSelectedMethod(null)
    setAmount("")
    setCardNumber("")
    setCardName("")
    setBankName("")
    setPhoneNumber("")
    setSbpName("")
    setCryptoNetwork("trc20")
    setCryptoAddress("")
    setIsSuccess(false)
    setTransactionId("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white text-lg">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-800/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-700/20 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gray-800/10 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gray-600/15 rounded-full blur-3xl animate-float delay-3000"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <DashboardHeader />

      <div className="flex relative z-10">
        <DashboardNav activeItem="withdraw" />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-red-600/20 via-pink-600/20 to-rose-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl overflow-hidden">
              {/* Animated Orbs */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-red-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
              
              <div className="relative z-10 text-center space-y-4">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-full px-6 py-3 border-2 border-red-400/30 shadow-lg mb-4">
                  <ArrowRight className="h-6 w-6 text-red-400 animate-pulse" />
                  <span className="text-white font-bold text-lg">Вывод прибыли</span>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                </div>

                <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-red-400 via-pink-500 to-rose-600 bg-clip-text text-transparent mb-4">
                  💸 Вывод средств
                </h1>
                
                <p className="text-pink-100 max-w-2xl mx-auto text-xl font-medium">
                  Выберите удобный способ получения и внимательно заполните заявку на вывод
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -translate-y-1/2"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-gray-400 to-gray-500 -translate-y-1/2 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              ></div>
              <div className="relative flex justify-between">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      currentStep >= 1
                        ? "bg-gradient-to-r from-gray-400 to-gray-500 text-black"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
                  </div>
                  <span className="text-xs mt-2 text-white">Способ</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      currentStep >= 2
                        ? "bg-gradient-to-r from-gray-400 to-gray-500 text-black"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
                  </div>
                  <span className="text-xs mt-2 text-white">Реквизиты</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      currentStep >= 3
                        ? "bg-gradient-to-r from-gray-400 to-gray-500 text-black"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {isSuccess ? <Check className="h-5 w-5" /> : "3"}
                  </div>
                  <span className="text-xs mt-2 text-white">Подтверждение</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">
                  {currentStep === 1 && "Выберите способ вывода"}
                  {currentStep === 2 && "Введите реквизиты для вывода"}
                  {currentStep === 3 && (isSuccess ? "Заявка принята" : "Подтверждение заявки")}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {currentStep === 1 && "Выберите удобный способ получения и укажите сумму"}
                  {currentStep === 2 && "Заполните необходимые данные для выбранного способа вывода"}
                  {currentStep === 3 &&
                    (isSuccess
                      ? "Ваша заявка принята в обработку. Ожидайте подтверждения от оператора"
                      : "Проверьте данные перед подтверждением")}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Step 1: Select Withdrawal Method */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <Alert className="bg-yellow-500/20 border-yellow-500/30 text-yellow-200">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Важно</AlertTitle>
                      <AlertDescription>
                        Вывод возможен только на реквизиты, оформленные на ваше имя. Это необходимо для безопасности и
                        подтверждения личности.
                      </AlertDescription>
                    </Alert>

                    <RadioGroup
                      value={selectedMethod || ""}
                      onValueChange={setSelectedMethod}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <Label
                        htmlFor="card"
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                          selectedMethod === "card"
                            ? "border-gray-400 bg-gray-500/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        } cursor-pointer transition-all duration-200`}
                      >
                        <RadioGroupItem value="card" id="card" className="sr-only" />
                        <CreditCard className="h-10 w-10 mb-3 text-gray-300" />
                        <span className="text-white font-medium">Банковская карта</span>
                        <span className="text-white/60 text-xs mt-1">Visa, MasterCard</span>
                        <Badge className="mt-2 bg-gray-500/30 text-gray-200">Комиссия 3%</Badge>
                      </Label>

                      <Label
                        htmlFor="sbp"
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                          selectedMethod === "sbp"
                            ? "border-gray-400 bg-gray-500/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        } cursor-pointer transition-all duration-200`}
                      >
                        <RadioGroupItem value="sbp" id="sbp" className="sr-only" />
                        <Smartphone className="h-10 w-10 mb-3 text-gray-300" />
                        <span className="text-white font-medium">Система быстрых платежей</span>
                        <span className="text-white/60 text-xs mt-1">СБП</span>
                        <Badge className="mt-2 bg-gray-500/30 text-gray-200">Комиссия 1.5%</Badge>
                      </Label>

                      <Label
                        htmlFor="crypto"
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                          selectedMethod === "crypto"
                            ? "border-gray-400 bg-gray-500/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        } cursor-pointer transition-all duration-200`}
                      >
                        <RadioGroupItem value="crypto" id="crypto" className="sr-only" />
                        <Bitcoin className="h-10 w-10 mb-3 text-gray-300" />
                        <span className="text-white font-medium">Криптовалюта</span>
                        <span className="text-white/60 text-xs mt-1">USDT TRC-20, TON</span>
                        <Badge className="mt-2 bg-gray-500/30 text-gray-200">Комиссия 1%</Badge>
                      </Label>
                    </RadioGroup>

                    <div className="pt-4">
                      <Label htmlFor="amount" className="text-white mb-2 block">
                        Сумма вывода
                      </Label>
                      <div className="relative">
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Введите сумму"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-white/70">USD</span>
                        </div>
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-white/60 text-sm">Доступно: ${availableBalance.toFixed(2)}</span>
                      </div>
                    </div>

                    {amount && Number.parseFloat(amount) > 0 && selectedMethod && (
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">Сумма вывода:</span>
                          <span className="text-white">${Number.parseFloat(amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">Комиссия:</span>
                          <span className="text-white">${commission.toFixed(2)}</span>
                        </div>
                        <Separator className="my-2 bg-white/10" />
                        <div className="flex justify-between items-center font-medium">
                          <span className="text-white">Итого к получению:</span>
                          <span className="text-white">${totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    <Alert className="bg-blue-500/20 border-blue-500/30 text-blue-200">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Информация</AlertTitle>
                      <AlertDescription>
                        Все заявки обрабатываются вручную в течение 5–30 минут (иногда до 3 дней) в рабочее время.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Step 2: Withdrawal Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    {/* Card Withdrawal Form */}
                    {selectedMethod === "card" && (
                      <div className="space-y-6">
                        <Alert className="bg-yellow-500/20 border-yellow-500/30 text-yellow-200">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Важно</AlertTitle>
                          <AlertDescription>
                            Карта должна быть оформлена на ваше имя. Переводы на чужие карты не осуществляются.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber" className="text-white">
                              Номер карты
                            </Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              maxLength={19}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cardName" className="text-white">
                              ФИО владельца карты
                            </Label>
                            <Input
                              id="cardName"
                              placeholder="Иванов Иван Иванович"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bankName" className="text-white">
                              Банк
                            </Label>
                            <select
                              id="bankName"
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                              <option value="" className="bg-gray-800 text-white">Выберите банк</option>
                              <option value="Сбербанк" className="bg-gray-800 text-white">Сбербанк</option>
                              <option value="ВТБ" className="bg-gray-800 text-white">ВТБ</option>
                              <option value="Газпромбанк" className="bg-gray-800 text-white">Газпромбанк</option>
                              <option value="Альфа-Банк" className="bg-gray-800 text-white">Альфа-Банк</option>
                              <option value="Россельхозбанк" className="bg-gray-800 text-white">Россельхозбанк</option>
                              <option value="Открытие" className="bg-gray-800 text-white">Открытие</option>
                              <option value="Совкомбанк" className="bg-gray-800 text-white">Совкомбанк</option>
                              <option value="Райффайзенбанк" className="bg-gray-800 text-white">Райффайзенбанк</option>
                              <option value="Промсвязьбанк" className="bg-gray-800 text-white">Промсвязьбанк</option>
                              <option value="Тинькофф Банк" className="bg-gray-800 text-white">Тинькофф Банк</option>
                              <option value="МТС Банк" className="bg-gray-800 text-white">МТС Банк</option>
                              <option value="Росбанк" className="bg-gray-800 text-white">Росбанк</option>
                              <option value="Другой" className="bg-gray-800 text-white">Другой</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SBP Withdrawal Form */}
                    {selectedMethod === "sbp" && (
                      <div className="space-y-6">
                        <Alert className="bg-yellow-500/20 border-yellow-500/30 text-yellow-200">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Важно</AlertTitle>
                          <AlertDescription>
                            Номер телефона должен быть зарегистрирован на ваше имя и подключен к СБП.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-white">
                              Номер телефона, подключённый к СБП
                            </Label>
                            <Input
                              id="phoneNumber"
                              placeholder="+7 (999) 123-45-67"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sbpName" className="text-white">
                              ФИО владельца
                            </Label>
                            <Input
                              id="sbpName"
                              placeholder="Иванов Иван Иванович"
                              value={sbpName}
                              onChange={(e) => setSbpName(e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Crypto Withdrawal Form */}
                    {selectedMethod === "crypto" && (
                      <div className="space-y-6">
                        <Alert className="bg-red-500/20 border-red-500/30 text-red-200">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Важно!</AlertTitle>
                          <AlertDescription>
                            Мы не возвращаем средства, отправленные в неправильную сеть. Убедитесь в точности адреса и
                            сети.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-white mb-2 block">Выберите сеть</Label>
                            <div className="flex space-x-3">
                              <Button
                                type="button"
                                variant={cryptoNetwork === "trc20" ? "default" : "outline"}
                                className={
                                  cryptoNetwork === "trc20"
                                    ? "bg-gradient-to-r from-gray-400 to-gray-500 text-black"
                                    : "border-white/20 text-white hover:bg-white/10"
                                }
                                onClick={() => setCryptoNetwork("trc20")}
                              >
                                USDT TRC-20
                              </Button>
                              <Button
                                type="button"
                                variant={cryptoNetwork === "ton" ? "default" : "outline"}
                                className={
                                  cryptoNetwork === "ton"
                                    ? "bg-gradient-to-r from-gray-400 to-gray-500 text-black"
                                    : "border-white/20 text-white hover:bg-white/10"
                                }
                                onClick={() => setCryptoNetwork("ton")}
                              >
                                USDT TON
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cryptoAddress" className="text-white">
                              Адрес кошелька ({cryptoNetwork === "trc20" ? "USDT TRC-20" : "USDT TON"})
                            </Label>
                            <Input
                              id="cryptoAddress"
                              placeholder={cryptoNetwork === "trc20" ? "T..." : "UQ..."}
                              value={cryptoAddress}
                              onChange={(e) => setCryptoAddress(e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70">Сумма вывода:</span>
                        <span className="text-white">${Number.parseFloat(amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70">Комиссия:</span>
                        <span className="text-white">${commission.toFixed(2)}</span>
                      </div>
                      <Separator className="my-2 bg-white/10" />
                      <div className="flex justify-between items-center font-medium">
                        <span className="text-white">Итого к получению:</span>
                        <span className="text-white">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Withdrawal Details */}
                {currentStep === 3 && !isSuccess && (
                  <div className="space-y-6">
                    <PaymentDetails 
                      method={selectedMethod!} 
                      amount={Number.parseFloat(amount)} 
                      type="withdrawal" 
                    />
                    
                    <Alert className="bg-blue-500/20 border-blue-500/30 text-blue-200">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Информация о заявке</AlertTitle>
                      <AlertDescription>
                        После отправки заявки ожидайте подтверждения от оператора. При необходимости с вами свяжется
                        менеджер.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Success State */}
                {currentStep === 3 && isSuccess && (
                  <div className="space-y-6">
                    <div className="text-center py-6">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-400" />
                      </div>
                      <h3 className="text-white text-xl font-medium mb-2">Заявка на вывод создана</h3>
                      <p className="text-white/70 mb-4">
                        Ваша заявка на вывод средств успешно создана и находится в обработке
                      </p>

                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-w-xs mx-auto mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">ID заявки:</span>
                          <span className="text-white font-mono">{transactionId}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70">Статус:</span>
                          <Badge className="bg-yellow-500/30 text-yellow-200">В обработке</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Сумма:</span>
                          <span className="text-white">${Number.parseFloat(amount).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-2 text-white/70 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>Ожидаемое время обработки: 5-30 минут</span>
                      </div>
                    </div>

                    <Alert className="bg-blue-500/20 border-blue-500/30 text-blue-200">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Что дальше?</AlertTitle>
                      <AlertDescription>
                        Вы можете отслеживать статус вашей заявки в разделе "Транзакции". Если возникли вопросы —
                        обратитесь в поддержку через форму обратной связи.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between border-t border-white/10 bg-white/5">
                {currentStep > 1 && !isSuccess && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Назад
                  </Button>
                )}
                {isSuccess ? (
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-black ml-auto"
                    onClick={resetForm}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Новая заявка
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className={`bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-black ${
                      currentStep === 1 ? "w-full" : "ml-auto"
                    }`}
                    onClick={handleNextStep}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        {currentStep < 3 ? "Продолжить" : "Подтвердить"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
