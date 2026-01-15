"use strict";(()=>{var e={};e.id=8866,e.ids=[8866],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},75386:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{originalPathname:()=>E,patchFetch:()=>u,requestAsyncStorage:()=>d,routeModule:()=>p,serverHooks:()=>m,staticGenerationAsyncStorage:()=>l});var a=r(73278),n=r(45002),o=r(54877),i=r(51619),c=e([i]);i=(c.then?(await c)():c)[0];let p=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/transactions/route",pathname:"/api/transactions",filename:"route",bundlePath:"app/api/transactions/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\transactions\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:d,staticGenerationAsyncStorage:l,serverHooks:m}=p,E="/api/transactions/route";function u(){return(0,o.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:l})}s()}catch(e){s(e)}})},51619:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{GET:()=>i});var a=r(71309),n=r(64985),o=e([n]);async function i(e){try{let{searchParams:t}=new URL(e.url),r=t.get("userId"),s=parseInt(t.get("limit")||"10");if(!r)return a.NextResponse.json({error:"userId is required"},{status:400});console.log("Fetching transactions for user:",r,"limit:",s);let o=await (0,n.I)(`SELECT 
        t.id,
        t.type,
        t.amount,
        t.status,
        t.created_at,
        t.description,
        t.payment_method,
        CASE 
          WHEN t.type = 'investment' THEN ip.name
          ELSE NULL
        END as plan_name
      FROM transactions t
      LEFT JOIN investments i ON t.user_id = i.user_id AND t.type = 'investment' AND t.created_at = i.created_at
      LEFT JOIN investment_plans ip ON i.plan_id = ip.id
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC
      LIMIT $2`,[r,s]);return console.log(`Found ${o.rows.length} transactions for user ${r}`),a.NextResponse.json({success:!0,transactions:o.rows})}catch(e){return console.error("Transactions API error:",e),a.NextResponse.json({error:"Ошибка загрузки транзакций",details:e.message},{status:500})}}n=(o.then?(await o)():o)[0],s()}catch(e){s(e)}})},64985:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.d(t,{I:()=>o,d:()=>c});var a=r(8678),n=e([a]);a=(n.then?(await n)():n)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let c=new a.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function o(e,t){let r=await c.connect();try{return await r.query(e,t)}finally{r.release()}}s()}catch(e){s(e)}})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[7787,4833],()=>r(75386));module.exports=s})();