# Trauma-Informed Design Principles in TARU Backend

## Overview

TARU (Trauma-Aware Recovery Utility) is built on trauma-informed care principles, integrating evidence-based therapeutic approaches including Internal Family Systems (IFS) therapy and sacred archetypes.

## Core Design Principles

### 1. Safety First

**Implementation:**
- JWT authentication to ensure user data privacy
- Private journaling with `isPrivate` flag
- Anonymous community posting option
- User-controlled data sharing

**Technical Features:**
- Password hashing with bcryptjs
- Secure token-based authentication
- User data isolation (all queries filtered by userId)
- Option to flag inappropriate community content

### 2. Trustworthiness & Transparency

**Implementation:**
- Clear API responses with appropriate status codes
- Validation errors that guide users without shaming
- Audit trail with `createdAt` and `updatedAt` timestamps
- Webhook support for external therapeutic integrations

### 3. Peer Support

**Implementation:**
- Community messages system
- Anonymous sharing option
- Like functionality for positive reinforcement
- Non-judgmental flagging system (not public shaming)

**Database Design:**
```typescript
model CommunityMessage {
  isAnonymous Boolean  @default(false)  // User controls identity
  likes       Int      @default(0)      // Positive reinforcement
  flagged     Boolean  @default(false)  // Safety without shame
}
```

### 4. Collaboration & Mutuality

**Implementation:**
- User-defined coping strategies in triggers
- Customizable archetype system
- Self-reported mood and parts data
- User controls intervention delivery timing

### 5. Empowerment, Voice & Choice

**Implementation:**
- User chooses preferred archetype
- User controls when to deliver letters
- Optional fields throughout (respects boundaries)
- User-initiated trigger activation
- Choice of anonymous or identified community participation

### 6. Cultural, Historical & Gender Issues

**Implementation:**
- Sacred archetypes (Warrior, Healer, Sage, Creator, Lover)
- Trauma background field (optional, user-defined)
- Flexible gender-neutral data model
- Support for diverse cultural healing practices via webhooks

## Internal Family Systems (IFS) Integration

### Parts Check-Ins

The backend supports IFS therapy through the `PartsCheckIn` model:

```typescript
model PartsCheckIn {
  partName    String  // e.g., "Inner Critic", "Protector"
  emotion     String  // Current emotional state
  message     String? // What the part is communicating
  burden      String? // What this part is carrying
  needs       String? // What this part needs for healing
}
```

**Trauma-Informed Aspects:**
- Non-pathologizing language (parts, not disorders)
- Recognition that parts serve protective functions
- Space for understanding burdens without judgment
- Focus on needs rather than problems

### Self-Leadership

The archetype system supports Self energy development:

```typescript
model UserArchetype {
  archetype   String  // Sacred archetype name
  strength    Int     // Current strength/activation
  isActive    Boolean // User can activate/deactivate
  description String? // Personal meaning
}
```

## Mood Tracking for Nervous System Regulation

### Trauma-Aware Features:

1. **Intensity Scale (1-10)**: Respects that trauma survivors may experience extreme emotional states
2. **Tags System**: Allows tracking of triggers without prescriptive categories
3. **Notes Field**: Space for context without forced narrative
4. **Statistics**: Helps identify patterns for nervous system regulation

### Example Use:

```json
{
  "mood": "triggered",
  "intensity": 9,
  "notes": "Loud noise reminded me of...",
  "tags": ["sound", "unexpected", "public"]
}
```

## Interventions: Gentle Healing Practices

### 1. Letters to Loved Ones

**Purpose**: Undelivered emotional communications
**Trauma-Informed Design:**
- Can be written without sending (`isDelivered: false`)
- User controls delivery timing
- Safe space for expressing difficult emotions
- No judgment on content

### 2. Private Journaling

**Purpose**: Processing and integration
**Trauma-Informed Design:**
- Default is private (`isPrivate: true`)
- User-defined tags (not prescribed categories)
- Optional mood tracking
- No forced prompts or templates

