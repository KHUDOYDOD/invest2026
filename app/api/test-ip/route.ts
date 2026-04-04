import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const host = request.headers.get('host') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const forwarded = request.headers.get('x-forwarded-for') || 'none'
  
  return NextResponse.json({
    success: true,
    message: 'IP доступ работает корректно!',
    timestamp: new Date().toISOString(),
    request_info: {
      host: host,
      url: url.toString(),
      user_agent: userAgent,
      forwarded_for: forwarded,
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port
    },
    server_info: {
      node_version: process.version,
      platform: process.platform,
      uptime: process.uptime()
    }
  })
}