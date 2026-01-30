export const PolicyTemplates = {
    // ------------------------------------------------------------------
    // 1. Single Tenant (User is King of their own Castle)
    // ------------------------------------------------------------------
    singleTenant: (tableName: string) => `
    -- [${tableName}] View own data
    CREATE POLICY "Users can view own ${tableName}" 
    ON public.${tableName} FOR SELECT 
    USING (auth.uid() = user_id);

    -- [${tableName}] Insert own data
    CREATE POLICY "Users can insert own ${tableName}" 
    ON public.${tableName} FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

    -- [${tableName}] Update own data
    CREATE POLICY "Users can update own ${tableName}" 
    ON public.${tableName} FOR UPDATE 
    USING (auth.uid() = user_id);
  `,

    // ------------------------------------------------------------------
    // 2. Multi-Tenant (Organization Context is Everything)
    // ------------------------------------------------------------------
    multiTenant: (tableName: string) => `
    -- [${tableName}] Access via Organization Membership
    -- Prerequisite: helper function "auth_get_org_ids()"
    
    CREATE POLICY "Tenant isolation for ${tableName}"
    ON public.${tableName}
    USING (
      organization_id IN (
        SELECT organization_id 
        FROM public.organization_members 
        WHERE user_id = auth.uid()
      )
    );
  `,

    // ------------------------------------------------------------------
    // 3. Helper Functions (The Secret Sauce)
    // ------------------------------------------------------------------
    helpers: `
    -- Function to get current user's org IDs (Performance Optimized)
    CREATE OR REPLACE FUNCTION auth_get_org_ids() 
    RETURNS uuid[] 
    LANGUAGE sql STABLE SECURITY DEFINER AS $$
      SELECT array_agg(organization_id)
      FROM public.organization_members
      WHERE user_id = auth.uid();
    $$;
  `
};
