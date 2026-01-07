// ============================================================
// 🔖 Type Definitions for CogniSeek
// ============================================================

export interface ItemCategory {
  id: string
  label: string
  icon: string
  items: Array<{ id: string; label: string }>
}

export interface LocationCategory {
  id: string
  name: string
  icon: string
  subLocations: string[]
}

export interface ActivityCategory {
  id: string
  name: string
}

export interface MoodOption {
  id: string
  label: string
}

export interface SearchSession {
  // Step 0: Location Selection
  lossLocationCategory: string
  lossLocationSubCategory: string[]
  lossLocationCustom: string
  
  // Step 1: Item Identification
  itemCategory: string
  itemName: string
  itemFeatures: string
  itemSize: 'small' | 'medium' | 'large'
  itemColor: string
  
  // Step 2: Time Trace
  lossTime: string
  lossTimeRange: string
  preciseTime: string
  
  // Step 3: Scene Reconstruction
  lossLocation: string
  lossScenario: string
  
  // Step 4: Context & Emotion
  userMood: string
  userActivity: string
  additionalContext: string
  
  // Step 5: Final Review
  confidence: number
}

export const initialSearchSession: SearchSession = {
  // Step 0
  lossLocationCategory: '',
  lossLocationSubCategory: [],
  lossLocationCustom: '',
  
  // Step 1
  itemCategory: '',
  itemName: '',
  itemFeatures: '',
  itemSize: 'medium',
  itemColor: '',
  
  // Step 2
  lossTime: '',
  lossTimeRange: '',
  preciseTime: '',
  
  // Step 3
  lossLocation: '',
  lossScenario: '',
  
  // Step 4
  userMood: '',
  userActivity: '',
  additionalContext: '',
  
  // Step 5
  confidence: 0,
}
