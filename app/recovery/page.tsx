'use client'

import { useState, useEffect } from 'react'
import { Search, ThumbsUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Navigation } from '@/components/navigation'
import { siteCopy, type SiteCopy } from '@/lib/site-copy'

const conditions = ['Depression', 'Anxiety', 'Trauma', 'PTSD', 'Burnout', 'Stress']
const categories = ['Athlete', 'Celebrity', 'Scientist', 'Activist', 'Student', 'Professional']

function recoveryConditionLabel(condition: string, t: SiteCopy): string {
  switch (condition) {
    case 'Depression':
      return t.depression
    case 'Anxiety':
      return t.anxiety
    case 'Trauma':
      return t.trauma
    case 'PTSD':
      return t.ptsd
    case 'Burnout':
      return t.burnout
    case 'Stress':
      return t.stress
    default:
      return condition
  }
}

function recoveryCategoryLabel(category: string, t: SiteCopy): string {
  switch (category) {
    case 'Athlete':
      return t.athlete
    case 'Celebrity':
      return t.celebrity
    case 'Scientist':
      return t.scientist
    case 'Activist':
      return t.activist
    case 'Student':
      return t.student
    case 'Professional':
      return t.professional
    default:
      return category
  }
}

interface Story {
  id: number
  name: string
  region: 'Global' | 'Ethiopian'
  context: string
  condition: string
  category: string
  story: string
  coping: string
  quote: string
  likes: number
}

