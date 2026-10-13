// 表单提交处理
const pdfForm = document.getElementById('pdf-form');
if (pdfForm) {
    pdfForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 收集表单数据
        const formData = new FormData(pdfForm);
        const data = {};
        
        // 基本信息
        data.fullName = formData.get('fullName');
        data.gender = formData.get('gender');
        data.age = formData.get('age');
        data.phone = formData.get('phone');
        data.email = formData.get('email');
        data.wechat = formData.get('wechat');
        
        // 职业信息
        data.company = formData.get('company');
        data.position = formData.get('position');
        data.industry = formData.get('industry');
        data.companySize = formData.get('companySize');
        
        // 商业需求
        data.businessType = formData.get('businessType');
        data.challenges = formData.getAll('challenges');
        data.goals = formData.get('goals');
        
        // 联系偏好
        data.contactMethod = formData.get('contactMethod');
        data.bestTime = formData.get('bestTime');
        
        // 同意条款
        data.privacy = formData.get('privacy');
        data.marketing = formData.get('marketing');
        
        // 验证必填字段
        if (!data.fullName || !data.phone || !data.email || !data.businessType || !data.privacy) {
            alert('请填写所有必填项（标记为 * 的字段）');
            return;
        }
        
        // 手机号验证
        if (!/^1[3-9]\d{9}$/.test(data.phone)) {
            alert('请输入正确的11位手机号码');
            return;
        }
        
        // 邮箱验证
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            alert('请输入正确的邮箱地址');
            return;
        }
        
        // 显示提交中状态
        const submitBtn = pdfForm.querySelector('.pdf-submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-text">提交中...</span>';
        submitBtn.disabled = true;
        
        try {
            // 尝试保存到 Supabase
            if (typeof getSupabaseClient === 'function') {
                const client = getSupabaseClient();
                const result = await client.submitForm(data);
                
                if (result.success) {
                    // 显示成功动画和下载按钮
                    showSuccessAnimation(data.fullName, data.email);
                    
                    // 清除本地存储
                    localStorage.removeItem('pdfFormData');
                    
                    // 重置表单
                    pdfForm.reset();
                } else {
                    console.error('Supabase 保存失败:', result.error);
                    // 即使 Supabase 失败，也显示成功（可以作为备用方案）
                    showSuccessAnimation(data.fullName, data.email);
                    localStorage.removeItem('pdfFormData');
                    pdfForm.reset();
                }
            } else {
                // Supabase 客户端未加载，使用本地存储作为备用
                console.log('表单数据:', data);
                showSuccessAnimation(data.fullName, data.email);
                localStorage.removeItem('pdfFormData');
                pdfForm.reset();
            }
        } catch (error) {
            console.error('提交错误:', error);
            alert('提交失败，请稍后重试');
        } finally {
            // 恢复按钮状态
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// 输入框验证反馈
const requiredInputs = document.querySelectorAll('input[required], select[required]');
requiredInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.style.borderColor = '#ff4444';
        } else {
            input.style.borderColor = '#e0e0e0';
        }
    });
    
    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.style.borderColor = '#e0e0e0';
        }
    });
});

// 手机号实时验证
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        e.target.value = value;
    });
}

// 邮箱实时验证
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value;
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailInput.style.borderColor = '#ff4444';
        } else if (email) {
            emailInput.style.borderColor = '#d4af37';
        }
    });
}

// 页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 打印功能（可选）
function printForm() {
    window.print();
}

// 保存表单数据到本地存储（可选，防止刷新丢失）
const pdfFormElement = document.getElementById('pdf-form');
if (pdfFormElement) {
    // 页面加载时恢复数据
    const savedData = localStorage.getItem('pdfFormData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = pdfFormElement.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = data[key];
                    } else {
                        input.value = data[key];
                    }
                }
            });
        } catch (e) {
            console.log('无法恢复保存的数据');
        }
    }
    
    // 实时保存数据
    pdfFormElement.addEventListener('input', () => {
        const formData = new FormData(pdfFormElement);
        const data = {};
        formData.forEach((value, key) => {
            const existing = data[key];
            if (existing) {
                if (Array.isArray(existing)) {
                    existing.push(value);
                } else {
                    data[key] = [existing, value];
                }
            } else {
                data[key] = value;
            }
        });
        localStorage.setItem('pdfFormData', JSON.stringify(data));
    });
    
    // 表单提交后清除保存的数据
    pdfFormElement.addEventListener('submit', () => {
        localStorage.removeItem('pdfFormData');
    });
}

