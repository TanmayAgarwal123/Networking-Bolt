/*
  # Add Admin Access to All Tables
  
  1. Purpose
    - Allow admin users to view and manage all users' data
    - Maintain regular user restrictions (users can only see their own data)
    
  2. Changes
    - Create helper function to check if current user is an admin
    - Update RLS policies for all tables to allow admin access
    - Keep existing user restrictions for non-admin users
    
  3. Tables Updated
    - profiles: Allow admins to read all profiles
    - contacts: Allow admins to view/manage all contacts
    - events: Allow admins to view/manage all events
    - achievements: Allow admins to view/manage all achievements
    - goals: Allow admins to view/manage all goals
    - resource_progress: Allow admins to view/manage all resource progress
    - streak_data: Allow admins to view/manage all streak data
    - activities: Allow admins to view/manage all activities
*/

-- ============================================
-- 1. Create Helper Function to Check Admin Role
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' 
    FROM profiles 
    WHERE id = (select auth.uid())
  );
END;
$$;

-- ============================================
-- 2. Update Profiles Table Policies
-- ============================================

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()) OR is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()) OR is_admin())
  WITH CHECK (id = (select auth.uid()) OR is_admin());

-- ============================================
-- 3. Update Contacts Table Policies
-- ============================================

DROP POLICY IF EXISTS "Users can manage own contacts" ON contacts;

CREATE POLICY "Users can manage own contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()) OR is_admin())
  WITH CHECK (user_id = (select auth.uid()) OR is_admin());

-- ============================================
-- 4. Update Events Table Policies
-- ============================================

DROP POLICY IF EXISTS "Users can manage own events" ON events;

CREATE POLICY "Users can manage own events"
  ON events
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()) OR is_admin())
  WITH CHECK (user_id = (select auth.uid()) OR is_admin());

-- ============================================
-- 5. Update Achievements Table Policies
-- ============================================

DROP POLICY IF EXISTS "Users can manage own achievements" ON achievements;

CREATE POLICY "Users can manage own achievements"
  ON achievements
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()) OR is_admin())
  WITH CHECK (user_id = (select auth.uid()) OR is_admin());

-- ============================================
-- 6. Update Goals Table Policies
-- ============================================

DROP POLICY IF EXISTS "Users can manage own goals" ON goals;

CREATE POLICY "Users can manage own goals"
  ON goals
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()) OR is_admin())
  WITH CHECK (user_id = (select auth.uid()) OR is_admin());

-- ============================================
-- 7. Update Resource Progress Table Policies
-- ============================================

DROP POLICY IF EXISTS "Users can manage own resource progress" ON resource_progress;

CREATE POLICY "Users can manage own resource progress"
  ON resource_progress
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()) OR is_admin())
  WITH CHECK (user_id = (select auth.uid()) OR is_admin());

-- ============================================
-- 8. Update Streak Data Table Policies
-- ============================================

DROP POLICY IF EXISTS "Users can manage own streak data" ON streak_data;

CREATE POLICY "Users can manage own streak data"
  ON streak_data
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()) OR is_admin())
  WITH CHECK (user_id = (select auth.uid()) OR is_admin());

-- ============================================
-- 9. Update Activities Table Policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own activities" ON activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON activities;
DROP POLICY IF EXISTS "Users can update own activities" ON activities;
DROP POLICY IF EXISTS "Users can delete own activities" ON activities;

CREATE POLICY "Users can view own activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()) OR is_admin());

CREATE POLICY "Users can insert own activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()) OR is_admin());

CREATE POLICY "Users can update own activities"
  ON activities
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()) OR is_admin())
  WITH CHECK (user_id = (select auth.uid()) OR is_admin());

CREATE POLICY "Users can delete own activities"
  ON activities
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()) OR is_admin());