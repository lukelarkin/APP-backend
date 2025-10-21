import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    archetype: string;
  };
}

export interface JwtPayload {
  id: string;
  email: string;
  archetype: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  archetype: string;
  timezone?: string;
  bedtime?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CheckInDto {
  part: string;
  emotion: string;
  quadrant: string;
  intensity: number;
  notes?: string;
}

export interface LetterDto {
  subject: string;
  body: string;
  author?: string;
  audioUrl?: string;
}

export interface CommunityMessageDto {
  messageType: 'gratitude' | 'support' | 'ritual';
  content: string;
  recipientId?: string;
}

export interface TriggerEventDto {
  userId: string;
  eventType: string;
  payload?: Record<string, unknown>;
}

export type Archetype = 'Warrior' | 'Sage' | 'Lover' | 'Seeker';

export interface InterventionContent {
  type: string;
  title: string;
  content: string;
  archetype: Archetype;
}
