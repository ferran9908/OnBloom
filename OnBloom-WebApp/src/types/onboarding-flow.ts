export interface OnboardingPerson {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  connectionType: 'direct' | 'indirect';
  reasoning?: string; // For indirect connections
  profileImage?: string;
  phone?: string;
  location?: string;
  startDate?: string;
}

export interface OnboardingProcess {
  id: string;
  title: string;
  description: string;
  source: 'notion' | 'web' | 'internal';
  url: string;
  category: string;
}

export interface OnboardingTraining {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: string;
  source: 'youtube' | 'internal';
}

export interface OnboardingAccess {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

export interface OnboardingFlowData {
  employee: {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    startDate: string;
  };
  people: OnboardingPerson[];
  processes: OnboardingProcess[];
  training: OnboardingTraining[];
  access: OnboardingAccess[];
}