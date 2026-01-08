/*
  # Fix Security and Performance Issues
  
  1. Performance Improvements
    - Add missing foreign key indexes for optimal query performance
    - Optimize RLS policies to use (select auth.uid()) pattern
    - Remove unused indexes that add overhead
    
  2. Security Improvements
    - Fix function search paths to prevent SQL injection
    - Improve RLS policy performance at scale
    
  3. Changes
    - Add indexes on foreign keys: activities.contact_id, activities.event_id, events.contact_id
    - Update all RLS policies to use (select auth.uid()) pattern
    - Remove unused indexes
    - Fix search_path for all functions
*/

-- ============================================
-- 1. Add Missing Foreign Key Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_activities_contact_id ON activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_activities_event_id ON activities(event_id);
CREATE INDEX IF NOT EXISTS idx_events_contact_id ON events(contact_id);

-- ============================================
-- 2. Remove Unused Indexes
-- ============================================

DROP INDEX IF EXISTS idx_contacts_priority;
DROP INDEX IF EXISTS idx_events_date;
DROP INDEX IF EXISTS idx_profiles_role;
DROP INDEX IF EXISTS idx_activities_user_id;
DROP INDEX IF EXISTS idx_activities_date;

-- ============================================
-- 3. Fix RLS Policies - Contacts
-- ============================================

DROP POLICY IF EXISTS "Users can manage own contacts" ON contacts;

CREATE POLICY "Users can manage own contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- 4. Fix RLS Policies - Events
-- ============================================

DROP POLICY IF EXISTS "Users can manage own events" ON events;

CREATE POLICY "Users can manage own events"
  ON events
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- 5. Fix RLS Policies - Achievements
-- ============================================

DROP POLICY IF EXISTS "Users can manage own achievements" ON achievements;

CREATE POLICY "Users can manage own achievements"
  ON achievements
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- 6. Fix RLS Policies - Goals
-- ============================================

DROP POLICY IF EXISTS "Users can manage own goals" ON goals;

CREATE POLICY "Users can manage own goals"
  ON goals
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- 7. Fix RLS Policies - Resource Progress
-- ============================================

DROP POLICY IF EXISTS "Users can manage own resource progress" ON resource_progress;

CREATE POLICY "Users can manage own resource progress"
  ON resource_progress
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- 8. Fix RLS Policies - Streak Data
-- ============================================

DROP POLICY IF EXISTS "Users can manage own streak data" ON streak_data;

CREATE POLICY "Users can manage own streak data"
  ON streak_data
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- 9. Fix RLS Policies - Activities
-- ============================================

DROP POLICY IF EXISTS "Users can view own activities" ON activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON activities;
DROP POLICY IF EXISTS "Users can update own activities" ON activities;
DROP POLICY IF EXISTS "Users can delete own activities" ON activities;

CREATE POLICY "Users can view own activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own activities"
  ON activities
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own activities"
  ON activities
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- 10. Fix RLS Policies - Profiles
-- ============================================

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- ============================================
-- 11. Fix Function Search Paths
-- ============================================

-- Drop and recreate update_updated_at_column function with secure search_path
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate all triggers for update_updated_at_column
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_progress_updated_at
  BEFORE UPDATE ON resource_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streak_data_updated_at
  BEFORE UPDATE ON streak_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Drop and recreate create_initial_achievements function with secure search_path
DROP FUNCTION IF EXISTS create_initial_achievements(uuid);

CREATE FUNCTION create_initial_achievements(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO achievements (user_id, title, description, icon, date, category)
  VALUES
    (p_user_id, 'Welcome to NetworkMaster!', 'Created your account and started your networking journey', 'star', CURRENT_DATE, 'milestone'),
    (p_user_id, 'First Steps', 'Added your first contact to the platform', 'user-plus', CURRENT_DATE, 'milestone'),
    (p_user_id, 'Getting Started', 'Completed your profile setup', 'check-circle', CURRENT_DATE, 'milestone')
  ON CONFLICT DO NOTHING;
END;
$$;

-- Drop and recreate create_default_achievements function with secure search_path
DROP FUNCTION IF EXISTS create_default_achievements(uuid);

CREATE FUNCTION create_default_achievements(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO achievements (user_id, title, description, icon, date, category)
  VALUES
    (p_user_id, 'Welcome Aboard!', 'Successfully created your NetworkMaster account', 'rocket', CURRENT_DATE, 'milestone'),
    (p_user_id, 'Profile Complete', 'Finished setting up your profile', 'user-check', CURRENT_DATE, 'milestone')
  ON CONFLICT DO NOTHING;
END;
$$;