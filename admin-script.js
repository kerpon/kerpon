// 管理看板脚本
let isAuthenticated = false;
let submissionsData = [];
let currentPage = 1;
const itemsPerPage = 10;
let verifiedPassword = null; // 存储已验证的密码

// DOM 元素
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const adminPasswordInput = document.getElementById('admin-password');
const refreshBtn = document.getElementById('refresh-btn');
const logoutBtn = document.getElementById('logout-btn');
const submissionsTableBody = document.getElementById('submissions-table-body');
const searchInput = document.getElementById('search-input');
const filterIndustry = document.getElementById('filter-industry');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const currentPageSpan = document.getElementById('current-page');
const detailModal = document.getElementById('detail-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');

// 检查登录状态
function checkAuth() {
    const auth = sessionStorage.getItem('adminAuth');
    const password = sessionStorage.getItem('adminPassword');
    if (auth === 'true' && password) {
        isAuthenticated = true;
        verifiedPassword = password;
        showDashboard();
    }
}

// 显示看板
function showDashboard() {
    loginScreen.style.display = 'none';
    dashboardScreen.style.display = 'block';
    loadSubmissions();
}

// 显示登录界面
function showLogin() {
    loginScreen.style.display = 'flex';
    dashboardScreen.style.display = 'none';
    isAuthenticated = false;
    sessionStorage.removeItem('adminAuth');
}

