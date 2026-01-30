# Security Launch Checklist (Zero Trust)

## 1. Database & RLS
- [ ] **RLS Enabled Globally**: Run `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = false;` to find leaks.
- [ ] **No "public" Role Access**: Revoke all generic permissions. `REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;` (Then grant specifically).
- [ ] **Policy Coverage**: Ensure SELECT, INSERT, UPDATE, DELETE all have policies.
- [ ] **Service Role Protection**: Ensure `service_role` key is NEVER used in the client (browser).

## 2. Authentication
- [ ] **Email Verification**: Enabled in Supabase Auth settings.
- [ ] **Redirect URLs**: Whitelisted strictly to production domains (no `localhost` in prod).
- [ ] **Password Strength**: Minimum 8 chars enforced.

## 3. API & Edge
- [ ] **Input Validation**: usage of `Zod` or similar on all API inputs.
- [ ] **Rate Limiting**: Configured on API Routes / Edge Functions.

## 4. Multi-Tenant Specific
- [ ] **Leak Test**: Insert a record with `organization_id = [Another Org]` and verify it FAILS.
- [ ] **Cross-Tenant Access**: Attempt to read Org A's data as Org B's user.
