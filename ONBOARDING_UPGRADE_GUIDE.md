# 🚀 Onboarding Upgrade Guide - 15 Steps Enhanced Version

## Overview

We've upgraded the onboarding from **7 steps** to **15 sophisticated steps** based on research from leading maternal health apps (Flo, Ovia) and clinical mental health screening standards (PHQ-2, GAD-2).

## What's New

### Research-Based Enhancements

**Based on:**
- **Flo App**: 70 questions across 5 health areas (menstrual health, pregnancy, general health, etc.)
- **Ovia App**: Daily habit tracking, symptom monitoring, health assessments
- **Clinical Standards**: PHQ-2 (depression screening), GAD-2 (anxiety screening)
- **EMA Principles**: Ecological Momentary Assessment for real-time emotion capture

### New Steps (8 additional questions)

| Step | Category | Description | Inspired By |
|------|----------|-------------|-------------|
| 5 | Physical Health | Symptoms & pain level (nausea, back pain, headaches, etc.) | Flo |
| 6 | Sleep Quality | Sleep hours, quality rating, specific challenges | Ovia |
| 7 | Support System | Network, partner relationship, isolation feelings | Research |
| 8 | Daily Habits | Vitamins, exercise, water intake, healthy meals | Ovia |
| 9 | Stress & Coping | Stress level (1-10), triggers, coping mechanisms | EMA |
| 11 | Energy Levels | Energy rating, fatigue patterns (morning/evening) | Clinical |
| 12 | Mental Health | PHQ-2/GAD-2 inspired screening, resource interest | Clinical |
| 14 | Goal-Setting | Preferences for structured vs. flexible goals | Behavioral |

### Enhanced Existing Steps

| Step | Enhancement |
|------|-------------|
| 4 (Emotion) | Added intensity scale (1-5) for sentiment tracking |
| 15 (Notifications) | Granular preferences (daily check-in, tips, community, celebrations) |

## Architecture Changes

### 1. Enhanced Data Model

**File**: `src/services/onboardingService.ts`

New `OnboardingData` interface includes:
- Emotion intensity tracking
- Physical symptoms with pain scale
- Sleep quality metrics
- Support system evaluation
- Daily habit baselines
- Stress triggers and coping strategies
- Energy level assessment
- Mental health screening (PHQ-2/GAD-2 inspired)
- Goal-setting preferences
- Granular notification preferences

### 2. Sentiment Analysis Service

**File**: `src/services/analytics/sentimentAnalysisService.ts`

New service implements:
- **EMA (Ecological Momentary Assessment)**: Real-time emotion capture
- **Pattern Detection**: Identifies trends in mood, sleep, stress over 7-day windows
- **Mental Health Screening**: PHQ-2/GAD-2 inspired assessments
- **Personalized Insights**: Auto-generates recommendations, alerts, celebrations
- **Behavioral Tracking**: Daily habits, exercise, sleep, water intake

**Key Features:**
```typescript
// Record sentiment snapshots
await sentimentAnalysisService.recordSentiment({
  emotional_state: 'ansiosa',
  intensity: 4,
  stress_level: 7,
  energy_level: 'low',
  sleep_quality: 'poor'
});

// Generate weekly insights
const insights = await sentimentAnalysisService.generateInsights(userId, 7);

// Mental health screening (weekly)
const assessment = await sentimentAnalysisService.performMentalHealthAssessment({
  depression_indicators: { little_interest: 2, feeling_down: 2 },
  anxiety_indicators: { feeling_nervous: 3, cant_stop_worrying: 2 },
  maternal_specific: {
    overwhelming_fatigue: 3,
    bonding_concerns: 0,
    support_satisfaction: 3
  }
});
```

### 3. Database Schema Requirements

**New Tables Needed** (Supabase):

