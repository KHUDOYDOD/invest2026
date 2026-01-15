"use strict";(()=>{var e={};e.id=4007,e.ids=[4007],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},76162:e=>{e.exports=require("stream")},21764:e=>{e.exports=require("util")},12871:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>_,patchFetch:()=>h,requestAsyncStorage:()=>m,routeModule:()=>p,serverHooks:()=>w,staticGenerationAsyncStorage:()=>c});var a={};t.r(a),t.d(a,{GET:()=>l});var s=t(73278),i=t(45002),n=t(54877),u=t(71309),o=t(67390),d=t.n(o);async function l(e){try{let r=e.headers.get("authorization");if(!r||!r.startsWith("Bearer "))return u.NextResponse.json({error:"Unauthorized"},{status:401});let t=r.substring(7),a=d().verify(t,process.env.JWT_SECRET||"your-secret-key"),s=await i("SELECT role_id FROM users WHERE id = $1",[a.userId]);if(!s.rows[0]||1!==s.rows[0].role_id)return u.NextResponse.json({error:"Access denied"},{status:403});let i=`
      SELECT 
        wr.id,
        wr.user_id,
        wr.amount::text as amount,
        wr.method,
        wr.wallet_address,
        wr.status,
        wr.admin_comment,
        wr.created_at,
        wr.processed_at,
        u.full_name,
        u.email,
        u.balance::text as balance
      FROM withdrawal_requests wr
      JOIN users u ON wr.user_id = u.id
      ORDER BY wr.created_at DESC
      LIMIT 50
    `,n=(await i(i)).rows.map(e=>({id:e.id,user_id:e.user_id,amount:parseFloat(e.amount),method:e.method,payment_details:null,wallet_address:e.wallet_address,card_number:null,phone_number:null,status:e.status,admin_comment:e.admin_comment,created_at:e.created_at,processed_at:e.processed_at,user:{id:e.user_id,full_name:e.full_name,email:e.email,balance:parseFloat(e.balance),previous_balance:null}}));return u.NextResponse.json({success:!0,requests:n})}catch(e){return console.error("Error fetching withdrawal requests:",e),u.NextResponse.json({error:"Internal server error"},{status:500})}}let p=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/admin/withdrawal-requests/simple/route",pathname:"/api/admin/withdrawal-requests/simple",filename:"route",bundlePath:"app/api/admin/withdrawal-requests/simple/route"},resolvedPagePath:"C:\\Users\\x4539\\Downloads\\Invest2025-main\\Invest2025-main\\app\\api\\admin\\withdrawal-requests\\simple\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:c,serverHooks:w}=p,_="/api/admin/withdrawal-requests/simple/route";function h(){return(0,n.patchFetch)({serverHooks:w,staticGenerationAsyncStorage:c})}}};var r=require("../../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[7787,4833,7390],()=>t(12871));module.exports=a})();