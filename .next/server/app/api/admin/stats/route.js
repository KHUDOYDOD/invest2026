"use strict";(()=>{var t={};t.id=6553,t.ids=[6553],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:t=>{t.exports=import("pg")},68718:(t,a,e)=>{e.a(t,async(t,s)=>{try{e.r(a),e.d(a,{originalPathname:()=>E,patchFetch:()=>p,requestAsyncStorage:()=>d,routeModule:()=>u,serverHooks:()=>m,staticGenerationAsyncStorage:()=>c});var o=e(73278),r=e(45002),n=e(54877),i=e(85476),l=t([i]);i=(l.then?(await l)():l)[0];let u=new o.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/admin/stats/route",pathname:"/api/admin/stats",filename:"route",bundlePath:"app/api/admin/stats/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\admin\\stats\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:d,staticGenerationAsyncStorage:c,serverHooks:m}=u,E="/api/admin/stats/route";function p(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:c})}s()}catch(t){s(t)}})},85476:(t,a,e)=>{e.a(t,async(t,s)=>{try{e.r(a),e.d(a,{GET:()=>i});var o=e(71309),r=e(64985),n=t([r]);async function i(){try{console.log("Loading admin stats from database...");let t=await (0,r.I)(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_month
      FROM users
    `),a=await (0,r.I)(`
      SELECT 
        COUNT(*) as total_transactions,
        COALESCE(SUM(amount) FILTER (WHERE type = 'deposit' AND status = 'completed'), 0) as total_deposits,
        COALESCE(SUM(amount) FILTER (WHERE type = 'withdrawal' AND status = 'completed'), 0) as total_withdrawals,
        COALESCE(SUM(amount) FILTER (WHERE type = 'profit' AND status = 'completed'), 0) as total_profits
      FROM transactions
    `),e=await (0,r.I)(`
      SELECT 
        COUNT(*) as total_investments,
        COALESCE(SUM(amount), 0) as total_invested_amount,
        COUNT(*) FILTER (WHERE status = 'active') as active_investments
      FROM investments
    `),s={users:{total:parseInt(t.rows[0].total_users)||0,newThisMonth:parseInt(t.rows[0].new_users_month)||0,growth:0},transactions:{total:parseInt(a.rows[0].total_transactions)||0,totalDeposits:parseFloat(a.rows[0].total_deposits)||0,totalWithdrawals:parseFloat(a.rows[0].total_withdrawals)||0,totalProfits:parseFloat(a.rows[0].total_profits)||0},investments:{total:parseInt(e.rows[0].total_investments)||0,totalAmount:parseFloat(e.rows[0].total_invested_amount)||0,active:parseInt(e.rows[0].active_investments)||0}};return console.log(`✅ Admin stats loaded from database`),o.NextResponse.json(s)}catch(t){return console.error("Admin stats API error:",t),o.NextResponse.json({error:"Ошибка загрузки статистики"},{status:500})}}r=(n.then?(await n)():n)[0],s()}catch(t){s(t)}})},64985:(t,a,e)=>{e.a(t,async(t,s)=>{try{e.d(a,{I:()=>n,d:()=>l});var o=e(8678),r=t([o]);o=(r.then?(await r)():r)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let l=new o.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function n(t,a){let e=await l.connect();try{return await e.query(t,a)}finally{e.release()}}s()}catch(t){s(t)}})}};var a=require("../../../../webpack-runtime.js");a.C(t);var e=t=>a(a.s=t),s=a.X(0,[7787,4833],()=>e(68718));module.exports=s})();