const stories: Story[] = [
  {
    id: 1,
    name: 'Malala Yousafzai',
    region: 'Global',
    context: 'Global Activist',
    condition: 'Trauma',
    category: 'Activist',
    story: "Malala's life changed overnight after surviving a violent attack for speaking about girls' education. The trauma brought fear and uncertainty, but she slowly rebuilt her life through learning, purpose, and advocacy. Instead of being defined by what happened to her, she chose to use her voice even louder.",
    coping: 'education, family support, purpose',
    quote: 'One child, one teacher, one book can change the world.',
    likes: 1456
  },
  {
    id: 2,
    name: 'Nelson Mandela',
    region: 'Global',
    context: 'Global Leader',
    condition: 'Trauma',
    category: 'Activist',
    story: 'After 27 years in prison, Mandela faced not only physical hardship but emotional strain. Rather than letting anger take over, he practiced reflection and discipline. When he walked free, he chose forgiveness — showing deep emotional strength.',
    coping: 'reflection, discipline, forgiveness',
    quote: "It always seems impossible until it's done.",
    likes: 1834
  },
  {
    id: 3,
    name: 'Viktor Frankl',
    region: 'Global',
    context: 'Psychologist & Author',
    condition: 'Trauma',
    category: 'Scientist',
    story: 'In concentration camps, Frankl witnessed extreme suffering. What helped him survive was the belief that life still had meaning. Afterward, he turned that belief into a psychological approach that continues to help millions.',
    coping: 'meaning, mindset',
    quote: 'He who has a why can endure any how.',
    likes: 1567
  },
  {
    id: 4,
    name: 'Oprah Winfrey',
    region: 'Global',
    context: 'Media Personality',
    condition: 'Trauma',
    category: 'Celebrity',
    story: 'Growing up in difficult conditions, Oprah carried emotional pain into adulthood. Through therapy and reflection, she began to heal and transform her past into strength.',
    coping: 'therapy, journaling',
    quote: 'Turn your wounds into wisdom.',
    likes: 1723
  },
  {
    id: 5,
    name: 'Michael Phelps',
    region: 'Global',
    context: 'Olympic Athlete',
    condition: 'Depression',
    category: 'Athlete',
    story: 'Despite his success, Phelps struggled with depression and emotional emptiness. At his lowest point, he reached out for help — a decision that changed everything.',
    coping: 'therapy, routine, support',
    quote: "It's okay to ask for help.",
    likes: 1289
  },
  {
    id: 6,
    name: 'Lady Gaga',
    region: 'Global',
    context: 'Singer & Actress',
    condition: 'PTSD',
    category: 'Celebrity',
    story: 'Living with PTSD, Gaga experienced moments where daily life felt overwhelming. Through music and therapy, she found ways to cope and support others.',
    coping: 'therapy, music, advocacy',
    quote: 'Healing is not linear.',
    likes: 1445
  },
  {
    id: 7,
    name: 'Selena Gomez',
    region: 'Global',
    context: 'Singer & Actress',
    condition: 'Anxiety',
    category: 'Celebrity',
    story: 'Balancing fame and personal struggles, Selena faced anxiety and depression. Taking time away helped her prioritize her well-being.',
    coping: 'therapy, rest, treatment',
    quote: 'I had to learn to take care of myself.',
    likes: 1198
  },
  {
    id: 8,
    name: 'Prince Harry',
    region: 'Global',
    context: 'Royal & Advocate',
    condition: 'Grief',
    category: 'Celebrity',
    story: 'Avoiding grief for years led to emotional struggles. Therapy helped him confront and process his pain.',
    coping: 'therapy, openness',
    quote: 'Talking about it is strength.',
    likes: 1612
  },
  {
    id: 9,
    name: 'Simone Biles',
    region: 'Global',
    context: 'Olympic Gymnast',
    condition: 'Anxiety',
    category: 'Athlete',
    story: 'At the peak of her career, Simone faced a mental block that made competing unsafe. Instead of pushing through, she chose to step back — a difficult but powerful decision that reshaped how people view mental health in sports.',
    coping: 'rest, therapy, boundaries',
    quote: 'Mental health comes first.',
    likes: 1378
  },
  {
    id: 10,
    name: 'Naomi Osaka',
    region: 'Global',
    context: 'Tennis Champion',
    condition: 'Anxiety',
    category: 'Athlete',
    story: 'Naomi experienced intense anxiety under public pressure. Choosing to step away from competition, she prioritized her mental health over expectations.',
    coping: 'rest, therapy, boundaries',
    quote: "It's okay to pause.",
    likes: 1034
  },
  {
    id: 11,
    name: 'Ariana Grande',
    region: 'Global',
    context: 'Singer & Actress',
    condition: 'PTSD',
    category: 'Celebrity',
    story: 'After traumatic events, Ariana struggled with anxiety and PTSD. Through music and support systems, she slowly found ways to heal.',
    coping: 'music, therapy, support',
    quote: 'Healing takes time.',
    likes: 1267
  },
  {
    id: 12,
    name: 'Emma Watson',
    region: 'Global',
    context: 'Actress & Activist',
    condition: 'Anxiety',
    category: 'Celebrity',
    story: 'Balancing fame, expectations, and activism brought pressure. Emma learned to step back when needed and focus on inner balance.',
    coping: 'mindfulness, breaks, reflection',
    quote: "It's okay not to be okay.",
    likes: 945
  },
  {
    id: 13,
    name: 'Dwayne Johnson',
    region: 'Global',
    context: 'Actor & Athlete',
    condition: 'Depression',
    category: 'Celebrity',
    story: 'Before success, Johnson went through periods of deep depression. Through discipline and consistency, he slowly rebuilt his mindset.',
    coping: 'fitness, routine, discipline',
    quote: 'Keep moving forward.',
    likes: 1567
  },
  {
    id: 14,
    name: 'Maya Angelou',
    region: 'Global',
    context: 'Author & Poet',
    condition: 'Trauma',
    category: 'Scientist',
    story: 'After experiencing trauma as a child, Maya became silent for years. Writing eventually became her voice and her healing tool.',
    coping: 'writing, expression',
    quote: 'There is no greater agony than an untold story.',
    likes: 1134
  },
  {
    id: 15,
    name: 'Frida Kahlo',
    region: 'Global',
    context: 'Artist',
    condition: 'Chronic Pain',
    category: 'Scientist',
    story: 'Following a life-changing accident, Frida lived with constant pain. Instead of hiding it, she expressed her struggles through art.',
    coping: 'creativity, art',
    quote: 'I paint my reality.',
    likes: 987
  },
  {
    id: 16,
    name: 'John Nash',
    region: 'Global',
    context: 'Mathematician',
    condition: 'Schizophrenia',
    category: 'Scientist',
    story: 'Nash battled schizophrenia, which deeply affected his life. With treatment and support, he gradually returned to his work.',
    coping: 'treatment, support',
    quote: 'Ideas are worth pursuing.',
    likes: 1089
  },
  {
    id: 17,
    name: 'Demi Lovato',
    region: 'Global',
    context: 'Singer & Actress',
    condition: 'Addiction',
    category: 'Celebrity',
    story: 'Demi faced addiction and mental health struggles. Through recovery programs and therapy, she continues to rebuild her life.',
    coping: 'therapy, rehab, support',
    quote: 'Recovery is possible.',
    likes: 1178
  },
  {
    id: 18,
    name: 'David Goggins',
    region: 'Global',
    context: 'Motivational Speaker',
    condition: 'Trauma',
    category: 'Athlete',
    story: 'Growing up in an abusive environment, Goggins carried deep scars. He used discipline and mental training to transform his life.',
    coping: 'discipline, mindset',
    quote: 'Stay hard.',
    likes: 1345
  },
  {
    id: 19,
    name: 'Arianna Huffington',
    region: 'Global',
    context: 'Entrepreneur & Author',
    condition: 'Burnout',
    category: 'Celebrity',
    story: 'After collapsing from burnout, she realized success without well-being was unsustainable. She restructured her life around rest.',
    coping: 'sleep, boundaries',
    quote: 'Burnout is not a badge of honor.',
    likes: 934
  },
  {
    id: 20,
    name: 'Nick Vujicic',
    region: 'Global',
    context: 'Motivational Speaker',
    condition: 'Resilience',
    category: 'Activist',
    story: 'Born without limbs, Nick struggled with emotional distress. Over time, he developed confidence and became a motivational speaker.',
    coping: 'mindset, faith',
    quote: 'Life is worth living.',
    likes: 1523
  },
  {
    id: 21,
    name: 'Selam',
    region: 'Ethiopian',
    context: 'Student – Addis Ababa',
    condition: 'Anxiety',
    category: 'Student',
    story: 'Feeling overwhelmed by academic pressure and loneliness, Selam isolated herself. Through counseling and friends, she rebuilt her confidence.',
    coping: 'counseling, social support',
    quote: 'You are not alone.',
    likes: 432
  },
  {
    id: 22,
    name: 'Dawit',
    region: 'Ethiopian',
    context: 'Developer',
    condition: 'Burnout',
    category: 'Professional',
    story: 'Long working hours left Dawit mentally exhausted. After recognizing burnout, he set boundaries and regained balance.',
    coping: 'rest, boundaries',
    quote: 'Rest is part of success.',
    likes: 385
  },
  {
    id: 23,
    name: 'Hana',
    region: 'Ethiopian',
    context: 'Healthcare Worker',
    condition: 'Burnout',
    category: 'Professional',
    story: 'Working in healthcare, Hana constantly supported others but ignored her own needs. Peer support helped her heal.',
    coping: 'peer support, breaks',
    quote: 'You must care for yourself too.',
    likes: 298
  },
  {
    id: 31,
    name: 'Yared',
    region: 'Ethiopian',
    context: 'Ethiopian Entrepreneur',
    condition: 'Stress',
    category: 'Entrepreneur',
    story: 'While building a startup, Yared faced constant stress and pressure. Through mentorship and pacing, he learned that growth takes time.',
    coping: 'mentorship, pacing',
    quote: 'Slow progress is still progress.',
    likes: 421
  },
  {
    id: 32,
    name: 'Betty G',
    region: 'Ethiopian',
    context: 'Singer & Performer',
    condition: 'Anxiety / Pressure',
    category: 'Artist',
    story: 'Betty G has spoken in interviews about the pressure of fame and constant public expectations in the music industry. She described moments of anxiety before performances and learning how to manage stress while staying grounded in her personal life.',
    coping: 'support system, rest, grounding, preparation',
    quote: 'Staying true to yourself is the strongest thing you can do.',
    likes: 1200
  },
  {
    id: 33,
    name: 'Teddy Afro',
    region: 'Ethiopian',
    context: 'Artist',
    condition: 'Stress / Burnout',
    category: 'Artist',
    story: 'Teddy Afro has faced long periods of public pressure, criticism, and high expectations throughout his career. Over time, he emphasized patience, emotional balance, and staying focused on long-term purpose rather than external pressure.',
    coping: 'family support, patience, purpose-driven mindset',
    quote: 'Time and patience bring clarity.',
    likes: 1180
  },
  {
    id: 34,
    name: 'Haile Gebrselassie',
    region: 'Ethiopian',
    context: 'Athlete',
    condition: 'Emotional Pressure / Grief',
    category: 'Athlete',
    story: 'Although widely celebrated for his achievements, Haile Gebrselassie has spoken about the mental pressure of competition, expectations, and balancing life beyond sports. He emphasizes mental discipline and emotional balance as part of success.',
    coping: 'discipline, routine, purpose',
    quote: 'Success means nothing without balance.',
    likes: 1350
  },
  {
    id: 35,
    name: 'Kenenisa Bekele',
    region: 'Ethiopian',
    context: 'Athlete',
    condition: 'Performance Anxiety',
    category: 'Athlete',
    story: 'Kenenisa Bekele has experienced intense pressure during international competitions. He has discussed the importance of mental preparation and staying focused under stress in high-performance environments.',
    coping: 'mental preparation, focus, training routine',
    quote: 'Mental strength is part of training.',
    likes: 1220
  },
  {
    id: 36,
    name: 'Ephrem Tamiru',
    region: 'Ethiopian',
    context: 'Artist & Performer',
    condition: 'Public Pressure / Identity Stress',
    category: 'Artist',
    story: 'Ephrem Tamiru, a well-known Ethiopian singer, has shared experiences of emotional pressure in the music industry and the importance of staying grounded despite fame and expectations.',
    coping: 'humility, family support, emotional grounding',
    quote: 'Staying grounded keeps you strong.',
    likes: 980
  },
  {
    id: 37,
    name: 'Neway Debebe',
    region: 'Ethiopian',
    context: 'Musician',
    condition: 'Creative Pressure / Burnout',
    category: 'Artist',
    story: 'Neway Debebe has faced long career pressure in the Ethiopian music industry. Like many artists, he has spoken about maintaining balance and avoiding emotional exhaustion while staying creative.',
    coping: 'rest, creativity balance, pacing',
    quote: 'Creativity needs rest too.',
    likes: 1100
  }
]