```sql
-- Sentiment tracking (EMA)
CREATE TABLE sentiment_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  emotional_state TEXT NOT NULL,
  intensity INTEGER NOT NULL CHECK (intensity BETWEEN 1 AND 5),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  energy_level TEXT,
  sleep_quality TEXT,
  context JSONB,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Daily behavior metrics
CREATE TABLE behavior_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  habits JSONB NOT NULL,
  mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 10),
  stress_score INTEGER CHECK (stress_score BETWEEN 1 AND 10),
  notes TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Mental health assessments (PHQ-2/GAD-2)
CREATE TABLE mental_health_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  assessment_date TIMESTAMPTZ NOT NULL,
  depression_indicators JSONB NOT NULL,
  anxiety_indicators JSONB NOT NULL,
  maternal_specific JSONB NOT NULL,
  overall_wellness_score INTEGER NOT NULL CHECK (overall_wellness_score BETWEEN 0 AND 100),
  needs_professional_support BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Personalized insights
CREATE TABLE personalized_insights (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pattern', 'recommendation', 'alert', 'celebration')),
  category TEXT NOT NULL CHECK (category IN ('emotional', 'behavioral', 'physical', 'social')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  actionable_steps TEXT[],
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  data_source JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- Update profiles table with new onboarding fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emotion_intensity INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS physical_challenges TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS physical_pain_level INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sleep_quality TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sleep_hours NUMERIC(3,1);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS support_system TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS feels_isolated BOOLEAN;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_habits JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stress_level INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stress_triggers TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS coping_mechanisms TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS energy_level TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fatigue_pattern TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mental_health_concerns TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS previous_mental_health_support BOOLEAN;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interested_in_resources BOOLEAN;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goal_setting_style TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wants_reminders BOOLEAN;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wants_progress_tracking BOOLEAN;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB;

-- Indexes for performance
CREATE INDEX idx_sentiment_scores_user_id ON sentiment_scores(user_id);
CREATE INDEX idx_sentiment_scores_recorded_at ON sentiment_scores(recorded_at DESC);
CREATE INDEX idx_behavior_metrics_user_id ON behavior_metrics(user_id);
CREATE INDEX idx_behavior_metrics_date ON behavior_metrics(date DESC);
CREATE INDEX idx_mental_health_user_id ON mental_health_assessments(user_id);
CREATE INDEX idx_mental_health_date ON mental_health_assessments(assessment_date DESC);
CREATE INDEX idx_insights_user_id ON personalized_insights(user_id);
CREATE INDEX idx_insights_priority ON personalized_insights(priority) WHERE read_at IS NULL;

-- Row Level Security (RLS)
ALTER TABLE sentiment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sentiment scores"
  ON sentiment_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sentiment scores"
  ON sentiment_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own behavior metrics"
  ON behavior_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own behavior metrics"
  ON behavior_metrics FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own mental health assessments"
  ON mental_health_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mental health assessments"
  ON mental_health_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own insights"
  ON personalized_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights"
  ON personalized_insights FOR UPDATE
  USING (auth.uid() = user_id);
```

## Migration Steps

### Option 1: Gradual Rollout (Recommended)

1. **Deploy database changes** (run SQL above)
2. **Update `onboardingService.ts`** (already done)
3. **Deploy sentiment analysis service** (already done)
4. **A/B Test**: Show new onboarding to 10% of new users
5. **Collect feedback** and iterate
6. **Full rollout** after validation

### Option 2: Direct Replacement

1. **Deploy database changes**
2. **Replace** `OnboardingScreen.tsx` with `OnboardingScreenEnhanced.tsx`
3. **Update navigation** to use new screen
4. **Test thoroughly**

### Update Navigation

**File**: `src/navigation/StackNavigator.tsx`

```typescript
// Old
import OnboardingScreen from '@/screens/Onboarding/OnboardingScreen';

// New
import OnboardingScreenEnhanced from '@/screens/Onboarding/OnboardingScreenEnhanced';

// In Stack.Navigator
<Stack.Screen
  name="Onboarding"
  component={OnboardingScreenEnhanced}  // Changed
  options={{ headerShown: false }}
/>
```

## Testing Plan

### 1. Unit Tests

```typescript
// Test sentiment analysis service
describe('SentimentAnalysisService', () => {
  it('should record sentiment with intensity', async () => {
    const result = await sentimentAnalysisService.recordSentiment({
      emotional_state: 'ansiosa',
      intensity: 4,
      stress_level: 7
    });
    expect(result).toBe(true);
  });

  it('should detect low mood pattern', async () => {
    // Record 4 days of low mood
    for (let i = 0; i < 4; i++) {
      await sentimentAnalysisService.recordSentiment({
        emotional_state: 'triste',
        intensity: 2
      });
    }

    const insights = await sentimentAnalysisService.generateInsights('user123', 7);
    expect(insights.some(i => i.type === 'pattern')).toBe(true);
  });

  it('should flag mental health concerns', async () => {
    const assessment = await sentimentAnalysisService.performMentalHealthAssessment({
      depression_indicators: { little_interest: 3, feeling_down: 3 },
      anxiety_indicators: { feeling_nervous: 2, cant_stop_worrying: 2 },
      maternal_specific: {
        overwhelming_fatigue: 2,
        bonding_concerns: 0,
        support_satisfaction: 3
      }
    });

    expect(assessment?.needs_professional_support).toBe(true);
  });
});
```

### 2. Integration Tests

