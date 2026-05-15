'use client'

import { useMemo, useState } from 'react'
import { Bell, CheckCircle2, Clock3, Edit3, Phone, MessageSquare, Globe, User } from 'lucide-react'
import { toast } from 'sonner'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'

type RoleType = 'Psychologist' | 'Counselor'

type RequestStatus = 'pending' | 'accepted' | 'declined'
type Priority = 'low' | 'medium' | 'high'
type CommunicationMethod = 'Email' | 'Chat' | 'Phone'

type ProfessionalProfile = {
  fullName: string
  email: string
  phone: string
  specialization: string
  hospital: string
  city: string
  languages: string[]
  role: RoleType
}

type WorkingDay = {
  day: string
  available: boolean
  start: string // HH:mm
  end: string // HH:mm
}

type ConsultationRequest = {
  id: string
  patientName: string
  concernType: string
  receivedTimeLabel: string // e.g. "5 min ago"
  language: string
  priority: Priority
  status: RequestStatus

  description: string
  contactInfo: string
  preferredCommunication: CommunicationMethod
}

type NotificationItem = {
  id: string
  title: string
  timeLabel: string
}

const LANGUAGE_OPTIONS = ['English', 'Amharic', 'Afaan Oromo', 'Somali', 'Tigrinya']
const PRIORITY_ORDER: Record<Priority, number> = { low: 1, medium: 2, high: 3 }

function statusPill(status: RequestStatus) {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        className: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100',
        dot: 'bg-amber-500',
      }
    case 'accepted':
      return {
        label: 'Accepted',
        className: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100',
        dot: 'bg-emerald-500',
      }
    case 'declined':
      return {
        label: 'Declined',
        className: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100',
        dot: 'bg-rose-500',
      }
  }
}

function priorityPill(priority: Priority) {
  switch (priority) {
    case 'low':
      return {
        label: 'Low',
        className: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-100',
      }
    case 'medium':
      return {
        label: 'Medium',
        className: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100',
      }
    case 'high':
      return {
        label: 'High',
        className: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100',
      }
  }
}

function formatTimeRange(start: string, end: string) {
  // UI-only: expects HH:mm, show as "09:00 AM"
  const toAmPm = (hhmm: string) => {
    const [hhStr, mmStr] = hhmm.split(':')
    const hh = Number(hhStr)
    const mm = Number(mmStr)
    const suffix = hh >= 12 ? 'PM' : 'AM'
    const h12 = hh % 12 === 0 ? 12 : hh % 12
    return `${String(h12).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${suffix}`
  }

  return `${toAmPm(start)} – ${toAmPm(end)}`
}

function IconForCommunication({ method }: { method: CommunicationMethod }) {
  if (method === 'Email') return <Globe className="h-4 w-4" aria-hidden />
  if (method === 'Chat') return <MessageSquare className="h-4 w-4" aria-hidden />
  return <Phone className="h-4 w-4" aria-hidden />
}