// 登录处理
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = adminPasswordInput.value.trim();
    
    if (!password) {
        alert('请输入密码');
        return;
    }
    
    // 显示加载状态
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-text">验证中...</span>';
    submitBtn.disabled = true;
    
    try {
        // 通过 Supabase 数据库验证密码
        if (typeof getSupabaseClient === 'function') {
            const client = getSupabaseClient();
            const isValid = await client.verifyAdminPassword(password);
            
            if (isValid) {
                isAuthenticated = true;
                verifiedPassword = password;
                sessionStorage.setItem('adminAuth', 'true');
                sessionStorage.setItem('adminPassword', password);
                showDashboard();
                adminPasswordInput.value = '';
            } else {
                alert('密码错误，请重试');
                adminPasswordInput.value = '';
                adminPasswordInput.focus();
            }
        } else {
            // 如果 Supabase 未配置，使用本地验证作为备用
            const LOCAL_PASSWORD = '345027';
            if (password === LOCAL_PASSWORD) {
                isAuthenticated = true;
                verifiedPassword = password;
                sessionStorage.setItem('adminAuth', 'true');
                sessionStorage.setItem('adminPassword', password);
                showDashboard();
                adminPasswordInput.value = '';
            } else {
                alert('密码错误，请重试');
                adminPasswordInput.value = '';
                adminPasswordInput.focus();
            }
        }
    } catch (error) {
        console.error('验证错误:', error);
        alert('验证失败，请稍后重试');
    } finally {
        // 恢复按钮状态
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// 退出登录
logoutBtn.addEventListener('click', () => {
    if (confirm('确定要退出登录吗？')) {
        showLogin();
    }
});

// 刷新数据
refreshBtn.addEventListener('click', () => {
    loadSubmissions();
});

// 生成数据按钮
const generateDataBtn = document.getElementById('generate-data-btn');
if (generateDataBtn) {
    generateDataBtn.addEventListener('click', async () => {
        if (confirm('确定要生成100条模拟表单数据吗？')) {
            generateDataBtn.innerHTML = '<span class="btn-icon">⏳</span><span>生成中...</span>';
            generateDataBtn.disabled = true;
            
            try {
                if (typeof insertFormData === 'function') {
                    const result = await insertFormData(100);
                    alert(`✅ 数据生成完成！\n成功: ${result.success} 条\n失败: ${result.error} 条`);
                    loadSubmissions();
                } else {
                    alert('请先加载 generate-form-data.js 和 insert-form-data.js');
                }
            } catch (error) {
                console.error('生成数据失败:', error);
                alert('生成数据失败，请查看控制台');
            } finally {
                generateDataBtn.innerHTML = '<span class="btn-icon">🔄</span><span>生成数据</span>';
                generateDataBtn.disabled = false;
            }
        }
    });
}

// 加载提交数据
async function loadSubmissions() {
    submissionsTableBody.innerHTML = `
        <tr>
            <td colspan="8" class="loading-row">
                <div class="loading-spinner"></div>
                <p>加载数据中...</p>
            </td>
        </tr>
    `;
    
    try {
        // 使用 Supabase 客户端获取数据
        if (typeof getSupabaseClient === 'function') {
            const client = getSupabaseClient();
            const result = await client.getSubmissions(verifiedPassword);
            
            if (result.success) {
                submissionsData = result.data;
                updateStats();
                renderTable();
            } else {
                console.error('获取数据失败:', result.error);
                // 使用模拟数据作为备用
                submissionsData = getMockData();
                updateStats();
                renderTable();
            }
        } else {
            // 使用模拟数据
            submissionsData = getMockData();
            updateStats();
            renderTable();
        }
    } catch (error) {
        console.error('加载错误:', error);
        submissionsData = getMockData();
        updateStats();
        renderTable();
    }
}

// 获取模拟数据（备用）
function getMockData() {
    return [
        {
            id: 1,
            full_name: '张三',
            phone: '13800138000',
            email: 'zhangsan@example.com',
            company: '科技有限公司',
            industry: 'tech',
            business_type: 'startup',
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            full_name: '李四',
            phone: '13900139000',
            email: 'lisi@example.com',
            company: '金融集团',
            industry: 'finance',
            business_type: 'enterprise',
            created_at: new Date(Date.now() - 86400000).toISOString()
        }
    ];
}

// 更新统计数据
function updateStats() {
    const total = submissionsData.length;
    const today = new Date().toDateString();
    const todayCount = submissionsData.filter(item => 
        new Date(item.created_at).toDateString() === today
    ).length;
    const companyCount = submissionsData.filter(item => 
        item.company && item.company.trim() !== ''
    ).length;
    const conversionRate = total > 0 ? Math.round((companyCount / total) * 100) : 0;
    
    document.getElementById('total-submissions').textContent = total;
    document.getElementById('today-submissions').textContent = todayCount;
    document.getElementById('company-submissions').textContent = companyCount;
    document.getElementById('conversion-rate').textContent = conversionRate + '%';
}

// 渲染表格
function renderTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const industryFilter = filterIndustry.value;
    
    let filteredData = submissionsData.filter(item => {
        const matchesSearch = 
            item.full_name.toLowerCase().includes(searchTerm) ||
            item.email.toLowerCase().includes(searchTerm) ||
            (item.company && item.company.toLowerCase().includes(searchTerm));
        
        const matchesIndustry = !industryFilter || item.industry === industryFilter;
        
        return matchesSearch && matchesIndustry;
    });
    
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    if (pageData.length === 0) {
        submissionsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="loading-row">
                    <p>暂无数据</p>
                </td>
            </tr>
        `;
        return;
    }
    
    submissionsTableBody.innerHTML = pageData.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.full_name}</td>
            <td>
                <div>${item.phone}</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">${item.email}</div>
            </td>
            <td>${item.company || '-'}</td>
            <td>${getIndustryLabel(item.industry)}</td>
            <td>${getBusinessTypeLabel(item.business_type)}</td>
            <td>${formatDate(item.created_at)}</td>
            <td>
                <button class="btn-action btn-view" data-id="${item.id}">查看</button>
                <button class="btn-action btn-delete" data-id="${item.id}">删除</button>
            </td>
        </tr>
    `).join('');
    
    // 更新分页
    currentPageSpan.textContent = currentPage;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage >= totalPages;
    
    // 添加事件监听
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            showDetail(id);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            deleteSubmission(id);
        });
    });
}

