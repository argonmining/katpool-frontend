import { NextResponse } from 'next/server'
import { $fetch } from 'ofetch'

export const revalidate = 10;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const wallet = searchParams.get('wallet')

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet parameter is required' },
        { status: 400 }
      )
    }

    const response = await $fetch(`http://kas.katpool.xyz:8080/api/v1/query`, {
      query: {
        query: `miner_balances{wallet="${wallet}"}`,
      },
      retry: 3,
      retryDelay: 1000,
      timeout: 10000,
      next: { revalidate: 10 }
    })

    if (!response || !response.data || !response.data.result || !response.data.result[0]?.value) {
      throw new Error('Invalid response format')
    }

    // Extract the balance value and convert it from 8 decimal places
    const rawBalance = response.data.result[0].value[1]
    // Convert to string, divide by 10^8 while avoiding floating point issues
    const balance = Number(BigInt(rawBalance)) / (10 ** 8)

    return NextResponse.json({
      status: 'success',
      data: {
        balance: balance.toString()
      }
    })

  } catch (error) {
    console.error('Error fetching miner balance:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch miner balance' },
      { status: 500 }
    )
  }
} 