"use strict";(()=>{var e={};e.id=3002,e.ids=[3002,9023],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:e=>{e.exports=require("pg")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},76162:e=>{e.exports=require("stream")},21764:e=>{e.exports=require("util")},8678:e=>{e.exports=import("pg")},93827:(e,t,s)=>{s.a(e,async(e,a)=>{try{s.r(t),s.d(t,{originalPathname:()=>_,patchFetch:()=>l,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>p});var r=s(73278),o=s(45002),n=s(54877),u=s(67248),i=e([u]);u=(i.then?(await i)():i)[0];let c=new r.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/auth/register/route",pathname:"/api/auth/register",filename:"route",bundlePath:"app/api/auth/register/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\auth\\register\\route.ts",nextConfigOutput:"",userland:u}),{requestAsyncStorage:d,staticGenerationAsyncStorage:p,serverHooks:m}=c,_="/api/auth/register/route";function l(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:p})}a()}catch(e){a(e)}})},67248:(e,t,s)=>{s.a(e,async(e,a)=>{try{s.r(t),s.d(t,{POST:()=>d});var r=s(71309),o=s(93981),n=s(67390),u=s.n(n),i=s(44819),l=s(24188),c=e([i]);async function d(e){console.log("\uD83D\uDD35 Registration API called");try{let t=await e.json();console.log("\uD83D\uDCE6 Request body:",{email:t.email,fullName:t.fullName,country:t.country,referralCode:t.referralCode});let{email:s,password:a,fullName:n,country:c,referralCode:d}=t;if(!s||!a||!n)return console.log("❌ Validation failed: missing fields"),r.NextResponse.json({success:!1,error:"Все поля обязательны для заполнения",field:s?a?"full_name":"password":"email"},{status:400});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))return r.NextResponse.json({success:!1,error:"Некорректный формат email",field:"email"},{status:400});if(a.length<6)return r.NextResponse.json({success:!1,error:"Пароль должен содержать минимум 6 символов",field:"password"},{status:400});console.log("\uD83D\uDD0C Connecting to database..."),console.log("\uD83D\uDCCD DATABASE_URL:",process.env.DATABASE_URL?.replace(/:[^:@]+@/,":****@")),console.log("✅ Database connected successfully!");{console.log("\uD83D\uDD0D Checking if user exists...");let e=await (0,i.I)("SELECT id FROM users WHERE email = $1",[s.toLowerCase()]);if(console.log("✅ User check complete:",e.rows.length>0?"User exists":"User not found"),e.rows.length>0)return r.NextResponse.json({success:!1,error:"Пользователь с таким email уже существует",field:"email"},{status:400});console.log("\uD83D\uDD10 Hashing password...");let t=await o.ZP.hash(a,10);console.log("✅ Password hashed");let p="REF"+Math.random().toString(36).substring(2,10).toUpperCase();console.log("\uD83C\uDFAB Generated referral code:",p);let m=null;d&&(console.log("\uD83D\uDD0D Checking referral code:",d),(await (0,i.I)("SELECT referral_code FROM users WHERE referral_code = $1",[d])).rows.length>0?(m=d,console.log("✅ Valid referral code found")):console.log("⚠️ Invalid referral code, ignoring")),console.log("\uD83D\uDCBE Creating user in database...");let _=(await (0,i.I)(`INSERT INTO users (
          email, 
          password_hash, 
          full_name, 
          country,
          referral_code,
          referred_by,
          balance,
          total_invested,
          total_earned,
          role_id,
          status,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, 0, 0, 0, 3, 'active', NOW())
        RETURNING id, email, full_name, role_id, referral_code, balance, created_at`,[s.toLowerCase(),t,n,c||null,p,m])).rows[0];console.log("✅ User created successfully:",_.id),await (0,l.updateStatistics)();let h=1===_.role_id?"super_admin":2===_.role_id?"admin":"user",g=u().sign({userId:_.id,email:_.email,role:h,isDemoMode:!1},process.env.NEXTAUTH_SECRET||process.env.JWT_SECRET||"fallback_secret",{expiresIn:"7d"});return console.log("\uD83C\uDF89 Registration successful!"),r.NextResponse.json({success:!0,message:"Регистрация успешна!",user:{id:_.id,email:_.email,fullName:_.full_name,full_name:_.full_name,role:h,referralCode:_.referral_code,balance:parseFloat(_.balance||0),createdAt:_.created_at},token:g,redirect:"/dashboard"})}}catch(e){if(console.error("❌ Registration error:",e),console.error("Error details:",{message:e.message,code:e.code,detail:e.detail}),"23505"===e.code)return r.NextResponse.json({success:!1,error:"Пользователь с таким email уже существует",field:"email"},{status:400});if("ECONNREFUSED"===e.code||e.message?.includes("connect"))return r.NextResponse.json({success:!1,error:"Ошибка подключения к базе данных. Проверьте, что PostgreSQL запущен."},{status:500});if("42703"===e.code)return r.NextResponse.json({success:!1,error:"Ошибка структуры базы данных. Запустите setup-registration.bat"},{status:500});return r.NextResponse.json({success:!1,error:`Ошибка при регистрации: ${e.message||"Попробуйте позже."}`},{status:500})}}i=(c.then?(await c)():c)[0],a()}catch(e){a(e)}})},24188:(e,t,s)=>{let{Pool:a}=s(35900),r=new a({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}});async function o(e,t){let s=await r.connect();try{return await s.query(e,t)}finally{s.release()}}async function n(){try{console.log("\uD83D\uDD04 Обновляем статистику...");let[e,t,s]=await Promise.all([o("SELECT COUNT(*) as count FROM users"),o(`
        SELECT 
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(*) as count
        FROM transactions 
        WHERE type = 'investment' AND status = 'completed'
      `),o(`
        SELECT 
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(*) as count
        FROM transactions 
        WHERE type = 'withdrawal' AND status = 'completed'
      `)]),a=parseInt(e.rows[0].count),r=parseFloat(t.rows[0].total_amount),n=parseFloat(s.rows[0].total_amount),u=r>0?n/r*100:0,i=await o(`
      SELECT 
        users_count,
        investments_amount,
        payouts_amount,
        profitability_rate
      FROM platform_statistics 
      ORDER BY updated_at DESC 
      LIMIT 1
    `),l=0,c=0,d=0,p=0;if(i.rows.length>0){let e=i.rows[0];l=e.users_count>0?(a-e.users_count)/e.users_count*100:0,c=e.investments_amount>0?(r-e.investments_amount)/e.investments_amount*100:0,d=e.payouts_amount>0?(n-e.payouts_amount)/e.payouts_amount*100:0,p=e.profitability_rate>0?(u-e.profitability_rate)/e.profitability_rate*100:0}let m=await o("SELECT id FROM platform_statistics ORDER BY updated_at DESC LIMIT 1");return m.rows.length>0?await o(`
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
      `,[a,Math.round(100*l)/100,Math.round(r),Math.round(100*c)/100,Math.round(n),Math.round(100*d)/100,Math.round(100*u)/100,Math.round(100*p)/100,m.rows[0].id]):await o(`
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
      `,[a,Math.round(100*l)/100,Math.round(r),Math.round(100*c)/100,Math.round(n),Math.round(100*d)/100,Math.round(100*u)/100,Math.round(100*p)/100]),console.log("✅ Статистика обновлена:",{users:a,investments:r,payouts:n,profitability:u}),{success:!0,data:{users_count:a,users_change:Math.round(100*l)/100,investments_amount:Math.round(r),investments_change:Math.round(100*c)/100,payouts_amount:Math.round(n),payouts_change:Math.round(100*d)/100,profitability_rate:Math.round(100*u)/100,profitability_change:Math.round(100*p)/100}}}catch(e){return console.error("❌ Ошибка обновления статистики:",e),{success:!1,error:e.message}}}e.exports={updateStatistics:n}},44819:(e,t,s)=>{s.a(e,async(e,a)=>{try{s.d(t,{I:()=>n,d:()=>i});var r=s(8678),o=e([r]);r=(o.then?(await o)():o)[0];let u=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!u)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let i=new r.Pool({connectionString:u,ssl:!!u?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function n(e,t){let s=await i.connect();try{return await s.query(e,t)}finally{s.release()}}a()}catch(e){a(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),a=t.X(0,[7787,4833,7390,3981],()=>s(93827));module.exports=a})();