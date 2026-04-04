# ============================================
# SSH КЛЮЧ ДЛЯ CASCADE
# ============================================

## 🔑 Сгенерированные ключи:

### Публичный ключ (для загрузки на VPS):
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAID89crfWqNjozkuRBJYXZwfgvdO1VXXCc33lFrwERPav x4539@KHUDOIDOD
```

### Приватный ключ: `cascade_vps_key` (у меня)

---

## 📋 ИНСТРУКЦИЯ ПО УСТАНОВКЕ:

### Шаг 1: Подключитесь к VPS через веб-консоль
```
Login: root11
Password: $X11021997x$
```

### Шаг 2: Добавьте публичный ключ
```bash
# Создаем папку .ssh если нет
mkdir -p ~/.ssh

# Добавляем ключ в authorized_keys
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAID89crfWqNjozkuRBJYXZwfgvdO1VXXCc33lFrwERPav x4539@KHUDOIDOD" >> ~/.ssh/authorized_keys

# Устанавливаем правильные права
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Проверяем что ключ добавлен
cat ~/.ssh/authorized_keys
```

### Шаг 3: Проверяем SSH доступ
```bash
# Проверяем что SSH работает
sshd -t && echo "SSH config OK"

# Проверяем порт 22
netstat -tlnp | grep :22
```

---

## 🚀 ПОСЛЕ УСТАНОВКИ:

Теперь я смогу подключаться к вашему VPS:

```bash
ssh -i cascade_vps_key root11@213.171.31.215
```

И выполнять команды:
- Деплой кода
- Перезапуск PM2
- Обновление файлов
- Диагностику проблем

---

## ⚡ БЫСТРАЯ КОМАНДА ДЛЯ ВАС:

Скопируйте и выполните в веб-консоли одним блоком:

```bash
mkdir -p ~/.ssh && \
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAID89crfWqNjozkuRBJYXZwfgvdO1VXXCc33lFrwERPav x4539@KHUDOIDOD" >> ~/.ssh/authorized_keys && \
chmod 700 ~/.ssh && \
chmod 600 ~/.ssh/authorized_keys && \
echo "✅ SSH ключ добавлен!" && \
cat ~/.ssh/authorized_keys
```

---

## 🔒 БЕЗОПАСНОСТЬ:

- Ключ уникальный для Cascade
- Без парольной фразы (для автоматизации)
- Можно удалить в любой момент: `rm ~/.ssh/authorized_keys`

---

## 📞 ПРОВЕРКА:

После установки скажите мне и я проверю подключение:
```bash
ssh -i cascade_vps_key root11@213.171.31.215 "echo 'SSH работает!'"
```

Готов к работе! 🚀
