"use strict";(()=>{var e={};e.id=7217,e.ids=[7217],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},38352:(e,s,r)=>{r.a(e,async(e,t)=>{try{r.r(s),r.d(s,{originalPathname:()=>m,patchFetch:()=>c,requestAsyncStorage:()=>p,routeModule:()=>l,serverHooks:()=>R,staticGenerationAsyncStorage:()=>d});var a=r(73278),n=r(45002),o=r(54877),i=r(15833),u=e([i]);i=(u.then?(await u)():u)[0];let l=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/messages/route",pathname:"/api/messages",filename:"route",bundlePath:"app/api/messages/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\messages\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:p,staticGenerationAsyncStorage:d,serverHooks:R}=l,m="/api/messages/route";function c(){return(0,o.patchFetch)({serverHooks:R,staticGenerationAsyncStorage:d})}t()}catch(e){t(e)}})},15833:(e,s,r)=>{r.a(e,async(e,t)=>{try{r.r(s),r.d(s,{DELETE:()=>l,GET:()=>i,PATCH:()=>c,POST:()=>u});var a=r(71309),n=r(44819),o=e([n]);async function i(e){try{let s=e.headers.get("x-user-id");if(!s)return a.NextResponse.json({error:"Не авторизован"},{status:401});let r=await (0,n.I)(`SELECT 
        id,
        subject,
        message,
        status,
        priority,
        from_user,
        from_email,
        admin_reply,
        is_read,
        created_at,
        replied_at
      FROM messages
      WHERE user_id = $1::integer
      ORDER BY created_at DESC`,[s]);return a.NextResponse.json({success:!0,messages:r.rows})}catch(e){return console.error("Error fetching messages:",e),a.NextResponse.json({error:"Ошибка при получении сообщений"},{status:500})}}async function u(e){try{let s=e.headers.get("x-user-id");if(!s)return a.NextResponse.json({error:"Не авторизован"},{status:401});let{subject:r,message:t,priority:o="medium"}=await e.json();if(!r||!t)return a.NextResponse.json({error:"Тема и сообщение обязательны"},{status:400});let i=await (0,n.I)("SELECT full_name, email FROM users WHERE id = $1::integer",[s]);if(0===i.rows.length)return a.NextResponse.json({error:"Пользователь не найден"},{status:404});let u=i.rows[0],c=await (0,n.I)(`INSERT INTO messages (
        user_id,
        subject,
        message,
        priority,
        from_user,
        from_email,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'new')
      RETURNING *`,[s,r,t,o,u.full_name,u.email]);return await (0,n.I)(`INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        icon,
        color
      )
      SELECT 
        id,
        'info',
        'Новое сообщение от пользователя',
        $1,
        'MessageCircle',
        'from-blue-500 to-cyan-600'
      FROM users
      WHERE role_id = 1`,[`Пользователь ${u.full_name} отправил новое сообщение: ${r}`]),a.NextResponse.json({success:!0,message:"Сообщение успешно отправлено",data:c.rows[0]})}catch(e){return console.error("Error creating message:",e),a.NextResponse.json({error:"Ошибка при отправке сообщения"},{status:500})}}async function c(e){try{let s=e.headers.get("x-user-id");if(!s)return a.NextResponse.json({error:"Не авторизован"},{status:401});let{messageId:r,isRead:t}=await e.json();if(!r)return a.NextResponse.json({error:"ID сообщения обязателен"},{status:400});let o=await (0,n.I)(`UPDATE messages
      SET is_read = $1, updated_at = NOW()
      WHERE id = $2 AND user_id = $3::integer
      RETURNING *`,[t,r,s]);if(0===o.rows.length)return a.NextResponse.json({error:"Сообщение не найдено"},{status:404});return a.NextResponse.json({success:!0,message:"Статус сообщения обновлен",data:o.rows[0]})}catch(e){return console.error("Error updating message:",e),a.NextResponse.json({error:"Ошибка при обновлении сообщения"},{status:500})}}async function l(e){try{let s=e.headers.get("x-user-id");if(!s)return a.NextResponse.json({error:"Не авторизован"},{status:401});let{searchParams:r}=new URL(e.url),t=r.get("id");if(!t)return a.NextResponse.json({error:"ID сообщения обязателен"},{status:400});let o=await (0,n.I)("DELETE FROM messages WHERE id = $1 AND user_id = $2::integer RETURNING id",[t,s]);if(0===o.rows.length)return a.NextResponse.json({error:"Сообщение не найдено"},{status:404});return a.NextResponse.json({success:!0,message:"Сообщение успешно удалено"})}catch(e){return console.error("Error deleting message:",e),a.NextResponse.json({error:"Ошибка при удалении сообщения"},{status:500})}}n=(o.then?(await o)():o)[0],t()}catch(e){t(e)}})},44819:(e,s,r)=>{r.a(e,async(e,t)=>{try{r.d(s,{I:()=>o});var a=r(8678),n=e([a]);a=(n.then?(await n)():n)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let u=new a.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function o(e,s){let r=await u.connect();try{return await r.query(e,s)}finally{r.release()}}t()}catch(e){t(e)}})}};var s=require("../../../webpack-runtime.js");s.C(e);var r=e=>s(s.s=e),t=s.X(0,[7787,4833],()=>r(38352));module.exports=t})();