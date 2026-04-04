"use strict";(()=>{var t={};t.id=6081,t.ids=[6081,9023],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:t=>{t.exports=require("pg")},78893:t=>{t.exports=require("buffer")},84770:t=>{t.exports=require("crypto")},76162:t=>{t.exports=require("stream")},21764:t=>{t.exports=require("util")},8678:t=>{t.exports=import("pg")},82916:(t,e,a)=>{a.a(t,async(t,r)=>{try{a.r(e),a.d(e,{originalPathname:()=>m,patchFetch:()=>d,requestAsyncStorage:()=>c,routeModule:()=>l,serverHooks:()=>_,staticGenerationAsyncStorage:()=>p});var s=a(73278),n=a(45002),o=a(54877),i=a(95080),u=t([i]);i=(u.then?(await u)():u)[0];let l=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/admin/withdrawal-requests/[id]/route",pathname:"/api/admin/withdrawal-requests/[id]",filename:"route",bundlePath:"app/api/admin/withdrawal-requests/[id]/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\admin\\withdrawal-requests\\[id]\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:c,staticGenerationAsyncStorage:p,serverHooks:_}=l,m="/api/admin/withdrawal-requests/[id]/route";function d(){return(0,o.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:p})}r()}catch(t){r(t)}})},95080:(t,e,a)=>{a.a(t,async(t,r)=>{try{a.r(e),a.d(e,{PATCH:()=>l});var s=a(71309),n=a(64985),o=a(67390),i=a.n(o),u=a(24188),d=t([n]);async function l(t,{params:e}){try{console.log("=== ADMIN UPDATE WITHDRAWAL REQUEST ===");let a=function(t){let e=t.headers.get("authorization");if(!e||!e.startsWith("Bearer "))return null;let a=e.substring(7);try{let t=process.env.NEXTAUTH_SECRET||process.env.JWT_SECRET||"fallback_secret",e=i().verify(a,t);if("admin"!==e.role&&"super_admin"!==e.role)return null;return e}catch(t){return console.error("Admin token verification error:",t),null}}(t);if(!a)return s.NextResponse.json({error:"Доступ запрещен"},{status:403});let{status:r,admin_comment:o}=await t.json(),d=e.id;if(console.log("Request details:",{requestId:d,status:r,admin_comment:o,adminUserId:a.userId}),!d||!r)return s.NextResponse.json({error:"Не указаны обязательные поля"},{status:400});let l=["pending","approved","rejected"];if(!l.includes(r))return console.error("Invalid status:",r,"Allowed:",l),s.NextResponse.json({error:`Недопустимый статус: ${r}. Разрешены: ${l.join(", ")}`},{status:400});console.log("Updating withdrawal request:",d,"Status:",r);let c=await (0,n.I)("SELECT user_id, amount, final_amount FROM withdrawal_requests WHERE id = $1",[d]);if(0===c.rows.length)return s.NextResponse.json({error:"Заявка не найдена"},{status:404});let{user_id:p,amount:_,final_amount:m}=c.rows[0];await (0,n.I)("BEGIN");try{await (0,n.I)(`UPDATE withdrawal_requests 
         SET status = $1, admin_comment = $2, processed_at = NOW(), processed_by = $3
         WHERE id = $4`,[r,o||null,a.userId,d]),"rejected"===r?(await (0,n.I)("UPDATE users SET balance = balance + $1 WHERE id = $2",[_,p]),await (0,n.I)(`INSERT INTO transactions (id, user_id, type, amount, status, description, created_at)
           VALUES (gen_random_uuid(), $1, 'refund', $2, 'completed', 'Возврат средств (заявка на вывод отклонена)', NOW())`,[p,_]),console.log("✅ Withdrawal rejected and funds returned to balance")):"approved"===r&&(await (0,n.I)(`INSERT INTO transactions (id, user_id, type, amount, status, description, created_at)
           VALUES (gen_random_uuid(), $1, 'withdrawal', $2, 'completed', 'Вывод средств (одобрено администратором)', NOW())`,[p,m||_]),console.log("✅ Withdrawal approved")),await (0,n.I)("COMMIT"),await (0,u.updateStatistics)()}catch(t){throw await (0,n.I)("ROLLBACK"),t}return console.log("✅ Withdrawal request updated successfully"),s.NextResponse.json({success:!0,message:"Заявка обновлена успешно"})}catch(t){return console.error("❌ Error updating withdrawal request:",t),s.NextResponse.json({error:"Ошибка обновления заявки",details:t instanceof Error?t.message:"Unknown error"},{status:500})}}n=(d.then?(await d)():d)[0],r()}catch(t){r(t)}})},64985:(t,e,a)=>{a.a(t,async(t,r)=>{try{a.d(e,{I:()=>o,d:()=>u});var s=a(8678),n=t([s]);s=(n.then?(await n)():n)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let u=new s.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function o(t,e){let a=await u.connect();try{return await a.query(t,e)}finally{a.release()}}r()}catch(t){r(t)}})},24188:(t,e,a)=>{let{Pool:r}=a(35900),s=new r({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}});async function n(t,e){let a=await s.connect();try{return await a.query(t,e)}finally{a.release()}}async function o(){try{console.log("\uD83D\uDD04 Обновляем статистику...");let[t,e,a]=await Promise.all([n("SELECT COUNT(*) as count FROM users"),n(`
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
      `)]),r=parseInt(t.rows[0].count),s=parseFloat(e.rows[0].total_amount),o=parseFloat(a.rows[0].total_amount),i=s>0?o/s*100:0,u=await n(`
      SELECT 
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate
      FROM platform_statistics 
      ORDER BY updated_at DESC 
      LIMIT 1
    `),d=0,l=0,c=0,p=0;if(u.rows.length>0){let t=u.rows[0];d=t.users_count>0?(r-t.users_count)/t.users_count*100:0,l=t.investments_amount>0?(s-t.investments_amount)/t.investments_amount*100:0,c=t.payouts_amount>0?(o-t.payouts_amount)/t.payouts_amount*100:0,p=t.profitability_rate>0?(i-t.profitability_rate)/t.profitability_rate*100:0}let _=await n("SELECT id FROM platform_statistics ORDER BY updated_at DESC LIMIT 1");return _.rows.length>0?await n(`
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
      `,[r,Math.round(100*d)/100,Math.round(s),Math.round(100*l)/100,Math.round(o),Math.round(100*c)/100,Math.round(100*i)/100,Math.round(100*p)/100,_.rows[0].id]):await n(`
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
      `,[r,Math.round(100*d)/100,Math.round(s),Math.round(100*l)/100,Math.round(o),Math.round(100*c)/100,Math.round(100*i)/100,Math.round(100*p)/100]),console.log("✅ Статистика обновлена:",{users:r,investments:s,payouts:o,profitability:i}),{success:!0,data:{users_count:r,users_change:Math.round(100*d)/100,investments_amount:Math.round(s),investments_change:Math.round(100*l)/100,payouts_amount:Math.round(o),payouts_change:Math.round(100*c)/100,profitability_rate:Math.round(100*i)/100,profitability_change:Math.round(100*p)/100}}}catch(t){return console.error("❌ Ошибка обновления статистики:",t),{success:!1,error:t.message}}}t.exports={updateStatistics:o}}};var e=require("../../../../../webpack-runtime.js");e.C(t);var a=t=>e(e.s=t),r=e.X(0,[7787,4833,7390],()=>a(82916));module.exports=r})();