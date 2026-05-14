export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  content: {
    title: string
    subtitle: string
    overview: string
    symptoms: string[]
    resources: Array<{
      title: string
      description: string
      type: 'article' | 'exercise' | 'hotline' | 'service'
    }>
    professionals: string[]
  }
}

export const categories: Category[] = [
  {
    id: 'mental-health',
    name: 'Mental Health',
    slug: 'mental-health',
    description: 'General mental health support, anxiety, depression, and stress management',
    icon: 'Brain',
    color: 'primary',
    content: {
      title: 'Mental Health Support',
      subtitle: 'Support for anxiety, depression, stress, and overall wellbeing',
      overview: 'Mental health is as important as physical health. Whether you\'re experiencing anxiety, depression, stress, or just need someone to talk to, MindBridge Ethiopia is here to support you on your journey to better mental wellness.',
      symptoms: [
        'Persistent sadness or emptiness',
        'Excessive worry or panic',
        'Loss of interest in activities',
        'Sleep disturbances',
        'Difficulty concentrating',
        'Feelings of worthlessness'
      ],
      resources: [
        {
          title: 'Understanding Depression',
          description: 'Learn about depression symptoms and coping strategies',
          type: 'article'
        },
        {
          title: 'Anxiety Management Techniques',
          description: 'Evidence-based methods to manage anxiety disorders',
          type: 'article'
        },
        {
          title: 'Progressive Muscle Relaxation',
          description: 'A guided technique to reduce tension and stress',
          type: 'exercise'
        },
        {
          title: 'Mental Health Hotline',
          description: '24/7 support available in Amharic and English',
          type: 'hotline'
        }
      ],
      professionals: ['Dr. Abebe Kassa', 'Dr. Mahlet Yimer', 'Counselor Tadesse']
    }
  },
  {
    id: 'crisis',
    name: 'Crisis Support',
    slug: 'crisis',
    description: 'Immediate support for suicidal thoughts, self-harm, and acute mental health crises',
    icon: 'AlertCircle',
    color: 'destructive',
    content: {
      title: 'Crisis Support Services',
      subtitle: 'Immediate help when you need it most',
      overview: 'If you\'re experiencing a mental health crisis, suicidal thoughts, or feeling overwhelmed, help is available right now. MindBridge Ethiopia provides 24/7 crisis support and emergency services.',
      symptoms: [
        'Suicidal thoughts or urges',
        'Intense feelings of despair',
        'Self-harm urges',
        'Severe panic attacks',
        'Acute dissociation',
        'Loss of control or reality'
      ],
      resources: [
        {
          title: 'National Suicide Prevention',
          description: 'Call 9119 for immediate crisis support (toll-free)',
          type: 'hotline'
        },
        {
          title: 'Crisis Text Line',
          description: 'Text HOME to 741741 for confidential support',
          type: 'hotline'
        },
        {
          title: 'Emergency Mental Health Services',
          description: 'Hospital-based psychiatric emergency services',
          type: 'service'
        },
        {
          title: 'Safety Planning',
          description: 'Create a personalized crisis action plan',
          type: 'article'
        }
      ],
      professionals: ['Crisis Intervention Team', 'Emergency Psychiatrists', '24/7 Hotline Counselors']
    }
  },
  {
    id: 'women-health',
    name: 'Women\'s Health',
    slug: 'womens-health',
    description: 'Mental health support specific to women\'s experiences including postpartum, reproductive health, and gender-specific challenges',
    icon: 'Heart',
    color: 'accent',
    content: {
      title: 'Women\'s Mental Health Support',
      subtitle: 'Tailored support for women\'s unique mental health needs',
      overview: 'Women face unique mental health challenges including hormonal changes, reproductive health concerns, and societal pressures. Our specialized women\'s health services provide compassionate, culturally-sensitive support.',
      symptoms: [
        'Postpartum depression or anxiety',
        'Premenstrual mood changes',
        'Reproductive trauma',
        'Gender-based stress',
        'Identity and body image concerns',
        'Relationship and family stress'
      ],
      resources: [
        {
          title: 'Postpartum Mental Health Guide',
          description: 'Support for mothers experiencing postpartum depression or anxiety',
          type: 'article'
        },
        {
          title: 'Reproductive Health and Mental Wellness',
          description: 'Understanding hormonal influences on mental health',
          type: 'article'
        },
        {
          title: 'Self-Compassion for Women',
          description: 'Guided meditation and self-care practices',
          type: 'exercise'
        },
        {
          title: 'Women\'s Health Clinic',
          description: 'Specialized women\'s mental health services',
          type: 'service'
        }
      ],
      professionals: ['Dr. Almaz Girma', 'Dr. Hiwot Zewdie', 'Counselor Yohannes']
    }
  },
  {
    id: 'anti-bullying',
    name: 'Anti-Bullying',
    slug: 'anti-bullying',
    description: 'Support for those experiencing bullying, harassment, and cyberbullying',
    icon: 'Shield',
    color: 'secondary',
    content: {
      title: 'Anti-Bullying Support',
      subtitle: 'You\'re not alone - support for bullying and harassment',
      overview: 'Bullying and harassment can have serious impacts on mental health. Whether it\'s in-person, online, or at school, we\'re here to support you and help you find your strength.',
      symptoms: [
        'Anxiety and fear',
        'Social withdrawal',
        'Loss of confidence',
        'Sleep problems',
        'Suicidal thoughts',
        'Academic or work performance decline'
      ],
      resources: [
        {
          title: 'Understanding Cyberbullying',
          description: 'Guide to recognizing and responding to online harassment',
          type: 'article'
        },
        {
          title: 'Building Resilience and Confidence',
          description: 'Strategies to develop self-esteem and coping skills',
          type: 'article'
        },
        {
          title: 'Bullying Support Group',
          description: 'Connect with others who have experienced bullying',
          type: 'service'
        },
        {
          title: 'Report Bullying Safely',
          description: 'Anonymous reporting and intervention services',
          type: 'service'
        }
      ],
      professionals: ['School Counselors', 'Youth Advocates', 'Trauma Specialists']
    }
  },
  {
    id: 'domestic-violence',
    name: 'Domestic Violence',
    slug: 'domestic-violence',
    description: 'Support and resources for those experiencing domestic violence, abuse, or intimate partner violence',
    icon: 'Lock',
    color: 'destructive',
    content: {
      title: 'Domestic Violence Support',
      subtitle: 'Safe support for those experiencing abuse',
      overview: 'If you\'re experiencing domestic violence or abuse, you deserve support and safety. MindBridge Ethiopia provides confidential resources and connections to help you.',
      symptoms: [
        'Physical injuries or pain',
        'Anxiety and hypervigilance',
        'Depression and hopelessness',
        'Post-traumatic stress',
        'Isolation from support systems',
        'Financial stress and control'
      ],
      resources: [
        {
          title: 'Recognizing Abuse',
          description: 'Understanding physical, emotional, and financial abuse',
          type: 'article'
        },
        {
          title: 'Safety Planning',
          description: 'Create a plan to stay safe and leave abusive situations',
          type: 'article'
        },
        {
          title: 'Domestic Violence Hotline',
          description: '24/7 confidential support and shelter information',
          type: 'hotline'
        },
        {
          title: 'Safe Houses & Shelters',
          description: 'Emergency shelter and transitional housing',
          type: 'service'
        }
      ],
      professionals: ['Domestic Violence Advocates', 'Trauma Counselors', 'Legal Advisors']
    }
  },
  {
    id: 'youth-support',
    name: 'Youth Support',
    slug: 'youth-support',
    description: 'Mental health support tailored for adolescents and young adults facing unique challenges',
    icon: 'Users',
    color: 'primary',
    content: {
      title: 'Youth Mental Health Support',
      subtitle: 'Support for teens and young adults navigating life\'s challenges',
      overview: 'Youth face unique mental health challenges including academic pressure, identity development, peer relationships, and social media influences. MindBridge Ethiopia offers support specifically for young people.',
      symptoms: [
        'Academic stress and pressure',
        'Social anxiety and peer pressure',
        'Identity and self-esteem issues',
        'Substance use concerns',
        'Relationship difficulties',
        'Family conflict'
      ],
      resources: [
        {
          title: 'Teen Mental Health 101',
          description: 'Understanding adolescent mental health challenges',
          type: 'article'
        },
        {
          title: 'Academic Stress Management',
          description: 'Strategies for managing school and exam pressure',
          type: 'article'
        },
        {
          title: 'Youth Peer Support Group',
          description: 'Connect with other young people and share experiences',
          type: 'service'
        },
        {
          title: 'College Mental Health Planning',
          description: 'Prepare for mental health in higher education',
          type: 'article'
        }
      ],
      professionals: ['School Psychologists', 'Youth Counselors', 'Career Advisors']
    }
  }
]
