"use strict";(()=>{var t={};t.id=4540,t.ids=[4540],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:t=>{t.exports=require("buffer")},84770:t=>{t.exports=require("crypto")},76162:t=>{t.exports=require("stream")},21764:t=>{t.exports=require("util")},8678:t=>{t.exports=import("pg")},53610:(t,e,a)=>{a.a(t,async(t,r)=>{try{a.r(e),a.d(e,{originalPathname:()=>_,patchFetch:()=>p,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d});var s=a(73278),n=a(45002),o=a(54877),i=a(675),u=t([i]);i=(u.then?(await u)():u)[0];let c=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/admin/testimonials/route",pathname:"/api/admin/testimonials",filename:"route",bundlePath:"app/api/admin/testimonials/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\admin\\testimonials\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:l,staticGenerationAsyncStorage:d,serverHooks:m}=c,_="/api/admin/testimonials/route";function p(){return(0,o.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}r()}catch(t){r(t)}})},675:(t,e,a)=>{a.a(t,async(t,r)=>{try{a.r(e),a.d(e,{GET:()=>p});var s=a(71309),n=a(64985),o=a(67390),i=a.n(o),u=t([n]);n=(u.then?(await u)():u)[0];let c=process.env.NEXTAUTH_SECRET||process.env.JWT_SECRET||"fallback_secret";async function p(t){try{let e;let a=t.headers.get("authorization");if(!a||!a.startsWith("Bearer "))return s.NextResponse.json({success:!1,error:"Authorization required"},{status:401});let r=a.substring(7);try{e=i().verify(r,c)}catch(t){return s.NextResponse.json({success:!1,error:"Invalid token"},{status:401})}if("admin"!==e.role&&"super_admin"!==e.role)return s.NextResponse.json({success:!1,error:"Admin access required"},{status:403});let{searchParams:o}=new URL(t.url),u=o.get("status")||"all",p=parseInt(o.get("limit")||"20"),l=parseInt(o.get("page")||"1"),d=(l-1)*p,m="",_=[p,d];"all"!==u&&(m="WHERE t.status = $3",_.push(u));let v=await (0,n.I)(`
      SELECT 
        t.id,
        t.rating,
        t.title,
        t.content,
        t.status,
        t.admin_comment,
        t.created_at,
        t.updated_at,
        t.approved_at,
        u.full_name,
        u.email,
        u.country,
        u.city,
        approver.full_name as approved_by_name
      FROM testimonials t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN users approver ON t.approved_by = approver.id
      ${m}
      ORDER BY t.created_at DESC
      LIMIT $1 OFFSET $2
    `,_),y=await (0,n.I)(`
      SELECT 
        status,
        COUNT(*) as count
      FROM testimonials
      GROUP BY status
    `),R={pending:0,approved:0,rejected:0,total:0};y.rows.forEach(t=>{R[t.status]=parseInt(t.count),R.total+=parseInt(t.count)});let E=v.rows.map(t=>({id:t.id,rating:t.rating,title:t.title,content:t.content,status:t.status,adminComment:t.admin_comment,user:{name:t.full_name||"Анонимный пользователь",email:t.email,location:t.city&&t.country?`${t.city}, ${t.country}`:t.country||"Не указано"},createdAt:t.created_at,updatedAt:t.updated_at,approvedAt:t.approved_at,approvedBy:t.approved_by_name}));return console.log(`✅ Loaded ${E.length} testimonials for admin`),s.NextResponse.json({success:!0,testimonials:E,stats:R,pagination:{page:l,limit:p,total:R.total}})}catch(t){return console.error("Error loading testimonials for admin:",t),s.NextResponse.json({success:!1,error:"Failed to load testimonials"},{status:500})}}r()}catch(t){r(t)}})},64985:(t,e,a)=>{a.a(t,async(t,r)=>{try{a.d(e,{I:()=>o,d:()=>u});var s=a(8678),n=t([s]);s=(n.then?(await n)():n)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let u=new s.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function o(t,e){let a=await u.connect();try{return await a.query(t,e)}finally{a.release()}}r()}catch(t){r(t)}})}};var e=require("../../../../webpack-runtime.js");e.C(t);var a=t=>e(e.s=t),r=e.X(0,[7787,4833,7390],()=>a(53610));module.exports=r})();