"use strict";(()=>{var e={};e.id=9902,e.ids=[9902],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},76162:e=>{e.exports=require("stream")},21764:e=>{e.exports=require("util")},8678:e=>{e.exports=import("pg")},88933:(e,t,s)=>{s.a(e,async(e,a)=>{try{s.r(t),s.d(t,{originalPathname:()=>m,patchFetch:()=>u,requestAsyncStorage:()=>c,routeModule:()=>_,serverHooks:()=>p,staticGenerationAsyncStorage:()=>l});var r=s(73278),i=s(45002),o=s(54877),n=s(80407),d=e([n]);n=(d.then?(await d)():d)[0];let _=new r.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/admin/deposit-requests/detailed/route",pathname:"/api/admin/deposit-requests/detailed",filename:"route",bundlePath:"app/api/admin/deposit-requests/detailed/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\admin\\deposit-requests\\detailed\\route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:c,staticGenerationAsyncStorage:l,serverHooks:p}=_,m="/api/admin/deposit-requests/detailed/route";function u(){return(0,o.patchFetch)({serverHooks:p,staticGenerationAsyncStorage:l})}a()}catch(e){a(e)}})},80407:(e,t,s)=>{s.a(e,async(e,a)=>{try{s.r(t),s.d(t,{GET:()=>u});var r=s(71309),i=s(64985),o=s(67390),n=s.n(o),d=e([i]);i=(d.then?(await d)():d)[0];let _=process.env.NEXTAUTH_SECRET||process.env.JWT_SECRET||"fallback_secret";async function u(e){try{let t;let s=e.headers.get("authorization");if(!s||!s.startsWith("Bearer "))return r.NextResponse.json({success:!1,error:"Authorization required"},{status:401});let a=s.substring(7);try{t=n().verify(a,_)}catch(e){return r.NextResponse.json({success:!1,error:"Invalid token"},{status:401})}if("admin"!==t.role&&"super_admin"!==t.role)return r.NextResponse.json({success:!1,error:"Admin access required"},{status:403});let o=await (0,i.I)(`
      SELECT 
        dr.id,
        dr.user_id,
        dr.amount,
        dr.method,
        dr.payment_details,
        dr.status,
        dr.admin_comment,
        dr.created_at,
        dr.processed_at,
        
        -- Информация о пользователе
        u.full_name,
        u.email,
        u.balance,
        u.total_invested,
        u.total_earned,
        u.created_at as registration_date,
        u.last_login,
        u.country,
        u.city,
        u.is_verified,
        u.phone,
        
        -- Статистика пользователя
        (SELECT COUNT(*) FROM deposit_requests WHERE user_id = u.id AND status = 'approved') as total_deposits,
        (SELECT COUNT(*) FROM withdrawal_requests WHERE user_id = u.id AND status = 'approved') as total_withdrawals,
        (SELECT COUNT(*) FROM transactions WHERE user_id = u.id AND status = 'completed') as successful_transactions,
        (SELECT COUNT(*) FROM transactions WHERE user_id = u.id AND status = 'failed') as failed_transactions,
        (SELECT AVG(amount) FROM transactions WHERE user_id = u.id) as average_transaction,
        (SELECT MIN(created_at) FROM transactions WHERE user_id = u.id) as first_transaction_date,
        (SELECT MAX(created_at) FROM transactions WHERE user_id = u.id) as last_transaction_date
        
      FROM deposit_requests dr
      JOIN users u ON dr.user_id = u.id
      ORDER BY dr.created_at DESC
      LIMIT 50
    `),d=await Promise.all(o.rows.map(async e=>{let t=new Date(e.registration_date),s=new Date,a=30>Math.floor((s.getTime()-t.getTime())/864e5),r=e.amount>5e3,o=await (0,i.I)("SELECT COUNT(*) as count FROM deposit_requests WHERE user_id = $1 AND created_at > NOW() - INTERVAL '24 hours'",[e.user_id]),n=parseInt(o.rows[0].count)>3,d=(await (0,i.I)("SELECT DISTINCT method FROM deposit_requests WHERE user_id = $1",[e.user_id])).rows.length>3,u=await (0,i.I)("SELECT COUNT(*) as count FROM deposit_requests WHERE user_id = $1 AND created_at > NOW() - INTERVAL '7 days'",[e.user_id]),_=parseInt(u.rows[0].count)>10,c=0;a&&(c+=15),r&&(c+=25),n&&(c+=20),d&&(c+=10),_&&(c+=30),e.is_verified||(c+=15);let l=await (0,i.I)(`
          SELECT id, amount, method, status, created_at
          FROM deposit_requests 
          WHERE user_id = $1 AND id != $2
          ORDER BY created_at DESC
          LIMIT 5
        `,[e.user_id,e.id]);return{id:e.id,user_id:e.user_id,amount:parseFloat(e.amount),method:e.method,payment_details:e.payment_details,status:e.status,admin_comment:e.admin_comment,created_at:e.created_at,processed_at:e.processed_at,user:{id:e.user_id,full_name:e.full_name,email:e.email,balance:parseFloat(e.balance||0),total_invested:parseFloat(e.total_invested||0),total_earned:parseFloat(e.total_earned||0),registration_date:e.registration_date,last_login:e.last_login,country:e.country,city:e.city,ip_address:"192.168.1.1",is_verified:e.is_verified,kyc_status:e.is_verified?"verified":"pending",phone:e.phone},user_stats:{total_deposits:parseInt(e.total_deposits||0),total_withdrawals:parseInt(e.total_withdrawals||0),successful_transactions:parseInt(e.successful_transactions||0),failed_transactions:parseInt(e.failed_transactions||0),average_transaction:parseFloat(e.average_transaction||0),first_transaction_date:e.first_transaction_date,last_transaction_date:e.last_transaction_date},risk_factors:{new_user:a,large_amount:r,suspicious_pattern:_,multiple_requests:n,different_payment_methods:d,risk_score:Math.min(100,c)},similar_requests:l.rows.map(e=>({id:e.id,amount:parseFloat(e.amount),method:e.method,status:e.status,created_at:e.created_at}))}}));return console.log(`✅ Loaded ${d.length} detailed deposit requests`),r.NextResponse.json({success:!0,requests:d})}catch(e){return console.error("Error loading detailed deposit requests:",e),r.NextResponse.json({success:!1,error:"Failed to load detailed requests"},{status:500})}}a()}catch(e){a(e)}})},64985:(e,t,s)=>{s.a(e,async(e,a)=>{try{s.d(t,{I:()=>o,d:()=>d});var r=s(8678),i=e([r]);r=(i.then?(await i)():i)[0];let n=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!n)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let d=new r.Pool({connectionString:n,ssl:!!n?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function o(e,t){let s=await d.connect();try{return await s.query(e,t)}finally{s.release()}}a()}catch(e){a(e)}})}};var t=require("../../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),a=t.X(0,[7787,4833,7390],()=>s(88933));module.exports=a})();