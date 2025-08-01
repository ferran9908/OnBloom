import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GiftService } from '@/lib/redis-gift';

export const runtime = 'edge';

interface ListRequest {
  status?: string;
  giverId?: string;
  recipientId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const giverId = searchParams.get('giverId') || undefined;
    const recipientId = searchParams.get('recipientId') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get gifts based on filters
    let gifts = await GiftService.searchGifts({
      giverId,
      recipientId,
      startDate,
      endDate,
      status: status as any,
    });

    // Sort by most recent first
    gifts.sort((a, b) => 
      new Date(b.selectedAt).getTime() - new Date(a.selectedAt).getTime()
    );

    // Calculate pagination
    const totalCount = gifts.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGifts = gifts.slice(startIndex, endIndex);

    // Get statistics
    const stats = {
      total: totalCount,
      pending: gifts.filter(g => g.status === 'TBD').length,
      accepted: gifts.filter(g => g.status === 'Accepted').length,
      denied: gifts.filter(g => g.status === 'Denied').length,
      purchased: gifts.filter(g => g.status === 'purchased').length,
      delivered: gifts.filter(g => g.status === 'delivered').length,
    };

    return NextResponse.json({
      gifts: paginatedGifts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      stats,
    });
  } catch (error) {
    console.error('Gift list API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gifts' },
      { status: 500 }
    );
  }
}