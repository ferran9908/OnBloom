import { redis } from './redis';
import { nanoid } from 'nanoid';

// Gift storage types
export interface StoredGift {
  id: string; // Unique gift selection ID
  giftId: string; // Qloo entity ID
  giftName: string;
  giftCategory: string;
  giftPrice?: number;
  giftImage?: string;
  giftUrl?: string;
  affinityScore?: number;
  
  // Selection metadata
  selectedBy: string; // Employee ID who selected
  selectedByName: string; // Employee name for display
  selectedFor: string; // Recipient employee ID
  selectedForName: string; // Recipient name for display
  selectedAt: string; // ISO timestamp
  occasion?: string;
  notes?: string;
  
  // Qloo metadata
  qlooSources?: {
    signals: string[];
    explainability?: any;
  };
  
  // Status
  status: 'TBD' | 'Accepted' | 'Denied' | 'purchased' | 'delivered';
  statusUpdatedAt?: string;
  statusUpdatedBy?: string;
}

export interface GiftSelectionInput {
  gift: {
    id: string;
    name: string;
    category: string;
    price?: number;
    priceRange?: {
      min: number;
      max: number;
    };
    image?: string;
    url?: string;
    affinityScore?: number;
  };
  selectedBy: {
    id: string;
    name: string;
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

export class GiftService {
  private static TTL = 60 * 60 * 24 * 90; // 90 days TTL for gift records

  /**
   * Store a selected gift
   */
  static async storeGift(input: GiftSelectionInput): Promise<StoredGift> {
    const giftId = nanoid();
    const now = new Date().toISOString();
    const dateKey = now.split('T')[0]; // YYYY-MM-DD

    const storedGift: StoredGift = {
      id: giftId,
      giftId: input.gift.id,
      giftName: input.gift.name,
      giftCategory: input.gift.category,
      giftPrice: input.gift.price,
      giftImage: input.gift.image,
      giftUrl: input.gift.url,
      affinityScore: input.gift.affinityScore,
      selectedBy: input.selectedBy.id,
      selectedByName: input.selectedBy.name,
      selectedFor: input.selectedFor.id,
      selectedForName: input.selectedFor.name,
      selectedAt: now,
      occasion: input.occasion,
      notes: input.notes,
      qlooSources: input.qlooSources,
      status: 'TBD',
    };

    // Use Redis pipeline for atomic operations
    const pipeline = redis.pipeline();

    // Store the gift object
    pipeline.setex(
      `gift:selections:${giftId}`,
      this.TTL,
      JSON.stringify(storedGift)
    );

    // Add to giver's gift set
    pipeline.sadd(`gift:by-giver:${input.selectedBy.id}`, giftId);
    pipeline.expire(`gift:by-giver:${input.selectedBy.id}`, this.TTL);

    // Add to recipient's gift set
    pipeline.sadd(`gift:by-recipient:${input.selectedFor.id}`, giftId);
    pipeline.expire(`gift:by-recipient:${input.selectedFor.id}`, this.TTL);

    // Add to date-based set
    pipeline.sadd(`gift:by-date:${dateKey}`, giftId);
    pipeline.expire(`gift:by-date:${dateKey}`, this.TTL);

    // Add to all gifts set
    pipeline.sadd('gift:all', giftId);
    pipeline.expire('gift:all', this.TTL);

    await pipeline.exec();

    return storedGift;
  }

  /**
   * Get a gift by ID
   */
  static async getGift(giftId: string): Promise<StoredGift | null> {
    const giftData = await redis.get(`gift:selections:${giftId}`);
    if (!giftData) return null;
    return JSON.parse(giftData);
  }

  /**
   * Get all gifts
   */
  static async getAllGifts(): Promise<StoredGift[]> {
    const giftIds = await redis.smembers('gift:all');
    if (!giftIds || giftIds.length === 0) return [];

    const pipeline = redis.pipeline();
    giftIds.forEach(id => {
      pipeline.get(`gift:selections:${id}`);
    });

    const results = await pipeline.exec();
    
    return results
      .map(([err, data]) => {
        if (err || !data) return null;
        return JSON.parse(data as string);
      })
      .filter(Boolean) as StoredGift[];
  }

  /**
   * Get gifts by giver
   */
  static async getGiftsByGiver(giverId: string): Promise<StoredGift[]> {
    const giftIds = await redis.smembers(`gift:by-giver:${giverId}`);
    if (!giftIds || giftIds.length === 0) return [];

    const pipeline = redis.pipeline();
    giftIds.forEach(id => {
      pipeline.get(`gift:selections:${id}`);
    });

    const results = await pipeline.exec();
    
    return results
      .map(([err, data]) => {
        if (err || !data) return null;
        return JSON.parse(data as string);
      })
      .filter(Boolean) as StoredGift[];
  }

  /**
   * Get gifts by recipient
   */
  static async getGiftsByRecipient(recipientId: string): Promise<StoredGift[]> {
    const giftIds = await redis.smembers(`gift:by-recipient:${recipientId}`);
    if (!giftIds || giftIds.length === 0) return [];

    const pipeline = redis.pipeline();
    giftIds.forEach(id => {
      pipeline.get(`gift:selections:${id}`);
    });

    const results = await pipeline.exec();
    
    return results
      .map(([err, data]) => {
        if (err || !data) return null;
        return JSON.parse(data as string);
      })
      .filter(Boolean) as StoredGift[];
  }

  /**
   * Get gifts by date
   */
  static async getGiftsByDate(date: string): Promise<StoredGift[]> {
    const giftIds = await redis.smembers(`gift:by-date:${date}`);
    if (!giftIds || giftIds.length === 0) return [];

    const pipeline = redis.pipeline();
    giftIds.forEach(id => {
      pipeline.get(`gift:selections:${id}`);
    });

    const results = await pipeline.exec();
    
    return results
      .map(([err, data]) => {
        if (err || !data) return null;
        return JSON.parse(data as string);
      })
      .filter(Boolean) as StoredGift[];
  }

  /**
   * Update gift status
   */
  static async updateGiftStatus(
    giftId: string, 
    status: 'TBD' | 'Accepted' | 'Denied' | 'purchased' | 'delivered',
    updatedBy?: string
  ): Promise<StoredGift | null> {
    const gift = await this.getGift(giftId);
    if (!gift) return null;

    gift.status = status;
    gift.statusUpdatedAt = new Date().toISOString();
    if (updatedBy) {
      gift.statusUpdatedBy = updatedBy;
    }
    
    await redis.setex(
      `gift:selections:${giftId}`,
      this.TTL,
      JSON.stringify(gift)
    );

    return gift;
  }

  /**
   * Check if a gift has already been selected for a recipient
   */
  static async isGiftAlreadySelected(
    giftId: string, 
    recipientId: string
  ): Promise<boolean> {
    const recipientGifts = await this.getGiftsByRecipient(recipientId);
    return recipientGifts.some(gift => gift.giftId === giftId);
  }

  /**
   * Get gift statistics
   */
  static async getGiftStats(): Promise<{
    totalGifts: number;
    selectedCount: number;
    purchasedCount: number;
    deliveredCount: number;
  }> {
    const allGifts = await this.getAllGifts();
    
    return {
      totalGifts: allGifts.length,
      selectedCount: allGifts.filter(g => g.status === 'selected').length,
      purchasedCount: allGifts.filter(g => g.status === 'purchased').length,
      deliveredCount: allGifts.filter(g => g.status === 'delivered').length,
    };
  }

  /**
   * Search gifts by various criteria
   */
  static async searchGifts(criteria: {
    giverId?: string;
    recipientId?: string;
    startDate?: string;
    endDate?: string;
    status?: 'selected' | 'purchased' | 'delivered';
    occasion?: string;
  }): Promise<StoredGift[]> {
    let gifts: StoredGift[] = [];

    // Start with the most specific criteria
    if (criteria.giverId) {
      gifts = await this.getGiftsByGiver(criteria.giverId);
    } else if (criteria.recipientId) {
      gifts = await this.getGiftsByRecipient(criteria.recipientId);
    } else {
      gifts = await this.getAllGifts();
    }

    // Apply additional filters
    return gifts.filter(gift => {
      if (criteria.recipientId && gift.selectedFor !== criteria.recipientId) {
        return false;
      }
      if (criteria.giverId && gift.selectedBy !== criteria.giverId) {
        return false;
      }
      if (criteria.status && gift.status !== criteria.status) {
        return false;
      }
      if (criteria.occasion && gift.occasion !== criteria.occasion) {
        return false;
      }
      if (criteria.startDate && gift.selectedAt < criteria.startDate) {
        return false;
      }
      if (criteria.endDate && gift.selectedAt > criteria.endDate) {
        return false;
      }
      return true;
    });
  }
}