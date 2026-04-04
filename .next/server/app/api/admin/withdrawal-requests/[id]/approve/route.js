"use strict";(()=>{var t={};t.id=228,t.ids=[228,9023],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:t=>{t.exports=require("pg")},78893:t=>{t.exports=require("buffer")},84770:t=>{t.exports=require("crypto")},76162:t=>{t.exports=require("stream")},21764:t=>{t.exports=require("util")},8678:t=>{t.exports=import("pg")},444:(t,e,a)=>{a.a(t,async(t,r)=>{try{a.r(e),a.d(e,{originalPathname:()=>h,patchFetch:()=>p,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>_,staticGenerationAsyncStorage:()=>l});var s=a(73278),o=a(45002),n=a(54877),i=a(75688),u=t([i]);i=(u.then?(await u)():u)[0];let c=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/admin/withdrawal-requests/[id]/approve/route",pathname:"/api/admin/withdrawal-requests/[id]/approve",filename:"route",bundlePath:"app/api/admin/withdrawal-requests/[id]/approve/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\admin\\withdrawal-requests\\[id]\\approve\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:d,staticGenerationAsyncStorage:l,serverHooks:_}=c,h="/api/admin/withdrawal-requests/[id]/approve/route";function p(){return(0,n.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:l})}r()}catch(t){r(t)}})},75688:(t,e,a)=>{a.a(t,async(t,r)=>{try{a.r(e),a.d(e,{POST:()=>c});var s=a(71309),o=a(67390),n=a.n(o),i=a(44819),u=a(24188),p=t([i]);async function c(t,{params:e}){try{let a=t.headers.get("authorization");if(!a||!a.startsWith("Bearer "))return s.NextResponse.json({error:"Unauthorized"},{status:401});let r=a.substring(7),o=n().verify(r,process.env.JWT_SECRET||"your-secret-key"),p=await (0,i.I)("SELECT role_id FROM users WHERE id = $1",[o.userId]);if(!p.rows[0]||1!==p.rows[0].role_id)return s.NextResponse.json({error:"Access denied"},{status:403});let{admin_comment:c}=await t.json(),d=e.id;if("3"===d||"4"===d)return s.NextResponse.json({success:!0,message:"Заявка одобрена (демо-режим)"});let l=await (0,i.I)("SELECT user_id, amount FROM withdrawal_requests WHERE id = $1",[d]);if(!l.rows[0])return s.NextResponse.json({error:"Заявка не найдена"},{status:404});let{user_id:_,amount:h}=l.rows[0],m=await (0,i.I)("SELECT balance FROM users WHERE id = $1",[_]);if(!m.rows[0]||parseFloat(m.rows[0].balance)<parseFloat(h))return s.NextResponse.json({error:"Недостаточно средств на балансе пользователя"},{status:400});let E=await (0,i.I)(`UPDATE withdrawal_requests 
       SET status = 'approved', 
           admin_comment = $1, 
           processed_at = NOW(),
           processed_by = $2
       WHERE id = $3`,[c||"Одобрено",o.userId,d]);if(0===E.rowCount)return s.NextResponse.json({error:"Заявка не найдена"},{status:404});return await (0,i.I)("UPDATE users SET balance = balance - $1 WHERE id = $2",[h,_]),await (0,u.updateStatistics)(),s.NextResponse.json({success:!0,message:"Заявка на вывод одобрена"})}catch(t){return console.error("Error approving withdrawal request:",t),s.NextResponse.json({error:"Internal server error"},{status:500})}}i=(p.then?(await p)():p)[0],r()}catch(t){r(t)}})},24188:(t,e,a)=>{let{Pool:r}=a(35900),s=new r({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}});async function o(t,e){let a=await s.connect();try{return await a.query(t,e)}finally{a.release()}}async function n(){try{console.log("\uD83D\uDD04 Обновляем статистику...");let[t,e,a]=await Promise.all([o("SELECT COUNT(*) as count FROM users"),o(`
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
      `)]),r=parseInt(t.rows[0].count),s=parseFloat(e.rows[0].total_amount),n=parseFloat(a.rows[0].total_amount),i=s>0?n/s*100:0,u=await o(`
      SELECT 
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate
      FROM platform_statistics 
      ORDER BY updated_at DESC 
      LIMIT 1
    `),p=0,c=0,d=0,l=0;if(u.rows.length>0){let t=u.rows[0];p=t.users_count>0?(r-t.users_count)/t.users_count*100:0,c=t.investments_amount>0?(s-t.investments_amount)/t.investments_amount*100:0,d=t.payouts_amount>0?(n-t.payouts_amount)/t.payouts_amount*100:0,l=t.profitability_rate>0?(i-t.profitability_rate)/t.profitability_rate*100:0}let _=await o("SELECT id FROM platform_statistics ORDER BY updated_at DESC LIMIT 1");return _.rows.length>0?await o(`
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
      `,[r,Math.round(100*p)/100,Math.round(s),Math.round(100*c)/100,Math.round(n),Math.round(100*d)/100,Math.round(100*i)/100,Math.round(100*l)/100,_.rows[0].id]):await o(`
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
      `,[r,Math.round(100*p)/100,Math.round(s),Math.round(100*c)/100,Math.round(n),Math.round(100*d)/100,Math.round(100*i)/100,Math.round(100*l)/100]),console.log("✅ Статистика обновлена:",{users:r,investments:s,payouts:n,profitability:i}),{success:!0,data:{users_count:r,users_change:Math.round(100*p)/100,investments_amount:Math.round(s),investments_change:Math.round(100*c)/100,payouts_amount:Math.round(n),payouts_change:Math.round(100*d)/100,profitability_rate:Math.round(100*i)/100,profitability_change:Math.round(100*l)/100}}}catch(t){return console.error("❌ Ошибка обновления статистики:",t),{success:!1,error:t.message}}}t.exports={updateStatistics:n}},44819:(t,e,a)=>{a.a(t,async(t,r)=>{try{a.d(e,{I:()=>n,d:()=>u});var s=a(8678),o=t([s]);s=(o.then?(await o)():o)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let u=new s.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function n(t,e){let a=await u.connect();try{return await a.query(t,e)}finally{a.release()}}r()}catch(t){r(t)}})}};var e=require("../../../../../../webpack-runtime.js");e.C(t);var a=t=>e(e.s=t),r=e.X(0,[7787,4833,7390],()=>a(444));module.exports=r})();