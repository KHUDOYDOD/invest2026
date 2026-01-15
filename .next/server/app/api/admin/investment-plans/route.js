"use strict";(()=>{var e={};e.id=8819,e.ids=[8819],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},78024:(e,t,n)=>{n.a(e,async(e,s)=>{try{n.r(t),n.d(t,{originalPathname:()=>E,patchFetch:()=>p,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d});var r=n(73278),a=n(45002),o=n(54877),i=n(103),u=e([i]);i=(u.then?(await u)():u)[0];let c=new r.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/admin/investment-plans/route",pathname:"/api/admin/investment-plans",filename:"route",bundlePath:"app/api/admin/investment-plans/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\admin\\investment-plans\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:l,staticGenerationAsyncStorage:d,serverHooks:m}=c,E="/api/admin/investment-plans/route";function p(){return(0,o.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}s()}catch(e){s(e)}})},103:(e,t,n)=>{n.a(e,async(e,s)=>{try{n.r(t),n.d(t,{DELETE:()=>c,GET:()=>i,POST:()=>u,PUT:()=>p});var r=n(71309),a=n(44819),o=e([a]);async function i(e){try{let e=await (0,a.I)(`
      SELECT 
        id,
        name,
        description,
        min_amount,
        max_amount,
        daily_profit,
        duration_days,
        payout_interval_hours,
        is_active,
        created_at,
        updated_at
      FROM investment_plans
      ORDER BY min_amount ASC
    `);return r.NextResponse.json({success:!0,plans:e.rows})}catch(e){return console.error("Error fetching investment plans:",e),r.NextResponse.json({error:"Ошибка при получении планов"},{status:500})}}async function u(e){try{let{name:t,description:n,min_amount:s,max_amount:o,daily_profit:i,duration_days:u,payout_interval_hours:p,is_active:c}=await e.json();if(!t||!s||!o||!i||!u)return r.NextResponse.json({error:"Все обязательные поля должны быть заполнены"},{status:400});let l=await (0,a.I)(`INSERT INTO investment_plans 
        (name, description, min_amount, max_amount, daily_profit, duration_days, payout_interval_hours, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,[t,n,s,o,i,u,p??24,c??!0]);return r.NextResponse.json({success:!0,message:"План успешно создан",plan:l.rows[0]})}catch(e){return console.error("Error creating investment plan:",e),r.NextResponse.json({error:"Ошибка при создании плана"},{status:500})}}async function p(e){try{let{id:t,name:n,description:s,min_amount:o,max_amount:i,daily_profit:u,duration_days:p,payout_interval_hours:c,is_active:l}=await e.json();if(!t)return r.NextResponse.json({error:"ID плана обязателен"},{status:400});let d=await (0,a.I)(`UPDATE investment_plans 
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        min_amount = COALESCE($3, min_amount),
        max_amount = COALESCE($4, max_amount),
        daily_profit = COALESCE($5, daily_profit),
        duration_days = COALESCE($6, duration_days),
        payout_interval_hours = COALESCE($7, payout_interval_hours),
        is_active = COALESCE($8, is_active),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *`,[n,s,o,i,u,p,c,l,t]);if(0===d.rows.length)return r.NextResponse.json({error:"План не найден"},{status:404});return r.NextResponse.json({success:!0,message:"План успешно обновлен",plan:d.rows[0]})}catch(e){return console.error("Error updating investment plan:",e),r.NextResponse.json({error:"Ошибка при обновлении плана"},{status:500})}}async function c(e){try{let{searchParams:t}=new URL(e.url),n=t.get("id");if(!n)return r.NextResponse.json({error:"ID плана обязателен"},{status:400});let s=await (0,a.I)("SELECT COUNT(*) as count FROM investments WHERE plan_id = $1 AND status = 'active'",[n]);if(parseInt(s.rows[0].count)>0)return r.NextResponse.json({error:"Невозможно удалить план с активными инвестициями. Деактивируйте план вместо удаления."},{status:400});let o=await (0,a.I)("DELETE FROM investment_plans WHERE id = $1 RETURNING id",[n]);if(0===o.rows.length)return r.NextResponse.json({error:"План не найден"},{status:404});return r.NextResponse.json({success:!0,message:"План успешно удален"})}catch(e){return console.error("Error deleting investment plan:",e),r.NextResponse.json({error:"Ошибка при удалении плана"},{status:500})}}a=(o.then?(await o)():o)[0],s()}catch(e){s(e)}})},44819:(e,t,n)=>{n.a(e,async(e,s)=>{try{n.d(t,{I:()=>o});var r=n(8678),a=e([r]);r=(a.then?(await a)():a)[0];let i=process.env.POSTGRES_URL_NON_POOLING||process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!i)throw Error("DATABASE_URL, POSTGRES_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?");let u=new r.Pool({connectionString:i,ssl:!!i?.includes("sslmode=require")&&{rejectUnauthorized:!1}});async function o(e,t){let n=await u.connect();try{return await n.query(e,t)}finally{n.release()}}s()}catch(e){s(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),s=t.X(0,[7787,4833],()=>n(78024));module.exports=s})();