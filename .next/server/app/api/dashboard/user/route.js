"use strict";(()=>{var e={};e.id=3422,e.ids=[3422],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},76162:e=>{e.exports=require("stream")},21764:e=>{e.exports=require("util")},8678:e=>{e.exports=import("pg")},85818:(e,r,t)=>{t.a(e,async(e,a)=>{try{t.r(r),t.d(r,{originalPathname:()=>p,patchFetch:()=>u,requestAsyncStorage:()=>c,routeModule:()=>d,serverHooks:()=>_,staticGenerationAsyncStorage:()=>m});var s=t(73278),o=t(45002),n=t(54877),i=t(80725),l=e([i]);i=(l.then?(await l)():l)[0];let d=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/dashboard/user/route",pathname:"/api/dashboard/user",filename:"route",bundlePath:"app/api/dashboard/user/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\dashboard\\user\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:c,staticGenerationAsyncStorage:m,serverHooks:_}=d,p="/api/dashboard/user/route";function u(){return(0,n.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:m})}a()}catch(e){a(e)}})},80725:(e,r,t)=>{t.a(e,async(e,a)=>{try{t.r(r),t.d(r,{GET:()=>u});var s=t(71309),o=t(64985),n=t(67390),i=t.n(n),l=e([o]);async function u(e){try{let r,t;let a=e.headers.get("authorization"),n=null;if(a&&a.startsWith("Bearer ")&&(n=a.substring(7)),!n)return s.NextResponse.json({error:"Токен не предоставлен"},{status:401});try{r=i().verify(n,process.env.JWT_SECRET||process.env.NEXTAUTH_SECRET||"fallback_secret")}catch(e){return s.NextResponse.json({error:"Недействительный токен"},{status:401})}if(r.isDemoMode)return console.log("\uD83D\uDCCA Dashboard API: DEMO mode for user:",r.email),s.NextResponse.json({success:!0,isDemoMode:!0,user:{id:r.userId,email:r.email,name:"super_admin"===r.role?"Создатель Системы":"admin"===r.role?"Администратор Демо":"Пользователь Демо",full_name:"super_admin"===r.role?"Создатель Системы":"admin"===r.role?"Администратор Демо":"Пользователь Демо",balance:"admin"===r.role?5e4:"user"===r.role?1e4:0,totalInvested:"admin"===r.role?25e3:"user"===r.role?5e3:0,total_invested:"admin"===r.role?25e3:"user"===r.role?5e3:0,totalProfit:"admin"===r.role?5e3:"user"===r.role?1e3:0,total_earned:"admin"===r.role?5e3:"user"===r.role?1e3:0,activeInvestments:"admin"===r.role?3:"user"===r.role?2:0,referralCount:"admin"===r.role?10:"user"===r.role?2:0,role:r.role,isAdmin:"super_admin"===r.role||"admin"===r.role,created_at:new Date().toISOString()}});let l=`
      SELECT 
        u.id, 
        u.email, 
        u.full_name, 
        COALESCE(u.balance, 0) as balance, 
        COALESCE(u.total_invested, 0) as total_invested, 
        COALESCE(u.total_earned, 0) as total_earned, 
        u.role_id,
        u.created_at,
        COALESCE(inv_stats.active_investments, 0) as active_investments,
        COALESCE(inv_stats.total_profit, 0) as total_profit,
        COALESCE(ref_stats.referral_count, 0) as referral_count
      FROM users u
      LEFT JOIN (
        SELECT 
          user_id,
          COUNT(*) as active_investments,
          COALESCE(SUM(total_profit), 0) as total_profit
        FROM investments 
        WHERE status = 'active'
        GROUP BY user_id
      ) inv_stats ON u.id = inv_stats.user_id
      LEFT JOIN (
        SELECT 
          referrer_id,
          COUNT(*) as referral_count
        FROM users 
        WHERE referrer_id IS NOT NULL
        GROUP BY referrer_id
      ) ref_stats ON u.id = ref_stats.referrer_id
      WHERE u.id = $1 AND u.is_active = true
    `;try{t=await (0,o.I)(l,[r.userId])}catch(e){return console.log("⚠️  Database unavailable in dashboard API, using DEMO mode"),s.NextResponse.json({success:!0,isDemoMode:!0,user:{id:r.userId,email:r.email,name:"super_admin"===r.role?"Создатель Системы":"admin"===r.role?"Администратор Демо":"Пользователь Демо",full_name:"super_admin"===r.role?"Создатель Системы":"admin"===r.role?"Администратор Демо":"Пользователь Демо",balance:"admin"===r.role?5e4:"user"===r.role?1e4:0,totalInvested:"admin"===r.role?25e3:"user"===r.role?5e3:0,total_invested:"admin"===r.role?25e3:"user"===r.role?5e3:0,totalProfit:"admin"===r.role?5e3:"user"===r.role?1e3:0,total_earned:"admin"===r.role?5e3:"user"===r.role?1e3:0,activeInvestments:"admin"===r.role?3:"user"===r.role?2:0,referralCount:"admin"===r.role?10:"user"===r.role?2:0,role:r.role,isAdmin:"super_admin"===r.role||"admin"===r.role,created_at:new Date().toISOString()}})}if(0===t.rows.length)return s.NextResponse.json({error:"Пользователь не найден"},{status:404});let u=t.rows[0];return s.NextResponse.json({success:!0,user:{id:u.id,email:u.email,name:u.full_name,full_name:u.full_name,balance:parseFloat(u.balance),totalInvested:parseFloat(u.total_invested),total_invested:parseFloat(u.total_invested),totalProfit:parseFloat(u.total_profit),total_earned:parseFloat(u.total_earned),activeInvestments:parseInt(u.active_investments),referralCount:parseInt(u.referral_count),role:1===u.role_id?"admin":"user",isAdmin:1===u.role_id,created_at:u.created_at}})}catch(e){return console.error("Dashboard user API error:",e),s.NextResponse.json({error:"Ошибка сервера"},{status:500})}}o=(l.then?(await l)():l)[0],a()}catch(e){a(e)}})},64985:(e,r,t)=>{t.a(e,async(e,a)=>{try{t.d(r,{I:()=>n,d:()=>l});var s=t(8678),o=e([s]);s=(o.then?(await o)():o)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let l=new s.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function n(e,r){let t=await l.connect();try{return await t.query(e,r)}finally{t.release()}}a()}catch(e){a(e)}})}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[7787,4833,7390],()=>t(85818));module.exports=a})();