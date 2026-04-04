"use strict";(()=>{var e={};e.id=7041,e.ids=[7041],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},99609:(e,r,t)=>{t.a(e,async(e,n)=>{try{t.r(r),t.d(r,{originalPathname:()=>_,patchFetch:()=>u,requestAsyncStorage:()=>d,routeModule:()=>p,serverHooks:()=>h,staticGenerationAsyncStorage:()=>l});var o=t(73278),s=t(45002),a=t(54877),c=t(16529),i=e([c]);c=(i.then?(await i)():i)[0];let p=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/admin/project-launches/route",pathname:"/api/admin/project-launches",filename:"route",bundlePath:"app/api/admin/project-launches/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\admin\\project-launches\\route.ts",nextConfigOutput:"",userland:c}),{requestAsyncStorage:d,staticGenerationAsyncStorage:l,serverHooks:h}=p,_="/api/admin/project-launches/route";function u(){return(0,a.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:l})}n()}catch(e){n(e)}})},16529:(e,r,t)=>{t.a(e,async(e,n)=>{try{t.r(r),t.d(r,{DELETE:()=>p,GET:()=>c,POST:()=>i,PUT:()=>u,dynamic:()=>d});var o=t(71309),s=t(44819),a=e([s]);s=(a.then?(await a)():a)[0];let d="force-dynamic";async function c(){try{let e=await s.d.query(`
      SELECT 
        id, name, title, description, 
        launch_date, countdown_end, is_launched, 
        is_active, show_on_site, show_countdown,
        position, icon_type, background_type, color_scheme,
        created_at, updated_at
      FROM project_launches 
      WHERE is_active = true
      ORDER BY position ASC, launch_date ASC
    `);return o.NextResponse.json(e.rows,{headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}})}catch(e){return console.error("Error fetching project launches:",e),o.NextResponse.json({error:"Internal server error"},{status:500})}}async function i(e){try{let{name:r,title:t,description:n,launch_date:a,countdown_end:c,show_countdown:i=!0,icon_type:u="rocket",color_scheme:p="blue",position:d=1}=await e.json(),l=await s.d.query(`
      INSERT INTO project_launches (
        name, title, description, launch_date, countdown_end,
        show_countdown, icon_type, color_scheme, position
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,[r,t,n,a,c,i,u,p,d]);return o.NextResponse.json(l.rows[0])}catch(e){return console.error("Error creating project launch:",e),o.NextResponse.json({error:"Internal server error"},{status:500})}}async function u(e){try{let{id:r,name:t,title:n,description:a,launch_date:c,countdown_end:i,is_launched:u,show_countdown:p,icon_type:d,color_scheme:l,position:h}=await e.json(),_=await s.d.query(`
      UPDATE project_launches 
      SET 
        name = $2,
        title = $3,
        description = $4,
        launch_date = $5,
        countdown_end = $6,
        is_launched = $7,
        show_countdown = $8,
        icon_type = $9,
        color_scheme = $10,
        position = $11,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,[r,t,n,a,c,i,u,p,d,l,h]);if(0===_.rows.length)return o.NextResponse.json({error:"Project launch not found"},{status:404});return o.NextResponse.json(_.rows[0])}catch(e){return console.error("Error updating project launch:",e),o.NextResponse.json({error:"Internal server error"},{status:500})}}async function p(e){try{let{searchParams:r}=new URL(e.url),t=r.get("id");if(!t)return o.NextResponse.json({error:"ID is required"},{status:400});let n=await s.d.query(`
      DELETE FROM project_launches 
      WHERE id = $1
      RETURNING *
    `,[t]);if(0===n.rows.length)return o.NextResponse.json({error:"Project launch not found"},{status:404});return o.NextResponse.json({success:!0})}catch(e){return console.error("Error deleting project launch:",e),o.NextResponse.json({error:"Internal server error"},{status:500})}}n()}catch(e){n(e)}})},44819:(e,r,t)=>{t.a(e,async(e,n)=>{try{t.d(r,{I:()=>a,d:()=>i});var o=t(8678),s=e([o]);o=(s.then?(await s)():s)[0];let c=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!c)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let i=new o.Pool({connectionString:c,ssl:!!c?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function a(e,r){let t=await i.connect();try{return await t.query(e,r)}finally{t.release()}}n()}catch(e){n(e)}})}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),n=r.X(0,[7787,4833],()=>t(99609));module.exports=n})();