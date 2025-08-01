import { NextRequest, NextResponse } from 'next/server';
import { GiftService } from '@/lib/redis-gift';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'edge';

interface SelectGiftRequest {
  gift: {
    id: string;
    name: string;
    category: string;
    price?: number;
    image?: string;
    url?: string;
    affinityScore?: number;
  };
  selectedFor: {
    id: string;
    name: string;
  };
  occasion?: string;
  notes?: string;
  qlooSources?: {
    signals: string[];
    explainability?: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get current user from Clerk
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json() as SelectGiftRequest;

    // Check if gift is already selected for this recipient
    const alreadySelected = await GiftService.isGiftAlreadySelected(
      data.gift.id,
      data.selectedFor.id
    );

    if (alreadySelected) {
      return NextResponse.json(
        { error: 'This gift has already been selected for this recipient' },
        { status: 400 }
      );
    }

    // Store the gift selection
    const storedGift = await GiftService.storeGift({
      gift: data.gift,
      selectedBy: {
        id: userId,
        name: userId, // TODO: Get user name from Clerk user metadata
      },
      selectedFor: data.selectedFor,
      occasion: data.occasion,
      notes: data.notes,
      qlooSources: data.qlooSources,
    });

    return NextResponse.json({
      success: true,
      gift: storedGift,
    });
  } catch (error) {
    console.error('Gift selection error:', error);
    return NextResponse.json(
      { error: 'Failed to select gift' },
      { status: 500 }
    );
  }
}

// Get selected gifts
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const recipientId = searchParams.get('recipientId');
    const giverId = searchParams.get('giverId');

    let gifts;
    
    if (filter === 'my-selections') {
      gifts = await GiftService.getGiftsByGiver(userId);
    } else if (recipientId) {
      gifts = await GiftService.getGiftsByRecipient(recipientId);
    } else if (giverId) {
      gifts = await GiftService.getGiftsByGiver(giverId);
    } else {
      gifts = await GiftService.getAllGifts();
    }

    // Sort by most recent first
    gifts.sort((a, b) => new Date(b.selectedAt).getTime() - new Date(a.selectedAt).getTime());

    return NextResponse.json({
      gifts,
      stats: await GiftService.getGiftStats(),
    });
  } catch (error) {
    console.error('Get gifts error:', error);
    return NextResponse.json(
      { error: 'Failed to get gifts' },
      { status: 500 }
    );
  }
}