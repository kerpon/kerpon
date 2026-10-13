// PDF 生成器 - 商业增长秘籍
class PDFGenerator {
    constructor() {
        this.jsPDF = window.jspdf.jsPDF;
    }

    // 生成商业增长秘籍 PDF
    generateGuide(name, email) {
        const doc = new this.jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;

        // 设置字体（jsPDF 默认不支持中文，使用英文或添加中文字体）
        // 这里使用英文内容，如需中文需要添加中文字体文件
        this.addCoverPage(doc, pageWidth, pageHeight, margin, contentWidth);
        this.addIntroduction(doc, pageWidth, pageHeight, margin, contentWidth);
        this.addStrategy1(doc, pageWidth, pageHeight, margin, contentWidth);
        this.addStrategy2(doc, pageWidth, pageHeight, margin, contentWidth);
        this.addStrategy3(doc, pageWidth, pageHeight, margin, contentWidth);
        this.addStrategy4(doc, pageWidth, pageHeight, margin, contentWidth);
        this.addStrategy5(doc, pageWidth, pageHeight, margin, contentWidth);
        this.addCommonMistakes(doc, pageWidth, pageHeight, margin, contentWidth);
        this.addActionChecklist(doc, pageWidth, pageHeight, margin, contentWidth);
        this.addConclusion(doc, pageWidth, pageHeight, margin, contentWidth);

        return doc;
    }

    // 添加封面
    addCoverPage(doc, pageWidth, pageHeight, margin, contentWidth) {
        doc.setFillColor(26, 26, 46); // 深色背景
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // 标题
        doc.setTextColor(212, 175, 55); // 金色
        doc.setFontSize(32);
        doc.setFont('helvetica', 'bold');
        doc.text('BUSINESS GROWTH', pageWidth / 2, pageHeight / 3, { align: 'center' });
        doc.text('SECRETS', pageWidth / 2, pageHeight / 3 + 15, { align: 'center' });

        // 副标题
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text('The Ultimate Guide to Scaling Your Business', pageWidth / 2, pageHeight / 2, { align: 'center' });

        // 作者
        doc.setTextColor(212, 175, 55);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('By Zheng Di', pageWidth / 2, pageHeight - 50, { align: 'center' });

        doc.addPage();
    }

    // 添加介绍
    addIntroduction(doc, pageWidth, pageHeight, margin, contentWidth) {
        this.addSectionTitle(doc, 'Introduction', margin, 30);
        
        const introText = [
            'Welcome to the Business Growth Secrets guide. This comprehensive manual is designed to help entrepreneurs and business leaders unlock their full potential.',
            '',
            'In this guide, you will discover:',
            '• 5 proven growth strategies',
            '• 10+ real-world case studies',
            '• Actionable steps you can implement today',
            '• Common mistakes to avoid',
            '',
            'These strategies have helped 100+ businesses achieve 3x growth. Now, it\'s your turn.'
        ];

        this.addMultilineText(doc, introText, margin, 50, contentWidth);
        doc.addPage();
    }

    // 添加策略1
    addStrategy1(doc, pageWidth, pageHeight, margin, contentWidth) {
        this.addSectionTitle(doc, 'Strategy 1: Data-Driven Decision Making', margin, 30);
        
        const content = [
            'The most successful businesses don\'t guess—they know. Data-driven decision making is the foundation of sustainable growth.',
            '',
            'Key Elements:',
            '• Track Key Performance Indicators (KPIs)',
            '• Use analytics tools to understand customer behavior',
            '• A/B test your marketing campaigns',
            '• Regularly review and adjust strategies based on data',
            '',
            'Implementation Steps:',
            '1. Identify your core metrics (revenue, conversion rate, customer acquisition cost)',
            '2. Set up tracking tools (Google Analytics, CRM, etc.)',
            '3. Create weekly data review meetings',
            '4. Make decisions based on data, not intuition'
        ];

        this.addMultilineText(doc, content, margin, 50, contentWidth);
        doc.addPage();
    }

    // 添加策略2
    addStrategy2(doc, pageWidth, pageHeight, margin, contentWidth) {
        this.addSectionTitle(doc, 'Strategy 2: Customer-Centric Approach', margin, 30);
        
        const content = [
            'Your customers are your most valuable asset. A customer-centric approach leads to higher retention, referrals, and revenue.',
            '',
            'Key Principles:',
            '• Understand your customer\'s pain points',
            '• Deliver exceptional customer service',
            '• Build long-term relationships',
            '• Continuously gather and act on feedback',
            '',
            'Action Items:',
            '1. Create detailed customer personas',
            '2. Map out the customer journey',
            '3. Implement a customer feedback system',
            '4. Train your team on customer service best practices',
            '5. Regularly measure customer satisfaction (NPS, CSAT)'
        ];

        this.addMultilineText(doc, content, margin, 50, contentWidth);
        doc.addPage();
    }

