import { detectMood } from './moodDetector';
import { responseBank } from './responseBank';

export function hediBrain(message: string) {
  const mood = detectMood(message);
  const answers = responseBank[mood] || responseBank.GENERAL;
  return answers[Math.floor(Math.random() * answers.length)];
}
