"use strict";(()=>{var t={};t.id=5382,t.ids=[5382],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:t=>{t.exports=import("pg")},8677:(t,e,a)=>{a.a(t,async(t,r)=>{try{a.r(e),a.d(e,{originalPathname:()=>v,patchFetch:()=>u,requestAsyncStorage:()=>c,routeModule:()=>p,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d});var o=a(73278),s=a(45002),n=a(54877),i=a(72502),l=t([i]);i=(l.then?(await l)():l)[0];let p=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/testimonials/route",pathname:"/api/testimonials",filename:"route",bundlePath:"app/api/testimonials/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\testimonials\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:c,staticGenerationAsyncStorage:d,serverHooks:m}=p,v="/api/testimonials/route";function u(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}r()}catch(t){r(t)}})},72502:(t,e,a)=>{a.a(t,async(t,r)=>{try{a.r(e),a.d(e,{GET:()=>i});var o=a(71309),s=a(64985),n=t([s]);async function i(t){try{let{searchParams:e}=new URL(t.url),a=parseInt(e.get("limit")||"5"),r=parseInt(e.get("page")||"1"),n=(r-1)*a;console.log(`Loading testimonials: limit=${a}, page=${r}`);let i=await (0,s.I)(`
      SELECT 
        t.id,
        t.rating,
        t.title,
        t.content,
        t.created_at,
        t.approved_at,
        u.full_name,
        u.email,
        u.avatar_url,
        u.country,
        u.city
      FROM testimonials t
      JOIN users u ON t.user_id = u.id
      WHERE t.status = 'approved'
      ORDER BY t.approved_at DESC
      LIMIT $1 OFFSET $2
    `,[a,n]),l=await (0,s.I)(`
      SELECT COUNT(*) as total
      FROM testimonials 
      WHERE status = 'approved'
    `),u=i.rows.map(t=>({id:t.id,rating:t.rating,title:t.title,content:t.content,user:{name:t.full_name||"Анонимный пользователь",email:t.email,avatar:t.avatar_url||"/placeholder-avatar.png",location:t.city&&t.country?`${t.city}, ${t.country}`:t.country||"Не указано"},createdAt:t.created_at,approvedAt:t.approved_at})),p=parseInt(l.rows[0].total),c=Math.ceil(p/a);return console.log(`✅ Loaded ${u.length} testimonials (${p} total)`),o.NextResponse.json({success:!0,testimonials:u,pagination:{page:r,limit:a,total:p,totalPages:c,hasMore:r<c}})}catch(t){return console.error("Error loading testimonials:",t),o.NextResponse.json({success:!1,error:"Failed to load testimonials"},{status:500})}}s=(n.then?(await n)():n)[0],r()}catch(t){r(t)}})},64985:(t,e,a)=>{a.a(t,async(t,r)=>{try{a.d(e,{I:()=>n,d:()=>l});var o=a(8678),s=t([o]);o=(s.then?(await s)():s)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let l=new o.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function n(t,e){let a=await l.connect();try{return await a.query(t,e)}finally{a.release()}}r()}catch(t){r(t)}})}};var e=require("../../../webpack-runtime.js");e.C(t);var a=t=>e(e.s=t),r=e.X(0,[7787,4833],()=>a(8677));module.exports=r})();