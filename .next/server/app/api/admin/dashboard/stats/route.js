"use strict";(()=>{var t={};t.id=9358,t.ids=[9358],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:t=>{t.exports=import("pg")},13702:(t,e,a)=>{a.a(t,async(t,s)=>{try{a.r(e),a.d(e,{originalPathname:()=>R,patchFetch:()=>l,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>c,staticGenerationAsyncStorage:()=>E});var r=a(73278),n=a(45002),o=a(54877),i=a(9999),d=t([i]);i=(d.then?(await d)():d)[0];let p=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/admin/dashboard/stats/route",pathname:"/api/admin/dashboard/stats",filename:"route",bundlePath:"app/api/admin/dashboard/stats/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\admin\\dashboard\\stats\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:u,staticGenerationAsyncStorage:E,serverHooks:c}=p,R="/api/admin/dashboard/stats/route";function l(){return(0,o.patchFetch)({serverHooks:c,staticGenerationAsyncStorage:E})}s()}catch(t){s(t)}})},9999:(t,e,a)=>{a.a(t,async(t,s)=>{try{a.r(e),a.d(e,{GET:()=>i});var r=a(71309),n=a(44819),o=t([n]);async function i(t){try{let t=await (0,n.I)(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE status = 'active') as active_users
      FROM users
    `),e=await (0,n.I)(`
      SELECT 
        COALESCE(SUM(balance), 0) as total_balance,
        COALESCE(SUM(total_invested), 0) as total_invested,
        COALESCE(SUM(total_earned), 0) as total_earned
      FROM users
    `),a=await (0,n.I)(`
      SELECT COUNT(*) as total_investments
      FROM investments
      WHERE status = 'active'
    `),s=await (0,n.I)(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending_deposits,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_withdrawals
      FROM (
        SELECT status FROM deposit_requests
        UNION ALL
        SELECT status FROM withdrawal_requests
      ) as all_requests
    `),o=await (0,n.I)(`
      SELECT 
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as current_month,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '60 days' AND created_at < NOW() - INTERVAL '30 days') as previous_month
      FROM users
    `),i=t.rows[0],d=e.rows[0],l=a.rows[0],p=s.rows[0],u=o.rows[0],E=parseInt(u.current_month)||0,c=parseInt(u.previous_month)||1,R=c>0?((E-c)/c*100).toFixed(1):"0",_=parseFloat(R);return r.NextResponse.json({totalUsers:parseInt(i.total_users)||0,activeUsers:parseInt(i.active_users)||0,totalRevenue:parseFloat(d.total_balance)+parseFloat(d.total_invested),totalInvested:parseFloat(d.total_invested),totalEarned:parseFloat(d.total_earned),totalInvestments:parseInt(l.total_investments)||0,pendingRequests:(parseInt(p.pending_deposits)||0)+(parseInt(p.pending_withdrawals)||0),monthlyGrowth:_})}catch(t){return console.error("Admin dashboard stats error:",t),r.NextResponse.json({error:"Failed to load dashboard stats",totalUsers:0,activeUsers:0,totalRevenue:0,monthlyGrowth:0,totalInvestments:0,pendingRequests:0},{status:500})}}n=(o.then?(await o)():o)[0],s()}catch(t){s(t)}})},44819:(t,e,a)=>{a.a(t,async(t,s)=>{try{a.d(e,{I:()=>o});var r=a(8678),n=t([r]);r=(n.then?(await n)():n)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let d=new r.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function o(t,e){let a=await d.connect();try{return await a.query(t,e)}finally{a.release()}}s()}catch(t){s(t)}})}};var e=require("../../../../../webpack-runtime.js");e.C(t);var a=t=>e(e.s=t),s=e.X(0,[7787,4833],()=>a(13702));module.exports=s})();