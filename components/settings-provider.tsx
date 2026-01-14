"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  registrationEnabled: boolean
  maintenanceMode: boolean
  minDeposit: number
  maxDeposit: number
  minWithdraw: number
  withdrawFee: number
  referralBonus: number
  welcomeBonus: number
}

interface AppearanceSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  darkMode: boolean
  logoUrl: string
  faviconUrl: string
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  depositNotifications: boolean
  withdrawNotifications: boolean
  investmentNotifications: boolean
}

interface SettingsContextType {
  siteSettings: SiteSettings
  appearanceSettings: AppearanceSettings
  notificationSettings: NotificationSettings
  loading: boolean
  refreshSettings: () => Promise<void>
  updateSiteSettings: (settings: SiteSettings) => void
  updateAppearanceSettings: (settings: AppearanceSettings) => void
  updateNotificationSettings: (settings: NotificationSettings) => void
}

const defaultSiteSettings: SiteSettings = {
  siteName: "InvestPro",
  siteDescription: "Профессиональная инвестиционная платформа",
  contactEmail: "X453925x@gmail.com",
  registrationEnabled: true,
  maintenanceMode: false,
  minDeposit: 50,
  maxDeposit: 50000,
  minWithdraw: 10,
  withdrawFee: 2,
  referralBonus: 5,
  welcomeBonus: 25,
}

