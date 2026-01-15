"use strict";(()=>{var e={};e.id=5238,e.ids=[5238],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},76162:e=>{e.exports=require("stream")},21764:e=>{e.exports=require("util")},8678:e=>{e.exports=import("pg")},21123:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{originalPathname:()=>m,patchFetch:()=>u,requestAsyncStorage:()=>_,routeModule:()=>l,serverHooks:()=>p,staticGenerationAsyncStorage:()=>c});var n=a(73278),i=a(45002),s=a(54877),o=a(6115),d=e([o]);o=(d.then?(await d)():d)[0];let l=new n.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/dashboard/all/route",pathname:"/api/dashboard/all",filename:"route",bundlePath:"app/api/dashboard/all/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\dashboard\\all\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:_,staticGenerationAsyncStorage:c,serverHooks:p}=l,m="/api/dashboard/all/route";function u(){return(0,s.patchFetch)({serverHooks:p,staticGenerationAsyncStorage:c})}r()}catch(e){r(e)}})},6115:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{GET:()=>o});var n=a(71309),i=a(64985),s=e([i]);async function o(e){let{searchParams:t}=new URL(e.url),r=t.get("userId");try{if(!r){let t=e.headers.get("authorization");if(t?.startsWith("Bearer ")){let e=t.slice(7);try{r=a(67390).verify(e,process.env.JWT_SECRET||"fallback_secret").userId}catch(e){console.error("JWT decode error:",e)}}}if(!r)return n.NextResponse.json({error:"userId is required"},{status:400});console.log("Fetching dashboard data for user:",r);let t=await (0,i.I)(`SELECT 
        id, 
        email, 
        full_name, 
        COALESCE(balance, 0) as balance,
        COALESCE(total_invested, 0) as total_invested,
        COALESCE(total_earned, 0) as total_earned,
        created_at,
        phone,
        country,
        city,
        referral_code,
        role_id,
        status,
        is_verified,
        is_active
      FROM users 
      WHERE id = $1`,[r]);if(0===t.rows.length)return n.NextResponse.json({error:"User not found"},{status:404});let s=t.rows[0],o=await (0,i.I)(`SELECT 
        i.id,
        i.amount,
        i.created_at,
        i.status,
        ip.name as plan_name,
        ip.daily_percent as daily_return_rate,
        ip.duration as duration_days,
        i.created_at as start_date
      FROM investments i
      LEFT JOIN investment_plans ip ON i.plan_id = ip.id
      WHERE i.user_id = $1
      ORDER BY i.created_at DESC
      LIMIT 10`,[r]),d=await (0,i.I)(`SELECT 
        id,
        type,
        amount,
        status,
        created_at,
        description
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10`,[r]),u=await (0,i.I)(`SELECT 
        id,
        name,
        COALESCE(min_amount, 0) as min_amount,
        COALESCE(max_amount, 0) as max_amount,
        COALESCE(daily_percent, 0) as daily_return_rate,
        duration as duration_days
      FROM investment_plans
      WHERE is_active = true
      ORDER BY min_amount ASC`);return console.log(`Dashboard data loaded: User ${s.email}, ${o.rows.length} investments, ${d.rows.length} transactions`),n.NextResponse.json({success:!0,user:{id:s.id,email:s.email,full_name:s.full_name,balance:parseFloat(s.balance),total_invested:parseFloat(s.total_invested),total_earned:parseFloat(s.total_earned),created_at:s.created_at,phone:s.phone,country:s.country,city:s.city,referral_code:s.referral_code,role:1===s.role_id?"super_admin":2===s.role_id?"admin":"user",status:s.status||"active",email_verified:s.is_verified||!1,phone_verified:!!s.phone,is_active:!1!==s.is_active},investments:o.rows.map(e=>{let t=parseFloat(e.amount),a=parseFloat(e.daily_return_rate||"0"),r=e.duration_days||30,n=new Date(e.start_date),i=new Date(n);i.setDate(i.getDate()+r);let s=new Date,o=Math.floor((s.getTime()-n.getTime())/864e5),d=t*a/100;return{id:e.id,amount:t,plan_name:e.plan_name,daily_return_rate:a,duration_days:r,status:e.status,created_at:e.created_at,start_date:n.toISOString(),end_date:i.toISOString(),daily_profit:d,total_profit:d*Math.min(o,r),days_left:Math.max(0,r-o),progress:Math.min(100,o/r*100)}}),transactions:d.rows.map(e=>({id:e.id,type:e.type,amount:parseFloat(e.amount),status:e.status,description:e.description,created_at:e.created_at})),investment_plans:u.rows.map(e=>({id:e.id,name:e.name,min_amount:parseFloat(e.min_amount),max_amount:parseFloat(e.max_amount),daily_return:parseFloat(e.daily_return_rate),duration:e.duration_days,description:`План ${e.name} с доходностью ${e.daily_return_rate}%`,features:[`Доходность ${e.daily_return_rate}%`,`Срок ${e.duration_days} дней`],is_active:!0}))})}catch(e){return console.error("Dashboard all API error:",e),console.log("⚠️  Database unavailable, using DEMO mode"),n.NextResponse.json({success:!0,isDemoMode:!0,user:{id:r,email:"demo@user.com",full_name:"Демо Пользователь",balance:1e4,total_invested:5e3,total_earned:1e3,created_at:new Date().toISOString(),phone:"+7 (999) 123-45-67",country:"RU",city:"Москва",referral_code:"DEMO123456",role:"user",status:"active",email_verified:!0,phone_verified:!0,is_active:!0},investments:[{id:"demo-inv-1",amount:2e3,plan_name:"Стандарт",daily_return_rate:1.5,duration_days:30,status:"active",created_at:new Date(Date.now()-432e6).toISOString(),start_date:new Date(Date.now()-432e6).toISOString(),end_date:new Date(Date.now()+216e7).toISOString(),daily_profit:30,total_profit:150,days_left:25,progress:16.67},{id:"demo-inv-2",amount:3e3,plan_name:"Премиум",daily_return_rate:2,duration_days:60,status:"active",created_at:new Date(Date.now()-864e6).toISOString(),start_date:new Date(Date.now()-864e6).toISOString(),end_date:new Date(Date.now()+432e7).toISOString(),daily_profit:60,total_profit:600,days_left:50,progress:16.67}],transactions:[{id:"demo-tx-1",type:"deposit",amount:5e3,status:"completed",description:"Пополнение счета",created_at:new Date(Date.now()-1296e6).toISOString()},{id:"demo-tx-2",type:"investment",amount:2e3,status:"completed",description:"Инвестиция в план Стандарт",created_at:new Date(Date.now()-432e6).toISOString()},{id:"demo-tx-3",type:"profit",amount:150,status:"completed",description:"Прибыль от инвестиций",created_at:new Date(Date.now()-864e5).toISOString()}],investment_plans:[{id:1,name:"Базовый",min_amount:100,max_amount:999,daily_return:1.2,duration:30,description:"План Базовый с доходностью 1.2%",features:["Доходность 1.2%","Срок 30 дней"],is_active:!0},{id:2,name:"Стандарт",min_amount:1e3,max_amount:4999,daily_return:1.5,duration:30,description:"План Стандарт с доходностью 1.5%",features:["Доходность 1.5%","Срок 30 дней"],is_active:!0},{id:3,name:"Премиум",min_amount:5e3,max_amount:19999,daily_return:2,duration:60,description:"План Премиум с доходностью 2.0%",features:["Доходность 2.0%","Срок 60 дней"],is_active:!0}]})}}i=(s.then?(await s)():s)[0],r()}catch(e){r(e)}})},64985:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.d(t,{I:()=>s,d:()=>d});var n=a(8678),i=e([n]);n=(i.then?(await i)():i)[0];let o=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!o)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let d=new n.Pool({connectionString:o,ssl:!!o?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function s(e,t){let a=await d.connect();try{return await a.query(e,t)}finally{a.release()}}r()}catch(e){r(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[7787,4833,7390],()=>a(21123));module.exports=r})();