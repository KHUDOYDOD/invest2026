"use strict";(()=>{var e={};e.id=5837,e.ids=[5837],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},76162:e=>{e.exports=require("stream")},21764:e=>{e.exports=require("util")},8678:e=>{e.exports=import("pg")},44660:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{originalPathname:()=>h,patchFetch:()=>p,requestAsyncStorage:()=>c,routeModule:()=>d,serverHooks:()=>m,staticGenerationAsyncStorage:()=>l});var a=r(73278),n=r(45002),i=r(54877),o=r(13338),u=e([o]);o=(u.then?(await u)():u)[0];let d=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/dashboard/investments/route",pathname:"/api/dashboard/investments",filename:"route",bundlePath:"app/api/dashboard/investments/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\dashboard\\investments\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:c,staticGenerationAsyncStorage:l,serverHooks:m}=d,h="/api/dashboard/investments/route";function p(){return(0,i.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:l})}s()}catch(e){s(e)}})},13338:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{GET:()=>p});var a=r(71309),n=r(64985),i=r(67390),o=r.n(i),u=e([n]);async function p(e){try{let t;let r=e.headers.get("authorization"),s=null;if(r&&r.startsWith("Bearer ")&&(s=r.substring(7)),!s)return a.NextResponse.json({error:"Токен не предоставлен"},{status:401});try{t=o().verify(s,process.env.NEXTAUTH_SECRET||"fallback-secret")}catch(e){return a.NextResponse.json({error:"Недействительный токен"},{status:401})}let i=await (0,n.I)(`SELECT 
        i.id,
        i.amount,
        i.status,
        i.start_date,
        i.end_date,
        i.total_profit as profit_earned,
        ip.name as plan_name,
        ip.min_amount,
        ip.max_amount,
        ip.daily_profit_rate,
        ip.duration_days,
        i.created_at
      FROM investments i
      JOIN investment_plans ip ON i.plan_id = ip.id
      WHERE i.user_id = $1
      ORDER BY i.created_at DESC`,[t.userId]);return a.NextResponse.json({success:!0,investments:i.rows})}catch(e){return console.error("Dashboard investments API error:",e),a.NextResponse.json({error:"Ошибка сервера"},{status:500})}}n=(u.then?(await u)():u)[0],s()}catch(e){s(e)}})},64985:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.d(t,{I:()=>i,d:()=>u});var a=r(8678),n=e([a]);a=(n.then?(await n)():n)[0];let o=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!o)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let u=new a.Pool({connectionString:o,ssl:!!o?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function i(e,t){let r=await u.connect();try{return await r.query(e,t)}finally{r.release()}}s()}catch(e){s(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[7787,4833,7390],()=>r(44660));module.exports=s})();