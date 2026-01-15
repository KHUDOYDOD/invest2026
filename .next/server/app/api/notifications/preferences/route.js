"use strict";(()=>{var e={};e.id=9772,e.ids=[9772],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},82108:(e,t,i)=>{i.a(e,async(e,n)=>{try{i.r(t),i.d(t,{originalPathname:()=>l,patchFetch:()=>f,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>_,staticGenerationAsyncStorage:()=>d});var r=i(73278),s=i(45002),o=i(54877),a=i(3444),c=e([a]);a=(c.then?(await c)():c)[0];let p=new r.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/notifications/preferences/route",pathname:"/api/notifications/preferences",filename:"route",bundlePath:"app/api/notifications/preferences/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\notifications\\preferences\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:u,staticGenerationAsyncStorage:d,serverHooks:_}=p,l="/api/notifications/preferences/route";function f(){return(0,o.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:d})}n()}catch(e){n(e)}})},3444:(e,t,i)=>{i.a(e,async(e,n)=>{try{i.r(t),i.d(t,{GET:()=>a,PUT:()=>c});var r=i(71309),s=i(44819),o=e([s]);async function a(e){try{let t=e.headers.get("x-user-id");if(!t)return r.NextResponse.json({error:"Не авторизован"},{status:401});let i=await (0,s.I)("SELECT * FROM notification_preferences WHERE user_id = $1::integer",[t]);return 0===i.rows.length&&(i=await (0,s.I)(`INSERT INTO notification_preferences (user_id)
        VALUES ($1::integer)
        RETURNING *`,[t])),r.NextResponse.json({success:!0,preferences:i.rows[0]})}catch(e){return console.error("Error fetching notification preferences:",e),r.NextResponse.json({error:"Ошибка при получении настроек уведомлений"},{status:500})}}async function c(e){try{let t=e.headers.get("x-user-id");if(!t)return r.NextResponse.json({error:"Не авторизован"},{status:401});let{email_notifications:i,push_notifications:n,sms_notifications:o,deposit_notifications:a,withdrawal_notifications:c,referral_notifications:f,system_notifications:p,marketing_notifications:u}=await e.json(),d=await (0,s.I)(`INSERT INTO notification_preferences (
        user_id,
        email_notifications,
        push_notifications,
        sms_notifications,
        deposit_notifications,
        withdrawal_notifications,
        referral_notifications,
        system_notifications,
        marketing_notifications
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id) 
      DO UPDATE SET
        email_notifications = EXCLUDED.email_notifications,
        push_notifications = EXCLUDED.push_notifications,
        sms_notifications = EXCLUDED.sms_notifications,
        deposit_notifications = EXCLUDED.deposit_notifications,
        withdrawal_notifications = EXCLUDED.withdrawal_notifications,
        referral_notifications = EXCLUDED.referral_notifications,
        system_notifications = EXCLUDED.system_notifications,
        marketing_notifications = EXCLUDED.marketing_notifications,
        updated_at = NOW()
      RETURNING *`,[t,i,n,o,a,c,f,p,u]);return r.NextResponse.json({success:!0,message:"Настройки уведомлений обновлены",preferences:d.rows[0]})}catch(e){return console.error("Error updating notification preferences:",e),r.NextResponse.json({error:"Ошибка при обновлении настроек уведомлений"},{status:500})}}s=(o.then?(await o)():o)[0],n()}catch(e){n(e)}})},44819:(e,t,i)=>{i.a(e,async(e,n)=>{try{i.d(t,{I:()=>o});var r=i(8678),s=e([r]);r=(s.then?(await s)():s)[0];let a=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!a)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let c=new r.Pool({connectionString:a,ssl:!!a?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function o(e,t){let i=await c.connect();try{return await i.query(e,t)}finally{i.release()}}n()}catch(e){n(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),n=t.X(0,[7787,4833],()=>i(82108));module.exports=n})();