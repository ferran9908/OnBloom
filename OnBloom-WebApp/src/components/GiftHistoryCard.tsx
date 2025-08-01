"use client"

import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Gift, 
  Calendar, 
  User, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock,
  Package,
  Truck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface GiftHistoryCardProps {
  gift: {
    id: string
    giftId: string
    giftName: string
    giftCategory: string
    giftPrice?: number
    selectedBy: string
    selectedByName: string
    selectedFor: string
    selectedForName: string
    selectedAt: string
    status: 'TBD' | 'Accepted' | 'Denied' | 'purchased' | 'delivered'
    statusUpdatedAt?: string
    occasion?: string
    notes?: string
    affinityScore?: number
  }
  onStatusUpdate?: (giftId: string, status: 'Accepted' | 'Denied') => Promise<void>
  isUpdating?: boolean
}

const statusConfig = {
  TBD: {
    label: 'Pending Approval',
    icon: Clock,
    color: 'bg-onbloom-warning/10 text-onbloom-warning border-onbloom-warning/20',
  },
  Accepted: {
    label: 'Approved',
    icon: CheckCircle,
    color: 'bg-onbloom-success/10 text-onbloom-success border-onbloom-success/20',
  },
  Denied: {
    label: 'Denied',
    icon: XCircle,
    color: 'bg-onbloom-error/10 text-onbloom-error border-onbloom-error/20',
  },
  purchased: {
    label: 'Purchased',
    icon: Package,
    color: 'bg-onbloom-accent-blue/10 text-onbloom-accent-blue border-onbloom-accent-blue/20',
  },
  delivered: {
    label: 'Delivered',
    icon: Truck,
    color: 'bg-onbloom-primary/10 text-onbloom-primary border-onbloom-primary/20',
  },
}

export function GiftHistoryCard({ gift, onStatusUpdate, isUpdating = false }: GiftHistoryCardProps) {
  const status = statusConfig[gift.status]
  const StatusIcon = status.icon

  const handleApprove = async () => {
    if (onStatusUpdate) {
      try {
        await onStatusUpdate(gift.id, 'Accepted')
        toast.success(`${gift.giftName} has been approved`)
      } catch (error) {
        toast.error('Failed to approve gift')
      }
    }
  }

  const handleDeny = async () => {
    if (onStatusUpdate) {
      try {
        await onStatusUpdate(gift.id, 'Denied')
        toast.success(`${gift.giftName} has been denied`)
      } catch (error) {
        toast.error('Failed to deny gift')
      }
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-1 font-title">
              {gift.giftName}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">{gift.giftCategory}</p>
          </div>
          <Badge 
            variant="outline" 
            className={cn("gap-1", status.color)}
          >
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {gift.giftPrice && (
          <div className="flex items-center gap-2 text-lg font-semibold text-onbloom-primary">
            <DollarSign className="w-5 h-5" />
            ${gift.giftPrice}
          </div>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span>For: <span className="font-medium text-foreground">{gift.selectedForName}</span></span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gift className="w-4 h-4" />
            <span>Selected by: <span className="font-medium text-foreground">{gift.selectedByName}</span></span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(gift.selectedAt), 'MMM d, yyyy')}</span>
          </div>
        </div>

        {gift.occasion && (
          <div className="pt-2">
            <Badge variant="secondary" className="bg-onbloom-secondary/20 text-onbloom-primary">
              {gift.occasion}
            </Badge>
          </div>
        )}

        {gift.notes && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">Notes:</p>
            <p className="text-sm mt-1">{gift.notes}</p>
          </div>
        )}

        {gift.affinityScore && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Affinity Score: {Math.round(gift.affinityScore * 100)}%
            </p>
          </div>
        )}
      </CardContent>

      {gift.status === 'TBD' && onStatusUpdate && (
        <CardFooter className="pt-3 gap-2">
          <Button
            onClick={handleApprove}
            disabled={isUpdating}
            className="flex-1 bg-onbloom-success hover:bg-onbloom-success/90"
            size="sm"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            onClick={handleDeny}
            disabled={isUpdating}
            variant="outline"
            className="flex-1 border-onbloom-error text-onbloom-error hover:bg-onbloom-error/10"
            size="sm"
          >
            <XCircle className="w-4 h-4 mr-1" />
            Deny
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}