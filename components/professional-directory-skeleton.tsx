import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const skeletonShell = cn(
  'flex h-full flex-col rounded-2xl border border-white/50 bg-white/50 p-5 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]',
)

export function ProfessionalDirectorySkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className={cn(skeletonShell, 'border-none')}>
          <div className="flex gap-3">
            <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-5 w-48 max-w-[12rem]" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </div>
          <Skeleton className="mt-5 h-px w-full" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="mt-4 h-16 w-full rounded-xl" />
          <div className="mt-4 flex gap-1">
            <Skeleton className="h-6 w-14 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-border/30 pt-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-10" />
          </div>
          <div className="mt-5 flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 flex-1 rounded-xl" />
          </div>
        </Card>
      ))}
    </div>
  )
}