```typescript
describe('Enhanced Onboarding Flow', () => {
  it('should complete all 15 steps', async () => {
    // Test each step validation
    // Test data persistence
    // Test navigation to Main screen
  });

  it('should handle partial completion', async () => {
    // Test saving progress at each step
    // Test resuming from step 8
  });

  it('should record initial sentiment after completion', async () => {
    // Complete onboarding
    // Verify sentiment_scores table has entry
  });
});
```

### 3. User Acceptance Testing

**Checklist:**
- [ ] All 15 steps display correctly
- [ ] Validation works on each step
- [ ] Back button works correctly
- [ ] Progress bar updates smoothly
- [ ] Data persists to Supabase
- [ ] Sentiment tracking initializes
- [ ] Navigation to Main screen works
- [ ] Offline mode works (AsyncStorage fallback)
- [ ] Accessibility labels work with screen readers
- [ ] Haptic feedback works on button presses

## Analytics & Monitoring

### Key Metrics to Track

1. **Onboarding Completion Rate**
   - Before: 7 steps completion rate
   - After: 15 steps completion rate
   - Target: ≥75% completion

2. **Drop-off Points**
   - Track which step users abandon most
   - Optimize or simplify that step

3. **Time to Complete**
   - Before: Average time for 7 steps
   - After: Average time for 15 steps
   - Target: <10 minutes

4. **Data Quality**
   - % of users who select "none" or skip optional questions
   - Richness of responses (multi-select usage)

5. **Sentiment Analysis Engagement**
   - % of users who record subsequent sentiments (weekly)
   - Weekly mental health check-in completion rate

### Supabase Analytics Query

```sql
-- Onboarding completion funnel
SELECT
  onboarding_step,
  COUNT(*) as users_at_step,
  ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM profiles WHERE onboarding_step >= 1), 2) as completion_rate
FROM profiles
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY onboarding_step
ORDER BY onboarding_step;

-- Average onboarding duration
SELECT
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 60) as avg_minutes
FROM profiles
WHERE onboarding_completed = true
  AND created_at >= NOW() - INTERVAL '30 days';

-- Mental health flags
SELECT
  COUNT(*) as total_assessments,
  SUM(CASE WHEN needs_professional_support THEN 1 ELSE 0 END) as needs_support,
  ROUND(100.0 * SUM(CASE WHEN needs_professional_support THEN 1 ELSE 0 END) / COUNT(*), 2) as support_rate
FROM mental_health_assessments
WHERE assessment_date >= NOW() - INTERVAL '30 days';
```

## Benefits

### For Users
✅ **Personalized Experience**: AI understands their unique situation deeply
✅ **Early Support**: Mental health concerns flagged and resources offered
✅ **Behavioral Insights**: Patterns detected (sleep, stress, mood) with actionable recommendations
✅ **Evidence-Based**: Questions from Flo (70 questions) + Ovia (habit tracking) + clinical standards (PHQ-2, GAD-2)
✅ **Empowering**: Clear understanding of their baseline for progress tracking

### For Product
✅ **Rich Data**: 3x more data points for personalization
✅ **Better Retention**: Users feel understood → higher engagement
✅ **Clinical Validity**: Mental health screening based on validated instruments
✅ **Competitive Advantage**: Matches/exceeds Flo and Ovia sophistication
✅ **Revenue Potential**: Premium features (advanced insights, therapy referrals)

## Support Resources

If mental health assessment flags concerns (`needs_professional_support = true`), provide:

1. **Crisis Hotlines** (Brazil):
   - CVV (Centro de Valorização da Vida): 188
   - SAMU (emergências): 192

2. **Professional Resources**:
   - List of maternal mental health therapists
   - Postpartum Support International (PSI) resources
   - Links to evidence-based self-help (CBT, mindfulness)

3. **Community Support**:
   - In-app support groups
   - Peer mentoring programs

## Next Steps

1. **Deploy Database Changes** (run SQL migration)
2. **Test Locally** with new onboarding flow
3. **A/B Test** with 10% of new users
4. **Monitor Metrics** (completion rate, drop-off, sentiment engagement)
5. **Iterate** based on feedback
6. **Full Rollout** after validation

## Questions?

Contact the development team or refer to:
- [Sentiment Analysis Service Documentation](./src/services/analytics/sentimentAnalysisService.ts)
- [Onboarding Service Documentation](./src/services/onboardingService.ts)
- [Enhanced Onboarding Screen](./src/screens/Onboarding/OnboardingScreenEnhanced.tsx)

---

**Research Sources:**
- [Flo App User Review Study - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10173043/)
- [Ovia Pregnancy Tracker Study - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7704277/)
- [mHealth Mental Health Screening - Frontiers](https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2022.857304/full)
- [Sentiment Analysis in Mental Health - Nature](https://www.nature.com/articles/s41746-022-00589-7)
