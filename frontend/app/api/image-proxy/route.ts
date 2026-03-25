import { NextResponse } from 'next/server';

// No effect - doesn't get run through Next.js image optimizer

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    if (!imageUrl) {
        return NextResponse.json({ error: 'Missing image url' }, { status: 400 })
    }
    try {
        const allowedDomains = [(process.env.NEXT_PUBLIC_IMG_BUCKET_CDN).replace('https://', '').replace('http://', '')];
        const parsedUrl = new URL(imageUrl)
        console.log('Image proxy request for URL:', imageUrl);
        if (!allowedDomains.includes(parsedUrl.hostname)) {
            console.warn(`Blocked image proxy request to unauthorized domain: ${parsedUrl.hostname}`);
            return NextResponse.json({ error: 'Unauthorized domain' }, { status: 403 })
        }
        const response = await fetch(imageUrl)
        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
        }
        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const imageBuffer = await response.arrayBuffer()
        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400'
            }
        })
    } catch (err) {
        console.error('Image proxy error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}