// 数据看板脚本 - 基于 form_submissions 真实数据
let charts = {};

// 页面加载时初始化
window.addEventListener('load', async () => {
    await loadDashboardData();
});

// 加载看板数据
async function loadDashboardData() {
    try {
        const client = getSupabaseClient();
        
        // 从 form_submissions 表获取数据
        const { data: submissions, error } = await client.client
            .from('form_submissions')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('加载数据失败:', error);
            useMockData();
            return;
        }
        
        if (!submissions || submissions.length === 0) {
            console.log('暂无数据，使用模拟数据');
            useMockData();
            return;
        }
        
        console.log(`加载了 ${submissions.length} 条表单提交数据`);
        
        // 更新统计卡片
        updateStatsCards(submissions);
        
        // 渲染图表
        renderIndustryChart(submissions);
        renderBusinessTypeChart(submissions);
        renderCompanySizeChart(submissions);
        renderChallengesChart(submissions);
        renderAgeChart(submissions);
        renderContactMethodChart(submissions);
        renderTrendChart(submissions);
        
        // 渲染最近提交记录
        renderRecentSubmissions(submissions);
        
    } catch (error) {
        console.error('加载数据失败:', error);
        useMockData();
    }
}

// 使用模拟数据
function useMockData() {
    const generator = new FormDataGenerator();
    const submissions = generator.generateFormSubmissions(50);
    
    console.log('使用模拟数据展示');
    
    updateStatsCards(submissions);
    renderIndustryChart(submissions);
    renderBusinessTypeChart(submissions);
    renderCompanySizeChart(submissions);
    renderChallengesChart(submissions);
    renderAgeChart(submissions);
    renderContactMethodChart(submissions);
    renderTrendChart(submissions);
    renderRecentSubmissions(submissions);
}

// 更新统计卡片
function updateStatsCards(submissions) {
    const totalSubmissions = submissions.length;
    const companyCount = submissions.filter(s => s.company && s.company.trim() !== '').length;
    const emailCount = submissions.filter(s => s.email && s.email.trim() !== '').length;
    const wechatCount = submissions.filter(s => s.wechat && s.wechat.trim() !== '').length;
    
    document.getElementById('total-submissions').textContent = totalSubmissions;
    document.getElementById('company-count').textContent = companyCount;
    document.getElementById('email-count').textContent = emailCount;
    document.getElementById('wechat-count').textContent = wechatCount;
}

// 格式化数字
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
}

// 渲染行业分布图
function renderIndustryChart(submissions) {
    const ctx = document.getElementById('industryChart').getContext('2d');
    
    if (charts.industry) {
        charts.industry.destroy();
    }
    
    const industryLabels = {
        'tech': '科技/互联网',
        'finance': '金融',
        'retail': '零售/电商',
        'manufacturing': '制造业',
        'service': '服务业',
        'education': '教育',
        'healthcare': '医疗健康',
        'other': '其他'
    };
    
    const industryCounts = {};
    submissions.forEach(s => {
        const industry = s.industry || 'other';
        industryCounts[industry] = (industryCounts[industry] || 0) + 1;
    });
    
    const labels = Object.keys(industryCounts).map(k => industryLabels[k]);
    const data = Object.values(industryCounts);
    
    charts.industry = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '数量',
                data: data,
                backgroundColor: [
                    'rgba(212, 175, 55, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(16, 185, 129, 0.8)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#b8b8b8'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b8b8b8'
                    }
                }
            }
        }
    });
}

// 渲染业务类型分布
function renderBusinessTypeChart(submissions) {
    const ctx = document.getElementById('businessTypeChart').getContext('2d');
    
    if (charts.businessType) {
        charts.businessType.destroy();
    }
    
    const typeLabels = {
        'startup': '创业企业',
        'sme': '中小企业',
        'enterprise': '大型企业',
        'freelancer': '自由职业',
        'other': '其他'
    };
    
    const typeCounts = {};
    submissions.forEach(s => {
        const type = s.business_type || 'other';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    const labels = Object.keys(typeCounts).map(k => typeLabels[k]);
    const data = Object.values(typeCounts);
    
    charts.businessType = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#d4af37',
                    '#8b5cf6',
                    '#ec4899',
                    '#10b981',
                    '#f59e0b'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#b8b8b8',
                        padding: 15
                    }
                }
            }
        }
    });
}

// 渲染公司规模分布
function renderCompanySizeChart(submissions) {
    const ctx = document.getElementById('companySizeChart').getContext('2d');
    
    if (charts.companySize) {
        charts.companySize.destroy();
    }
    
    const sizeCounts = {};
    submissions.forEach(s => {
        const size = s.company_size || 'other';
        sizeCounts[size] = (sizeCounts[size] || 0) + 1;
    });
    
    const labels = Object.keys(sizeCounts);
    const data = Object.values(sizeCounts);
    
    charts.companySize = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '数量',
                data: data,
                backgroundColor: 'rgba(212, 175, 55, 0.8)',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b8b8b8'
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#b8b8b8'
                    }
                }
            }
        }
    });
}

