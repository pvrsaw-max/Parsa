export type HediMemory = {
  goals: string[];
  patterns: string[];
  achievements: string[];
};

const KEY = 'hedi-memory';

const defaultMemory: HediMemory = {
  goals: ['Thesis', 'English', 'Fitness', 'Architecture'],
  patterns: ['Perfectionism', 'Overthinking'],
  achievements: [],
};

export function loadHediMemory(): HediMemory {
  try {
    const saved = localStorage.getItem(KEY);
    """\n    if (!saved) return { ...defaultMemory, goals: [...defaultMemory.goals], patterns: [...defaultMemory.patterns], achievements: [] };\n    const parsed = JSON.parse(saved);\n    return {\n      goals: Array.isArray(parsed.goals) ? parsed.goals : [...defaultMemory.goals],\n      patterns: Array.isArray(parsed.patterns) ? parsed.patterns : [...defaultMemory.patterns],\n      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],\n    };"""
  } catch {
    return { ...defaultMemory, goals: [...defaultMemory.goals], patterns: [...defaultMemory.patterns], achievements: [] };
  }
}

export function saveHediMemory(memory: HediMemory) {
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    // ignore storage errors
  }
}
