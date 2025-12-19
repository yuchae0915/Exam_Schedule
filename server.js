const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const app = express();
const PORT = 8000;

// 備份設定
const BACKUP_DIR = path.join(__dirname, 'backups');
const MAX_BACKUPS = 2; // 只保留最近2個備份

// 中間件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('frontend'));

// 確保備份資料夾存在
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
    console.log('✅ 已創建備份資料夾:', BACKUP_DIR);
}

// ==================== API 路由 ====================

// 獲取所有 localStorage 數據
app.get('/api/data', (req, res) => {
    const dataFile = path.join(__dirname, 'data.json');

    if (fs.existsSync(dataFile)) {
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        res.json(data);
    } else {
        res.json({});
    }
});

// 保存 localStorage 數據
app.post('/api/data', (req, res) => {
    const dataFile = path.join(__dirname, 'data.json');

    try {
        fs.writeFileSync(dataFile, JSON.stringify(req.body, null, 2), 'utf8');
        console.log('💾 數據已保存');
        res.json({ status: 'success' });
    } catch (error) {
        console.error('❌ 保存失敗:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 手動備份
app.post('/api/backup', (req, res) => {
    try {
        performBackup();
        res.json({ status: 'success', message: '備份成功' });
    } catch (error) {
        console.error('❌ 備份失敗:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 獲取備份列表
app.get('/api/backups', (req, res) => {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.endsWith('.json'))
            .map(f => ({
                name: f,
                path: path.join(BACKUP_DIR, f),
                size: fs.statSync(path.join(BACKUP_DIR, f)).size,
                created: fs.statSync(path.join(BACKUP_DIR, f)).mtime
            }))
            .sort((a, b) => b.created - a.created);

        res.json(files);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// ==================== 備份功能 ====================

/**
 * 執行備份
 */
function performBackup() {
    const dataFile = path.join(__dirname, 'data.json');

    // 檢查數據文件是否存在
    if (!fs.existsSync(dataFile)) {
        console.log('⚠️  沒有數據需要備份');
        return;
    }

    // 讀取數據
    const data = fs.readFileSync(dataFile, 'utf8');

    // 生成備份文件名（英文）
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-'); // HH-MM-SS
    const backupName = `exam_backup_${dateStr}_${timeStr}.json`;
    const backupPath = path.join(BACKUP_DIR, backupName);

    // 保存備份
    fs.writeFileSync(backupPath, data, 'utf8');
    console.log('✅ 備份成功:', backupName);

    // 清理舊備份
    cleanOldBackups();
}

/**
 * 清理舊備份，只保留最近 N 個
 */
function cleanOldBackups() {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.startsWith('exam_backup_') && f.endsWith('.json'))
            .map(f => ({
                name: f,
                path: path.join(BACKUP_DIR, f),
                created: fs.statSync(path.join(BACKUP_DIR, f)).mtime
            }))
            .sort((a, b) => b.created - a.created); // 最新的在前

        // 刪除超過限制的舊備份
        if (files.length > MAX_BACKUPS) {
            const toDelete = files.slice(MAX_BACKUPS);
            toDelete.forEach(file => {
                fs.unlinkSync(file.path);
                console.log('🗑️  已刪除舊備份:', file.name);
            });
        }
    } catch (error) {
        console.error('❌ 清理舊備份失敗:', error);
    }
}

// ==================== 定時任務 ====================

// 自動備份已移除，改為手動備份
// 用戶可以透過網頁界面點擊「備份數據」按鈕進行備份

// ==================== 心跳檢測（自動關閉） ====================

let lastHeartbeat = Date.now();
const HEARTBEAT_TIMEOUT = 10000; // 10秒沒有心跳就關閉
const SHUTDOWN_DELAY = 5000; // 延遲5秒關閉，確保數據保存
let isShuttingDown = false; // 防止重複觸發關閉

// 心跳端點
app.get('/api/heartbeat', (req, res) => {
    lastHeartbeat = Date.now();
    res.json({ status: 'alive' });
});

// 每秒檢查心跳
const heartbeatChecker = setInterval(() => {
    const timeSinceLastHeartbeat = Date.now() - lastHeartbeat;

    if (timeSinceLastHeartbeat > HEARTBEAT_TIMEOUT && !isShuttingDown) {
        isShuttingDown = true;
        clearInterval(heartbeatChecker); // 停止檢查

        console.log('');
        console.log('⚠️  偵測到所有網頁已關閉');
        console.log(`⏱️  ${SHUTDOWN_DELAY / 1000} 秒後自動關閉伺服器...`);
        console.log('');

        setTimeout(() => {
            console.log('👋 伺服器已自動關閉');
            process.exit(0);
        }, SHUTDOWN_DELAY);
    }
}, 1000);

// ==================== 啟動服務器 ====================

app.listen(PORT, () => {
    console.log('');
    console.log('==================================');
    console.log('🚀 考試時程表伺服器已啟動');
    console.log('==================================');
    console.log(`📍 訪問地址: http://localhost:${PORT}`);
    console.log(`📁 備份位置: ${BACKUP_DIR}`);
    console.log(`💾 備份方式: 手動（點擊網頁上的「備份數據」按鈕）`);
    console.log(`🔄 自動關閉: 關閉所有網頁後 ${HEARTBEAT_TIMEOUT / 1000} 秒自動停止`);
    console.log('==================================');
    console.log('');
    console.log('💡 提示: 關閉所有網頁標籤後，伺服器會自動停止');
    console.log('');
});

// 錯誤處理
process.on('uncaughtException', (error) => {
    console.error('❌ 未捕獲的錯誤:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ 未處理的 Promise 拒絕:', reason);
});
