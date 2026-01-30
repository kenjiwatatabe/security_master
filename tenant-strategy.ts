export type TenantArchitecture = "Single Tenant (RBAC)" | "Multi-Tenant (Organization)";

export const TenantStrategy = {
    analyze: (requirements: string[]): TenantArchitecture => {
        const multiTenantKeywords = [
            "SaaS",
            "B2B",
            "multiple companies",
            "subscription",
            "team isolation",
            "client separation"
        ];

        const isMultiTenant = requirements.some(req =>
            multiTenantKeywords.some(keyword => req.toLowerCase().includes(keyword.toLowerCase()))
        );

        return isMultiTenant ? "Multi-Tenant (Organization)" : "Single Tenant (RBAC)";
    },

    features: {
        singleTenant: {
            advantages: ["Simpler Schema", "Easier Queries", "Direct User-to-Data mapping"],
            bestFor: ["Internal Tools", "Personal Apps", "Single Enterprise Deployments"]
        },
        multiTenant: {
            advantages: ["Data Isolation", " scalable to millions of orgs", "Unified Login"],
            bestFor: ["SaaS Products", "Marketplaces", "Collaboration Tools"],
            criticalRule: "Every table MUST have an `organization_id` column."
        }
    }
};
