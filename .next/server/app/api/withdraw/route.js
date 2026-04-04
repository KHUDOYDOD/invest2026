"use strict";(()=>{var t={};t.id=5886,t.ids=[5886,9023],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:t=>{t.exports=require("pg")},78893:t=>{t.exports=require("buffer")},84770:t=>{t.exports=require("crypto")},76162:t=>{t.exports=require("stream")},21764:t=>{t.exports=require("util")},8678:t=>{t.exports=import("pg")},49712:(t,e,s)=>{s.a(t,async(t,r)=>{try{s.r(e),s.d(e,{originalPathname:()=>h,patchFetch:()=>c,requestAsyncStorage:()=>d,routeModule:()=>l,serverHooks:()=>_,staticGenerationAsyncStorage:()=>p});var a=s(73278),n=s(45002),o=s(54877),u=s(28365),i=t([u]);u=(i.then?(await i)():i)[0];let l=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/withdraw/route",pathname:"/api/withdraw",filename:"route",bundlePath:"app/api/withdraw/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\withdraw\\route.ts",nextConfigOutput:"",userland:u}),{requestAsyncStorage:d,staticGenerationAsyncStorage:p,serverHooks:_}=l,h="/api/withdraw/route";function c(){return(0,o.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:p})}r()}catch(t){r(t)}})},28365:(t,e,s)=>{s.a(t,async(t,r)=>{try{s.r(e),s.d(e,{POST:()=>l});var a=s(71309),n=s(64985),o=s(67390),u=s.n(o),i=s(24188),c=t([n]);async function l(t){try{console.log("=== СОЗДАНИЕ ЗАЯВКИ НА ВЫВОД ===");let e=function(t){let e=t.headers.get("authorization");if(!e||!e.startsWith("Bearer "))return null;let s=e.substring(7);try{let t=process.env.NEXTAUTH_SECRET||process.env.JWT_SECRET||"fallback_secret";return u().verify(s,t)}catch(t){return console.error("Token verification error:",t),null}}(t);if(!e)return a.NextResponse.json({success:!1,error:"Необходима авторизация. Пожалуйста, войдите в систему."},{status:401});let{amount:s,method:r,payment_method:o,wallet_address:c,card_number:l,card_holder_name:d,bank_name:p,phone_number:_,account_holder_name:h,crypto_network:m}=await t.json(),w=r||o;if(console.log("Данные запроса:",{amount:s,method:w,wallet_address:c,card_number:l,card_holder_name:d,bank_name:p,phone_number:_,account_holder_name:h,crypto_network:m}),!s)return a.NextResponse.json({success:!1,error:"Укажите сумму для вывода"},{status:400});let E=parseFloat(s);if(isNaN(E)||E<=0)return a.NextResponse.json({success:!1,error:"Сумма должна быть положительным числом"},{status:400});if(E<10)return a.NextResponse.json({success:!1,error:"Минимальная сумма для вывода: $10"},{status:400});if(!w)return a.NextResponse.json({success:!1,error:"Выберите способ вывода средств"},{status:400});if(!["card","crypto","sbp","bank"].includes(w))return a.NextResponse.json({success:!1,error:"Недопустимый способ вывода"},{status:400});if("crypto"===w&&!c)return a.NextResponse.json({success:!1,error:"Укажите адрес криптокошелька"},{status:400});if("card"===w&&!l)return a.NextResponse.json({success:!1,error:"Укажите номер карты"},{status:400});if("sbp"===w&&!_)return a.NextResponse.json({success:!1,error:"Укажите номер телефона для СБП"},{status:400});if("sbp"===w&&!p)return a.NextResponse.json({success:!1,error:"Выберите банк для СБП"},{status:400});console.log("Creating withdrawal request:",{userId:e.userId,amount:E,method:w,bank_name:p});let f=await (0,n.I)("SELECT balance, full_name FROM users WHERE id = $1",[e.userId]);if(0===f.rows.length)return a.NextResponse.json({success:!1,error:"Пользователь не найден в системе"},{status:404});let y=parseFloat(f.rows[0].balance),R=f.rows[0].full_name;if(console.log(`Баланс пользователя ${R}: $${y}, запрашивает: $${E}`),0===y)return a.NextResponse.json({success:!1,error:"На вашем счету недостаточно средств для вывода",details:{currentBalance:y,requestedAmount:E,message:"Ваш текущий баланс: $0.00. Пополните счет или получите прибыль от инвестиций для вывода средств."}},{status:400});if(y<E){let t=E-y;return a.NextResponse.json({success:!1,error:`Недостаточно средств на счету`,details:{currentBalance:y,requestedAmount:E,shortage:t,message:`Ваш баланс: $${y.toFixed(2)}. Для вывода $${E.toFixed(2)} не хватает $${t.toFixed(2)}.`}},{status:400})}let g=.02*E,$=E-g;await (0,n.I)("BEGIN");try{await (0,n.I)("UPDATE users SET balance = balance - $1 WHERE id = $2",[E,e.userId]);let t=await (0,n.I)(`INSERT INTO withdrawal_requests (
          user_id, amount, method, wallet_address, card_number, card_holder_name, bank_name,
          phone_number, account_holder_name, crypto_network, fee, final_amount, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending', NOW()) 
        RETURNING id, created_at`,[e.userId,E,w,c||null,l||null,d||null,p||null,_||null,h||null,m||null,g,$]),s=await (0,n.I)(`INSERT INTO transactions (
          id, user_id, type, amount, status, description, created_at
        ) VALUES (gen_random_uuid(), $1, 'withdrawal', $2, 'pending', 'Заявка на вывод средств', NOW())
        RETURNING id`,[e.userId,E]);return await (0,n.I)("COMMIT"),console.log("✅ Withdrawal request created successfully"),await (0,i.updateStatistics)(),a.NextResponse.json({success:!0,message:"Заявка на вывод создана успешно",transaction:{id:s.rows[0].id,amount:E,fee:g,final_amount:$,status:"pending",created_at:t.rows[0].created_at},withdrawal_request:{id:t.rows[0].id,status:"pending"}})}catch(t){throw await (0,n.I)("ROLLBACK"),t}}catch(t){return console.error("❌ Error creating withdrawal request:",t),a.NextResponse.json({success:!1,error:"Произошла ошибка при создании заявки на вывод",details:t instanceof Error?t.message:"Неизвестная ошибка"},{status:500})}}n=(c.then?(await c)():c)[0],r()}catch(t){r(t)}})},64985:(t,e,s)=>{s.a(t,async(t,r)=>{try{s.d(e,{I:()=>o,d:()=>i});var a=s(8678),n=t([a]);a=(n.then?(await n)():n)[0];let u=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!u)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let i=new a.Pool({connectionString:u,ssl:!!u?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function o(t,e){let s=await i.connect();try{return await s.query(t,e)}finally{s.release()}}r()}catch(t){r(t)}})},24188:(t,e,s)=>{let{Pool:r}=s(35900),a=new r({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}});async function n(t,e){let s=await a.connect();try{return await s.query(t,e)}finally{s.release()}}async function o(){try{console.log("\uD83D\uDD04 Обновляем статистику...");let[t,e,s]=await Promise.all([n("SELECT COUNT(*) as count FROM users"),n(`
        SELECT 
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(*) as count
        FROM transactions 
        WHERE type = 'investment' AND status = 'completed'
      `),n(`
        SELECT 
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(*) as count
        FROM transactions 
        WHERE type = 'withdrawal' AND status = 'completed'
      `)]),r=parseInt(t.rows[0].count),a=parseFloat(e.rows[0].total_amount),o=parseFloat(s.rows[0].total_amount),u=a>0?o/a*100:0,i=await n(`
      SELECT 
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate
      FROM platform_statistics 
      ORDER BY updated_at DESC 
      LIMIT 1
    `),c=0,l=0,d=0,p=0;if(i.rows.length>0){let t=i.rows[0];c=t.users_count>0?(r-t.users_count)/t.users_count*100:0,l=t.investments_amount>0?(a-t.investments_amount)/t.investments_amount*100:0,d=t.payouts_amount>0?(o-t.payouts_amount)/t.payouts_amount*100:0,p=t.profitability_rate>0?(u-t.profitability_rate)/t.profitability_rate*100:0}let _=await n("SELECT id FROM platform_statistics ORDER BY updated_at DESC LIMIT 1");return _.rows.length>0?await n(`
        UPDATE platform_statistics SET
          users_count = $1,
          users_change = $2,
          investments_amount = $3,
          investments_change = $4,
          payouts_amount = $5,
          payouts_change = $6,
          profitability_rate = $7,
          profitability_change = $8,
          updated_at = NOW()
        WHERE id = $9
      `,[r,Math.round(100*c)/100,Math.round(a),Math.round(100*l)/100,Math.round(o),Math.round(100*d)/100,Math.round(100*u)/100,Math.round(100*p)/100,_.rows[0].id]):await n(`
        INSERT INTO platform_statistics (
          users_count,
          users_change,
          investments_amount,
          investments_change,
          payouts_amount,
          payouts_change,
          profitability_rate,
          profitability_change,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `,[r,Math.round(100*c)/100,Math.round(a),Math.round(100*l)/100,Math.round(o),Math.round(100*d)/100,Math.round(100*u)/100,Math.round(100*p)/100]),console.log("✅ Статистика обновлена:",{users:r,investments:a,payouts:o,profitability:u}),{success:!0,data:{users_count:r,users_change:Math.round(100*c)/100,investments_amount:Math.round(a),investments_change:Math.round(100*l)/100,payouts_amount:Math.round(o),payouts_change:Math.round(100*d)/100,profitability_rate:Math.round(100*u)/100,profitability_change:Math.round(100*p)/100}}}catch(t){return console.error("❌ Ошибка обновления статистики:",t),{success:!1,error:t.message}}}t.exports={updateStatistics:o}}};var e=require("../../../webpack-runtime.js");e.C(t);var s=t=>e(e.s=t),r=e.X(0,[7787,4833,7390],()=>s(49712));module.exports=r})();