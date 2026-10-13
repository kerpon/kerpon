// Supabase 客户端初始化
// 使用 CDN 加载 @supabase/supabase-js

class SupabaseClient {
    constructor(config) {
        this.config = config;
        this.client = null;
        this.initialize();
    }

    async initialize() {
        // 动态加载 Supabase 客户端
        if (typeof supabase === 'undefined') {
            await this.loadSupabaseScript();
        }
        
        this.client = supabase.createClient(
            this.config.url,
            this.config.anonKey
        );
    }

    async loadSupabaseScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // 提交表单数据
    async submitForm(formData) {
        try {
            await this.initialize();
            
            const { data, error } = await this.client
                .from('form_submissions')
                .insert([{
                    full_name: formData.fullName,
                    gender: formData.gender,
                    age: formData.age ? parseInt(formData.age) : null,
                    phone: formData.phone,
                    email: formData.email,
                    wechat: formData.wechat,
                    company: formData.company,
                    position: formData.position,
                    industry: formData.industry,
                    company_size: formData.companySize,
                    business_type: formData.businessType,
                    challenges: formData.challenges,
                    goals: formData.goals,
                    contact_method: formData.contactMethod,
                    best_time: formData.bestTime,
                    privacy_accepted: formData.privacy,
                    marketing_accepted: formData.marketing
                }]);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('提交表单失败:', error);
            return { success: false, error: error.message };
        }
    }

    // 验证管理员密码
    async verifyAdminPassword(password) {
        try {
            await this.initialize();
            
            // 使用 RPC 函数验证密码
            const { data, error } = await this.client
                .rpc('verify_admin_password', { input_password: password });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('密码验证失败:', error);
            return false;
        }
    }

    // 获取所有表单提交数据（需要管理员权限）
    async getSubmissions(password) {
        try {
            await this.initialize();
            
            // 使用 RPC 函数，通过数据库验证密码
            const { data, error } = await this.client
                .rpc('get_all_submissions', { admin_password: password });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('获取数据失败:', error);
            return { success: false, error: error.message };
        }
    }

    // 删除提交记录
    async deleteSubmission(id, password) {
        try {
            await this.initialize();
            
            // 使用 RPC 函数，通过数据库验证密码
            const { data, error } = await this.client
                .rpc('delete_submission_record', { 
                    record_id: id, 
                    admin_password: password 
                });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('删除失败:', error);
            return { success: false, error: error.message };
        }
    }
}

// 创建全局实例
let supabaseClient = null;

function getSupabaseClient() {
    if (!supabaseClient) {
        // 从配置文件加载配置
        const config = {
            url: 'https://fdchgdhrvluyhfzjkhct.supabase.co',
            anonKey: 'sb_publishable_oQCh1IcW0ZKyvUzp4uZIHQ_iSclv76T'
        };
        supabaseClient = new SupabaseClient(config);
    }
    return supabaseClient;
}
