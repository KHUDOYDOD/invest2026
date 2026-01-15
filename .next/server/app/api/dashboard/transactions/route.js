"use strict";(()=>{var e={};e.id=432,e.ids=[432],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},76162:e=>{e.exports=require("stream")},21764:e=>{e.exports=require("util")},8678:e=>{e.exports=import("pg")},91955:(e,t,s)=>{s.a(e,async(e,a)=>{try{s.r(t),s.d(t,{originalPathname:()=>m,patchFetch:()=>u,requestAsyncStorage:()=>p,routeModule:()=>c,serverHooks:()=>l,staticGenerationAsyncStorage:()=>E});var r=s(73278),o=s(45002),n=s(54877),i=s(30563),d=e([i]);i=(d.then?(await d)():d)[0];let c=new r.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/dashboard/transactions/route",pathname:"/api/dashboard/transactions",filename:"route",bundlePath:"app/api/dashboard/transactions/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\dashboard\\transactions\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:p,staticGenerationAsyncStorage:E,serverHooks:l}=c,m="/api/dashboard/transactions/route";function u(){return(0,n.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:E})}a()}catch(e){a(e)}})},30563:(e,t,s)=>{s.a(e,async(e,a)=>{try{s.r(t),s.d(t,{GET:()=>u});var r=s(71309),o=s(64985),n=s(67390),i=s.n(n),d=e([o]);async function u(e){try{let t;let s=e.headers.get("authorization"),a=null;if(s&&s.startsWith("Bearer ")&&(a=s.substring(7)),!a)return r.NextResponse.json({error:"Токен не предоставлен"},{status:401});try{t=i().verify(a,process.env.NEXTAUTH_SECRET||"fallback-secret")}catch(e){return r.NextResponse.json({error:"Недействительный токен"},{status:401})}console.log("Fetching transactions for user:",t.userId);let n=await (0,o.I)(`SELECT 
        id,
        type,
        amount,
        status,
        created_at,
        description,
        payment_method as method
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50`,[t.userId]),d=await (0,o.I)(`SELECT 
        id,
        'deposit_request' as type,
        amount,
        status,
        created_at,
        CASE 
          WHEN status = 'pending' THEN 'На проверке'
          WHEN status = 'approved' THEN 'Одобрено'
          WHEN status = 'rejected' THEN CONCAT('Отклонено: ', COALESCE(admin_comment, 'Не указана причина'))
        END as description,
        method as payment_method
      FROM deposit_requests
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20`,[t.userId]),u=await (0,o.I)(`SELECT 
        id,
        'withdrawal_request' as type,
        amount,
        status,
        created_at,
        CASE 
          WHEN status = 'pending' THEN 'На проверке'
          WHEN status = 'completed' THEN 'Выполнено'
          WHEN status = 'rejected' THEN CONCAT('Отклонено: ', COALESCE(admin_comment, 'Не указана причина'))
        END as description,
        method as payment_method
      FROM withdrawal_requests
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20`,[t.userId]),c=[...n.rows,...d.rows.map(e=>({...e,type:"deposit",status:"approved"===e.status?"completed":e.status})),...u.rows.map(e=>({...e,type:"withdrawal",status:"completed"===e.status?"completed":e.status}))];c.sort((e,t)=>new Date(t.created_at).getTime()-new Date(e.created_at).getTime());let p=c.slice(0,50);return console.log(`Found ${p.length} total transactions for user ${t.userId}`),r.NextResponse.json({success:!0,transactions:p})}catch(e){return console.error("Error fetching transactions:",e),r.NextResponse.json({error:"Ошибка получения транзакций",details:e?.message||"Unknown error"},{status:500})}}o=(d.then?(await d)():d)[0],a()}catch(e){a(e)}})},64985:(e,t,s)=>{s.a(e,async(e,a)=>{try{s.d(t,{I:()=>n,d:()=>d});var r=s(8678),o=e([r]);r=(o.then?(await o)():o)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let d=new r.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function n(e,t){let s=await d.connect();try{return await s.query(e,t)}finally{s.release()}}a()}catch(e){a(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),a=t.X(0,[7787,4833,7390],()=>s(91955));module.exports=a})();