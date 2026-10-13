// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 滚动动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// 为所有主要区域添加淡入动画
document.querySelectorAll('.pain-card, .solution-content, .stat-card, .lead-magnet-content').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// 数字计数动画
function animateNumber(element, target, suffix = '') {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 30);
}

// 当统计区进入视野时触发计数动画
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text);
                const suffix = text.replace(/[0-9]/g, '');
                animateNumber(stat, number, suffix);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// 页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 添加视差效果到英雄区
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        const heroContent = hero.querySelector('.hero-content');
        const heroImage = hero.querySelector('.hero-image');
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
        
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroImage.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    }
});

// 紧急性倒计时（可选功能）
function updateUrgency() {
    const urgencyElement = document.querySelector('.urgency strong');
    if (urgencyElement) {
        let count = parseInt(urgencyElement.textContent);
        if (count > 10) {
            // 随机减少，模拟真实的紧迫感
            if (Math.random() > 0.7) {
                count--;
                urgencyElement.textContent = count;
            }
        }
    }
}

// 每30秒更新一次紧迫感数字
setInterval(updateUrgency, 30000);
