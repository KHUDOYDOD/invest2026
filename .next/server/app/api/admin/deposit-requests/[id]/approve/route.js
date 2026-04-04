"use strict";(()=>{var t={};t.id=2295,t.ids=[2295,9023],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:t=>{t.exports=require("pg")},78893:t=>{t.exports=require("buffer")},84770:t=>{t.exports=require("crypto")},76162:t=>{t.exports=require("stream")},21764:t=>{t.exports=require("util")},8678:t=>{t.exports=import("pg")},78335:(t,e,r)=>{r.a(t,async(t,s)=>{try{r.r(e),r.d(e,{originalPathname:()=>m,patchFetch:()=>d,requestAsyncStorage:()=>c,routeModule:()=>p,serverHooks:()=>_,staticGenerationAsyncStorage:()=>l});var a=r(73278),o=r(45002),n=r(54877),i=r(3343),u=t([i]);i=(u.then?(await u)():u)[0];let p=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/admin/deposit-requests/[id]/approve/route",pathname:"/api/admin/deposit-requests/[id]/approve",filename:"route",bundlePath:"app/api/admin/deposit-requests/[id]/approve/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\admin\\deposit-requests\\[id]\\approve\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:c,staticGenerationAsyncStorage:l,serverHooks:_}=p,m="/api/admin/deposit-requests/[id]/approve/route";function d(){return(0,n.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:l})}s()}catch(t){s(t)}})},3343:(t,e,r)=>{r.a(t,async(t,s)=>{try{r.r(e),r.d(e,{POST:()=>p});var a=r(71309),o=r(67390),n=r.n(o),i=r(44819),u=r(24188),d=t([i]);async function p(t,{params:e}){try{let r=t.headers.get("authorization");if(!r||!r.startsWith("Bearer "))return a.NextResponse.json({error:"Unauthorized"},{status:401});let s=r.substring(7),o=n().verify(s,process.env.JWT_SECRET||"your-secret-key"),d=await (0,i.I)("SELECT role_id FROM users WHERE id = $1",[o.userId]);if(!d.rows[0]||1!==d.rows[0].role_id)return a.NextResponse.json({error:"Access denied"},{status:403});let{admin_comment:p}=await t.json(),c=e.id;if("1"===c||"2"===c)return a.NextResponse.json({success:!0,message:"Заявка одобрена (демо-режим)"});let l=await (0,i.I)(`UPDATE deposit_requests 
       SET status = 'approved', 
           admin_comment = $1, 
           processed_at = NOW(),
           processed_by = $2
       WHERE id = $3`,[p||"Одобрено",o.userId,c]);if(0===l.rowCount)return a.NextResponse.json({error:"Заявка не найдена"},{status:404});let _=await (0,i.I)("SELECT user_id, amount FROM deposit_requests WHERE id = $1",[c]);if(_.rows[0]){await (0,i.I)("UPDATE users SET balance = balance + $1 WHERE id = $2",[_.rows[0].amount,_.rows[0].user_id]);let t=await (0,i.I)("SELECT referred_by FROM users WHERE id = $1",[_.rows[0].user_id]);if(t.rows.length>0&&t.rows[0].referred_by){let e=t.rows[0].referred_by,r=.05*parseFloat(_.rows[0].amount);console.log(`💰 Processing referral commission: ${r} for code ${e}`);let s=await (0,i.I)("SELECT id FROM users WHERE referral_code = $1",[e]);if(s.rows.length>0){let t=s.rows[0].id;await (0,i.I)("UPDATE users SET balance = balance + $1, total_earned = total_earned + $1 WHERE id = $2",[r,t]),await (0,i.I)(`INSERT INTO transactions (id, user_id, type, amount, status, description, created_at)
             VALUES (gen_random_uuid(), $1, 'referral_bonus', $2, 'completed', 'Реферальная комиссия (5% от депозита)', NOW())`,[t,r]),console.log(`✅ Referral commission ${r} credited to user ${t}`)}}}return await (0,u.updateStatistics)(),a.NextResponse.json({success:!0,message:"Заявка на пополнение одобрена"})}catch(t){return console.error("Error approving deposit request:",t),a.NextResponse.json({error:"Internal server error"},{status:500})}}i=(d.then?(await d)():d)[0],s()}catch(t){s(t)}})},24188:(t,e,r)=>{let{Pool:s}=r(35900),a=new s({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}});async function o(t,e){let r=await a.connect();try{return await r.query(t,e)}finally{r.release()}}async function n(){try{console.log("\uD83D\uDD04 Обновляем статистику...");let[t,e,r]=await Promise.all([o("SELECT COUNT(*) as count FROM users"),o(`
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
      `)]),s=parseInt(t.rows[0].count),a=parseFloat(e.rows[0].total_amount),n=parseFloat(r.rows[0].total_amount),i=a>0?n/a*100:0,u=await o(`
      SELECT 
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate
      FROM platform_statistics 
      ORDER BY updated_at DESC 
      LIMIT 1
    `),d=0,p=0,c=0,l=0;if(u.rows.length>0){let t=u.rows[0];d=t.users_count>0?(s-t.users_count)/t.users_count*100:0,p=t.investments_amount>0?(a-t.investments_amount)/t.investments_amount*100:0,c=t.payouts_amount>0?(n-t.payouts_amount)/t.payouts_amount*100:0,l=t.profitability_rate>0?(i-t.profitability_rate)/t.profitability_rate*100:0}let _=await o("SELECT id FROM platform_statistics ORDER BY updated_at DESC LIMIT 1");return _.rows.length>0?await o(`
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
      `,[s,Math.round(100*d)/100,Math.round(a),Math.round(100*p)/100,Math.round(n),Math.round(100*c)/100,Math.round(100*i)/100,Math.round(100*l)/100,_.rows[0].id]):await o(`
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
      `,[s,Math.round(100*d)/100,Math.round(a),Math.round(100*p)/100,Math.round(n),Math.round(100*c)/100,Math.round(100*i)/100,Math.round(100*l)/100]),console.log("✅ Статистика обновлена:",{users:s,investments:a,payouts:n,profitability:i}),{success:!0,data:{users_count:s,users_change:Math.round(100*d)/100,investments_amount:Math.round(a),investments_change:Math.round(100*p)/100,payouts_amount:Math.round(n),payouts_change:Math.round(100*c)/100,profitability_rate:Math.round(100*i)/100,profitability_change:Math.round(100*l)/100}}}catch(t){return console.error("❌ Ошибка обновления статистики:",t),{success:!1,error:t.message}}}t.exports={updateStatistics:n}},44819:(t,e,r)=>{r.a(t,async(t,s)=>{try{r.d(e,{I:()=>n,d:()=>u});var a=r(8678),o=t([a]);a=(o.then?(await o)():o)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let u=new a.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function n(t,e){let r=await u.connect();try{return await r.query(t,e)}finally{r.release()}}s()}catch(t){s(t)}})}};var e=require("../../../../../../webpack-runtime.js");e.C(t);var r=t=>e(e.s=t),s=e.X(0,[7787,4833,7390],()=>r(78335));module.exports=s})();