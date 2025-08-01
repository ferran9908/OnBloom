"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Info, Sparkles, TrendingUp, Users, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QlooSource {
  id: string
  name: string
  affinity: number
  explainability?: {
    signals?: Array<{
      type: string
      value: string
      weight: number
    }>
  }
}

interface SourcesDisplayProps {
  qlooSources?: QlooSource[]
  perplexitySources?: Array<{
    title: string
    url: string
    snippet: string
  }>
  className?: string
}

export function SourcesDisplay({ qlooSources, perplexitySources, className }: SourcesDisplayProps) {
  if (!qlooSources?.length && !perplexitySources?.length) {
    return null
  }

  const getSignalIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'demographic':
      case 'demographics':
        return <Users className="w-3 h-3" />
      case 'location':
      case 'geo':
        return <MapPin className="w-3 h-3" />
      case 'trending':
      case 'trend':
        return <TrendingUp className="w-3 h-3" />
      default:
        return <Sparkles className="w-3 h-3" />
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {qlooSources && qlooSources.length > 0 && (
        <Card className="border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Powered by Qloo Cultural AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground mb-2">
              Recommendations based on cultural intelligence and affinity data
            </div>
            {qlooSources.slice(0, 3).map((source) => (
              <div key={source.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{source.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {(source.affinity * 100).toFixed(0)}% match
                  </Badge>
                </div>
                {source.explainability?.signals && source.explainability.signals.length > 0 && (
                  <div className="pl-2 space-y-1">
                    {source.explainability.signals.slice(0, 2).map((signal, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        {getSignalIcon(signal.type)}
                        <span>{signal.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {perplexitySources && perplexitySources.length > 0 && (
        <Card className="border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Web Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {perplexitySources.slice(0, 3).map((source, index) => (
                <div key={index} className="space-y-1">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline line-clamp-1"
                  >
                    {source.title}
                  </a>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {source.snippet}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}