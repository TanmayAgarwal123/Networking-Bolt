/*
  # Complete NetworkMaster Database Setup

  1. New Tables
    - `profiles` - User profiles with roles and preferences
    - `contacts` - User networking contacts
    - `events` - Networking events and meetings
    - `achievements` - User achievements and milestones
    - `goals` - Daily and custom networking goals
    - `resource_progress` - Learning resource completion tracking
    - `streak_data` - Networking streak information

  2. Security
    - Enable RLS on all tables
    - Add policies for user data isolation
    - Add admin policies for management access

  3. Functions & Triggers
    - Auto-create profile on user signup
    - Update timestamps on record changes
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE contact_status AS ENUM ('active', 'needs_followup', 'cold');
CREATE TYPE event_type AS ENUM ('meetup', 'call', 'event', 'follow-up');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE achievement_category AS ENUM (
  'milestone', 'streak', 'engagement', 'growth', 'special', 
  'meetings', 'diversity', 'productivity', 'events', 'digital', 
  'quality', 'communication', 'consistency', 'organization', 
  'alumni', 'mentorship', 'learning'
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  role user_role DEFAULT 'user'::user_role,
  weekly_goal integer DEFAULT 7,
  theme text DEFAULT 'light',
  notifications boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  company text NOT NULL,
  location text,
  email text,
  phone text,
  linkedin_url text,
  priority integer DEFAULT 50 CHECK (priority >= 1 AND priority <= 100),
  last_contact text DEFAULT 'Never',
  tags text[] DEFAULT '{}',
  status contact_status DEFAULT 'active',
  avatar text DEFAULT '👤',
  notes text DEFAULT '',
  industry text DEFAULT '',
  expertise text[] DEFAULT '{}',
  added_date date DEFAULT CURRENT_DATE,
  last_interaction_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  title text NOT NULL,
  event_date date NOT NULL,
  event_time time NOT NULL,
  type event_type DEFAULT 'meetup',
  location text DEFAULT '',
  priority priority_level DEFAULT 'medium',
  description text DEFAULT '',
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  earned boolean DEFAULT false,
  icon text DEFAULT '🎯',
  earned_date date,
  category achievement_category DEFAULT 'milestone',
  requirement integer DEFAULT 1,
  progress integer DEFAULT 0,
  points integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text text NOT NULL,
  completed boolean DEFAULT false,
  icon text DEFAULT 'Target',
  priority priority_level DEFAULT 'medium',
  category text DEFAULT 'custom',
  due_date date DEFAULT CURRENT_DATE,
  created_date date DEFAULT CURRENT_DATE,
  completed_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resource progress table
CREATE TABLE IF NOT EXISTS resource_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resource_id text NOT NULL,
  completed boolean DEFAULT false,
  completed_date date,
  time_spent integer,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- Streak data table
CREATE TABLE IF NOT EXISTS streak_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak integer DEFAULT 1,
  longest_streak integer DEFAULT 1,
  last_activity_date date DEFAULT CURRENT_DATE,
  streak_history jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_priority ON contacts(priority DESC);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_progress_user_id ON resource_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_streak_data_user_id ON streak_data(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_data ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Contacts policies
CREATE POLICY "Users can manage own contacts" ON contacts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all contacts" ON contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Events policies
CREATE POLICY "Users can manage own events" ON events
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all events" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Achievements policies
CREATE POLICY "Users can manage own achievements" ON achievements
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all achievements" ON achievements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Goals policies
CREATE POLICY "Users can manage own goals" ON goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all goals" ON goals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Resource progress policies
CREATE POLICY "Users can manage own resource progress" ON resource_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all resource progress" ON resource_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Streak data policies
CREATE POLICY "Users can manage own streak data" ON streak_data
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all streak data" ON streak_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
  );
  
  -- Initialize streak data
  INSERT INTO streak_data (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_progress_updated_at
  BEFORE UPDATE ON resource_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streak_data_updated_at
  BEFORE UPDATE ON streak_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();