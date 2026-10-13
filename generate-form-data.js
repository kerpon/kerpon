// 生成模拟的表单提交数据（真实的用户数据）
// 用于填充 form_submissions 表

class FormDataGenerator {
    constructor() {
        this.names = [
            '张伟', '李娜', '王芳', '刘洋', '陈静', '杨明', '赵强', '黄丽', '周杰', '吴婷',
            '徐磊', '孙敏', '马超', '朱琳', '胡勇', '郭晶', '林涛', '何磊', '高娜', '罗斌',
            '郑伟', '梁敏', '谢芳', '宋杰', '唐静', '许强', '韩丽', '冯明', '邓娜', '曹勇',
            '彭晶', '曾涛', '萧娜', '蔡磊', '袁芳', '余杰', '潘敏', '杜强', '蒋晶', '魏涛',
            '薛娜', '阎磊', '史芳', '陶强', '姜晶', '戚涛', '邹娜', '喻杰', '柏敏', '窦强',
            '苏晶', '陆涛', '顾娜', '侯杰', '邵敏', '孟强', '龙晶', '万涛', '段娜', '雷杰',
            '钱敏', '汤强', '尹晶', '黎涛', '易娜', '常杰', '武敏', '乔强', '贺晶', '赖涛'
        ];
        
        this.companies = [
            '科技创新有限公司', '金融集团', '零售电商', '制造业', '教育科技',
            '医疗健康', '服务行业', '咨询公司', '贸易公司', '互联网公司'
        ];
        
        this.positions = [
            'CEO', 'CTO', '销售总监', '市场经理', '产品经理', '运营总监',
            '技术总监', '人力资源总监', '财务总监', '创业者'
        ];
        
        this.industries = ['tech', 'finance', 'retail', 'manufacturing', 'service', 'education', 'healthcare', 'other'];
        
        this.businessTypes = ['startup', 'sme', 'enterprise', 'freelancer', 'other'];
        
        this.challenges = ['growth', 'competition', 'strategy', 'team', 'marketing', 'other'];
        
        this.contactMethods = ['email', 'wechat', 'both'];
        
        this.goals = [
            '希望实现3倍增长',
            '提升团队效率',
            '扩大市场份额',
            '优化运营流程',
            '增加客户留存',
            '提高转化率',
            '降低成本',
            '提升品牌影响力'
        ];
    }

    // 生成单个表单提交记录
    generateFormSubmission() {
        const name = this.names[Math.floor(Math.random() * this.names.length)];
        const phone = this.generatePhone();
        const email = this.generateEmail(name);
        
        return {
            full_name: name,
            gender: Math.random() > 0.5 ? 'male' : 'female',
            age: Math.floor(Math.random() * 40) + 25, // 25-65岁
            phone: phone,
            email: email,
            wechat: Math.random() > 0.3 ? `wx_${Math.floor(Math.random() * 10000)}` : null,
            company: Math.random() > 0.3 ? this.companies[Math.floor(Math.random() * this.companies.length)] : null,
            position: Math.random() > 0.3 ? this.positions[Math.floor(Math.random() * this.positions.length)] : null,
            industry: this.industries[Math.floor(Math.random() * this.industries.length)],
            company_size: this.randomCompanySize(),
            business_type: this.businessTypes[Math.floor(Math.random() * this.businessTypes.length)],
            challenges: this.randomChallenges(),
            goals: this.goals[Math.floor(Math.random() * this.goals.length)],
            contact_method: this.contactMethods[Math.floor(Math.random() * this.contactMethods.length)],
            best_time: this.randomBestTime(),
            privacy_accepted: true,
            marketing_accepted: Math.random() > 0.5
        };
    }

    // 生成多个表单提交记录
    generateFormSubmissions(count = 100) {
        const submissions = [];
        for (let i = 0; i < count; i++) {
            submissions.push(this.generateFormSubmission());
        }
        return submissions;
    }

    // 生成手机号
    generatePhone() {
        const prefix = ['138', '139', '150', '151', '152', '186', '187', '188'];
        const p = prefix[Math.floor(Math.random() * prefix.length)];
        const middle = Math.floor(Math.random() * 9000) + 1000;
        const end = Math.floor(Math.random() * 9000) + 1000;
        return `${p}${middle}${end}`;
    }

    // 生成邮箱
    generateEmail(name) {
        const domains = ['qq.com', '163.com', 'gmail.com', 'outlook.com', 'company.com'];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const username = name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 100);
        return `${username}@${domain}`;
    }

    // 随机公司规模
    randomCompanySize() {
        const sizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
        return sizes[Math.floor(Math.random() * sizes.length)];
    }

    // 随机挑战（可多选）
    randomChallenges() {
        const count = Math.floor(Math.random() * 3) + 1; // 1-3个挑战
        const selected = [];
        const shuffled = [...this.challenges].sort(() => Math.random() - 0.5);
        for (let i = 0; i < count; i++) {
            selected.push(shuffled[i]);
        }
        return selected;
    }

    // 随机最佳联系时间
    randomBestTime() {
        const times = ['morning', 'afternoon', 'evening', 'anytime'];
        return times[Math.floor(Math.random() * times.length)];
    }
}

// 创建全局实例
const formDataGenerator = new FormDataGenerator();

// 在控制台执行：
// const data = formDataGenerator.generateFormSubmissions(100);
// console.log(JSON.stringify(data, null, 2));
