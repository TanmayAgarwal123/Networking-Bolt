/*
  # Seed Default Achievements

  This migration creates default achievements that all users will have access to.
  These achievements will be automatically created for new users.
*/

-- Function to create default achievements for a user
CREATE OR REPLACE FUNCTION create_default_achievements(user_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO achievements (user_id, title, description, icon, category, requirement, points) VALUES
    (user_id, 'Getting Started', 'Add your first contact to the network', '🚀', 'milestone', 1, 10),
    (user_id, 'Building Network', 'Add 10 contacts to your network', '🌱', 'milestone', 10, 50),
    (user_id, 'Network Builder', 'Add 50 contacts to your network', '🏗️', 'milestone', 50, 200),
    (user_id, 'Master Networker', 'Add 100 contacts to your network', '👑', 'milestone', 100, 500),
    (user_id, 'Week Warrior', 'Maintain 7-day networking streak', '🔥', 'streak', 7, 100),
    (user_id, 'Monthly Master', 'Maintain a 30-day networking streak', '⭐', 'streak', 30, 500),
    (user_id, 'Century Club', 'Maintain a 100-day networking streak', '💎', 'streak', 100, 2000),
    (user_id, 'Ice Breaker', 'Log your first interaction', '🧊', 'engagement', 1, 10),
    (user_id, 'Coffee Champion', 'Schedule 10 coffee chats', '☕', 'meetings', 10, 150),
    (user_id, 'Social Butterfly', 'Connect with people from 5 different companies', '🦋', 'diversity', 5, 200);
END;
$$ LANGUAGE plpgsql;

-- Update the handle_new_user function to include default achievements
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
  
  -- Create default achievements
  PERFORM create_default_achievements(NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;