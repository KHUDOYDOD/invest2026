# 🔑 ЗАГРУЗИТЕ SSH КЛЮЧ НА VPS

## ✅ Ключ создан!

Я создал новый SSH ключ для автоматического подключения к серверу.

## 📋 ЧТО НУЖНО СДЕЛАТЬ:

### Шаг 1: Скопируйте публичный ключ

Откройте файл `kiro_vps_key.pub` или скопируйте отсюда:

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCyo99tia5JCLg0KNZqe4I80ZibOt9Rhcq/lizo/G9komooXXDa0wo1/V7lIl9KpBdd62OX3/DxlEAWDPBg9Hoy6/7bXv9PdaDSnFZ0hUO6Y3UPMGBcAraJEmb7YyFSeiFYFZDBpAoy5PKk0x2wmRKADQfNGdrhH8cm3u81kYsDRK+gSOH4UoxPA6lRR4XZ8E6EWEHKL0/DXcUFEJwPJ9igN6a+2/AYvdNIzlo2ErxBh5RfeW9ecOK3UBd4pj81LC3r71tkXWiusQV/r2F06D+YpxDWfOLJqO1G/JN50sekGy1zjTPyQ5K+momOhTxYfqIhl4t55QqZhC7Vd2fmGOMe57e8VaXXC0oWecgzPc13TqSaaTYRofhCb3AhRKP0pfAdzPeDeQn4AgW80DT3IRs6Jk8+Q4QAr/zXohPD8rTjHkZGrDxiYiffBN0GgKgCYGTBSqPT7wlcsayxvBj50EZFpGq1Zdhhs/0XBwrIaLWBcW7MX7cmpGKRCOsAl++Us7BjGObgtm3djAhRgdW/QS22wUM+u17s3LWklozqjEi45ohwOxHcqscaraHHTyqeppqXe1c/agAr2cgV6alYeEHluPy0CLXb4MMVhgiPmEs8pYRAFyC4oy8Z1VCsJwE1ufYXthR50ql3g97h3twMFBQlnqq04Jcgft5sUdbGGlVP5Q== kiro-ai-access
```

### Шаг 2: Зайдите на VPS через консоль

Откройте веб-консоль VPS или подключитесь через SSH:
```bash
ssh root@213.171.31.215
```

### Шаг 3: Добавьте ключ на сервер

Выполните эти команды на сервере:

```bash
# Создайте папку для ключей (если её нет)
mkdir -p ~/.ssh

# Установите правильные права
chmod 700 ~/.ssh

# Добавьте публичный ключ
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCyo99tia5JCLg0KNZqe4I80ZibOt9Rhcq/lizo/G9komooXXDa0wo1/V7lIl9KpBdd62OX3/DxlEAWDPBg9Hoy6/7bXv9PdaDSnFZ0hUO6Y3UPMGBcAraJEmb7YyFSeiFYFZDBpAoy5PKk0x2wmRKADQfNGdrhH8cm3u81kYsDRK+gSOH4UoxPA6lRR4XZ8E6EWEHKL0/DXcUFEJwPJ9igN6a+2/AYvdNIzlo2ErxBh5RfeW9ecOK3UBd4pj81LC3r71tkXWiusQV/r2F06D+YpxDWfOLJqO1G/JN50sekGy1zjTPyQ5K+momOhTxYfqIhl4t55QqZhC7Vd2fmGOMe57e8VaXXC0oWecgzPc13TqSaaTYRofhCb3AhRKP0pfAdzPeDeQn4AgW80DT3IRs6Jk8+Q4QAr/zXohPD8rTjHkZGrDxiYiffBN0GgKgCYGTBSqPT7wlcsayxvBj50EZFpGq1Zdhhs/0XBwrIaLWBcW7MX7cmpGKRCOsAl++Us7BjGObgtm3djAhRgdW/QS22wUM+u17s3LWklozqjEi45ohwOxHcqscaraHHTyqeppqXe1c/agAr2cgV6alYeEHluPy0CLXb4MMVhgiPmEs8pYRAFyC4oy8Z1VCsJwE1ufYXthR50ql3g97h3twMFBQlnqq04Jcgft5sUdbGGlVP5Q== kiro-ai-access" >> ~/.ssh/authorized_keys

# Установите правильные права на файл
chmod 600 ~/.ssh/authorized_keys

# Проверьте, что ключ добавлен
cat ~/.ssh/authorized_keys
```

### Шаг 4: Сообщите мне

После того как добавите ключ, напишите "готово" или "ключ добавлен", и я автоматически обновлю сервер!

## 🚀 Что произойдет дальше:

После добавления ключа я смогу:
1. ✅ Автоматически подключиться к серверу
2. ✅ Загрузить изменения из GitHub
3. ✅ Удалить кэш Next.js
4. ✅ Установить зависимости
5. ✅ Перезапустить PM2
6. ✅ Проверить статус

## 📝 Альтернативный способ (через файл):

Если команда выше не работает, создайте файл вручную:

```bash
# Откройте редактор
nano ~/.ssh/authorized_keys

# Вставьте ключ (весь текст из kiro_vps_key.pub)
# Нажмите Ctrl+X, затем Y, затем Enter

# Установите права
chmod 600 ~/.ssh/authorized_keys
```

## ✅ Проверка:

После добавления ключа проверьте:
```bash
cat ~/.ssh/authorized_keys | grep kiro-ai-access
```

Должна появиться строка с "kiro-ai-access" в конце.

---

**Файлы:**
- `kiro_vps_key` - приватный ключ (НЕ загружайте на сервер!)
- `kiro_vps_key.pub` - публичный ключ (загрузите на сервер)

**Сервер:** 213.171.31.215
