"use strict";(()=>{var e={};e.id=2345,e.ids=[2345],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},66505:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{originalPathname:()=>p,patchFetch:()=>d,requestAsyncStorage:()=>w,routeModule:()=>l,serverHooks:()=>m,staticGenerationAsyncStorage:()=>c});var s=r(73278),o=r(45002),n=r(54877),i=r(10454),u=e([i]);i=(u.then?(await u)():u)[0];let l=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/withdrawal-requests/route",pathname:"/api/withdrawal-requests",filename:"route",bundlePath:"app/api/withdrawal-requests/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\withdrawal-requests\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:w,staticGenerationAsyncStorage:c,serverHooks:m}=l,p="/api/withdrawal-requests/route";function d(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:c})}a()}catch(e){a(e)}})},10454:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{GET:()=>i,POST:()=>u});var s=r(71309),o=r(64985),n=e([o]);async function i(){try{console.log("\uD83D\uDD04 Loading withdrawal requests...");let e=(await (0,o.I)(`
      SELECT 
        wr.id,
        wr.user_id,
        wr.amount,
        wr.method,
        wr.wallet_address,
        wr.fee,
        wr.final_amount,
        wr.status,
        wr.admin_comment,
        wr.created_at,
        wr.processed_at,
        u.full_name,
        u.email
      FROM withdrawal_requests wr
      LEFT JOIN users u ON wr.user_id = u.id
      ORDER BY wr.created_at DESC
    `)).rows.map(e=>({id:e.id,user_id:e.user_id,amount:parseFloat(e.amount),method:e.method,wallet_address:e.wallet_address,fee:parseFloat(e.fee||0),final_amount:parseFloat(e.final_amount),status:e.status,admin_comment:e.admin_comment,created_at:e.created_at,processed_at:e.processed_at,users:{id:e.user_id,full_name:e.full_name||"Пользователь",email:e.email||"email@example.com"}}));return console.log("✅ Withdrawal requests loaded:",e.length),s.NextResponse.json(e)}catch(e){return console.error("❌ Error loading withdrawal requests:",e),s.NextResponse.json({error:"Ошибка загрузки заявок"},{status:500})}}async function u(e){try{let t=await e.json();console.log("\uD83D\uDD04 Creating new withdrawal request:",t);let r=(await (0,o.I)(`
      INSERT INTO withdrawal_requests (user_id, amount, method, wallet_address, fee, final_amount, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING id
    `,[t.userId||"1",t.amount,t.method,t.walletAddress||t.cardNumber||t.phoneNumber,t.fee||0,t.finalAmount||t.amount])).rows[0].id;return console.log("✅ New withdrawal request created:",r),s.NextResponse.json({success:!0,id:r})}catch(e){return console.error("❌ Error creating withdrawal request:",e),s.NextResponse.json({error:"Ошибка создания заявки"},{status:500})}}o=(n.then?(await n)():n)[0],a()}catch(e){a(e)}})},64985:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.d(t,{I:()=>n,d:()=>u});var s=r(8678),o=e([s]);s=(o.then?(await o)():o)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let u=new s.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function n(e,t){let r=await u.connect();try{return await r.query(e,t)}finally{r.release()}}a()}catch(e){a(e)}})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[7787,4833],()=>r(66505));module.exports=a})();