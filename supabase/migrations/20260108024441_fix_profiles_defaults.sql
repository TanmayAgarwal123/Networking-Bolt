/*
  # Fix Profiles Table Defaults

  1. Changes
    - Make email and full_name have default empty string values
    - This ensures the trigger can always create a profile even if data is missing
    
  2. Security
    - No security changes, just schema adjustments for data safety
*/

DO $$ 
BEGIN
  -- Update email column to have default if it doesn't already
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email'
    AND column_default IS NULL
  ) THEN
    ALTER TABLE profiles ALTER COLUMN email SET DEFAULT ''::text;
  END IF;

  -- Update full_name column to have default if it doesn't already
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'full_name'
    AND column_default IS NULL
  ) THEN
    ALTER TABLE profiles ALTER COLUMN full_name SET DEFAULT ''::text;
  END IF;
END $$;