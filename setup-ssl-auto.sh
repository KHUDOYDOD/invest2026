#!/bin/bash

echo "🔒 АВТОМАТИЧЕСКАЯ УСТАНОВКА SSL СЕРТИФИКАТА"
echo "=========================================="

# Функция для установки SSL с доменом
install_ssl_with_domain() {
    local domain=$1
    echo "🌐 Устанавливаем SSL для домена: $domain"
    
    # Обновляем систему
    echo "📦 Обновляем систему..."
    sudo apt update
    
    # Устанавливаем Certbot
    echo "🔧 Устанавливаем Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
    
    # Создаем конфигурацию nginx для домена
    echo "⚙️ Создаем конфигурацию nginx..."
    sudo tee /etc/nginx/sites-available/$domain > /dev/null <<EOF
server {
    listen 80;
    server_name $domain www.$domain;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF
    
    # Активируем конфигурацию
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo ln -sf /etc/nginx/sites-available/$domain /etc/nginx/sites-enabled/
    
    # Проверяем конфигурацию
    sudo nginx -t
    if [ $? -eq 0 ]; then
        sudo systemctl reload nginx
        echo "✅ Nginx конфигурация обновлена"
    else
        echo "❌ Ошибка в конфигурации nginx"
        return 1
    fi
    
    # Получаем SSL сертификат
    echo "🔒 Получаем SSL сертификат от Let's Encrypt..."
    sudo certbot --nginx -d $domain -d www.$domain --non-interactive --agree-tos --email admin@$domain
    
    if [ $? -eq 0 ]; then
        echo "🎉 SSL сертификат успешно установлен!"
        echo "✅ Сайт доступен по адресу: https://$domain"
        
        # Настраиваем автообновление
        echo "🔄 Настраиваем автообновление сертификата..."
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        
        return 0
    else
        echo "❌ Ошибка при получении SSL сертификата"
        return 1
    fi
}

# Функция для получения бесплатного поддомена
setup_free_domain() {
    echo "🆓 НАСТРОЙКА БЕСПЛАТНОГО ПОДДОМЕНА"
    echo "=================================="
    echo ""
    echo "Варианты бесплатных доменов/поддоменов:"
    echo "1. Freenom (.tk, .ml, .ga, .cf) - полностью бесплатные домены"
    echo "2. No-IP - бесплатные поддомены (yoursite.ddns.net)"
    echo "3. DuckDNS - бесплатные поддомены (yoursite.duckdns.org)"
    echo "4. Cloudflare Tunnel - доступ через tunnel без домена"
    echo ""
    echo "Рекомендуем:"
    echo "- Зарегистрировать домен на Freenom: https://freenom.com"
    echo "- Или использовать No-IP: https://www.noip.com"
    echo ""
    echo "После получения домена запустите:"
    echo "bash setup-ssl-auto.sh ваш-домен.com"
}

# Основная логика
if [ $# -eq 0 ]; then
    echo "❓ Использование:"
    echo "bash setup-ssl-auto.sh ваш-домен.com"
    echo ""
    setup_free_domain
    exit 1
fi

DOMAIN=$1

# Проверяем что домен указан
if [ -z "$DOMAIN" ]; then
    echo "❌ Ошибка: не указан домен"
    exit 1
fi

# Проверяем что домен резолвится на наш IP
echo "🔍 Проверяем DNS для домена $DOMAIN..."
DOMAIN_IP=$(dig +short $DOMAIN)
SERVER_IP=$(curl -s ifconfig.me)

echo "IP домена: $DOMAIN_IP"
echo "IP сервера: $SERVER_IP"

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    echo "⚠️ ВНИМАНИЕ: Домен $DOMAIN не указывает на этот сервер!"
    echo "Настройте DNS записи:"
    echo "A запись: $DOMAIN -> $SERVER_IP"
    echo "A запись: www.$DOMAIN -> $SERVER_IP"
    echo ""
    read -p "Продолжить установку? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Установка отменена"
        exit 1
    fi
fi

# Устанавливаем SSL
install_ssl_with_domain $DOMAIN

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 УСТАНОВКА ЗАВЕРШЕНА!"
    echo "======================"
    echo "✅ SSL сертификат установлен"
    echo "🌐 Сайт доступен: https://$DOMAIN"
    echo "🔒 Автоматическое обновление настроено"
    echo ""
    echo "Проверьте сайт:"
    echo "- HTTP: http://$DOMAIN (перенаправляется на HTTPS)"
    echo "- HTTPS: https://$DOMAIN"
else
    echo ""
    echo "❌ ОШИБКА УСТАНОВКИ"
    echo "=================="
    echo "Проверьте:"
    echo "1. DNS записи домена"
    echo "2. Доступность порта 80 и 443"
    echo "3. Логи: sudo tail -f /var/log/letsencrypt/letsencrypt.log"
fi