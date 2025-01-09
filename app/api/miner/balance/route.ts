import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const revalidate = 10

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const wallet = searchParams.get('wallet')

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    const url = new URL('http://kas.katpool.xyz:8080/api/v1/query')
    url.searchParams.append('query', `miner_balances{wallet="${wallet}"}`)

    const response = await fetch(url, {
      next: { revalidate: 10 }
    })

    if (!response.ok) {
      console.error('Pool API error:', {
        status: response.status,
        statusText: response.statusText,
        url: url.toString()
      })
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error: unknown) {
    console.error('Error in miner balance API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner balance' },
      { status: 500 }
    )
  }
} 