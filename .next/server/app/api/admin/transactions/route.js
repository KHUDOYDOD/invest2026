"use strict";(()=>{var e={};e.id=5009,e.ids=[5009],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},76162:e=>{e.exports=require("stream")},21764:e=>{e.exports=require("util")},8678:e=>{e.exports=import("pg")},29423:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{originalPathname:()=>h,patchFetch:()=>l,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>p});var s=a(73278),n=a(45002),i=a(54877),o=a(71639),u=e([o]);o=(u.then?(await u)():u)[0];let c=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/admin/transactions/route",pathname:"/api/admin/transactions",filename:"route",bundlePath:"app/api/admin/transactions/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\admin\\transactions\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:d,staticGenerationAsyncStorage:p,serverHooks:m}=c,h="/api/admin/transactions/route";function l(){return(0,i.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:p})}r()}catch(e){r(e)}})},71639:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{GET:()=>u,POST:()=>l});var s=a(71309),n=a(64985),i=a(16910),o=e([n,i]);[n,i]=o.then?(await o)():o;let u=(0,i.kF)(async e=>{try{let t=new URL(e.url),a=parseInt(t.searchParams.get("page")||"1"),r=parseInt(t.searchParams.get("limit")||"50"),i=t.searchParams.get("search")||"",o=t.searchParams.get("status")||"",u=t.searchParams.get("type")||"",l=t.searchParams.get("sortBy")||"created_at",c=t.searchParams.get("sortOrder")||"DESC",d=(a-1)*r,p=[],m=[],h=1;i&&(p.push(`u.full_name ILIKE $${h}`),m.push(`%${i}%`),h++),o&&(p.push(`t.status = $${h}`),m.push(o),h++),u&&(p.push(`t.type = $${h}`),m.push(u),h++);let _=p.length>0?`WHERE ${p.join(" AND ")}`:"",E=`
      SELECT 
        t.id,
        t.user_id,
        u.full_name as user_name,
        u.email as user_email,
        t.type,
        t.amount,
        t.status,
        t.description,
        t.created_at,
        t.updated_at
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ${_}
      ORDER BY t.${l} ${c}
      LIMIT $${h} OFFSET $${h+1}
    `;m.push(r,d);let R=`
      SELECT COUNT(*) as total
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ${_}
    `,y=m.slice(0,-2),[O,w]=await Promise.all([(0,n.I)(E,m),(0,n.I)(R,y)]),T=parseInt(w.rows[0].total),I=Math.ceil(T/r);return s.NextResponse.json({transactions:O.rows,pagination:{page:a,limit:r,total:T,totalPages:I}})}catch(e){return console.error("Error fetching transactions:",e),s.NextResponse.json({error:"Failed to fetch transactions"},{status:500})}}),l=(0,i.kF)(async e=>{try{let{user_id:t,type:a,amount:r,status:i="pending",description:o=""}=await e.json(),u=await (0,n.I)(`INSERT INTO transactions (user_id, type, amount, status, description) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,[t,a,r,i,o]);return"completed"===i&&("deposit"===a?await (0,n.I)("UPDATE users SET balance = balance + $1 WHERE id = $2",[r,t]):"withdrawal"===a&&await (0,n.I)("UPDATE users SET balance = balance - $1 WHERE id = $2",[r,t])),s.NextResponse.json(u.rows[0])}catch(e){return console.error("Error creating transaction:",e),s.NextResponse.json({error:"Failed to create transaction"},{status:500})}});r()}catch(e){r(e)}})},16910:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.d(t,{kF:()=>l});var s=a(67390),n=a.n(s),i=a(64985),o=e([i]);async function u(e){try{let t=e.cookies.get("auth-token")?.value;if(!t)return null;let a=n().verify(t,process.env.NEXTAUTH_SECRET||"fallback-secret");if(!a.userId)return null;let r=await (0,i.I)(`SELECT u.id, u.email, u.full_name, u.balance, u.total_invested, 
              u.total_earned, u.is_active, ur.name as role_name
       FROM users u
       LEFT JOIN user_roles ur ON u.role_id = ur.id
       WHERE u.id = $1 AND u.is_active = true`,[a.userId]);if(0===r.rows.length)return null;let s=r.rows[0];return{id:s.id,email:s.email,full_name:s.full_name,balance:s.balance,total_invested:s.total_invested,total_earned:s.total_earned,role:s.role_name,isAdmin:"admin"===s.role_name||"super_admin"===s.role_name}}catch(e){return console.error("Session error:",e),null}}function l(e){return async t=>{let a=await u(t);return a&&a.isAdmin?e(t,a):new Response(JSON.stringify({error:"Admin access required"}),{status:403,headers:{"Content-Type":"application/json"}})}}i=(o.then?(await o)():o)[0],r()}catch(e){r(e)}})},64985:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.d(t,{I:()=>i,d:()=>u});var s=a(8678),n=e([s]);s=(n.then?(await n)():n)[0];let o=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!o)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let u=new s.Pool({connectionString:o,ssl:!!o?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function i(e,t){let a=await u.connect();try{return await a.query(e,t)}finally{a.release()}}r()}catch(e){r(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[7787,4833,7390],()=>a(29423));module.exports=r})();