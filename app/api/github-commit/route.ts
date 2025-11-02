// app/api/github-commit/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Fetching GitHub commit info...')
    
    const response = await fetch('https://api.github.com/repos/chocomintw/asd-panel/commits/main', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ASD-Panel-App'
      },
      // Add timeout
      signal: AbortSignal.timeout(10000)
    })
    
    console.log('GitHub API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      
      // Return specific error based on status code
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded' },
          { status: 429 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { error: 'Repository not found' },
          { status: 404 }
        )
      } else {
        return NextResponse.json(
          { error: `GitHub API error: ${response.status} ${response.statusText}` },
          { status: response.status }
        )
      }
    }
    
    const commitData = await response.json()
    console.log('Successfully fetched commit data')
    
    return NextResponse.json(commitData)
    
  } catch (error: any) {
    console.error('GitHub API fetch error:', error)
    
    if (error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Request timeout - GitHub API is slow to respond' },
        { status: 408 }
      )
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Network error - unable to reach GitHub API' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}