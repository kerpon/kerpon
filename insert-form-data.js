// 插入模拟的表单提交数据到 form_submissions 表
// 在浏览器控制台执行

async function insertFormData(count = 100) {
    console.log(`开始生成 ${count} 条表单提交数据...`);
    
    const generator = new FormDataGenerator();
    const submissions = generator.generateFormSubmissions(count);
    
    console.log('开始插入数据到数据库...');
    
    try {
        const client = getSupabaseClient();
        
        let successCount = 0;
        let errorCount = 0;
        
        // 批量插入（每次10条）
        for (let i = 0; i < submissions.length; i += 10) {
            const batch = submissions.slice(i, i + 10);
            
            const { data, error } = await client.client
                .from('form_submissions')
                .insert(batch);
            
            if (error) {
                console.error(`批量 ${i}-${i + batch.length} 插入失败:`, error);
                errorCount += batch.length;
            } else {
                successCount += batch.length;
                console.log(`✓ 已插入 ${successCount} 条记录`);
            }
        }
        
        console.log('✅ 数据插入完成！');
        console.log(`成功: ${successCount} 条`);
        console.log(`失败: ${errorCount} 条`);
        
        return { success: successCount, error: errorCount };
        
    } catch (error) {
        console.error('插入数据失败:', error);
        return { success: 0, error: count };
    }
}

// 在控制台执行：
// insertFormData(100); // 生成100条数据
// insertFormData(200); // 生成200条数据
