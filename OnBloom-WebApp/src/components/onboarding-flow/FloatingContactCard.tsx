'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, Briefcase, MapPin, Calendar, User } from 'lucide-react'

interface FloatingContactCardProps {
  person: {
    name: string
    role: string
    department?: string
    email?: string
    phone?: string
    location?: string
    startDate?: string
    profileImage?: string
  }
  x: number
  y: number
  isVisible: boolean
}

export function FloatingContactCard({ person, x, y, isVisible }: FloatingContactCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  const cardContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(-50%, -100%) translateY(-16px)'
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px] max-w-[320px]">
            <div className="flex items-start gap-3 mb-3">
              {person.profileImage ? (
                <img
                  src={person.profileImage}
                  alt={person.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-onbloom-accent-pink/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-onbloom-primary" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-title font-semibold text-gray-900 dark:text-gray-100">
                  {person.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{person.role}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {person.department && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Briefcase className="w-4 h-4" />
                  <span>{person.department}</span>
                </div>
              )}
              
              {person.email && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{person.email}</span>
                </div>
              )}
              
              {person.phone && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{person.phone}</span>
                </div>
              )}
              
              {person.location && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{person.location}</span>
                </div>
              )}
              
              {person.startDate && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Started: {person.startDate}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(cardContent, document.body)
}