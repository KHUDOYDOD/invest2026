"use strict";(()=>{var e={};e.id=4848,e.ids=[4848],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},25799:(e,t,a)=>{a.a(e,async(e,s)=>{try{a.r(t),a.d(t,{originalPathname:()=>_,patchFetch:()=>c,requestAsyncStorage:()=>p,routeModule:()=>d,serverHooks:()=>l,staticGenerationAsyncStorage:()=>m});var n=a(73278),r=a(45002),i=a(54877),o=a(76465),u=e([o]);o=(u.then?(await u)():u)[0];let d=new n.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/user-activity/route",pathname:"/api/user-activity",filename:"route",bundlePath:"app/api/user-activity/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\user-activity\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:p,staticGenerationAsyncStorage:m,serverHooks:l}=d,_="/api/user-activity/route";function c(){return(0,i.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:m})}s()}catch(e){s(e)}})},76465:(e,t,a)=>{a.a(e,async(e,s)=>{try{a.r(t),a.d(t,{GET:()=>o,dynamic:()=>u,revalidate:()=>c});var n=a(71309),r=a(44819),i=e([r]);r=(i.then?(await i)():i)[0];let u="force-dynamic",c=0;async function o(){try{let e=await (0,r.I)(`
      SELECT 
        t.id,
        t.user_id,
        t.type,
        CAST(t.amount AS DECIMAL(10,2)) as amount,
        t.status,
        t.created_at as time,
        u.full_name as user_name,
        CASE 
          WHEN t.type = 'investment' AND t.investment_id IS NOT NULL THEN 
            (SELECT p.name FROM investment_plans p 
             JOIN investments i ON i.plan_id = p.id 
             WHERE i.id = t.investment_id
             LIMIT 1)
          ELSE NULL
        END as plan_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.status IN ('completed', 'pending')
      ORDER BY t.created_at DESC
      LIMIT 20
    `);if(console.log("\uD83D\uDCCA User activity query result:",e.rows.length,"rows"),0===e.rows.length){let e=[{id:"1",user_id:"1",type:"deposit",amount:500,status:"completed",time:new Date(Date.now()-3e5).toISOString(),user_name:"Александр П."},{id:"2",user_id:"2",type:"investment",amount:1e3,status:"completed",time:new Date(Date.now()-9e5).toISOString(),user_name:"Мария И."},{id:"3",user_id:"3",type:"withdrawal",amount:250,status:"completed",time:new Date(Date.now()-18e5).toISOString(),user_name:"Дмитрий С."},{id:"4",user_id:"4",type:"deposit",amount:750,status:"completed",time:new Date(Date.now()-27e5).toISOString(),user_name:"Елена К."},{id:"5",user_id:"5",type:"investment",amount:2e3,status:"completed",time:new Date(Date.now()-36e5).toISOString(),user_name:"Андрей В."}];return n.NextResponse.json({success:!0,data:e},{headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}})}return n.NextResponse.json({success:!0,data:e.rows.map(e=>({...e,amount:parseFloat(e.amount)||0}))},{headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}})}catch(t){console.error("Error fetching user activity:",t);let e=[{id:"1",user_id:"1",type:"deposit",amount:500,status:"completed",time:new Date(Date.now()-3e5).toISOString(),user_name:"Александр П."},{id:"2",user_id:"2",type:"investment",amount:1e3,status:"completed",time:new Date(Date.now()-9e5).toISOString(),user_name:"Мария И."}];return n.NextResponse.json({success:!0,data:e},{headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}})}}s()}catch(e){s(e)}})},44819:(e,t,a)=>{a.a(e,async(e,s)=>{try{a.d(t,{I:()=>i,d:()=>u});var n=a(8678),r=e([n]);n=(r.then?(await r)():r)[0];let o=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!o)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let u=new n.Pool({connectionString:o,ssl:!!o?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function i(e,t){let a=await u.connect();try{return await a.query(e,t)}finally{a.release()}}s()}catch(e){s(e)}})}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[7787,4833],()=>a(25799));module.exports=s})();