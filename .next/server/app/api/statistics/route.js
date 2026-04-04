"use strict";(()=>{var t={};t.id=198,t.ids=[198],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:t=>{t.exports=import("pg")},52499:(t,e,a)=>{a.a(t,async(t,s)=>{try{a.r(e),a.d(e,{originalPathname:()=>h,patchFetch:()=>u,requestAsyncStorage:()=>l,routeModule:()=>p,serverHooks:()=>d,staticGenerationAsyncStorage:()=>_});var r=a(73278),n=a(45002),o=a(54877),i=a(38857),c=t([i]);i=(c.then?(await c)():c)[0];let p=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/statistics/route",pathname:"/api/statistics",filename:"route",bundlePath:"app/api/statistics/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\statistics\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:l,staticGenerationAsyncStorage:_,serverHooks:d}=p,h="/api/statistics/route";function u(){return(0,o.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:_})}s()}catch(t){s(t)}})},38857:(t,e,a)=>{a.a(t,async(t,s)=>{try{a.r(e),a.d(e,{GET:()=>i,PUT:()=>c,dynamic:()=>u,revalidate:()=>p});var r=a(71309),n=a(44819),o=t([n]);n=(o.then?(await o)():o)[0];let u="force-dynamic",p=0;async function i(){try{console.log("\uD83D\uDCCA Statistics API called at:",new Date().toISOString());let t=await (0,n.I)(`
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
    `);if(console.log("\uD83D\uDCCA Database query result:",t.rows.length>0?t.rows[0]:"No data"),0===t.rows.length)return console.log("⚠️ No statistics data found, returning defaults"),r.NextResponse.json({users_count:15420,users_change:12.5,investments_amount:285e4,investments_change:8.3,payouts_amount:192e4,payouts_change:15.7,profitability_rate:24.8,profitability_change:3.2},{headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}});let e=t.rows[0],a={users_count:parseInt(e.users_count),users_change:parseFloat(e.users_change),investments_amount:parseInt(e.investments_amount),investments_change:parseFloat(e.investments_change),payouts_amount:parseInt(e.payouts_amount),payouts_change:parseFloat(e.payouts_change),profitability_rate:parseFloat(e.profitability_rate),profitability_change:parseFloat(e.profitability_change),updated_at:e.updated_at};return console.log("\uD83D\uDCCA Returning statistics:",a),r.NextResponse.json(a,{headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}})}catch(t){return console.error("❌ Error fetching statistics:",t),r.NextResponse.json({error:"Failed to fetch statistics"},{status:500,headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}})}}async function c(t){try{let e;let{users_count:a,users_change:s,investments_amount:o,investments_change:i,payouts_amount:c,payouts_change:u,profitability_rate:p,profitability_change:l}=await t.json(),_=await (0,n.I)("SELECT id FROM platform_statistics LIMIT 1");return e=_.rows.length>0?await (0,n.I)(`
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
      `,[a,s,o,i,c,u,p,l,_.rows[0].id]):await (0,n.I)(`
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
      `,[a,s,o,i,c,u,p,l]),r.NextResponse.json({success:!0,data:e.rows[0]})}catch(t){return console.error("Error updating statistics:",t),r.NextResponse.json({error:"Failed to update statistics"},{status:500})}}s()}catch(t){s(t)}})},44819:(t,e,a)=>{a.a(t,async(t,s)=>{try{a.d(e,{I:()=>o,d:()=>c});var r=a(8678),n=t([r]);r=(n.then?(await n)():n)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let c=new r.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function o(t,e){let a=await c.connect();try{return await a.query(t,e)}finally{a.release()}}s()}catch(t){s(t)}})}};var e=require("../../../webpack-runtime.js");e.C(t);var a=t=>e(e.s=t),s=e.X(0,[7787,4833],()=>a(52499));module.exports=s})();