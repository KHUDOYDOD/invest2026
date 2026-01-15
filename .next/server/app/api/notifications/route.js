"use strict";(()=>{var e={};e.id=1996,e.ids=[1996],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},66421:(e,t,s)=>{s.a(e,async(e,r)=>{try{s.r(t),s.d(t,{originalPathname:()=>E,patchFetch:()=>c,requestAsyncStorage:()=>p,routeModule:()=>d,serverHooks:()=>R,staticGenerationAsyncStorage:()=>l});var n=s(73278),a=s(45002),o=s(54877),i=s(72233),u=e([i]);i=(u.then?(await u)():u)[0];let d=new n.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/notifications/route",pathname:"/api/notifications",filename:"route",bundlePath:"app/api/notifications/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\notifications\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:p,staticGenerationAsyncStorage:l,serverHooks:R}=d,E="/api/notifications/route";function c(){return(0,o.patchFetch)({serverHooks:R,staticGenerationAsyncStorage:l})}r()}catch(e){r(e)}})},72233:(e,t,s)=>{s.a(e,async(e,r)=>{try{s.r(t),s.d(t,{DELETE:()=>d,GET:()=>i,PATCH:()=>c,POST:()=>u});var n=s(71309),a=s(44819),o=e([a]);async function i(e){try{let t=e.headers.get("x-user-id");if(!t)return n.NextResponse.json({error:"Не авторизован"},{status:401});let{searchParams:s}=new URL(e.url),r=s.get("type"),a=parseInt(s.get("limit")||"50"),o=`
      SELECT 
        id,
        type,
        title,
        message,
        icon,
        color,
        is_read,
        action_url,
        metadata,
        created_at,
        read_at
      FROM notifications
      WHERE user_id = $1::integer
    `,i=[t];"unread"===r?o+=" AND is_read = false":"transactions"===r?o+=" AND type IN ('success', 'bonus')":"system"===r&&(o+=" AND type = 'system'"),o+=" ORDER BY created_at DESC LIMIT $2",i.push(a);let u=await o(o,i),c=await o(`SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_read = false) as unread,
        COUNT(*) FILTER (WHERE is_read = true) as read
      FROM notifications
      WHERE user_id = $1::integer`,[t]);return n.NextResponse.json({success:!0,notifications:u.rows,stats:c.rows[0]})}catch(e){return console.error("Error fetching notifications:",e),n.NextResponse.json({error:"Ошибка при получении уведомлений"},{status:500})}}async function u(e){try{let{userId:t,type:s,title:r,message:o,icon:i,color:u,actionUrl:c,metadata:d}=await e.json();if(!t||!s||!r||!o)return n.NextResponse.json({error:"userId, type, title и message обязательны"},{status:400});let p=await (0,a.I)(`INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        icon,
        color,
        action_url,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,[t,s,r,o,i,u,c,JSON.stringify(d||{})]);return n.NextResponse.json({success:!0,message:"Уведомление создано",data:p.rows[0]})}catch(e){return console.error("Error creating notification:",e),n.NextResponse.json({error:"Ошибка при создании уведомления"},{status:500})}}async function c(e){try{let t=e.headers.get("x-user-id");if(!t)return n.NextResponse.json({error:"Не авторизован"},{status:401});let{notificationId:s,markAllAsRead:r}=await e.json();if(r)return await (0,a.I)(`UPDATE notifications
        SET is_read = true, read_at = NOW()
        WHERE user_id = $1::integer AND is_read = false`,[t]),n.NextResponse.json({success:!0,message:"Все уведомления отмечены как прочитанные"});if(!s)return n.NextResponse.json({error:"ID уведомления обязателен"},{status:400});let o=await (0,a.I)(`UPDATE notifications
      SET is_read = true, read_at = NOW()
      WHERE id = $1 AND user_id = $2::integer
      RETURNING *`,[s,t]);if(0===o.rows.length)return n.NextResponse.json({error:"Уведомление не найдено"},{status:404});return n.NextResponse.json({success:!0,message:"Уведомление отмечено как прочитанное",data:o.rows[0]})}catch(e){return console.error("Error updating notification:",e),n.NextResponse.json({error:"Ошибка при обновлении уведомления"},{status:500})}}async function d(e){try{let t=e.headers.get("x-user-id");if(!t)return n.NextResponse.json({error:"Не авторизован"},{status:401});let{searchParams:s}=new URL(e.url),r=s.get("id");if("true"===s.get("all"))return await (0,a.I)("DELETE FROM notifications WHERE user_id = $1::integer",[t]),n.NextResponse.json({success:!0,message:"Все уведомления удалены"});if(!r)return n.NextResponse.json({error:"ID уведомления обязателен"},{status:400});let o=await (0,a.I)("DELETE FROM notifications WHERE id = $1 AND user_id = $2::integer RETURNING id",[r,t]);if(0===o.rows.length)return n.NextResponse.json({error:"Уведомление не найдено"},{status:404});return n.NextResponse.json({success:!0,message:"Уведомление удалено"})}catch(e){return console.error("Error deleting notification:",e),n.NextResponse.json({error:"Ошибка при удалении уведомления"},{status:500})}}a=(o.then?(await o)():o)[0],r()}catch(e){r(e)}})},44819:(e,t,s)=>{s.a(e,async(e,r)=>{try{s.d(t,{I:()=>o});var n=s(8678),a=e([n]);n=(a.then?(await a)():a)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let u=new n.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function o(e,t){let s=await u.connect();try{return await s.query(e,t)}finally{s.release()}}r()}catch(e){r(e)}})}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[7787,4833],()=>s(66421));module.exports=r})();