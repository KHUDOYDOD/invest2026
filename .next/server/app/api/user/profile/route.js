"use strict";(()=>{var e={};e.id=3744,e.ids=[3744],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},43799:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>f,patchFetch:()=>E,requestAsyncStorage:()=>p,routeModule:()=>d,serverHooks:()=>_,staticGenerationAsyncStorage:()=>c});var a={};t.r(a),t.d(a,{GET:()=>i,PUT:()=>u});var o=t(73278),n=t(45002),l=t(54877),s=t(71309);async function i(e){try{let{searchParams:r}=new URL(e.url),t=r.get("id");if(!t)return s.NextResponse.json({error:"User ID is required"},{status:400});{let e=await client.query(`SELECT 
          id,
          email,
          full_name,
          COALESCE(balance, 0) as balance,
          COALESCE(total_invested, 0) as total_invested,
          COALESCE(total_earned, 0) as total_earned,
          role,
          created_at,
          phone,
          country,
          city,
          profile_image,
          referral_code,
          last_login,
          status,
          (SELECT COUNT(*) FROM referrals WHERE referrer_id = $1) as referral_count
        FROM users
        WHERE id = $1`,[t]);if(0===e.rows.length)return s.NextResponse.json({error:"User not found"},{status:404});let r=e.rows[0];return s.NextResponse.json({user:{id:r.id,email:r.email,full_name:r.full_name,balance:parseFloat(r.balance),total_invested:parseFloat(r.total_invested),total_earned:parseFloat(r.total_earned),role:r.role,created_at:r.created_at,phone:r.phone,country:r.country,city:r.city,bio:null,avatar_url:r.profile_image,referral_code:r.referral_code,referral_count:parseInt(r.referral_count)||0,last_login:r.last_login,status:r.status}})}}catch(e){return console.error("Profile API error:",e),s.NextResponse.json({error:"Failed to load profile"},{status:500})}}async function u(e){try{let{userId:r,full_name:t,phone:a,country:o,city:n,bio:l,occupation:i}=await e.json();if(!r)return s.NextResponse.json({error:"User ID is required"},{status:400});{let e=await client.query(`UPDATE users 
        SET 
          full_name = COALESCE($1, full_name),
          phone = COALESCE($2, phone),
          country = COALESCE($3, country),
          city = COALESCE($4, city),
          updated_at = NOW()
        WHERE id = $5
        RETURNING 
          id,
          email,
          full_name,
          COALESCE(balance, 0) as balance,
          COALESCE(total_invested, 0) as total_invested,
          COALESCE(total_earned, 0) as total_earned,
          role,
          created_at,
          phone,
          country,
          city,
          profile_image,
          referral_code,
          (SELECT COUNT(*) FROM referrals WHERE referrer_id = $5) as referral_count`,[t,a,o,n,r]);if(0===e.rows.length)return s.NextResponse.json({error:"User not found"},{status:404});let l=e.rows[0];return s.NextResponse.json({user:{id:l.id,email:l.email,full_name:l.full_name,balance:parseFloat(l.balance),total_invested:parseFloat(l.total_invested),total_earned:parseFloat(l.total_earned),role:l.role,created_at:l.created_at,phone:l.phone,country:l.country,city:l.city,bio:null,avatar_url:l.profile_image,referral_code:l.referral_code,referral_count:parseInt(l.referral_count)||0}})}}catch(e){return console.error("Profile update error:",e),s.NextResponse.json({error:"Failed to update profile"},{status:500})}}let d=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/user/profile/route",pathname:"/api/user/profile",filename:"route",bundlePath:"app/api/user/profile/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\user\\profile\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:p,staticGenerationAsyncStorage:c,serverHooks:_}=d,f="/api/user/profile/route";function E(){return(0,l.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:c})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[7787,4833],()=>t(43799));module.exports=a})();