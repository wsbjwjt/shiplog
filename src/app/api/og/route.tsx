import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const title = searchParams.get('title') || 'ShipLog'
    const product = searchParams.get('product') || 'Product'

    return new ImageResponse(
      (
        <div
          style={{
            background: '#0d1117',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#58a6ff',
                marginBottom: '16px',
              }}
            >
              ShipLog
            </div>
            <div
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {product}
            </div>
            <div
              style={{
                fontSize: '36px',
                color: '#8b949e',
                textAlign: 'center',
                marginTop: '16px',
              }}
            >
              {title}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error('Error generating OG image:', e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
