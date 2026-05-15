export const searchableContent = [
  {
    id: '1',
    type: 'category',
    title: 'Mental Health Support',
    description: 'Professional guidance for depression, anxiety, and general wellbeing',
    url: '/support/mental-health',
    keywords: ['mental', 'health', 'depression', 'anxiety', 'therapy', 'counseling'],
  },
  {
    id: '2',
    type: 'category',
    title: 'Crisis Support',
    description: 'Immediate help for mental health emergencies and suicidal thoughts',
    url: '/support/crisis',
    keywords: ['crisis', 'emergency', 'suicide', 'help', 'urgent', 'hotline'],
  },
  {
    id: '3',
    type: 'category',
    title: 'Women\'s Mental Health',
    description: 'Support for women facing unique mental health challenges',
    url: '/support/womens-health',
    keywords: ['women', 'postpartum', 'maternal', 'hormonal', 'pregnancy', 'health'],
  },
  {
    id: '4',
    type: 'category',
    title: 'Anti-Bullying Support',
    description: 'Resources for those experiencing or affected by bullying',
    url: '/support/anti-bullying',
    keywords: ['bullying', 'cyberbullying', 'harassment', 'support', 'ally'],
  },
  {
    id: '5',
    type: 'category',
    title: 'Domestic Violence Support',
    description: 'Help for those in abusive relationships',
    url: '/support/domestic-violence',
    keywords: ['violence', 'abuse', 'relationship', 'safety', 'help'],
  },
  {
    id: '6',
    type: 'category',
    title: 'Youth Support',
    description: 'Mental health resources specifically for young people',
    url: '/support/youth',
    keywords: ['youth', 'teens', 'school', 'students', 'young', 'stress'],
  },
  {
    id: '7',
    type: 'resource',
    title: 'Find Mental Health Professionals',
    description: 'Connect with qualified professionals in your area',
    url: '/professionals',
    keywords: ['professionals', 'therapists', 'counselors', 'psychiatrists', 'doctors'],
  },
  {
    id: '8',
    type: 'resource',
    title: 'Find Mental Health Facilities',
    description: 'Locate mental health centers and clinics across Ethiopia',
    url: '/map',
    keywords: ['facilities', 'hospitals', 'clinics', 'centers', 'location', 'map'],
  },
  {
    id: '9',
    type: 'resource',
    title: 'Community Stories',
    description: 'Share and read stories from others in our community',
    url: '/community',
    keywords: ['stories', 'community', 'experiences', 'share', 'inspiration'],
  },
  {
    id: '10',
    type: 'resource',
    title: 'AI Support Chat',
    description: 'Talk to our AI-powered support chatbot anytime',
    url: '/chat',
    keywords: ['chat', 'support', 'ai', 'talk', 'assistance', 'help'],
  },
  {
    id: '11',
    type: 'resource',
    title: 'Self-Care Tools',
    description: 'Breathing exercises, guided meditations, and more',
    url: '/self-care',
    keywords: ['self-care', 'meditation', 'breathing', 'exercises', 'relaxation'],
  },
  {
    id: '12',
    type: 'resource',
    title: 'Emergency Contacts',
    description: '24/7 crisis hotlines and emergency resources',
    url: '/emergency',
    keywords: ['emergency', 'crisis', 'hotline', 'contact', 'help', 'urgent'],
  },
]

export function searchContent(query: string) {
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) return []

  return searchableContent
    .filter((item) => {
      return (
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.keywords.some((keyword) => keyword.includes(lowerQuery))
      )
    })
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(lowerQuery)
      const bTitle = b.title.toLowerCase().includes(lowerQuery)

      if (aTitle && !bTitle) return -1
      if (!aTitle && bTitle) return 1
      return 0
    })
}