    // 添加策略3
    addStrategy3(doc, pageWidth, pageHeight, margin, contentWidth) {
        this.addSectionTitle(doc, 'Strategy 3: Strategic Partnerships', margin, 30);
        
        const content = [
            'Partnerships can accelerate growth by providing access to new markets, resources, and expertise.',
            '',
            'Types of Partnerships:',
            '• Strategic alliances with complementary businesses',
            '• Joint ventures for new projects',
            '• Affiliate partnerships',
            '• Technology partnerships',
            '',
            'How to Build Successful Partnerships:',
            '1. Identify partners with aligned values and goals',
            '2. Define clear mutual benefits',
            '3. Create detailed partnership agreements',
            '4. Maintain regular communication',
            '5. Measure and optimize partnership performance'
        ];

        this.addMultilineText(doc, content, margin, 50, contentWidth);
        doc.addPage();
    }

    // 添加策略4
    addStrategy4(doc, pageWidth, pageHeight, margin, contentWidth) {
        this.addSectionTitle(doc, 'Strategy 4: Digital Transformation', margin, 30);
        
        const content = [
            'In today\'s digital age, businesses that embrace technology thrive while those that don\'t fall behind.',
            '',
            'Key Areas to Digitize:',
            '• Marketing automation',
            '• Customer relationship management (CRM)',
            '• Sales processes',
            '• Operations and supply chain',
            '',
            'Implementation Tips:',
            '1. Start with areas that will have the biggest impact',
            '2. Choose the right technology stack',
            '3. Train your team thoroughly',
            '4. Monitor and measure results',
            '5. Continuously iterate and improve'
        ];

        this.addMultilineText(doc, content, margin, 50, contentWidth);
        doc.addPage();
    }

    // 添加策略5
    addStrategy5(doc, pageWidth, pageHeight, margin, contentWidth) {
        this.addSectionTitle(doc, 'Strategy 5: Continuous Innovation', margin, 30);
        
        const content = [
            'Innovation is not a one-time event—it\'s a continuous process that keeps your business ahead of the competition.',
            '',
            'Creating an Innovation Culture:',
            '• Encourage experimentation and learning from failure',
            '• Allocate resources for R&D',
            '• Stay informed about industry trends',
            '• Foster cross-functional collaboration',
            '',
            'Innovation Framework:',
            '1. Identify problems or opportunities',
            '2. Brainstorm solutions',
            '3. Prototype and test',
            '4. Measure results',
            '5. Scale successful innovations'
        ];

        this.addMultilineText(doc, content, margin, 50, contentWidth);
        doc.addPage();
    }

    // 添加常见错误
    addCommonMistakes(doc, pageWidth, pageHeight, margin, contentWidth) {
        this.addSectionTitle(doc, '7 Common Mistakes to Avoid', margin, 30);
        
        const mistakes = [
            '1. Ignoring customer feedback',
            '2. Focusing on the wrong metrics',
            '3. Scaling too quickly',
            '4. Neglecting company culture',
            '5. Underinvesting in marketing',
            '6. Failing to adapt to market changes',
            '7. Not building a strong team'
        ];

        mistakes.forEach((mistake, index) => {
            this.addMultilineText(doc, [mistake], margin, 50 + index * 15, contentWidth);
        });

        doc.addPage();
    }

    // 添加行动清单
    addActionChecklist(doc, pageWidth, pageHeight, margin, contentWidth) {
        this.addSectionTitle(doc, 'Action Checklist', margin, 30);
        
        const checklist = [
            'Immediate Actions (This Week):',
            '□ Review your current KPIs',
            '□ Set up analytics tracking',
            '□ Create customer personas',
            '□ Identify 3 potential partners',
            '',
            'Short-term Actions (This Month):',
            '□ Implement A/B testing',
            '□ Launch customer feedback system',
            '□ Begin digital transformation planning',
            '□ Start innovation brainstorming sessions',
            '',
            'Long-term Actions (This Quarter):',
            '□ Complete digital transformation',
            '□ Establish 2-3 strategic partnerships',
            '□ Launch innovation program',
            '□ Achieve 3x growth target'
        ];

        this.addMultilineText(doc, checklist, margin, 50, contentWidth);
        doc.addPage();
    }

    // 添加结论
    addConclusion(doc, pageWidth, pageHeight, margin, contentWidth) {
        this.addSectionTitle(doc, 'Conclusion', margin, 30);
        
        const conclusion = [
            'You now have the strategies and tools to achieve explosive business growth. The key is implementation.',
            '',
            'Remember:',
            '• Growth is a journey, not a destination',
            '• Consistency beats intensity',
            '• Your team is your greatest asset',
            '• Customer satisfaction drives success',
            '',
            'Take action today. Pick one strategy and implement it this week. Then move to the next.',
            '',
            'Your success story starts now.',
            '',
            'Best regards,',
            'Zheng Di'
        ];

        this.addMultilineText(doc, conclusion, margin, 50, contentWidth);
    }

    // 辅助方法：添加章节标题
    addSectionTitle(doc, title, x, y) {
        doc.setTextColor(212, 175, 55);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(title, x, y);
    }

    // 辅助方法：添加多行文本
    addMultilineText(doc, lines, x, y, maxWidth) {
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        let currentY = y;
        lines.forEach(line => {
            if (line === '') {
                currentY += 7;
                return;
            }
            const splitText = doc.splitTextToSize(line, maxWidth);
            splitText.forEach(textLine => {
                doc.text(textLine, x, currentY);
                currentY += 7;
            });
        });
    }
}

// 创建全局实例
const pdfGenerator = new PDFGenerator();
