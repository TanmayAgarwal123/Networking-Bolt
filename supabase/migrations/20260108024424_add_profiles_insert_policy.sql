/*
  # Add Profiles INSERT Policy

  1. Changes
    - Add INSERT policy for profiles table to allow new user registration
    - This policy allows authenticated users to create their own profile entry
    
  2. Security
    - Users can only insert a profile for themselves (matching auth.uid())
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;