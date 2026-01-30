-- ==========================================
-- 1. BASE: Profiles (Public User Data)
-- ==========================================
-- Secure replacement for direct auth.users access
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  avatar_url text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Secure Profile View (Read Only for others)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. OPTION A: Single Tenant (RBAC)
-- ==========================================
-- Add 'role' to profiles or a separate table
ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user'));

-- ==========================================
-- 3. OPTION B: Multi-Tenant (Organization)
-- ==========================================
CREATE TABLE public.organizations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.organization_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Enable RLS on Everything
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