const defaultAppearanceSettings: AppearanceSettings = {
  primaryColor: "#3b82f6",
  secondaryColor: "#10b981",
  accentColor: "#f59e0b",
  darkMode: false,
  logoUrl: "/logo.png",
  faviconUrl: "/favicon.ico",
}

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  depositNotifications: true,
  withdrawNotifications: true,
  investmentNotifications: true,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings)
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(defaultAppearanceSettings)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings)
  const [loading, setLoading] = useState(false)

  const loadSettings = async () => {
    try {
      setLoading(true)

      // Загружаем настройки сайта из базы данных
      try {
        const siteResponse = await fetch("/api/settings/site")
        if (siteResponse.ok) {
          const siteData = await siteResponse.json()
          const loadedSiteSettings = {
            siteName: siteData.site_name || defaultSiteSettings.siteName,
            siteDescription: siteData.site_description || defaultSiteSettings.siteDescription,
            contactEmail: siteData.contact_email || defaultSiteSettings.contactEmail,
            registrationEnabled: siteData.registration_enabled !== undefined ? siteData.registration_enabled : defaultSiteSettings.registrationEnabled,
            maintenanceMode: siteData.maintenance_mode !== undefined ? siteData.maintenance_mode : defaultSiteSettings.maintenanceMode,
            minDeposit: siteData.min_deposit || defaultSiteSettings.minDeposit,
            maxDeposit: siteData.max_deposit || defaultSiteSettings.maxDeposit,
            minWithdraw: siteData.min_withdraw || defaultSiteSettings.minWithdraw,
            withdrawFee: siteData.withdraw_fee || defaultSiteSettings.withdrawFee,
            referralBonus: siteData.referral_bonus || defaultSiteSettings.referralBonus,
            welcomeBonus: siteData.welcome_bonus || defaultSiteSettings.welcomeBonus,
          }
          setSiteSettings(loadedSiteSettings)
          console.log("✅ Site settings loaded from database:", loadedSiteSettings)
        } else {
          console.log("⚠️ Using default site settings")
          setSiteSettings(defaultSiteSettings)
        }
      } catch (error) {
        console.error("Error loading site settings:", error)
        setSiteSettings(defaultSiteSettings)
      }

      // Загружаем настройки внешнего вида
      try {
        const appearanceResponse = await fetch("/api/settings/appearance")
        if (appearanceResponse.ok) {
          const appearanceData = await appearanceResponse.json()
          const loadedAppearanceSettings = {
            primaryColor: appearanceData.primary_color || defaultAppearanceSettings.primaryColor,
            secondaryColor: appearanceData.secondary_color || defaultAppearanceSettings.secondaryColor,
            accentColor: appearanceData.accent_color || defaultAppearanceSettings.accentColor,
            darkMode: appearanceData.dark_mode !== undefined ? appearanceData.dark_mode : defaultAppearanceSettings.darkMode,
            logoUrl: appearanceData.logo_url || defaultAppearanceSettings.logoUrl,
            faviconUrl: appearanceData.favicon_url || defaultAppearanceSettings.faviconUrl,
          }
          setAppearanceSettings(loadedAppearanceSettings)
          console.log("✅ Appearance settings loaded from database")
        } else {
          setAppearanceSettings(defaultAppearanceSettings)
        }
      } catch (error) {
        console.error("Error loading appearance settings:", error)
        setAppearanceSettings(defaultAppearanceSettings)
      }

      // Загружаем настройки уведомлений
      try {
        const notificationResponse = await fetch("/api/settings/notifications")
        if (notificationResponse.ok) {
          const notificationData = await notificationResponse.json()
          const loadedNotificationSettings = {
            emailNotifications: notificationData.email_notifications !== undefined ? notificationData.email_notifications : defaultNotificationSettings.emailNotifications,
            smsNotifications: notificationData.sms_notifications !== undefined ? notificationData.sms_notifications : defaultNotificationSettings.smsNotifications,
            pushNotifications: notificationData.push_notifications !== undefined ? notificationData.push_notifications : defaultNotificationSettings.pushNotifications,
            depositNotifications: notificationData.deposit_notifications !== undefined ? notificationData.deposit_notifications : defaultNotificationSettings.depositNotifications,
            withdrawNotifications: notificationData.withdraw_notifications !== undefined ? notificationData.withdraw_notifications : defaultNotificationSettings.withdrawNotifications,
            investmentNotifications: notificationData.investment_notifications !== undefined ? notificationData.investment_notifications : defaultNotificationSettings.investmentNotifications,
          }
          setNotificationSettings(loadedNotificationSettings)
          console.log("✅ Notification settings loaded from database")
        } else {
          setNotificationSettings(defaultNotificationSettings)
        }
      } catch (error) {
        console.error("Error loading notification settings:", error)
        setNotificationSettings(defaultNotificationSettings)
      }

      // Применяем настройки к DOM
      if (typeof document !== "undefined") {
        document.title = siteSettings.siteName
        document.documentElement.style.setProperty("--primary-color", appearanceSettings.primaryColor)
        document.documentElement.style.setProperty("--secondary-color", appearanceSettings.secondaryColor)
        document.documentElement.style.setProperty("--accent-color", appearanceSettings.accentColor)
      }

      console.log("✅ All settings loaded successfully")
    } catch (error) {
      console.error("Error loading settings:", error)
      // Устанавливаем значения по умолчанию при любых ошибках
      setSiteSettings(defaultSiteSettings)
      setAppearanceSettings(defaultAppearanceSettings)
      setNotificationSettings(defaultNotificationSettings)
    } finally {
      setLoading(false)
    }
  }

  const refreshSettings = async () => {
    await loadSettings()
  }

  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings)
    document.title = settings.siteName
  }

  const updateAppearanceSettings = (settings: AppearanceSettings) => {
    setAppearanceSettings(settings)
    document.documentElement.style.setProperty("--primary-color", settings.primaryColor)
    document.documentElement.style.setProperty("--secondary-color", settings.secondaryColor)
    document.documentElement.style.setProperty("--accent-color", settings.accentColor)
  }

  const updateNotificationSettings = (settings: NotificationSettings) => {
    setNotificationSettings(settings)
  }

  useEffect(() => {
    loadSettings()
  }, [])

  return (
    <SettingsContext.Provider
      value={{
        siteSettings,
        appearanceSettings,
        notificationSettings,
        loading,
        refreshSettings,
        updateSiteSettings,
        updateAppearanceSettings,
        updateNotificationSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
