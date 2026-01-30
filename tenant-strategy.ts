export type TenantArchitecture = "Single Tenant (RBAC)" | "Multi-Tenant (Organization)";

export const TenantStrategy = {
    analyze: (requirements: string[]): TenantArchitecture => {
        // 日本語キーワードにも対応
        const multiTenantKeywords = [
            "SaaS",
            "B2B",
            "multiple companies",
            "subscription",
            "team isolation",
            "client separation",
            "複数社",
            "組織",
            "テナント",
            "サブスクリプション",
            "チーム分離",
            "顧客分離"
        ];

        const isMultiTenant = requirements.some(req =>
            multiTenantKeywords.some(keyword => req.toLowerCase().includes(keyword.toLowerCase()))
        );

        return isMultiTenant ? "Multi-Tenant (Organization)" : "Single Tenant (RBAC)";
    },

    features: {
        singleTenant: {
            advantages: ["スキーマがシンプル", "クエリが容易", "ユーザー対データのマッピングが直接的"],
            bestFor: ["社内ツール", "個人アプリ", "単一企業への導入"]
        },
        multiTenant: {
            advantages: ["データの完全分離", "数百万の組織までスケール可能", "ログインの統一"],
            bestFor: ["SaaS製品", "マーケットプレイス", "コラボレーションツール"],
            criticalRule: "すべてのテーブルに必ず `organization_id` カラムを持たせること。"
        }
    }
};
