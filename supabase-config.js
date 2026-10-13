// Supabase 配置文件
// 请在 Supabase 控制台获取以下信息并填入

const SUPABASE_CONFIG = {
    // 项目 URL：在 Supabase 控制台 -> Settings -> API 中找到
    url: 'https://fdchgdhrvluyhfzjkhct.supabase.co',

    // 匿名公钥 (anon/public key)：在 Supabase 控制台 -> Settings -> API 中找到
    // 注意：这是公开的密钥，可以安全地暴露在前端代码中
    anonKey: 'sb_publishable_oQCh1IcW0ZKyvUzp4uZIHQ_iSclv76T',
    
    // 服务端密钥 (service_role key)：仅在服务端使用，不要暴露在前端
    // 用于管理后台，需要更高的权限
    serviceRoleKey: 'sb_secret_iVuqvnCWkke-9-DzcheTHg_2qclaW-S',
    
    // 管理员密码（前端验证用）
    adminPassword: '345027'
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}