export default function RecoveryPage() {
  const t = siteCopy
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConditions, setSelectedConditions] = useState<Set<string>>(new Set())
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [likedStories, setLikedStories] = useState<Set<number>>(new Set())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('likedStories')
    if (saved) {
      setLikedStories(new Set(JSON.parse(saved)))
    }
  }, [])

  const toggleCondition = (condition: string) => {
    const newSet = new Set(selectedConditions)
    if (newSet.has(condition)) {
      newSet.delete(condition)
    } else {
      newSet.add(condition)
    }
    setSelectedConditions(newSet)
  }

  const toggleCategory = (category: string) => {
    const newSet = new Set(selectedCategories)
    if (newSet.has(category)) {
      newSet.delete(category)
    } else {
      newSet.add(category)
    }
    setSelectedCategories(newSet)
  }

  const toggleLike = (storyId: number) => {
    const newSet = new Set(likedStories)
    if (newSet.has(storyId)) {
      newSet.delete(storyId)
    } else {
      newSet.add(storyId)
    }
    setLikedStories(newSet)
    localStorage.setItem('likedStories', JSON.stringify(Array.from(newSet)))
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedConditions(new Set())
    setSelectedCategories(new Set())
  }

  const filteredStories = stories.filter(story => {
    const matchesSearch = !searchQuery || 
      story.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.context.toLowerCase().includes(searchQuery.toLowerCase())

    const conditionMatch = selectedConditions.size === 0 || selectedConditions.has(story.condition)
    const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(story.category)

    return matchesSearch && conditionMatch && categoryMatch
  })

  const globalStories = filteredStories.filter(s => s.region === 'Global')
  const ethiopianStories = filteredStories.filter(s => s.region === 'Ethiopian')

  const hasActiveFilters = searchQuery || selectedConditions.size > 0 || selectedCategories.size > 0

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t.storiesOfRecoveryAndHope}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.realStoriesFromRealPeople}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={t.searchByNameOrStory}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-base rounded-xl border-2 border-border hover:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Filter Chips - Conditions */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">{t.mentalHealthConditions}</p>
          <div className="flex flex-wrap gap-2">
            {conditions.map((condition) => (
              <button
                key={condition}
                onClick={() => toggleCondition(condition)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedConditions.has(condition)
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-card border border-border text-foreground hover:border-blue-400'
                }`}
              >
                {recoveryConditionLabel(condition, t)}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Chips - Categories */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">{t.categories}</p>
          <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategories.has(category)
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-card border border-border text-foreground hover:border-purple-400'
                }`}
              >
                {recoveryCategoryLabel(category, t)}
              </button>
            ))}
          </div>
        </div>

        {/* Clear All Button & Results Count */}
        <div className="flex items-center justify-between mb-8">
          {hasActiveFilters ? (
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {t.showingStories
                  .replace('{count}', String(filteredStories.length))
                  .replace(
                    '{label}',
                    filteredStories.length === 1 ? t.story : t.stories,
                  )}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                {t.clearAll}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t.showingAllStories.replace('{count}', String(stories.length))}
            </p>
          )}
        </div>

        {filteredStories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-2">{t.noStoriesFound}</p>
            <p className="text-sm text-muted-foreground mb-8">{t.tryDifferentFilters}</p>
          </div>
        ) : (
          <>
            {/* Ethiopian Stories Section */}
            {ethiopianStories.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-8">{t.communityStories}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ethiopianStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      isLiked={likedStories.has(story.id)}
                      onLike={() => toggleLike(story.id)}
                      mounted={mounted}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Global Stories - Second */}
            {globalStories.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-8">{t.globalStories}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {globalStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      isLiked={likedStories.has(story.id)}
                      onLike={() => toggleLike(story.id)}
                      mounted={mounted}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
        </div>
      </main>
    </>
  )
}

