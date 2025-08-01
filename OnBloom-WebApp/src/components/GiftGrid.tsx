"use client"

import React from 'react'
import { GiftCard } from './GiftCard'
import { Skeleton } from '@/components/ui/skeleton'

interface Gift {
  id: string
  name: string
  category: string
  price?: number
  priceRange?: string
  image?: string
  url?: string
  affinityScore?: number
  popularity?: number
  type: 'brand' | 'place' | 'product'
  suggestedGifts?: string[]
  explainability?: {
    signals?: Array<{
      type: string
      value: string
      weight: number
    }>
  }
}

interface GiftGridProps {
  gifts: Gift[]
  onSelectGift?: (gift: Gift & { occasion?: string; notes?: string }) => void
  onSendForApproval?: (gift: Gift & { occasion?: string; notes?: string }) => void
  recipientName?: string
  selectedGiftIds?: string[]
  isLoading?: boolean
  showApprovalButtons?: boolean
}

export function GiftGrid({ 
  gifts, 
  onSelectGift, 
  onSendForApproval,
  recipientName, 
  selectedGiftIds = [],
  isLoading = false,
  showApprovalButtons = false 
}: GiftGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-[320px]">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full mb-3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (gifts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No gift recommendations available yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try describing the recipient and occasion to get personalized suggestions.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {gifts.map((gift) => (
        <GiftCard
          key={gift.id}
          {...gift}
          onSelect={onSelectGift ? (giftData) => onSelectGift({ ...gift, ...giftData }) : undefined}
          onSendForApproval={onSendForApproval ? (giftData) => onSendForApproval({ ...gift, ...giftData }) : undefined}
          recipientName={recipientName}
          isSelected={selectedGiftIds.includes(gift.id)}
          showApprovalButton={showApprovalButtons}
        />
      ))}
    </div>
  )
}

// Fix missing imports
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'