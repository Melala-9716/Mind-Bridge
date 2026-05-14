export const supportCategories = [
  {
    id: 'mental-health',
    title: 'Mental Health Support',
    description: 'Professional guidance for depression, anxiety, and general wellbeing',
    icon: 'Brain',
    color: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-700 dark:text-blue-300',
    resources: [
      {
        title: 'Understanding Depression',
        description: 'Learn about depression symptoms, causes, and treatment options',
        content: 'Depression is a medical condition affecting mood, energy, and motivation. It\'s treatable through therapy, medication, lifestyle changes, or a combination of approaches.',
      },
      {
        title: 'Managing Anxiety',
        description: 'Strategies to cope with anxiety and panic attacks',
        content: 'Anxiety is your body\'s response to stress. Techniques like deep breathing, progressive muscle relaxation, and cognitive behavioral therapy can help manage anxiety symptoms effectively.',
      },
      {
        title: 'Building Resilience',
        description: 'Develop emotional strength and coping mechanisms',
        content: 'Resilience is the ability to bounce back from challenges. Build it through strong relationships, self-care, realistic thinking, and seeking support when needed.',
      },
    ],
  },
  {
    id: 'crisis',
    title: 'Crisis Support',
    description: 'Immediate help for mental health emergencies and suicidal thoughts',
    icon: 'AlertCircle',
    color: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-700 dark:text-red-300',
    resources: [
      {
        title: 'Crisis Hotlines',
        description: 'Available 24/7 emergency support lines',
        content: 'If you\'re having thoughts of suicide, please reach out immediately. Call our crisis hotline or go to the nearest emergency room. Help is available right now.',
      },
      {
        title: 'Safety Planning',
        description: 'Create a personal plan for mental health crises',
        content: 'A safety plan identifies warning signs, coping strategies, people to contact, and professional resources. Having a plan ready can help during difficult moments.',
      },
      {
        title: 'After a Crisis',
        description: 'Recovery and support following a mental health emergency',
        content: 'After a crisis, self-care is crucial. Maintain regular contact with mental health professionals, follow treatment plans, and rebuild your support network.',
      },
    ],
  },
  {
    id: 'womens-health',
    title: 'Women\'s Mental Health',
    description: 'Support for women facing unique mental health challenges',
    icon: 'Heart',
    color: 'bg-pink-50 dark:bg-pink-900/20',
    textColor: 'text-pink-700 dark:text-pink-300',
    resources: [
      {
        title: 'Maternal Mental Health',
        description: 'Postpartum depression, anxiety, and perinatal mental health',
        content: 'Pregnancy and postpartum periods bring significant changes. Maternal mental health conditions are common and treatable. Support includes therapy, medication, and community resources.',
      },
      {
        title: 'Hormonal Health',
        description: 'Understanding mood changes related to hormonal cycles',
        content: 'Hormonal fluctuations can affect mood and mental health. PMS, PMDD, and menopause-related changes are real medical conditions that benefit from professional support.',
      },
      {
        title: 'Empowerment and Self-Worth',
        description: 'Building confidence and healthy relationships',
        content: 'Every woman deserves to feel empowered and valued. Therapy focuses on building self-worth, setting boundaries, and developing healthy relationships.',
      },
    ],
  },
  {
    id: 'anti-bullying',
    title: 'Anti-Bullying Support',
    description: 'Resources for those experiencing or affected by bullying',
    icon: 'Shield',
    color: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-700 dark:text-green-300',
    resources: [
      {
        title: 'What is Bullying?',
        description: 'Understanding different types of bullying and its impacts',
        content: 'Bullying includes physical, verbal, social, and cyberbullying. It causes lasting emotional harm. No one deserves to be bullied, and there is help available.',
      },
      {
        title: 'Coping Strategies',
        description: 'Ways to handle bullying situations and recover',
        content: 'Speak up, document incidents, and report to authorities. Find trusted adults or counselors to support you. Building a strong support network helps recovery.',
      },
      {
        title: 'Supporting Others',
        description: 'How to help someone experiencing bullying',
        content: 'Be a friend and ally. Listen without judgment, help them report incidents, and remind them it\'s not their fault. Include them and make them feel valued.',
      },
    ],
  },
  {
    id: 'domestic-violence',
    title: 'Domestic Violence Support',
    description: 'Help for those in abusive relationships',
    icon: 'Hand',
    color: 'bg-purple-50 dark:bg-purple-900/20',
    textColor: 'text-purple-700 dark:text-purple-300',
    resources: [
      {
        title: 'Recognizing Abuse',
        description: 'Understanding different forms of abuse',
        content: 'Abuse can be physical, emotional, financial, or sexual. It\'s never your fault. You deserve safety, respect, and support. Professional help is available.',
      },
      {
        title: 'Safety Planning',
        description: 'Creating a safe exit plan from an abusive relationship',
        content: 'Safety planning includes important documents, emergency funds, trusted contacts, and safe places to go. Work with professionals to create your plan.',
      },
      {
        title: 'Healing and Recovery',
        description: 'Rebuilding life after leaving an abusive relationship',
        content: 'Recovery takes time. Trauma therapy, support groups, and community resources help survivors heal and rebuild. You are not alone in this journey.',
      },
    ],
  },
  {
    id: 'youth',
    title: 'Youth Support',
    description: 'Mental health resources specifically for young people',
    icon: 'Users',
    color: 'bg-yellow-50 dark:bg-yellow-900/20',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    resources: [
      {
        title: 'School Stress and Academic Pressure',
        description: 'Managing educational stress and performance anxiety',
        content: 'School pressure is real and can impact mental health. Time management, study skills, and stress management techniques help. Talk to counselors and teachers.',
      },
      {
        title: 'Social and Peer Issues',
        description: 'Navigating friendships, social media, and identity',
        content: 'Peer relationships matter during youth. Social media pressures, bullying, and identity questions affect mental health. You are not alone in these feelings.',
      },
      {
        title: 'Future Planning',
        description: 'Managing anxiety about career and life decisions',
        content: 'Future uncertainty is normal. Career counseling, mentorship, and exploring options help. It\'s okay not to have all the answers right now.',
      },
    ],
  },
]

export const moderationResponses = {
  safe: [
    'Thank you for sharing your story. Your courage and openness help others feel less alone.',
    'We appreciate you sharing this experience. Your voice matters in our community.',
    'Thank you for contributing to our supportive community.',
  ],
  sensitive: [
    'Thank you for sharing. This story contains sensitive content and is pending review for community safety.',
    'Your story has been received and is being reviewed by our moderation team.',
    'This story is being reviewed to ensure it meets our community guidelines.',
  ],
  blocked: [
    'This story contains content that violates our community guidelines and cannot be published.',
    'This story cannot be shared as it contains harmful content.',
    'This submission does not meet our community guidelines.',
  ],
}

export function mockModerationCheck(text: string): 'safe' | 'sensitive' | 'blocked' {
  const blockedKeywords = ['harm', 'suicide', 'abuse', 'violence', 'explicit']
  const sensitiveKeywords = ['trauma', 'assault', 'medication', 'hospital', 'crisis']

  const lowerText = text.toLowerCase()

  if (blockedKeywords.some((keyword) => lowerText.includes(keyword))) {
    return 'blocked'
  }

  if (sensitiveKeywords.some((keyword) => lowerText.includes(keyword))) {
    return 'sensitive'
  }

  return 'safe'
}