export default function ProfessionalDashboardPage() {
  const [profile, setProfile] = useState<ProfessionalProfile>({
    fullName: 'Dr. Abebe Desalegn',
    email: 'abebe.desalegn@mindbridgeethiopia.com',
    phone: '+251 911 234 567',
    specialization: 'Clinical Psychology',
    hospital: 'MindBridge Community Clinic',
    city: 'Addis Ababa',
    languages: ['English', 'Amharic'],
    role: 'Psychologist',
  })

  const [profileEditing, setProfileEditing] = useState(false)
  const [profileDraft, setProfileDraft] = useState(profile)

  const [schedule, setSchedule] = useState<WorkingDay[]>([
    { day: 'Monday', available: true, start: '09:00', end: '17:00' },
    { day: 'Tuesday', available: true, start: '09:00', end: '17:00' },
    { day: 'Wednesday', available: true, start: '09:00', end: '17:00' },
    { day: 'Thursday', available: true, start: '09:00', end: '17:00' },
    { day: 'Friday', available: true, start: '09:00', end: '15:00' },
    { day: 'Saturday', available: false, start: '09:00', end: '17:00' },
    { day: 'Sunday', available: false, start: '09:00', end: '17:00' },
  ])
  const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false)
  const [scheduleDraft, setScheduleDraft] = useState(schedule)

  const requestsInitial: ConsultationRequest[] = useMemo(
    () => [
      {
        id: 'req-1',
        patientName: 'Abebe Kebede',
        concernType: 'Anxiety / Academic Stress',
        receivedTimeLabel: '5 min ago',
        language: 'Amharic',
        priority: 'high',
        status: 'pending',
        description:
          'Client reports persistent anxiety before exams, difficulty concentrating, and sleep disruption. Seeking coping strategies and structured support.',
        contactInfo: 'abebe.kebede@gmail.com',
        preferredCommunication: 'Email',
      },
      {
        id: 'req-2',
        patientName: 'Hana Tesfahun',
        concernType: 'Work Stress / Sleep Issues',
        receivedTimeLabel: '1 hour ago',
        language: 'English',
        priority: 'medium',
        status: 'pending',
        description:
          'Client describes feeling overwhelmed by workload, increased irritability, and trouble falling asleep. Looking for stress management plan and sleep routine guidance.',
        contactInfo: '+251 911 111 222',
        preferredCommunication: 'Phone',
      },
      {
        id: 'req-3',
        patientName: 'Dawit Mulu',
        concernType: 'Burnout / Depression',
        receivedTimeLabel: '3 hours ago',
        language: 'Afaan Oromo',
        priority: 'low',
        status: 'declined',
        description:
          'Client shares low mood, reduced motivation, and emotional fatigue. Prefers a gentle, step-by-step approach and periodic check-ins.',
        contactInfo: 'dawit.mulu@example.com',
        preferredCommunication: 'Chat',
      },
    ],
    [],
  )

  const [requests, setRequests] = useState<ConsultationRequest[]>(requestsInitial)
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(requestsInitial[0]?.id ?? null)

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'n-1', title: 'New consultation request received', timeLabel: 'Just now' },
    { id: 'n-2', title: 'Schedule updated successfully (demo)', timeLabel: 'Today' },
  ])

  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const onlineDotColorClass = 'bg-emerald-500'

  const sortedRequests = useMemo(() => {
    const copy = [...requests]
    copy.sort((a, b) => {
      const statusRank: Record<RequestStatus, number> = { accepted: 3, pending: 2, declined: 1 }
      if (statusRank[b.status] !== statusRank[a.status]) return statusRank[b.status] - statusRank[a.status]
      return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]
    })
    return copy
  }, [requests])

  const expandedRequest = useMemo(
    () => requests.find((r) => r.id === expandedRequestId) ?? null,
    [expandedRequestId, requests],
  )

  function pushNotification(title: string, timeLabel: string) {
    setNotifications((prev) => [
      { id: `n-${Date.now()}-${Math.random().toString(16).slice(2)}`, title, timeLabel },
      ...prev,
    ])
  }

  function handleSaveProfile() {
    setProfile(profileDraft)
    setProfileEditing(false)
    toast.success('Profile updated successfully')
    pushNotification('Profile updated successfully', 'Just now')
  }

  function handleOpenScheduleEditor() {
    setScheduleDraft(schedule)
    setScheduleDrawerOpen(true)
  }

  function handleSaveSchedule() {
    setSchedule(scheduleDraft)
    setScheduleDrawerOpen(false)
    toast.success('Schedule updated successfully')
    pushNotification('Schedule updated successfully', 'Just now')
  }

  function handleAcceptRequest(req: ConsultationRequest) {
    setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: 'accepted' } : r)))
    toast.success('Request accepted')
    pushNotification(`Accepted request from ${req.patientName}`, 'Just now')
  }

  function handleDeclineRequest(req: ConsultationRequest) {
    setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: 'declined' } : r)))
    toast.error('Request declined')
    pushNotification(`Declined request from ${req.patientName}`, 'Just now')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Toaster />

      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-background/70 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-border flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <span
                  className={cn(
                    'absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full ring-2 ring-background',
                    onlineDotColorClass,
                  )}
                  aria-label="Online"
                />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Welcome, {profile.fullName}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-2">
                    <Badge variant="outline" className="border-primary/30 bg-primary/5">
                      {profile.role}
                    </Badge>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full relative">
                    <Bell className="h-4 w-4" aria-hidden />
                    <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-rose-500 text-white text-[10px] font-semibold flex items-center justify-center px-1">
                      {Math.min(9, notifications.length)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[320px]">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No notifications</div>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <DropdownMenuItem key={n.id} className="flex items-start gap-2 py-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden />
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-tight">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.timeLabel}</p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                      setNotifications([])
                      toast.message('Notifications cleared (UI only)')
                    }}
                  >
                    Clear
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your consultations and schedule efficiently
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile card */}
            <Card className="rounded-2xl p-5 shadow-sm border-border/70">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 rounded-xl bg-primary/10 items-center justify-center border border-primary/20">
                      👤
                    </span>
                    Profile
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">View and update your professional information.</p>
                </div>
                <div className="flex gap-2">
                  {profileEditing ? null : (
                    <Button
                      variant="outline"
                      className="rounded-xl border-primary/25"
                      onClick={() => {
                        setProfileDraft(profile)
                        setProfileEditing(true)
                      }}
                    >
                      <Edit3 className="h-4 w-4 mr-2" aria-hidden />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Full Name</p>
                  {profileEditing ? (
                    <Input
                      value={profileDraft.fullName}
                      onChange={(e) => setProfileDraft((p) => ({ ...p, fullName: e.target.value }))}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-foreground">{profile.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Email</p>
                  {profileEditing ? (
                    <Input
                      value={profileDraft.email}
                      onChange={(e) => setProfileDraft((p) => ({ ...p, email: e.target.value }))}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-sm text-foreground">{profile.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Phone</p>
                  {profileEditing ? (
                    <Input
                      value={profileDraft.phone}
                      onChange={(e) => setProfileDraft((p) => ({ ...p, phone: e.target.value }))}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-sm text-foreground">{profile.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Specialization</p>
                  {profileEditing ? (
                    <Input
                      value={profileDraft.specialization}
                      onChange={(e) => setProfileDraft((p) => ({ ...p, specialization: e.target.value }))}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-sm text-foreground">{profile.specialization}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Hospital / Institution</p>
                  {profileEditing ? (
                    <Input
                      value={profileDraft.hospital}
                      onChange={(e) => setProfileDraft((p) => ({ ...p, hospital: e.target.value }))}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-sm text-foreground">{profile.hospital}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">City</p>
                  {profileEditing ? (
                    <Input
                      value={profileDraft.city}
                      onChange={(e) => setProfileDraft((p) => ({ ...p, city: e.target.value }))}
                      className="bg-background"
                    />
                  ) : (
                    <p className="text-sm text-foreground">{profile.city}</p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4" aria-hidden />
                    Languages spoken
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const selected = profileEditing ? profileDraft.languages.includes(lang) : profile.languages.includes(lang)
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          if (!profileEditing) return
                          setProfileDraft((p) => ({
                            ...p,
                            languages: selected ? p.languages.filter((l) => l !== lang) : [...p.languages, lang],
                          }))
                        }}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                          selected
                            ? 'border-primary/30 bg-primary/10 text-primary'
                            : 'border-border/70 bg-background text-muted-foreground hover:bg-card',
                        )}
                      >
                        {lang}
                      </button>
                    )
                  })}
                </div>
              </div>

              {profileEditing && (
                <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    className="rounded-xl"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => {
                      setProfileDraft(profile)
                      setProfileEditing(false)
                      toast.message('Edit canceled')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Card>

            {/* Working Schedule */}
            <Card className="rounded-2xl p-5 shadow-sm border-border/70">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 rounded-xl bg-emerald-500/10 items-center justify-center border border-emerald-500/20">
                      ⏰
                    </span>
                    Working Schedule
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">Set your availability for new consultation requests.</p>
                </div>
                <Button variant="outline" className="rounded-xl border-primary/25" onClick={handleOpenScheduleEditor}>
                  <Edit3 className="h-4 w-4 mr-2" aria-hidden />
                  Edit Schedule
                </Button>
              </div>

              <div className="mt-5 space-y-3">
                {schedule.map((d) => (
                  <div key={d.day} className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{d.day}</p>
                      {!d.available ? (
                        <p className="text-xs text-muted-foreground mt-0.5">Unavailable</p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatTimeRange(d.start, d.end)}
                        </p>
                      )}
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border',
                        d.available
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100'
                          : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100',
                      )}
                    >
                      <span className={cn('h-2 w-2 rounded-full', d.available ? 'bg-emerald-500' : 'bg-rose-500')} aria-hidden />
                      {d.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Consultation Requests */}
            <Card className="rounded-2xl p-5 shadow-sm border-border/70">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 rounded-xl bg-indigo-500/10 items-center justify-center border border-indigo-500/20">
                      📥
                    </span>
                    Consultation Requests
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Review incoming requests and respond quickly.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3">
                {sortedRequests.map((req) => {
                  const isExpanded = expandedRequestId === req.id
                  const st = statusPill(req.status)
                  const pr = priorityPill(req.priority)

                  return (
                    <div key={req.id} className="rounded-2xl border border-border/70 bg-card/60 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setExpandedRequestId((prev) => (prev === req.id ? null : req.id))}
                        className="w-full text-left px-4 py-4 flex items-start justify-between gap-4 hover:bg-card/70 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{req.patientName}</p>
                              <p className="text-sm text-muted-foreground mt-0.5 truncate">{req.concernType}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', pr.className)}>
                                {pr.label}
                              </span>
                              <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', st.className)}>
                                <span className={cn('h-2 w-2 rounded-full mr-2 inline-block', st.dot)} aria-hidden />
                                {st.label}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock3 className="h-4 w-4" aria-hidden />
                              {req.receivedTimeLabel}
                            </span>
                            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                              <Globe className="h-4 w-4" aria-hidden />
                              {req.language}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 text-xs text-primary font-semibold mt-1">
                          {isExpanded ? 'Hide' : 'View Details'}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 bg-background/40 border-t border-border/60">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Full description
                          </p>
                          <p className="mt-1 text-sm text-foreground leading-relaxed">
                            {req.description}
                          </p>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="rounded-xl border border-border/60 bg-card p-3">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact info</p>
                              <p className="mt-1 text-sm font-semibold text-foreground break-words">{req.contactInfo}</p>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-card p-3 md:col-span-2">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Preferred communication</p>
                              <div className="mt-2 flex items-center gap-2">
                                <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                  <IconForCommunication method={req.preferredCommunication} />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{req.preferredCommunication}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    We’ll use this method for updates.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-4 flex flex-col md:flex-row gap-2">
                            {req.status === 'pending' ? (
                              <>
                                <Button
                                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => handleAcceptRequest(req)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" aria-hidden />
                                  Accept Request
                                </Button>
                                <Button
                                  variant="outline"
                                  className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                  onClick={() => handleDeclineRequest(req)}
                                >
                                  Decline Request
                                </Button>
                              </>
                            ) : req.status === 'accepted' ? (
                              <>
                                <span
                                  className="inline-flex items-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 px-4 py-2 text-sm font-semibold"
                                >
                                  ✅ Accepted
                                </span>
                                <Button
                                  variant="default"
                                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => {
                                    toast.message(`Starting chat with ${req.patientName} (mock)`)
                                  }}
                                >
                                  Start Chat
                                </Button>
                              </>
                            ) : (
                              <>
                                <span
                                  className="inline-flex items-center rounded-xl border border-rose-200 bg-rose-50 text-rose-900 px-4 py-2 text-sm font-semibold"
                                >
                                  🔴 Declined
                                </span>
                                <Button
                                  disabled
                                  className="rounded-xl opacity-60 cursor-not-allowed"
                                >
                                  Start Chat
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Right column: lightweight UI-only panel */}
          <div className="space-y-6">
            <Card className="rounded-2xl p-5 shadow-sm border-border/70">
              <p className="text-sm font-semibold text-foreground">Notification Area</p>
              <p className="mt-2 text-xs text-muted-foreground">
                UI-only activity feed. Actions update this panel and show toasts.
              </p>

              <div className="mt-4 space-y-3">
                {notifications.slice(0, 6).map((n) => (
                  <div key={n.id} className="rounded-xl border border-border/60 bg-card p-3">
                    <p className="text-sm font-semibold text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.timeLabel}</p>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="rounded-xl border border-border/60 bg-card p-3 text-sm text-muted-foreground">
                    No notifications yet.
                  </div>
                )}
              </div>
            </Card>

            <Card className="rounded-2xl p-5 shadow-sm border-border/70">
              <p className="text-sm font-semibold text-foreground">Quick Status</p>
              <p className="mt-2 text-xs text-muted-foreground">
                A premium summary of what you need today.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {(['pending', 'accepted', 'declined'] as const).map((s) => {
                  const st = statusPill(s)
                  const count = requests.filter((r) => r.status === s).length
                  return (
                    <div key={s} className="rounded-xl border border-border/60 bg-card p-3">
                      <p className="text-xs text-muted-foreground">{st.label}</p>
                      <p className="text-2xl font-bold mt-2 text-foreground">{count}</p>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Schedule Edit Drawer */}
      <Drawer direction="right" open={scheduleDrawerOpen} onOpenChange={setScheduleDrawerOpen}>
        <DrawerContent className="ml-auto flex h-[100dvh] max-h-[100dvh] flex-col gap-0 rounded-none border-l bg-background p-0 shadow-2xl sm:max-w-[460px] sm:rounded-l-2xl">
          <DrawerHeader className="border-b border-border/70 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent px-5 pb-4 pt-6 text-left">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1 pr-2">
                <DrawerTitle className="text-xl font-semibold tracking-tight text-foreground">Edit Schedule</DrawerTitle>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Toggle availability and set your start/end times (UI-only).
                </p>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="shrink-0 rounded-full" aria-label="Close schedule">
                  ✕
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                {scheduleDraft.map((d, idx) => (
                  <div key={d.day} className="rounded-2xl border border-border/70 bg-card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{d.day}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {d.available ? formatTimeRange(d.start, d.end) : 'Unavailable'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{d.available ? 'Available' : 'Unavailable'}</span>
                        <Switch
                          checked={d.available}
                          onCheckedChange={(checked) => {
                            setScheduleDraft((prev) =>
                              prev.map((day, i) => (i === idx ? { ...day, available: checked } : day)),
                            )
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Start Time</p>
                        <Input
                          type="time"
                          value={d.start}
                          disabled={!d.available}
                          onChange={(e) => {
                            const value = e.target.value
                            setScheduleDraft((prev) =>
                              prev.map((day, i) => (i === idx ? { ...day, start: value } : day)),
                            )
                          }}
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">End Time</p>
                        <Input
                          type="time"
                          value={d.end}
                          disabled={!d.available}
                          onChange={(e) => {
                            const value = e.target.value
                            setScheduleDraft((prev) =>
                              prev.map((day, i) => (i === idx ? { ...day, end: value } : day)),
                            )
                          }}
                          className="bg-background"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 border-t border-border/70 bg-muted/15 px-5 py-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleSaveSchedule}
                >
                  Save Schedule
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setScheduleDrawerOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

