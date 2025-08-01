"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gift, Star, TrendingUp, Check, ShoppingCart, Send, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface GiftCardProps {
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
  onSelect?: (giftData: {
    id: string
    name: string
    category: string
    price?: number
    priceRange?: { min: number; max: number }
    image?: string
    url?: string
    affinityScore?: number
  }) => void
  onSendForApproval?: (giftData: {
    id: string
    name: string
    category: string
    price?: number
    priceRange?: { min: number; max: number }
    occasion?: string
    notes?: string
  }) => void
  recipientName?: string
  isSelected?: boolean
  showApprovalButton?: boolean
}

const occasions = [
  { value: 'anniversary', label: 'Work Anniversary' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'farewell', label: 'Farewell' },
  { value: 'welcome', label: 'Welcome/Onboarding' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'other', label: 'Other' },
]

export function GiftCard({
  id,
  name,
  category,
  price,
  priceRange,
  image,
  url,
  affinityScore,
  popularity,
  suggestedGifts,
  explainability,
  onSelect,
  onSendForApproval,
  recipientName,
  isSelected = false,
  showApprovalButton = false,
}: GiftCardProps) {
  const [showSelectDialog, setShowSelectDialog] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [occasion, setOccasion] = useState('')
  const [notes, setNotes] = useState('')

  const handleSelect = () => {
    if (onSelect) {
      setShowSelectDialog(true)
    }
  }

  const handleSendForApproval = () => {
    setShowApprovalDialog(true)
  }

  const handleConfirmSelection = async () => {
    try {
      if (onSelect) {
        await onSelect({
          id,
          name,
          category,
          price,
          priceRange: price ? undefined : priceRange ? { min: 50, max: 200 } : undefined,
          image,
          url,
          affinityScore,
        })
      }

      setShowSelectDialog(false)
      toast.success(`${name} has been selected for ${recipientName || 'the recipient'}.`)
    } catch (error) {
      toast.error('Failed to select gift. Please try again.')
    }
  }

  const handleConfirmApproval = async () => {
    try {
      if (onSendForApproval) {
        await onSendForApproval({
          id,
          name,
          category,
          price,
          priceRange: price ? undefined : priceRange ? { min: 50, max: 200 } : undefined,
          occasion,
          notes,
        })
      }

      setShowApprovalDialog(false)
      toast.success(`${name} has been sent for approval.`)
    } catch (error) {
      toast.error('Failed to send for approval. Please try again.')
    }
  }

  const getAffinityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50'
    if (score >= 0.6) return 'text-blue-600 bg-blue-50'
    return 'text-gray-600 bg-gray-50'
  }

  return (
    <>
      <Card className={cn(
        "group hover:shadow-lg transition-all duration-200",
        isSelected && "ring-2 ring-primary"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground capitalize">{category}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {affinityScore && (
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", getAffinityColor(affinityScore))}
                >
                  <Star className="w-3 h-3 mr-1" />
                  {(affinityScore * 100).toFixed(0)}% match
                </Badge>
              )}
              {popularity && popularity > 0.7 && (
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          {image && (
            <div className="relative w-full h-48 mb-3 rounded-md overflow-hidden bg-muted">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          {suggestedGifts && suggestedGifts.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Suggested gifts:</p>
              <div className="flex flex-wrap gap-1">
                {suggestedGifts.slice(0, 3).map((gift, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {gift}
                  </Badge>
                ))}
                {suggestedGifts.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{suggestedGifts.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {(price || priceRange) && (
            <div className="flex items-center gap-2 p-3 bg-onbloom-secondary/10 rounded-lg border border-onbloom-secondary/20">
              <DollarSign className="w-5 h-5 text-onbloom-primary" />
              <span className="font-semibold text-lg text-onbloom-primary">
                {price ? `$${price}` : priceRange || 'Price varies'}
              </span>
            </div>
          )}

          {explainability?.signals && explainability.signals.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-1">Why this recommendation:</p>
              <div className="space-y-1">
                {explainability.signals.slice(0, 2).map((signal, index) => (
                  <p key={index} className="text-xs text-muted-foreground">
                    • {signal.value}
                  </p>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 space-x-2">
          {onSelect && (
            <Button
              onClick={handleSelect}
              disabled={isSelected}
              className={cn(
                "flex-1",
                isSelected ? "bg-onbloom-success hover:bg-onbloom-success/90" : "bg-onbloom-primary hover:bg-onbloom-dark-purple"
              )}
              variant={isSelected ? "secondary" : "default"}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Selected
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Select Gift
                </>
              )}
            </Button>
          )}
          {showApprovalButton && onSendForApproval && (
            <Button
              onClick={handleSendForApproval}
              className="flex-1 bg-onbloom-accent-blue hover:bg-onbloom-accent-blue/90"
              variant="default"
            >
              <Send className="w-4 h-4 mr-2" />
              Send for Approval
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showSelectDialog} onOpenChange={setShowSelectDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Gift Selection</DialogTitle>
            <DialogDescription>
              You&apos;re selecting <strong>{name}</strong> for {recipientName || 'the recipient'}.
              Add any additional details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion</Label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger id="occasion">
                  <SelectValue placeholder="Select an occasion" />
                </SelectTrigger>
                <SelectContent>
                  {occasions.map((occ) => (
                    <SelectItem key={occ.value} value={occ.value}>
                      {occ.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any special instructions or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSelectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSelection}>
              Confirm Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Gift for Approval</DialogTitle>
            <DialogDescription>
              Send <strong>{name}</strong> for approval for {recipientName || 'the recipient'}.
              The gift will be reviewed before final purchase.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="p-3 bg-onbloom-secondary/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">{name}</span>
                <span className="font-semibold text-onbloom-primary">
                  {price ? `$${price}` : priceRange || 'Price varies'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="approval-occasion">Occasion</Label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger id="approval-occasion">
                  <SelectValue placeholder="Select an occasion" />
                </SelectTrigger>
                <SelectContent>
                  {occasions.map((occ) => (
                    <SelectItem key={occ.value} value={occ.value}>
                      {occ.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="approval-notes">Notes (optional)</Label>
              <Textarea
                id="approval-notes"
                placeholder="Add any justification or special notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmApproval} className="bg-onbloom-accent-blue hover:bg-onbloom-accent-blue/90">
              Send for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}