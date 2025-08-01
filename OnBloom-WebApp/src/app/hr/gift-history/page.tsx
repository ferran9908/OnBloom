"use client";

import React, { useState, useEffect } from "react";
import { GiftHistoryCard } from "@/components/GiftHistoryCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Filter,
  Download,
  RefreshCw,
  Gift,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

interface GiftData {
  id: string;
  giftId: string;
  giftName: string;
  giftCategory: string;
  giftPrice?: number;
  selectedBy: string;
  selectedByName: string;
  selectedFor: string;
  selectedForName: string;
  selectedAt: string;
  status: 'TBD' | 'Accepted' | 'Denied' | 'purchased' | 'delivered';
  statusUpdatedAt?: string;
  occasion?: string;
  notes?: string;
  affinityScore?: number;
}

interface GiftStats {
  total: number;
  pending: number;
  accepted: number;
  denied: number;
  purchased: number;
  delivered: number;
}

export default function GiftHistory() {
  const [gifts, setGifts] = useState<GiftData[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<GiftData[]>([]);
  const [stats, setStats] = useState<GiftStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    denied: 0,
    purchased: 0,
    delivered: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchGifts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/gift/list');
      if (!response.ok) throw new Error('Failed to fetch gifts');
      
      const data = await response.json();
      setGifts(data.gifts || []);
      setStats(data.stats || {
        total: 0,
        pending: 0,
        accepted: 0,
        denied: 0,
        purchased: 0,
        delivered: 0,
      });
    } catch (error) {
      console.error('Error fetching gifts:', error);
      toast.error('Failed to load gift history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredGifts(gifts);
    } else {
      setFilteredGifts(gifts.filter(gift => gift.status === statusFilter));
    }
  }, [gifts, statusFilter]);

  const handleStatusUpdate = async (giftId: string, newStatus: 'Accepted' | 'Denied') => {
    try {
      setIsUpdating(giftId);
      const response = await fetch('/api/gift/approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftId, status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      // Refresh the list
      await fetchGifts();
      toast.success(`Gift ${newStatus.toLowerCase()}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update gift status');
    } finally {
      setIsUpdating(null);
    }
  };

  const exportToCSV = () => {
    const headers = ['Gift Name', 'Category', 'Price', 'Selected For', 'Selected By', 'Date', 'Status', 'Occasion'];
    const rows = filteredGifts.map(gift => [
      gift.giftName,
      gift.giftCategory,
      gift.giftPrice || '',
      gift.selectedForName,
      gift.selectedByName,
      new Date(gift.selectedAt).toLocaleDateString(),
      gift.status,
      gift.occasion || '',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gift-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Gift history exported');
  };

  const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={cn("p-3 rounded-lg", color)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Gift History</h1>
          <p className="text-muted-foreground">
            View and manage all selected gifts across your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchGifts} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard 
          label="Total Gifts" 
          value={stats.total} 
          icon={Gift} 
          color="bg-onbloom-primary/10 text-onbloom-primary"
        />
        <StatCard 
          label="Pending" 
          value={stats.pending} 
          icon={Clock} 
          color="bg-onbloom-warning/10 text-onbloom-warning"
        />
        <StatCard 
          label="Approved" 
          value={stats.accepted} 
          icon={CheckCircle} 
          color="bg-onbloom-success/10 text-onbloom-success"
        />
        <StatCard 
          label="Denied" 
          value={stats.denied} 
          icon={XCircle} 
          color="bg-onbloom-error/10 text-onbloom-error"
        />
        <StatCard 
          label="Purchased" 
          value={stats.purchased} 
          icon={Package} 
          color="bg-onbloom-accent-blue/10 text-onbloom-accent-blue"
        />
        <StatCard 
          label="Delivered" 
          value={stats.delivered} 
          icon={Truck} 
          color="bg-onbloom-accent-green/10 text-onbloom-accent-green"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by:</span>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All gifts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All gifts</SelectItem>
            <SelectItem value="TBD">Pending Approval</SelectItem>
            <SelectItem value="Accepted">Approved</SelectItem>
            <SelectItem value="Denied">Denied</SelectItem>
            <SelectItem value="purchased">Purchased</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline" className="ml-auto">
          {filteredGifts.length} {filteredGifts.length === 1 ? 'gift' : 'gifts'}
        </Badge>
      </div>

      {/* Gift Grid */}
      {filteredGifts.length === 0 ? (
        <Card className="p-12 text-center">
          <Gift className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No gifts found</h3>
          <p className="text-muted-foreground">
            {statusFilter === 'all' 
              ? "No gifts have been selected yet." 
              : `No gifts with status "${statusFilter}" found.`}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGifts.map((gift) => (
            <GiftHistoryCard
              key={gift.id}
              gift={gift}
              onStatusUpdate={gift.status === 'TBD' ? handleStatusUpdate : undefined}
              isUpdating={isUpdating === gift.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Add missing import
import { cn } from '@/lib/utils';