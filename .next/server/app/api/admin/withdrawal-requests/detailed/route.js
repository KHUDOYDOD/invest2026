"use strict";(()=>{var e={};e.id=5280,e.ids=[5280],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},76162:e=>{e.exports=require("stream")},21764:e=>{e.exports=require("util")},8678:e=>{e.exports=import("pg")},4243:(e,t,a)=>{a.a(e,async(e,s)=>{try{a.r(t),a.d(t,{originalPathname:()=>w,patchFetch:()=>u,requestAsyncStorage:()=>_,routeModule:()=>l,serverHooks:()=>p,staticGenerationAsyncStorage:()=>c});var r=a(73278),i=a(45002),n=a(54877),o=a(47586),d=e([o]);o=(d.then?(await d)():d)[0];let l=new r.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/admin/withdrawal-requests/detailed/route",pathname:"/api/admin/withdrawal-requests/detailed",filename:"route",bundlePath:"app/api/admin/withdrawal-requests/detailed/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\admin\\withdrawal-requests\\detailed\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:_,staticGenerationAsyncStorage:c,serverHooks:p}=l,w="/api/admin/withdrawal-requests/detailed/route";function u(){return(0,n.patchFetch)({serverHooks:p,staticGenerationAsyncStorage:c})}s()}catch(e){s(e)}})},47586:(e,t,a)=>{a.a(e,async(e,s)=>{try{a.r(t),a.d(t,{GET:()=>u});var r=a(71309),i=a(64985),n=a(67390),o=a.n(n),d=e([i]);i=(d.then?(await d)():d)[0];let l=process.env.NEXTAUTH_SECRET||process.env.JWT_SECRET||"fallback_secret";async function u(e){try{let t;let a=e.headers.get("authorization");if(!a||!a.startsWith("Bearer "))return r.NextResponse.json({success:!1,error:"Authorization required"},{status:401});let s=a.substring(7);try{t=o().verify(s,l)}catch(e){return r.NextResponse.json({success:!1,error:"Invalid token"},{status:401})}if("admin"!==t.role&&"super_admin"!==t.role)return r.NextResponse.json({success:!1,error:"Admin access required"},{status:403});let n=await (0,i.I)(`
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
        
      FROM withdrawal_requests wr
      JOIN users u ON wr.user_id = u.id
      ORDER BY wr.created_at DESC
      LIMIT 50
    `),d=await Promise.all(n.rows.map(async e=>{let t=new Date(e.registration_date),a=new Date,s=30>Math.floor((a.getTime()-t.getTime())/864e5),r=e.amount>1e3,n=await (0,i.I)("SELECT COUNT(*) as count FROM withdrawal_requests WHERE user_id = $1 AND created_at > NOW() - INTERVAL '24 hours'",[e.user_id]),o=parseInt(n.rows[0].count)>1,d=(await (0,i.I)("SELECT DISTINCT method FROM withdrawal_requests WHERE user_id = $1",[e.user_id])).rows.length>2,u=await (0,i.I)("SELECT COUNT(*) as count FROM withdrawal_requests WHERE user_id = $1 AND created_at > NOW() - INTERVAL '7 days'",[e.user_id]),l=parseInt(u.rows[0].count)>5,_=0;s&&(_+=20),r&&(_+=30),o&&(_+=15),d&&(_+=10),l&&(_+=25),e.is_verified||(_+=20),e.total_withdrawals>e.total_deposits&&(_+=20);let c=await (0,i.I)(`
          SELECT id, amount, method, status, created_at
          FROM withdrawal_requests 
          WHERE user_id = $1 AND id != $2
          ORDER BY created_at DESC
          LIMIT 5
        `,[e.user_id,e.id]);return{id:e.id,user_id:e.user_id,amount:parseFloat(e.amount),method:e.method,wallet_address:e.wallet_address,fee:parseFloat(e.fee||0),final_amount:parseFloat(e.final_amount||e.amount),status:e.status,admin_comment:e.admin_comment,created_at:e.created_at,processed_at:e.processed_at,user:{id:e.user_id,full_name:e.full_name,email:e.email,balance:parseFloat(e.balance||0),total_invested:parseFloat(e.total_invested||0),total_earned:parseFloat(e.total_earned||0),registration_date:e.registration_date,last_login:e.last_login,country:e.country,city:e.city,ip_address:"192.168.1.1",is_verified:e.is_verified,kyc_status:e.is_verified?"verified":"pending",phone:e.phone},user_stats:{total_deposits:parseInt(e.total_deposits||0),total_withdrawals:parseInt(e.total_withdrawals||0),successful_transactions:parseInt(e.successful_transactions||0),failed_transactions:parseInt(e.failed_transactions||0),average_transaction:parseFloat(e.average_transaction||0),first_transaction_date:e.first_transaction_date,last_transaction_date:e.last_transaction_date},risk_factors:{new_user:s,large_amount:r,suspicious_pattern:l,multiple_requests:o,different_payment_methods:d,risk_score:Math.min(100,_)},similar_requests:c.rows.map(e=>({id:e.id,amount:parseFloat(e.amount),method:e.method,status:e.status,created_at:e.created_at}))}}));return console.log(`✅ Loaded ${d.length} detailed withdrawal requests`),r.NextResponse.json({success:!0,requests:d})}catch(e){return console.error("Error loading detailed withdrawal requests:",e),r.NextResponse.json({success:!1,error:"Failed to load detailed requests"},{status:500})}}s()}catch(e){s(e)}})},64985:(e,t,a)=>{a.a(e,async(e,s)=>{try{a.d(t,{I:()=>n,d:()=>d});var r=a(8678),i=e([r]);r=(i.then?(await i)():i)[0];let o=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!o)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let d=new r.Pool({connectionString:o,ssl:!!o?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function n(e,t){let a=await d.connect();try{return await a.query(e,t)}finally{a.release()}}s()}catch(e){s(e)}})}};var t=require("../../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[7787,4833,7390],()=>a(4243));module.exports=s})();