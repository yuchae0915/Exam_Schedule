// 高考115学习时间表配置
// 根据当前日期和时间，智能显示应该做的任务

/**
 * 每日学习时间表
 * 格式: { start: 'HH:MM', end: 'HH:MM', activity: '活动名称', type: 'study|break|rest' }
 */
const dailySchedule = [
    { start: '06:00', end: '07:00', activity: '晨間複習', type: 'study', icon: '📖' },
    { start: '07:00', end: '08:00', activity: '早餐＆整理', type: 'break', icon: '🍳' },
    { start: '08:00', end: '10:00', activity: '專注學習時段一', type: 'study', icon: '💪' },
    { start: '10:00', end: '10:30', activity: '休息＆運動', type: 'break', icon: '🚶' },
    { start: '10:30', end: '12:30', activity: '專注學習時段二', type: 'study', icon: '📚' },
    { start: '12:30', end: '14:00', activity: '午餐＆午休', type: 'break', icon: '🍱' },
    { start: '14:00', end: '16:00', activity: '專注學習時段三', type: 'study', icon: '✍️' },
    { start: '16:00', end: '16:30', activity: '下午茶休息', type: 'break', icon: '☕' },
    { start: '16:30', end: '18:30', activity: '專注學習時段四', type: 'study', icon: '🎯' },
    { start: '18:30', end: '19:30', activity: '晚餐時間', type: 'break', icon: '🍜' },
    { start: '19:30', end: '21:30', activity: '晚間學習時段', type: 'study', icon: '📝' },
    { start: '21:30', end: '22:30', activity: '複習＆總結', type: 'study', icon: '📋' },
    { start: '22:30', end: '23:00', activity: '放鬆準備就寢', type: 'rest', icon: '🌙' },
    { start: '23:00', end: '06:00', activity: '睡眠時間', type: 'rest', icon: '😴' }
];

/**
 * 根据月份获取当前阶段的学习重点
 */
const monthlyFocus = {
    11: { // 11月
        subjects: ['資訊管理', '資料庫預習'],
        tips: '追趕進度，建立基礎'
    },
    12: { // 12月
        subjects: ['資訊管理完課', '資料庫', '資料結構預習'],
        tips: '全力跟課，深度預習'
    },
    1: { // 1月
        subjects: ['資料庫完課', '資料結構', '資通網路'],
        tips: 'DB攻堅，開始練習考古題'
    },
    2: { // 2月
        subjects: ['資料結構密集學習', '考古題練習'],
        tips: '利用農曆年假期加速'
    },
    3: { // 3月
        subjects: ['資料結構完課', '資通安全開始'],
        tips: '收尾DS，啟動Security'
    },
    4: { // 4月
        subjects: ['資通安全完課', 'Tier1考古題'],
        tips: '全科完成，考古題全面啟動'
    },
    5: { // 5月
        subjects: ['Tier1制霸', '錯題複習'],
        tips: '考古題黃金期，建立題感'
    },
    6: { // 6月
        subjects: ['Tier2補充', '錯題＆複習'],
        tips: '調整狀態，準備應考'
    }
};

/**
 * 將時間字符串轉換為分鐘數（從00:00開始算）
 */
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * 將分鐘數轉換為時間字符串
 */
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * 獲取當前應該進行的活動
 */
function getCurrentActivity() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let i = 0; i < dailySchedule.length; i++) {
        const activity = dailySchedule[i];
        const startMinutes = timeToMinutes(activity.start);
        let endMinutes = timeToMinutes(activity.end);

        // 處理跨午夜的情況（如睡眠時間）
        if (endMinutes <= startMinutes) {
            endMinutes += 24 * 60;
        }

        let currentCheckMinutes = currentMinutes;
        if (startMinutes > endMinutes && currentMinutes < startMinutes) {
            currentCheckMinutes += 24 * 60;
        }

        if (currentCheckMinutes >= startMinutes && currentCheckMinutes < endMinutes) {
            return {
                ...activity,
                index: i
            };
        }
    }

    // 如果沒找到，返回第一個活動（凌晨時段）
    return {
        ...dailySchedule[0],
        index: 0
    };
}

/**
 * 獲取下一個活動
 */
function getNextActivity() {
    const current = getCurrentActivity();
    const nextIndex = (current.index + 1) % dailySchedule.length;
    return dailySchedule[nextIndex];
}

/**
 * 計算距離下一個活動的時間
 */
function getTimeUntilNext() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const next = getNextActivity();
    let nextStartMinutes = timeToMinutes(next.start);

    // 處理跨日情況
    if (nextStartMinutes <= currentMinutes) {
        nextStartMinutes += 24 * 60;
    }

    const diffMinutes = nextStartMinutes - currentMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (hours > 0) {
        return `${hours}小時${minutes}分鐘後`;
    } else {
        return `${minutes}分鐘後`;
    }
}

/**
 * 獲取當前月份的學習重點
 */
function getCurrentMonthFocus() {
    const month = new Date().getMonth() + 1; // 0-11 -> 1-12
    return monthlyFocus[month] || monthlyFocus[1];
}

/**
 * 更新當前活動顯示
 */
function updateCurrentActivityDisplay() {
    const current = getCurrentActivity();
    const next = getNextActivity();
    const timeUntil = getTimeUntilNext();
    const monthFocus = getCurrentMonthFocus();

    // 更新當前活動
    const currentActivityEl = document.getElementById('currentActivity');
    if (currentActivityEl) {
        let activityText = `${current.icon} ${current.activity}`;
        if (current.type === 'study') {
            activityText += ` - ${monthFocus.subjects[0] || '學習中'}`;
        }
        currentActivityEl.textContent = activityText;
    }

    // 更新下一個活動
    const nextActivityEl = document.getElementById('nextActivity');
    if (nextActivityEl) {
        nextActivityEl.textContent = `${next.icon} ${next.activity}`;
    }

    // 更新倒計時
    const timeUntilEl = document.getElementById('timeUntil');
    if (timeUntilEl) {
        timeUntilEl.textContent = `（${timeUntil}）`;
    }
}

/**
 * 初始化活動追蹤
 */
function initActivityTracking() {
    // 立即更新一次
    updateCurrentActivityDisplay();

    // 每30秒更新一次
    setInterval(updateCurrentActivityDisplay, 30000);
}

/**
 * 根據當前日期自動切換到對應月份
 */
function autoSwitchToCurrentMonth() {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const date = now.getDate();

    let targetMonth = 'nov'; // 預設

    // 11月20日之後
    if (month === 10 && date >= 20) {
        targetMonth = 'nov';
    }
    // 12月
    else if (month === 11) {
        targetMonth = 'dec';
    }
    // 1月
    else if (month === 0) {
        targetMonth = 'jan';
    }
    // 2月
    else if (month === 1) {
        targetMonth = 'feb';
    }
    // 3月
    else if (month === 2) {
        targetMonth = 'mar';
    }
    // 4月
    else if (month === 3) {
        targetMonth = 'apr';
    }
    // 5月
    else if (month === 4) {
        targetMonth = 'may';
    }
    // 6月
    else if (month === 5) {
        targetMonth = 'jun';
    }

    // 切換到對應月份
    if (typeof switchMonth === 'function') {
        switchMonth(targetMonth);
    }
}
