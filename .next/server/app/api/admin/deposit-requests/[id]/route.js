"use strict";(()=>{var t={};t.id=4407,t.ids=[4407,9023],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:t=>{t.exports=require("pg")},78893:t=>{t.exports=require("buffer")},84770:t=>{t.exports=require("crypto")},76162:t=>{t.exports=require("stream")},21764:t=>{t.exports=require("util")},8678:t=>{t.exports=import("pg")},51511:(t,e,s)=>{s.a(t,async(t,a)=>{try{s.r(e),s.d(e,{originalPathname:()=>m,patchFetch:()=>d,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>_,staticGenerationAsyncStorage:()=>p});var r=s(73278),o=s(45002),n=s(54877),i=s(90918),u=t([i]);i=(u.then?(await u)():u)[0];let c=new r.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/admin/deposit-requests/[id]/route",pathname:"/api/admin/deposit-requests/[id]",filename:"route",bundlePath:"app/api/admin/deposit-requests/[id]/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\admin\\deposit-requests\\[id]\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:l,staticGenerationAsyncStorage:p,serverHooks:_}=c,m="/api/admin/deposit-requests/[id]/route";function d(){return(0,n.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:p})}a()}catch(t){a(t)}})},90918:(t,e,s)=>{s.a(t,async(t,a)=>{try{s.r(e),s.d(e,{PATCH:()=>c});var r=s(71309),o=s(64985),n=s(67390),i=s.n(n),u=s(24188),d=t([o]);async function c(t,{params:e}){try{console.log("=== ADMIN UPDATE DEPOSIT REQUEST ===");let s=function(t){let e=t.headers.get("authorization");if(!e||!e.startsWith("Bearer "))return null;let s=e.substring(7);try{let t=process.env.NEXTAUTH_SECRET||process.env.JWT_SECRET||"fallback_secret",e=i().verify(s,t);if("admin"!==e.role&&"super_admin"!==e.role)return null;return e}catch(t){return console.error("Admin token verification error:",t),null}}(t);if(!s)return r.NextResponse.json({error:"Доступ запрещен"},{status:403});let{status:a,admin_comment:n}=await t.json(),d=e.id;if(!d||!a)return r.NextResponse.json({error:"Не указаны обязательные поля"},{status:400});if(console.log("Updating deposit request:",d,"Status:",a),"approved"===a){let t=await (0,o.I)("SELECT user_id, amount FROM deposit_requests WHERE id = $1",[d]);if(0===t.rows.length)return r.NextResponse.json({error:"Заявка не найдена"},{status:404});let{user_id:e,amount:i}=t.rows[0];await (0,o.I)("BEGIN");try{await (0,o.I)(`UPDATE deposit_requests 
           SET status = $1, admin_comment = $2, processed_at = NOW(), processed_by = $3
           WHERE id = $4`,[a,n||null,s.userId,d]),await (0,o.I)("UPDATE users SET balance = balance + $1 WHERE id = $2",[i,e]),await (0,o.I)(`INSERT INTO transactions (id, user_id, type, amount, status, description, created_at)
           VALUES (gen_random_uuid(), $1, 'deposit', $2, 'completed', 'Пополнение баланса (одобрено администратором)', NOW())`,[e,i]);let t=await (0,o.I)("SELECT referred_by FROM users WHERE id = $1",[e]);if(t.rows.length>0&&t.rows[0].referred_by){let e=t.rows[0].referred_by,s=.05*parseFloat(i);console.log(`💰 Processing referral commission: ${s} for code ${e}`);let a=await (0,o.I)("SELECT id FROM users WHERE referral_code = $1",[e]);if(a.rows.length>0){let t=a.rows[0].id;await (0,o.I)("UPDATE users SET balance = balance + $1, total_earned = total_earned + $1 WHERE id = $2",[s,t]),await (0,o.I)(`INSERT INTO transactions (id, user_id, type, amount, status, description, created_at)
               VALUES (gen_random_uuid(), $1, 'referral_bonus', $2, 'completed', 'Реферальная комиссия (5% от депозита)', NOW())`,[t,s]),console.log(`✅ Referral commission ${s} credited to user ${t}`)}}await (0,o.I)("COMMIT"),console.log("✅ Deposit request approved and balance updated"),await (0,u.updateStatistics)()}catch(t){throw await (0,o.I)("ROLLBACK"),t}}else{let t=await (0,o.I)(`UPDATE deposit_requests 
         SET status = $1, admin_comment = $2, processed_at = NOW(), processed_by = $3
         WHERE id = $4
         RETURNING *`,[a,n||null,s.userId,d]);if(0===t.rows.length)return r.NextResponse.json({error:"Заявка не найдена"},{status:404});await (0,u.updateStatistics)()}return console.log("✅ Deposit request updated successfully"),r.NextResponse.json({success:!0,message:"Заявка обновлена успешно"})}catch(t){return console.error("❌ Error updating deposit request:",t),r.NextResponse.json({error:"Ошибка обновления заявки",details:t instanceof Error?t.message:"Unknown error"},{status:500})}}o=(d.then?(await d)():d)[0],a()}catch(t){a(t)}})},64985:(t,e,s)=>{s.a(t,async(t,a)=>{try{s.d(e,{I:()=>n,d:()=>u});var r=s(8678),o=t([r]);r=(o.then?(await o)():o)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let u=new r.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function n(t,e){let s=await u.connect();try{return await s.query(t,e)}finally{s.release()}}a()}catch(t){a(t)}})},24188:(t,e,s)=>{let{Pool:a}=s(35900),r=new a({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}});async function o(t,e){let s=await r.connect();try{return await s.query(t,e)}finally{s.release()}}async function n(){try{console.log("\uD83D\uDD04 Обновляем статистику...");let[t,e,s]=await Promise.all([o("SELECT COUNT(*) as count FROM users"),o(`
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
      `)]),a=parseInt(t.rows[0].count),r=parseFloat(e.rows[0].total_amount),n=parseFloat(s.rows[0].total_amount),i=r>0?n/r*100:0,u=await o(`
      SELECT 
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate
      FROM platform_statistics 
      ORDER BY updated_at DESC 
      LIMIT 1
    `),d=0,c=0,l=0,p=0;if(u.rows.length>0){let t=u.rows[0];d=t.users_count>0?(a-t.users_count)/t.users_count*100:0,c=t.investments_amount>0?(r-t.investments_amount)/t.investments_amount*100:0,l=t.payouts_amount>0?(n-t.payouts_amount)/t.payouts_amount*100:0,p=t.profitability_rate>0?(i-t.profitability_rate)/t.profitability_rate*100:0}let _=await o("SELECT id FROM platform_statistics ORDER BY updated_at DESC LIMIT 1");return _.rows.length>0?await o(`
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
      `,[a,Math.round(100*d)/100,Math.round(r),Math.round(100*c)/100,Math.round(n),Math.round(100*l)/100,Math.round(100*i)/100,Math.round(100*p)/100,_.rows[0].id]):await o(`
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
      `,[a,Math.round(100*d)/100,Math.round(r),Math.round(100*c)/100,Math.round(n),Math.round(100*l)/100,Math.round(100*i)/100,Math.round(100*p)/100]),console.log("✅ Статистика обновлена:",{users:a,investments:r,payouts:n,profitability:i}),{success:!0,data:{users_count:a,users_change:Math.round(100*d)/100,investments_amount:Math.round(r),investments_change:Math.round(100*c)/100,payouts_amount:Math.round(n),payouts_change:Math.round(100*l)/100,profitability_rate:Math.round(100*i)/100,profitability_change:Math.round(100*p)/100}}}catch(t){return console.error("❌ Ошибка обновления статистики:",t),{success:!1,error:t.message}}}t.exports={updateStatistics:n}}};var e=require("../../../../../webpack-runtime.js");e.C(t);var s=t=>e(e.s=t),a=e.X(0,[7787,4833,7390],()=>s(51511));module.exports=a})();