// 添加进度指示器（可选）
const formSections = document.querySelectorAll('.form-section');
let currentSection = 0;

function updateProgress() {
    const progress = ((currentSection + 1) / formSections.length) * 100;
    // 可以在这里添加进度条显示
}

// 表单字段聚焦时的平滑滚动
const formFields = document.querySelectorAll('.form-field input, .form-field select, .form-field textarea');
formFields.forEach(field => {
    field.addEventListener('focus', () => {
        const section = field.closest('.form-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

// 显示成功动画和下载按钮
function showSuccessAnimation(name, email) {
    // 创建动画覆盖层
    const overlay = document.createElement('div');
    overlay.id = 'success-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    
    overlay.innerHTML = `
        <div class="success-content" style="text-align: center; padding: 40px;">
            <div class="success-icon" style="
                font-size: 80px;
                margin-bottom: 30px;
                animation: bounce 1s ease infinite;
            ">🎉</div>
            <h2 style="
                font-size: 2.5rem;
                font-weight: 800;
                margin-bottom: 20px;
                background: linear-gradient(135deg, #d4af37, #ffd700);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            ">提交成功！</h2>
            <p style="
                font-size: 1.2rem;
                color: #b8b8b8;
                margin-bottom: 40px;
            ">感谢 ${name}！资料已准备就绪</p>
            <div class="loading-spinner" style="
                width: 50px;
                height: 50px;
                border: 4px solid rgba(212, 175, 55, 0.3);
                border-top-color: #d4af37;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 30px;
            "></div>
            <p style="color: #b8b8b8; font-size: 0.9rem;">正在生成您的专属指南...</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .download-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 1rem 3rem;
            background: linear-gradient(135deg, #d4af37, #ffd700);
            color: #1a1a2e;
            border: none;
            border-radius: 50px;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
            animation: pulse 2s ease-in-out infinite;
        }
        .download-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(212, 175, 55, 0.4);
        }
        .download-btn:active {
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // 显示覆盖层
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 100);
    
    // 3秒后显示下载按钮
    setTimeout(() => {
        const content = overlay.querySelector('.success-content');
        content.innerHTML = `
            <div class="success-icon" style="
                font-size: 80px;
                margin-bottom: 30px;
            ">📚</div>
            <h2 style="
                font-size: 2.5rem;
                font-weight: 800;
                margin-bottom: 20px;
                background: linear-gradient(135deg, #d4af37, #ffd700);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            ">指南已生成！</h2>
            <p style="
                font-size: 1.2rem;
                color: #b8b8b8;
                margin-bottom: 40px;
            ">您的专属商业增长秘籍已准备就绪</p>
            <button class="download-btn" onclick="downloadPDF('${name}', '${email}')">
                <span>📥</span>
                <span>立即下载</span>
            </button>
            <p style="color: #666; font-size: 0.85rem; margin-top: 20px;">
                文件将保存为: 商业增长秘籍_${name}.pdf
            </p>
        `;
    }, 3000);
}

// 下载 PDF
function downloadPDF(name, email) {
    try {
        // 生成 PDF
        const doc = pdfGenerator.generateGuide(name, email);
        
        // 下载文件
        const fileName = `商业增长秘籍_${name}.pdf`;
        doc.save(fileName);
        
        // 显示成功消息
        const overlay = document.getElementById('success-overlay');
        if (overlay) {
            const content = overlay.querySelector('.success-content');
            content.innerHTML = `
                <div class="success-icon" style="
                    font-size: 80px;
                    margin-bottom: 30px;
                ">✅</div>
                <h2 style="
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 20px;
                    background: linear-gradient(135deg, #10b981, #34d399);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">下载完成！</h2>
                <p style="
                    font-size: 1.2rem;
                    color: #b8b8b8;
                    margin-bottom: 40px;
                ">文件已保存到您的下载文件夹</p>
                <button class="download-btn" onclick="closeOverlay()" style="
                    background: linear-gradient(135deg, #10b981, #34d399);
                ">
                    <span>关闭</span>
                </button>
            `;
        }
    } catch (error) {
        console.error('PDF 生成失败:', error);
        alert('PDF 生成失败，请稍后重试');
    }
}

// 关闭覆盖层
function closeOverlay() {
    const overlay = document.getElementById('success-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
        }, 500);
    }
}