// 获取行业标签
function getIndustryLabel(industry) {
    const labels = {
        'tech': '科技/互联网',
        'finance': '金融',
        'retail': '零售/电商',
        'manufacturing': '制造业',
        'service': '服务业',
        'education': '教育',
        'healthcare': '医疗健康',
        'other': '其他'
    };
    return labels[industry] || '-';
}

// 获取业务类型标签
function getBusinessTypeLabel(type) {
    const labels = {
        'startup': '创业企业',
        'sme': '中小企业',
        'enterprise': '大型企业',
        'freelancer': '自由职业',
        'other': '其他'
    };
    return labels[type] || '-';
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 显示详情
function showDetail(id) {
    const item = submissionsData.find(d => d.id === id);
    if (!item) return;
    
    modalBody.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">ID</div>
            <div class="detail-value">${item.id}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">姓名</div>
            <div class="detail-value">${item.full_name}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">性别</div>
            <div class="detail-value">${item.gender || '-'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">年龄</div>
            <div class="detail-value">${item.age || '-'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">手机</div>
            <div class="detail-value">${item.phone}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">邮箱</div>
            <div class="detail-value">${item.email}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">微信</div>
            <div class="detail-value">${item.wechat || '-'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">公司</div>
            <div class="detail-value">${item.company || '-'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">职位</div>
            <div class="detail-value">${item.position || '-'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">行业</div>
            <div class="detail-value">${getIndustryLabel(item.industry)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">公司规模</div>
            <div class="detail-value">${item.company_size || '-'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">业务类型</div>
            <div class="detail-value">${getBusinessTypeLabel(item.business_type)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">面临的挑战</div>
            <div class="detail-value">${item.challenges ? item.challenges.join(', ') : '-'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">目标</div>
            <div class="detail-value">${item.goals || '-'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">联系方式</div>
            <div class="detail-value">${item.contact_method || '-'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">最佳时间</div>
            <div class="detail-value">${item.best_time || '-'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">提交时间</div>
            <div class="detail-value">${formatDate(item.created_at)}</div>
        </div>
    `;
    
    detailModal.classList.add('active');
}

// 删除记录
async function deleteSubmission(id) {
    if (!confirm('确定要删除这条记录吗？')) return;
    
    try {
        if (typeof getSupabaseClient === 'function') {
            const client = getSupabaseClient();
            const result = await client.deleteSubmission(id, verifiedPassword);
            
            if (result.success) {
                submissionsData = submissionsData.filter(item => item.id !== id);
                updateStats();
                renderTable();
                alert('删除成功');
            } else {
                console.error('删除失败:', result.error);
                // 本地删除作为备用
                submissionsData = submissionsData.filter(item => item.id !== id);
                updateStats();
                renderTable();
                alert('删除成功（本地）');
            }
        } else {
            submissionsData = submissionsData.filter(item => item.id !== id);
            updateStats();
            renderTable();
            alert('删除成功（本地）');
        }
    } catch (error) {
        console.error('删除错误:', error);
        alert('删除失败');
    }
}

// 搜索和筛选
searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderTable();
});

filterIndustry.addEventListener('change', () => {
    currentPage = 1;
    renderTable();
});

// 分页
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(submissionsData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});

// 关闭模态框
modalClose.addEventListener('click', () => {
    detailModal.classList.remove('active');
});

detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
        detailModal.classList.remove('active');
    }
});

// 页面加载时检查登录状态
window.addEventListener('load', () => {
    checkAuth();
});

// 添加按钮样式
const style = document.createElement('style');
style.textContent = `
    .btn-action {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.85rem;
        margin-right: 0.5rem;
        transition: all 0.3s;
    }
    
    .btn-view {
        background: var(--primary-color);
        color: var(--bg-dark);
    }
    
    .btn-view:hover {
        background: var(--primary-hover);
    }
    
    .btn-delete {
        background: var(--danger-color);
        color: white;
    }
    
    .btn-delete:hover {
        background: #dc2626;
    }
`;
document.head.appendChild(style);
