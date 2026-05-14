export interface NavigationResponse {
  message: string
  action?: {
    type: 'navigate' | 'information' | 'redirect'
    target?: string
    label?: string
  }
  suggestions?: Array<{
    text: string
    action: string
  }>
}

const navigationIntents = {
  'find professional': {
    message: "I can help you find qualified mental health professionals. Let me redirect you to our professionals directory where you can search by specialization, location, and experience.",
    action: { type: 'navigate', target: '/professionals', label: 'View Professionals' },
    suggestions: [
      { text: 'Browse all professionals', action: '/professionals' },
      { text: 'Request a consultation', action: '/consultation' }
    ]
  },
  'consultation': {
    message: "To request a consultation with a mental health professional, I can take you to our consultation request form. Just fill in your details and area of concern.",
    action: { type: 'navigate', target: '/consultation', label: 'Request Consultation' },
    suggestions: [
      { text: 'Submit consultation form', action: '/consultation' },
      { text: 'Browse professionals first', action: '/professionals' }
    ]
  },
  'self-care': {
    message: "We have wonderful self-care tools available including breathing exercises, meditation guides, and wellness routines. Let me take you to our self-care resources.",
    action: { type: 'navigate', target: '/self-care', label: 'View Self-Care Tools' },
    suggestions: [
      { text: 'Explore self-care tools', action: '/self-care' },
      { text: 'Back to home', action: '/' }
    ]
  },
  'emergency': {
    message: "If you or someone you know is in crisis, please reach out immediately. I can connect you to our emergency hotlines and crisis support resources.",
    action: { type: 'navigate', target: '/emergency', label: 'View Emergency Help' },
    suggestions: [
      { text: 'View emergency contacts', action: '/emergency' },
      { text: 'Get crisis support now', action: '/emergency' }
    ]
  },
  'organization': {
    message: "To find mental health organizations and support centers across Ethiopia, let me take you to our organizations directory.",
    action: { type: 'navigate', target: '/organizations', label: 'View Organizations' },
    suggestions: [
      { text: 'Browse organizations', action: '/organizations' },
      { text: 'Find near me', action: '/organizations' }
    ]
  },
  'home': {
    message: "Let me take you back to the home page where you can access all our resources.",
    action: { type: 'navigate', target: '/', label: 'Go Home' },
    suggestions: [
      { text: 'Back to home', action: '/' },
      { text: 'Explore resources', action: '/professionals' }
    ]
  }
}

export function getNavigationResponse(userQuery: string): NavigationResponse {
  const query = userQuery.toLowerCase().trim()
  
  // Check for exact matches
  for (const [intent, response] of Object.entries(navigationIntents)) {
    if (query.includes(intent)) {
      return response as NavigationResponse
    }
  }

  // Check for keyword matches
  if (query.includes('help') || query.includes('support') || query.includes('need')) {
    if (query.includes('crisis') || query.includes('emergency') || query.includes('urgent') || query.includes('immediate')) {
      return navigationIntents['emergency'] as NavigationResponse
    }
    if (query.includes('professional') || query.includes('therapist') || query.includes('doctor') || query.includes('counselor')) {
      return navigationIntents['find professional'] as NavigationResponse
    }
    if (query.includes('self') || query.includes('care') || query.includes('exercise') || query.includes('meditation')) {
      return navigationIntents['self-care'] as NavigationResponse
    }
  }

  if (query.includes('where') || query.includes('how') || query.includes('what')) {
    if (query.includes('organization') || query.includes('center') || query.includes('facility')) {
      return navigationIntents['organization'] as NavigationResponse
    }
    if (query.includes('professional') || query.includes('therapist')) {
      return navigationIntents['find professional'] as NavigationResponse
    }
  }

  // Default response
  return {
    message: "I'm here to help guide you through MindBridge Ethiopia. I can help you find professionals, request consultations, access self-care tools, find organizations, or get emergency support. What would you like to do?",
    suggestions: [
      { text: 'Find a professional', action: '/professionals' },
      { text: 'Request consultation', action: '/consultation' },
      { text: 'Self-care tools', action: '/self-care' },
      { text: 'Emergency help', action: '/emergency' },
      { text: 'Organizations', action: '/organizations' }
    ]
  }
}

export function validateResponse(response: NavigationResponse): boolean {
  return !!response.message && response.message.length > 0
}
