@echo off
echo Создание таблицы отзывов...
psql -U postgres -d investpro -f create-testimonials-table.sql
echo Таблица отзывов создана успешно!
pause