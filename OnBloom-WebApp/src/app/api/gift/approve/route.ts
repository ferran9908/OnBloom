import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GiftService } from '@/lib/redis-gift';

export const runtime = 'edge';

interface ApprovalRequest {
  giftId: string;
  giftName: string;
  giftCategory: string;
  giftPrice?: number;
  giftPriceRange?: {
    min: number;
    max: number;
  };
  selectedFor: {
    id: string;
    name: string;
  };
  occasion?: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json() as ApprovalRequest;
    
    // Get user info (in a real app, you'd fetch this from your user service)
    const userName = 'Current User'; // Replace with actual user name

    // Store the gift with TBD status
    const storedGift = await GiftService.storeGift({
      gift: {
        id: body.giftId,
        name: body.giftName,
        category: body.giftCategory,
        price: body.giftPrice,
        priceRange: body.giftPriceRange,
        affinityScore: undefined, // Will be set if available
      },
      selectedBy: {
        id: userId,
        name: userName,
      },
      selectedFor: body.selectedFor,
      occasion: body.occasion,
      notes: body.notes,
    });

    console.log('Gift sent for approval:', {
      giftId: storedGift.id,
      giftName: body.giftName,
      status: storedGift.status,
      selectedFor: body.selectedFor.name,
    });

    return NextResponse.json({
      success: true,
      giftId: storedGift.id,
      status: storedGift.status,
      message: `${body.giftName} has been sent for approval`,
    });
  } catch (error) {
    console.error('Approval API error:', error);
    return NextResponse.json(
      { error: 'Failed to send gift for approval' },
      { status: 500 }
    );
  }
}

// Update gift status (for approval/denial)
export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { giftId, status } = await request.json() as {
      giftId: string;
      status: 'Accepted' | 'Denied';
    };

    if (!giftId || !status) {
      return NextResponse.json(
        { error: 'Gift ID and status are required' },
        { status: 400 }
      );
    }

    const updatedGift = await GiftService.updateGiftStatus(giftId, status, userId);
    
    if (!updatedGift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      );
    }

    console.log('Gift status updated:', {
      giftId: updatedGift.id,
      giftName: updatedGift.giftName,
      newStatus: status,
      updatedBy: userId,
    });

    return NextResponse.json({
      success: true,
      gift: updatedGift,
      message: `Gift has been ${status.toLowerCase()}`,
    });
  } catch (error) {
    console.error('Status update API error:', error);
    return NextResponse.json(
      { error: 'Failed to update gift status' },
      { status: 500 }
    );
  }
}