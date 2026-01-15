const { Pool } = require('pg');

async function addDemoTestimonials() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_w5yC0HdchuEB@ep-bold-grass-abge4ccn-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require',
  });

  try {
    console.log('🔄 Подключение к базе данных...');
    
    // Проверяем, есть ли пользователи
    const usersResult = await pool.query('SELECT id, full_name FROM users LIMIT 5');
    
    if (usersResult.rows.length === 0) {
      console.log('❌ В базе нет пользователей. Сначала создайте пользователей.');
      return;
    }
    
    console.log(`✅ Найдено ${usersResult.rows.length} пользователей`);
    
    // Проверяем существующие отзывы
    const existingResult = await pool.query(`
      SELECT COUNT(*) as count FROM testimonials WHERE status = 'approved'
    `);
    
    const existingCount = parseInt(existingResult.rows[0].count);
    console.log(`📊 Существующих одобренных отзывов: ${existingCount}`);
    
    if (existingCount >= 5) {
      console.log('✅ Уже есть достаточно отзывов!');
      return;
    }
    
    // Создаем демо-отзывы
    const demoTestimonials = [
      {
        rating: 5,
        title: 'Отличная платформа для инвестиций!',
        content: 'Пользуюсь платформой уже 6 месяцев. Все выплаты приходят вовремя, поддержка отвечает быстро. Рекомендую!'
      },
      {
        rating: 5,
        title: 'Стабильный доход каждый месяц',
        content: 'Инвестировал в тариф "Профессионал" и получаю стабильную прибыль. Очень доволен результатами!'
      },
      {
        rating: 4,
        title: 'Надежная компания',
        content: 'Работаю с InvestPro уже год. Все прозрачно и понятно. Единственное - хотелось бы больше тарифов.'
      },
      {
        rating: 5,
        title: 'Лучший сервис для инвестиций',
        content: 'Перепробовал много платформ, но InvestPro - самая надежная. Вывод средств быстрый, комиссии минимальные.'
      },
      {
        rating: 5,
        title: 'Рекомендую всем!',
        content: 'Начал с минимальной суммы, постепенно увеличиваю инвестиции. Результаты превзошли ожидания!'
      },
      {
        rating: 4,
        title: 'Хороший старт для новичков',
        content: 'Интерфейс понятный, есть калькулятор доходности. Для начинающих инвесторов - отличный вариант.'
      }
    ];
    
    let added = 0;
    
    for (let i = 0; i < demoTestimonials.length && added < (5 - existingCount); i++) {
      const testimonial = demoTestimonials[i];
      const user = usersResult.rows[i % usersResult.rows.length];
      
      await pool.query(`
        INSERT INTO testimonials (user_id, rating, title, content, status, approved_at, created_at)
        VALUES ($1, $2, $3, $4, 'approved', NOW(), NOW())
      `, [user.id, testimonial.rating, testimonial.title, testimonial.content]);
      
      console.log(`✅ Добавлен отзыв от ${user.full_name}: "${testimonial.title}"`);
      added++;
    }
    
    console.log(`\n✅ Добавлено ${added} новых отзывов!`);
    
    // Проверяем результат
    const finalResult = await pool.query(`
      SELECT COUNT(*) as count FROM testimonials WHERE status = 'approved'
    `);
    
    console.log(`\n📊 Всего одобренных отзывов: ${finalResult.rows[0].count}`);
    console.log('\n🎉 Готово! Теперь отзывы будут отображаться на главной странице.');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

addDemoTestimonials();
