"use strict";(()=>{var t={};t.id=9695,t.ids=[9695,9023],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:t=>{t.exports=require("pg")},78893:t=>{t.exports=require("buffer")},84770:t=>{t.exports=require("crypto")},76162:t=>{t.exports=require("stream")},21764:t=>{t.exports=require("util")},8678:t=>{t.exports=import("pg")},45830:(t,e,a)=>{a.a(t,async(t,s)=>{try{a.r(e),a.d(e,{originalPathname:()=>m,patchFetch:()=>c,requestAsyncStorage:()=>d,routeModule:()=>p,serverHooks:()=>_,staticGenerationAsyncStorage:()=>l});var r=a(73278),o=a(45002),n=a(54877),u=a(90955),i=t([u]);u=(i.then?(await i)():i)[0];let p=new r.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/deposit/route",pathname:"/api/deposit",filename:"route",bundlePath:"app/api/deposit/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\deposit\\route.ts",nextConfigOutput:"",userland:u}),{requestAsyncStorage:d,staticGenerationAsyncStorage:l,serverHooks:_}=p,m="/api/deposit/route";function c(){return(0,n.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:l})}s()}catch(t){s(t)}})},90955:(t,e,a)=>{a.a(t,async(t,s)=>{try{a.r(e),a.d(e,{POST:()=>p});var r=a(71309),o=a(64985),n=a(67390),u=a.n(n),i=a(24188),c=t([o]);async function p(t){try{let e;console.log("\uD83D\uDD35 Deposit API called");let a=t.headers.get("authorization");if(!a||!a.startsWith("Bearer "))return r.NextResponse.json({success:!1,error:"Необходима авторизация"},{status:401});let s=a.substring(7);try{let t=process.env.NEXTAUTH_SECRET||process.env.JWT_SECRET||"fallback_secret";e=u().verify(s,t)}catch(t){return r.NextResponse.json({success:!1,error:"Неверный токен"},{status:401})}let n=e.userId,{amount:c,payment_method:p,wallet_address:d,card_number:l,phone_number:_,receipt:m,receipt_filename:h,transaction_hash:y}=await t.json();if(console.log("\uD83D\uDCE6 Request data:",{userId:n,amount:c,payment_method:p,has_receipt:!!m}),!c||c<=0)return r.NextResponse.json({success:!1,error:"Некорректная сумма"},{status:400});if(!p)return r.NextResponse.json({success:!1,error:"Не указан способ оплаты"},{status:400});let E=await o.d.connect();try{let t=p;"card"===p?t="Банковская карта":"sbp"===p?t="Система быстрых платежей":"crypto"===p&&(t="USDT TRC-20");let e={method:t};"card"===p&&l?e.card_number=l:"crypto"===p&&d?(e.wallet_address=d,y&&(e.transaction_hash=y)):"sbp"===p&&_&&(e.phone_number=_),m&&h&&(e.receipt=m,e.receipt_filename=h);let a=(await E.query(`INSERT INTO deposit_requests (
          user_id,
          amount,
          method,
          payment_details,
          status,
          created_at
        ) VALUES ($1, $2, $3, $4, 'pending', NOW())
        RETURNING id, user_id, amount, method, status, created_at`,[n,c,t,JSON.stringify(e)])).rows[0];return console.log("✅ Deposit request created:",a.id),await (0,i.updateStatistics)(),r.NextResponse.json({success:!0,message:"Заявка на пополнение создана",transaction:{id:a.id,amount:parseFloat(a.amount),method:a.method,status:a.status,created_at:a.created_at}})}finally{E.release()}}catch(t){return console.error("❌ Deposit error:",t),r.NextResponse.json({success:!1,error:t.message||"Ошибка при создании заявки"},{status:500})}}o=(c.then?(await c)():c)[0],s()}catch(t){s(t)}})},64985:(t,e,a)=>{a.a(t,async(t,s)=>{try{a.d(e,{I:()=>n,d:()=>i});var r=a(8678),o=t([r]);r=(o.then?(await o)():o)[0];let u=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!u)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let i=new r.Pool({connectionString:u,ssl:!!u?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function n(t,e){let a=await i.connect();try{return await a.query(t,e)}finally{a.release()}}s()}catch(t){s(t)}})},24188:(t,e,a)=>{let{Pool:s}=a(35900),r=new s({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}});async function o(t,e){let a=await r.connect();try{return await a.query(t,e)}finally{a.release()}}async function n(){try{console.log("\uD83D\uDD04 Обновляем статистику...");let[t,e,a]=await Promise.all([o("SELECT COUNT(*) as count FROM users"),o(`
        SELECT 
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(*) as count
        FROM transactions 
        WHERE type = 'investment' AND status = 'completed'
      `),o(`
        SELECT 
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(*) as count
        FROM transactions 
        WHERE type = 'withdrawal' AND status = 'completed'
      `)]),s=parseInt(t.rows[0].count),r=parseFloat(e.rows[0].total_amount),n=parseFloat(a.rows[0].total_amount),u=r>0?n/r*100:0,i=await o(`
      SELECT 
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate
      FROM platform_statistics 
      ORDER BY updated_at DESC 
      LIMIT 1
    `),c=0,p=0,d=0,l=0;if(i.rows.length>0){let t=i.rows[0];c=t.users_count>0?(s-t.users_count)/t.users_count*100:0,p=t.investments_amount>0?(r-t.investments_amount)/t.investments_amount*100:0,d=t.payouts_amount>0?(n-t.payouts_amount)/t.payouts_amount*100:0,l=t.profitability_rate>0?(u-t.profitability_rate)/t.profitability_rate*100:0}let _=await o("SELECT id FROM platform_statistics ORDER BY updated_at DESC LIMIT 1");return _.rows.length>0?await o(`
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
      `,[s,Math.round(100*c)/100,Math.round(r),Math.round(100*p)/100,Math.round(n),Math.round(100*d)/100,Math.round(100*u)/100,Math.round(100*l)/100,_.rows[0].id]):await o(`
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
      `,[s,Math.round(100*c)/100,Math.round(r),Math.round(100*p)/100,Math.round(n),Math.round(100*d)/100,Math.round(100*u)/100,Math.round(100*l)/100]),console.log("✅ Статистика обновлена:",{users:s,investments:r,payouts:n,profitability:u}),{success:!0,data:{users_count:s,users_change:Math.round(100*c)/100,investments_amount:Math.round(r),investments_change:Math.round(100*p)/100,payouts_amount:Math.round(n),payouts_change:Math.round(100*d)/100,profitability_rate:Math.round(100*u)/100,profitability_change:Math.round(100*l)/100}}}catch(t){return console.error("❌ Ошибка обновления статистики:",t),{success:!1,error:t.message}}}t.exports={updateStatistics:n}}};var e=require("../../../webpack-runtime.js");e.C(t);var a=t=>e(e.s=t),s=e.X(0,[7787,4833,7390],()=>a(45830));module.exports=s})();