function StoryCard({
  story,
  isLiked,
  onLike,
  mounted
}: {
  story: Story
  isLiked: boolean
  onLike: () => void
  mounted: boolean
}) {
  const t = siteCopy

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full bg-card/50 backdrop-blur border border-border/50">
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
          {recoveryConditionLabel(story.condition, t)}
        </span>
        <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
          {recoveryCategoryLabel(story.category, t)}
        </span>
      </div>

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground mb-1">
          {story.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {story.context}
        </p>
      </div>

      {/* Story */}
      <div className="mb-4 flex-grow">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {story.story}
        </p>
      </div>

      {/* Coping Strategies */}
      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t.storyCardCopingStrategies}</p>
        <p className="text-sm text-foreground">
          {story.coping}
        </p>
      </div>

      {/* Quote */}
      <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm italic text-foreground font-medium flex items-start gap-2">
          <span className="text-lg leading-none">💬</span>
          <span>"{story.quote}"</span>
        </p>
      </div>

      {/* Like Button */}
      {mounted && (
        <Button
          variant="outline"
          size="sm"
          onClick={onLike}
          className={`w-full gap-2 transition-all ${
            isLiked
              ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
              : 'hover:bg-muted'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-red-600' : ''}`} />
          <span>{isLiked ? t.storyCardHelpful : t.storyCardMarkHelpful}</span>
          <span className="ml-auto text-xs font-semibold">
            {story.likes + (isLiked ? 1 : 0)}
          </span>
        </Button>
      )}
    </Card>
  )
}
