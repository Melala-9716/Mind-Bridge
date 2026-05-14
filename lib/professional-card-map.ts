import type { ProfessionalPublicCardModel } from '@/components/professional-directory-card'
import {
  formatWeeklyScheduleFullWeekCardSummary,
  getProfessionalAvailabilityLiveState,
  normalizeWeeklySchedule,
  type ProfessionalRecord,
} from '@/lib/professionals-db'

export function professionalRecordToPublicCard(item: ProfessionalRecord): ProfessionalPublicCardModel {
  const schedule = normalizeWeeklySchedule(item.weekly_schedule)
  const weeklyScheduleSummaryLines = formatWeeklyScheduleFullWeekCardSummary(item.weekly_schedule)
  return {
    id: item.id,
    name: item.full_name,
    role: item.specialization,
    hospital: item.hospital,
    city: item.city,
    languages: Array.isArray(item.languages) ? item.languages : [],
    weeklyScheduleSummaryLines,
    liveState: getProfessionalAvailabilityLiveState(schedule),
    rating: Number(item.rating ?? 4.8),
  }
}
