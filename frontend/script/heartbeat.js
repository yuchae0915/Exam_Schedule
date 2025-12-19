// ==================== 心跳檢測（自動關閉伺服器） ====================

/**
 * 定期向伺服器發送心跳，告訴伺服器網頁還在使用中
 * 當所有網頁關閉後，伺服器會自動停止
 */
(function initHeartbeat() {
    const HEARTBEAT_INTERVAL = 3000; // 每3秒發送一次心跳
    const INITIAL_DELAY = 1000; // 首次延遲1秒
    const MAX_RETRIES = 5; // 最多重試5次

    let heartbeatTimer = null;
    let serverReady = false;
    let retryCount = 0;

    function sendHeartbeat() {
        // 如果伺服器還沒準備好，就不顯示錯誤
        fetch('/api/heartbeat')
            .then(response => {
                if (response.ok) {
                    serverReady = true;
                    return response.json();
                }
            })
            .catch(error => {
                // 靜默處理，不顯示任何錯誤
            });
    }

    function startHeartbeat() {
        // 嘗試發送心跳
        fetch('/api/heartbeat')
            .then(response => {
                if (response.ok) {
                    serverReady = true;
                    // 伺服器準備好了，開始定期心跳
                    heartbeatTimer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
                    console.log('💓 心跳檢測已啟動');
                } else {
                    throw new Error('Server not ready');
                }
            })
            .catch(error => {
                // 伺服器還沒準備好，重試
                retryCount++;
                if (retryCount <= MAX_RETRIES) {
                    setTimeout(startHeartbeat, 1000);
                }
            });
    }

    // 延遲啟動
    setTimeout(startHeartbeat, INITIAL_DELAY);

    // 頁面即將關閉時停止心跳
    window.addEventListener('beforeunload', () => {
        if (heartbeatTimer) {
            clearInterval(heartbeatTimer);
        }
    });
})();