// 渲染面临的挑战
function renderChallengesChart(submissions) {
    const ctx = document.getElementById('challengesChart').getContext('2d');
    
    if (charts.challenges) {
        charts.challenges.destroy();
    }
    
    const challengeLabels = {
        'growth': '业绩增长缓慢',
        'competition': '竞争压力大',
        'strategy': '缺乏清晰战略',
        'team': '团队管理问题',
        'marketing': '营销效果不佳',
        'other': '其他问题'
    };
    
    const challengeCounts = {};
    submissions.forEach(s => {
        if (s.challenges && Array.isArray(s.challenges)) {
            s.challenges.forEach(challenge => {
                challengeCounts[challenge] = (challengeCounts[challenge] || 0) + 1;
            });
        }
    });
    
    const labels = Object.keys(challengeCounts).map(k => challengeLabels[k]);
    const data = Object.values(challengeCounts);
    
    charts.challenges = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '数量',
                data: data,
                backgroundColor: 'rgba(236, 72, 153, 0.8)',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#b8b8b8'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b8b8b8'
                    }
                }
            }
        }
    });
}

// 渲染年龄分布
function renderAgeChart(submissions) {
    const ctx = document.getElementById('ageChart').getContext('2d');
    
    if (charts.age) {
        charts.age.destroy();
    }
    
    const ageGroups = {
        '25-34': 0,
        '35-44': 0,
        '45-54': 0,
        '55+': 0
    };
    
    submissions.forEach(s => {
        const age = s.age || 30;
        if (age < 35) ageGroups['25-34']++;
        else if (age < 45) ageGroups['35-44']++;
        else if (age < 55) ageGroups['45-54']++;
        else ageGroups['55+']++;
    });
    
    const labels = Object.keys(ageGroups);
    const data = Object.values(ageGroups);
    
    charts.age = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#d4af37',
                    '#8b5cf6',
                    '#ec4899',
                    '#10b981'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#b8b8b8',
                        padding: 15
                    }
                }
            }
        }
    });
}

// 渲染联系方式偏好
function renderContactMethodChart(submissions) {
    const ctx = document.getElementById('contactMethodChart').getContext('2d');
    
    if (charts.contactMethod) {
        charts.contactMethod.destroy();
    }
    
    const methodLabels = {
        'email': '邮件',
        'wechat': '微信',
        'both': '邮件+微信'
    };
    
    const methodCounts = {};
    submissions.forEach(s => {
        const method = s.contact_method || 'email';
        methodCounts[method] = (methodCounts[method] || 0) + 1;
    });
    
    const labels = Object.keys(methodCounts).map(k => methodLabels[k]);
    const data = Object.values(methodCounts);
    
    charts.contactMethod = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#d4af37',
                    '#8b5cf6',
                    '#ec4899'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#b8b8b8',
                        padding: 15
                    }
                }
            }
        }
    });
}

// 渲染提交趋势
function renderTrendChart(submissions) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    if (charts.trend) {
        charts.trend.destroy();
    }
    
    // 按日期统计提交数
    const dateCounts = {};
    submissions.forEach(s => {
        const date = new Date(s.created_at).toLocaleDateString('zh-CN');
        dateCounts[date] = (dateCounts[date] || 0) + 1;
    });
    
    // 获取最近30天
    const today = new Date();
    const labels = [];
    const data = [];
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('zh-CN');
        labels.push(dateStr);
        data.push(dateCounts[dateStr] || 0);
    }
    
    charts.trend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '提交数',
                data: data,
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b8b8b8',
                        maxTicksLimit: 10
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b8b8b8'
                    }
                }
            }
        }
    });
}

// 渲染最近提交记录
function renderRecentSubmissions(submissions) {
    const tbody = document.getElementById('submissions-body');
    
    if (!submissions || submissions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading-row">暂无数据</td></tr>';
        return;
    }
    
    const recent = submissions.slice(0, 10);
    
    const industryLabels = {
        'tech': '科技/互联网',
        'finance': '金融',
        'retail': '零售/电商',
        'manufacturing': '制造业',
        'service': '服务业',
        'education': '教育',
        'healthcare': '医疗健康',
        'other': '其他'
    };
    
    const typeLabels = {
        'startup': '创业企业',
        'sme': '中小企业',
        'enterprise': '大型企业',
        'freelancer': '自由职业',
        'other': '其他'
    };
    
    tbody.innerHTML = recent.map(s => `
        <tr>
            <td>${s.full_name}</td>
            <td>
                <div>${s.phone}</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">${s.email}</div>
            </td>
            <td>${s.company || '-'}</td>
            <td>${industryLabels[s.industry] || '-'}</td>
            <td>${typeLabels[s.business_type] || '-'}</td>
            <td>${new Date(s.created_at).toLocaleDateString('zh-CN')}</td>
        </tr>
    `).join('');
}
