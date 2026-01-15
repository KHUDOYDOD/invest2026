"use strict";(()=>{var t={};t.id=198,t.ids=[198],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:t=>{t.exports=import("pg")},52499:(t,e,a)=>{a.a(t,async(t,s)=>{try{a.r(e),a.d(e,{originalPathname:()=>d,patchFetch:()=>c,requestAsyncStorage:()=>_,routeModule:()=>p,serverHooks:()=>h,staticGenerationAsyncStorage:()=>l});var n=a(73278),r=a(45002),i=a(54877),o=a(38857),u=t([o]);o=(u.then?(await u)():u)[0];let p=new n.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/statistics/route",pathname:"/api/statistics",filename:"route",bundlePath:"app/api/statistics/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\statistics\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:_,staticGenerationAsyncStorage:l,serverHooks:h}=p,d="/api/statistics/route";function c(){return(0,i.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:l})}s()}catch(t){s(t)}})},38857:(t,e,a)=>{a.a(t,async(t,s)=>{try{a.r(e),a.d(e,{GET:()=>o,PUT:()=>u});var n=a(71309),r=a(44819),i=t([r]);async function o(){try{let t=await (0,r.I)(`
      SELECT 
        users_count,
        users_change,
        investments_amount,
        investments_change,
        payouts_amount,
        payouts_change,
        profitability_rate,
        profitability_change,
        updated_at
      FROM platform_statistics 
      ORDER BY id DESC 
      LIMIT 1
    `);if(0===t.rows.length)return n.NextResponse.json({users_count:15420,users_change:12.5,investments_amount:285e4,investments_change:8.3,payouts_amount:192e4,payouts_change:15.7,profitability_rate:24.8,profitability_change:3.2});let e=t.rows[0];return n.NextResponse.json({users_count:parseInt(e.users_count),users_change:parseFloat(e.users_change),investments_amount:parseInt(e.investments_amount),investments_change:parseFloat(e.investments_change),payouts_amount:parseInt(e.payouts_amount),payouts_change:parseFloat(e.payouts_change),profitability_rate:parseFloat(e.profitability_rate),profitability_change:parseFloat(e.profitability_change),updated_at:e.updated_at})}catch(t){return console.error("Error fetching statistics:",t),n.NextResponse.json({error:"Failed to fetch statistics"},{status:500})}}async function u(t){try{let e;let{users_count:a,users_change:s,investments_amount:i,investments_change:o,payouts_amount:u,payouts_change:c,profitability_rate:p,profitability_change:_}=await t.json(),l=await (0,r.I)("SELECT id FROM platform_statistics LIMIT 1");return e=l.rows.length>0?await (0,r.I)(`
        UPDATE platform_statistics SET
          users_count = $1,
          users_change = $2,
          investments_amount = $3,
          investments_change = $4,
          payouts_amount = $5,
          payouts_change = $6,
          profitability_rate = $7,
          profitability_change = $8,
          updated_at = NOW()
        WHERE id = $9
        RETURNING *
      `,[a,s,i,o,u,c,p,_,l.rows[0].id]):await (0,r.I)(`
        INSERT INTO platform_statistics (
          users_count,
          users_change,
          investments_amount,
          investments_change,
          payouts_amount,
          payouts_change,
          profitability_rate,
          profitability_change,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING *
      `,[a,s,i,o,u,c,p,_]),n.NextResponse.json({success:!0,data:e.rows[0]})}catch(t){return console.error("Error updating statistics:",t),n.NextResponse.json({error:"Failed to update statistics"},{status:500})}}r=(i.then?(await i)():i)[0],s()}catch(t){s(t)}})},44819:(t,e,a)=>{a.a(t,async(t,s)=>{try{a.d(e,{I:()=>i});var n=a(8678),r=t([n]);n=(r.then?(await r)():r)[0];let o=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!o)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let u=new n.Pool({connectionString:o,ssl:!!o?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function i(t,e){let a=await u.connect();try{return await a.query(t,e)}finally{a.release()}}s()}catch(t){s(t)}})}};var e=require("../../../webpack-runtime.js");e.C(t);var a=t=>e(e.s=t),s=e.X(0,[7787,4833],()=>a(52499));module.exports=s})();