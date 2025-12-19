// ==================== localStorage 備份與恢復工具 ====================

/**
 * 備份所有 localStorage 數據到 JSON 檔案
 */
function backupData() {
    try {
        // 收集所有 localStorage 數據
        const backup = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            backup[key] = localStorage.getItem(key);
        }

        // 生成备份文件名（包含日期时间）
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-'); // HH-MM-SS
        const filename = `exam_schedule_backup_${dateStr}_${timeStr}.json`;

        // 创建 JSON Blob
        const json = JSON.stringify(backup, null, 2);
        const blob = new Blob([json], { type: 'application/json' });

        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);

        // 触发下载
        a.click();

        // 清理
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // 顯示成功訊息
        showBackupMessage(`✅ 備份成功！\n檔案已下載：${filename}\n共備份 ${Object.keys(backup).length} 個數據項`, 'success');

        console.log('✅ 數據備份成功:', {
            filename: filename,
            itemCount: Object.keys(backup).length,
            size: (json.length / 1024).toFixed(2) + ' KB'
        });

    } catch (error) {
        console.error('❌ 备份失败:', error);
        showBackupMessage('❌ 备份失败：' + error.message, 'error');
    }
}

/**
 * 從 JSON 檔案恢復 localStorage 數據
 */
function restoreData() {
    try {
        // 创建文件选择器
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';

        input.onchange = function (event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const backup = JSON.parse(e.target.result);

                    // 显示确认对话框
                    const itemCount = Object.keys(backup).length;
                    const confirmMsg = `確定要恢復備份嗎？\n\n將匯入 ${itemCount} 個數據項\n當前數據將被覆蓋！`;

                    if (!confirm(confirmMsg)) {
                        showBackupMessage('ℹ️ 已取消恢復操作', 'info');
                        return;
                    }

                    // 清除現有數據（可選）
                    // localStorage.clear();

                    // 恢復數據
                    let successCount = 0;
                    Object.entries(backup).forEach(([key, value]) => {
                        try {
                            localStorage.setItem(key, value);
                            successCount++;
                        } catch (err) {
                            console.warn(`无法恢复 key: ${key}`, err);
                        }
                    });

                    // 显示成功消息并刷新页面
                    showBackupMessage(`✅ 恢復成功！\n成功匯入 ${successCount}/${itemCount} 個數據項\n\n頁面將在 2 秒後自動刷新...`, 'success');

                    console.log('✅ 數據恢復成功:', {
                        filename: file.name,
                        successCount: successCount,
                        totalCount: itemCount
                    });

                    // 2秒后刷新页面
                    setTimeout(() => {
                        location.reload();
                    }, 2000);

                } catch (error) {
                    console.error('❌ 解析备份文件失败:', error);
                    showBackupMessage('❌ 恢复失败：备份文件格式错误', 'error');
                }
            };

            reader.onerror = function () {
                console.error('❌ 读取文件失败');
                showBackupMessage('❌ 恢复失败：无法读取文件', 'error');
            };

            reader.readAsText(file);
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);

    } catch (error) {
        console.error('❌ 恢复操作失败:', error);
        showBackupMessage('❌ 恢复失败：' + error.message, 'error');
    }
}

/**
 * 顯示備份/恢復訊息提示
 */
function showBackupMessage(message, type = 'info') {
    // 移除已存在的訊息
    const existing = document.getElementById('backup-message');
    if (existing) {
        existing.remove();
    }

    // 創建訊息元素
    const messageDiv = document.createElement('div');
    messageDiv.id = 'backup-message';
    messageDiv.className = `backup-message backup-message-${type}`;
    messageDiv.textContent = message;

    // 添加樣式
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        max-width: 400px;
        white-space: pre-line;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;

    // 根據類型設置背景色
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        info: '#2196f3',
        warning: '#ff9800'
    };
    messageDiv.style.backgroundColor = colors[type] || colors.info;

    // 添加到頁面
    document.body.appendChild(messageDiv);

    // 3秒後自動移除（除非是成功訊息，那個會等待刷新）
    if (type !== 'success' || !message.includes('刷新')) {
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

// 添加動畫樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('✅ 備份/恢復工具已載入');