### 3. Gratitude Practice

**Purpose**: Nervous system regulation through positive focus
**Trauma-Informed Design:**
- Simple, low-pressure format
- Optional categorization
- No minimum frequency required
- Celebrates small wins

## Trigger Management

### Trauma-Aware Implementation:

```typescript
model Trigger {
  name        String  // User-defined name
  severity    Int     // 1-10, user-assessed
  coping      String? // User's own strategies
  webhookUrl  String? // Integration with support systems
}
```

**Key Features:**
- User defines what is triggering (not clinician-prescribed)
- User rates severity (validates their experience)
- User documents their own coping strategies
- Optional webhook for immediate external support

### Activation Flow:

When a trigger is activated:
1. Logs the event (for pattern recognition)
2. Calls webhook if configured (immediate support)
3. Returns coping strategies to user
4. No judgment or shame

## Data Privacy & Control

### User Rights:

1. **View All Data**: Users can see all their stored information
2. **Delete Data**: Cascade deletes protect user privacy
3. **Control Sharing**: Anonymous options where appropriate
4. **Export Capability**: (Future feature) - users own their healing journey data

### Technical Implementation:

```typescript
// All relations use onDelete: Cascade
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
```

This ensures that if a user deletes their account, all personal data is removed.

## API Response Philosophy

### Non-Triggering Error Messages:

❌ Avoid:
- "Invalid input" (shaming)
- "User error" (blaming)
- "Failed" (catastrophizing)

✅ Use:
- "Please check your email format" (guidance)
- "Token expired, please log in again" (clear action)
- "Unable to process request" (neutral)

### Success Responses:

Always return complete objects so users have full context of their data.

## Community Guidelines Implementation

### Safety Without Surveillance:

1. **Flagging (not reporting)**: Marks content for review without public shame
2. **Likes (not comments)**: Simple positive reinforcement, reduces conflict
3. **Anonymous option**: Protects vulnerable users
4. **No user-to-user messaging**: Prevents boundary violations

### Technical Safety:

```typescript
// Only show non-flagged messages
where: { flagged: false }

// Hide identity when anonymous
user: msg.isAnonymous ? null : msg.user
```

## Webhook Integration for Support Networks

Allows connection to:
- Crisis support services
- Therapist notification systems
- Trusted person alerts
- Emergency services

**Trauma-Informed Design:**
- User controls what triggers send webhooks
- User provides webhook URL (their choice of support)
- Failures don't block the user experience
- Rich context provided to support systems

## Future Considerations

### Planned Enhancements:
1. Consent-based data sharing with therapists
2. Export functionality for user data ownership
3. Configurable notification preferences
4. Integration with evidence-based therapeutic apps
5. Multi-language support for cultural accessibility

### Research-Backed Features to Add:
- Window of tolerance tracking
- Grounding technique suggestions
- Resource building exercises
- Narrative therapy support

## Developer Guidelines

When adding features, ask:

1. **Safety**: Does this protect user privacy and emotional safety?
2. **Choice**: Does the user have control?
3. **Non-pathologizing**: Does the language respect the user's experience?
4. **Boundaries**: Are there appropriate limits on features?
5. **Transparency**: Is it clear what data is collected and why?
6. **Accessibility**: Can users of varying abilities use this?

## Resources

- [IFS Institute](https://ifs-institute.com/)
- [Trauma-Informed Care Implementation Resource Center](https://www.traumainformedcare.chcs.org/)
- [SAMHSA's Concept of Trauma and Guidance for a Trauma-Informed Approach](https://store.samhsa.gov/product/SAMHSA-s-Concept-of-Trauma-and-Guidance-for-a-Trauma-Informed-Approach/SMA14-4884)

## Contributing

When contributing to TARU, please ensure your code:
- Respects user autonomy
- Maintains privacy and security
- Uses non-pathologizing language
- Provides clear, gentle error messages
- Supports diverse healing journeys

---

*"All parts are welcome. All parts have value. All parts deserve compassion."*
