

function showTab(tabId) {
    // 隱藏所有tab內容
    var tabContents = document.getElementsByClassName('tab-content');
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }

    // 移除所有按鈕的active類
    var tabButtons = document.getElementsByClassName('tab-button');
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }

    // 顯示選中的tab
    document.getElementById(tabId).classList.add('active');

    // 為對應按鈕添加active類
    var buttons = document.getElementsByClassName('tab-button');
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].onclick.toString().includes(tabId)) {
            buttons[i].classList.add('active');
        }
    }
}
// 定義各階段的時間表
const schedules = {
    stage1: {
        monday: [
            { start: "09:00", end: "12:00", activity: "程式設計課程" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "程式設計申論題練習" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "16:30", activity: "休息準備" },
            { start: "16:30", end: "20:00", activity: "健身+晚餐" },
            { start: "20:00", end: "22:00", activity: "筆記整理+Notion弱點記錄" },
            { start: "22:00", end: "23:00", activity: "明日預習" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ],
        tuesday: [
            { start: "09:00", end: "12:00", activity: "資通網路課程" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "資通網路申論題練習" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "16:30", activity: "休息準備" },
            { start: "16:30", end: "20:00", activity: "健身+晚餐" },
            { start: "20:00", end: "22:00", activity: "筆記整理+Notion弱點記錄" },
            { start: "22:00", end: "23:00", activity: "錯題檢討" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ],
        wednesday: [
            { start: "09:00", end: "12:00", activity: "計算機概要課程" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "計算機選擇題練習" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "20:00", activity: "休息+晚餐" },
            { start: "20:00", end: "22:00", activity: "筆記整理+Notion弱點記錄" },
            { start: "22:00", end: "23:00", activity: "今日總複習" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ],
        thursday: [
            { start: "09:00", end: "12:00", activity: "資訊管理課程" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "資訊管理申論題練習" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "16:30", activity: "休息準備" },
            { start: "16:30", end: "20:00", activity: "健身+晚餐" },
            { start: "20:00", end: "22:00", activity: "筆記整理+Notion弱點記錄" },
            { start: "22:00", end: "23:00", activity: "錯題檢討" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ],
        friday: [
            { start: "09:00", end: "12:00", activity: "程式設計課程" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "程式實作練習" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "16:30", activity: "休息準備" },
            { start: "16:30", end: "20:00", activity: "健身+晚餐" },
            { start: "20:00", end: "22:00", activity: "週複習整理" },
            { start: "22:00", end: "23:00", activity: "弱點補強" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ],
        saturday: [
            { start: "09:00", end: "12:00", activity: "資訊管理課程" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "申論題綜合練習" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "20:00", activity: "休息+晚餐" },
            { start: "20:00", end: "21:00", activity: "英文課程" },
            { start: "21:00", end: "22:00", activity: "英文複習" },
            { start: "22:00", end: "23:00", activity: "今日總複習" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ],
        sunday: [
            { start: "09:00", end: "12:00", activity: "本週進度補課/緩衝" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "14:00", activity: "國文課程" },
            { start: "14:00", end: "15:00", activity: "國文複習" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "20:00", activity: "休息+晚餐" },
            { start: "20:00", end: "22:00", activity: "週複習+下週規劃" },
            { start: "22:00", end: "23:00", activity: "整理本週筆記" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ]
    },
    stage2: {
        monday: [
            { start: "09:00", end: "10:30", activity: "專業科目歷屆選擇題" },
            { start: "10:30", end: "12:00", activity: "申論題寫作練習" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "申論題檢討+改進" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "16:30", activity: "休息準備" },
            { start: "16:30", end: "20:00", activity: "健身+晚餐" },
            { start: "20:00", end: "22:00", activity: "弱點單元加強" },
            { start: "22:00", end: "23:00", activity: "Notion筆記更新" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ],
        tuesday: [
            { start: "09:00", end: "10:30", activity: "程式設計實作" },
            { start: "10:30", end: "12:00", activity: "程式申論題練習" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "Debug與優化練習" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "16:30", activity: "休息準備" },
            { start: "16:30", end: "20:00", activity: "健身+晚餐" },
            { start: "20:00", end: "22:00", activity: "歷屆試題深入解析" },
            { start: "22:00", end: "23:00", activity: "錯題整理" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ],
        wednesday: [
            { start: "09:00", end: "10:30", activity: "資通網路歷屆題" },
            { start: "10:30", end: "12:00", activity: "網路申論題練習" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "網路實務案例分析" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "20:00", activity: "休息+晚餐" },
            { start: "20:00", end: "22:00", activity: "弱點單元加強" },
            { start: "22:00", end: "23:00", activity: "今日總複習" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ],
        thursday: [
            { start: "09:00", end: "10:30", activity: "計算機選擇題精練" },
            { start: "10:30", end: "12:00", activity: "計算機進階題型" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "速解技巧練習" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "16:30", activity: "休息準備" },
            { start: "16:30", end: "20:00", activity: "健身+晚餐" },
            { start: "20:00", end: "22:00", activity: "跨科整合練習" },
            { start: "22:00", end: "23:00", activity: "Notion筆記更新" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ],
        friday: [
            { start: "09:00", end: "10:30", activity: "資訊管理歷屆題" },
            { start: "10:30", end: "12:00", activity: "資管申論題練習" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "資料處理實務練習" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "16:30", activity: "休息準備" },
            { start: "16:30", end: "20:00", activity: "健身+晚餐" },
            { start: "20:00", end: "21:00", activity: "國文課程" },
            { start: "21:00", end: "22:00", activity: "國文複習" },
            { start: "22:00", end: "23:00", activity: "週檢討" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ],
        saturday: [
            { start: "09:00", end: "12:00", activity: "模擬考(專業科目)" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "模考檢討" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "20:00", activity: "休息+晚餐" },
            { start: "20:00", end: "21:00", activity: "英文課程" },
            { start: "21:00", end: "22:00", activity: "英文複習" },
            { start: "22:00", end: "23:00", activity: "錯題強化" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ],
        sunday: [
            { start: "09:00", end: "12:00", activity: "弱點科目加強" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "申論題技巧總結" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "17:00", activity: "法學緒論速成" },
            { start: "17:00", end: "18:00", activity: "憲法速成" },
            { start: "18:00", end: "20:00", activity: "晚餐+休息" },
            { start: "20:00", end: "22:00", activity: "週總複習" },
            { start: "22:00", end: "23:00", activity: "下週規劃" },
            { start: "23:00", end: "01:00", activity: "自由安排" }
        ]
    },
    stage3: {
        monday: [
            { start: "09:00", end: "12:00", activity: "國營模擬考(計算機+程式)" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "模考檢討+強化" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "16:30", activity: "休息準備" },
            { start: "16:30", end: "20:00", activity: "健身+晚餐" },
            { start: "20:00", end: "22:00", activity: "資管重點加強" },
            { start: "22:00", end: "23:00", activity: "公式速記" },
            { start: "23:00", end: "00:00", activity: "早睡調整" }
        ],
        tuesday: [
            { start: "09:00", end: "10:30", activity: "計算機錯題精練" },
            { start: "10:30", end: "12:00", activity: "選擇題速解訓練" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "程式申論強化" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "16:30", activity: "休息準備" },
            { start: "16:30", end: "20:00", activity: "健身+晚餐" },
            { start: "20:00", end: "22:00", activity: "重點筆記背誦" },
            { start: "22:00", end: "23:00", activity: "程式語法速記" },
            { start: "23:00", end: "00:00", activity: "早睡調整" }
        ],
        wednesday: [
            { start: "09:00", end: "12:00", activity: "國營模擬考(資通+資管)" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "模考檢討+強化" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "20:00", activity: "休息+晚餐" },
            { start: "20:00", end: "21:00", activity: "法學緒論課程" },
            { start: "21:00", end: "22:00", activity: "法緒重點整理" },
            { start: "22:00", end: "23:00", activity: "網路協定速記" },
            { start: "23:00", end: "00:00", activity: "早睡調整" }
        ],
        thursday: [
            { start: "09:00", end: "10:30", activity: "資通網路錯題" },
            { start: "10:30", end: "12:00", activity: "網路申論精練" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "資管申論強化" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "16:30", activity: "休息準備" },
            { start: "16:30", end: "20:00", activity: "健身+晚餐" },
            { start: "20:00", end: "21:00", activity: "憲法課程" },
            { start: "21:00", end: "22:00", activity: "憲法重點整理" },
            { start: "22:00", end: "23:00", activity: "管理理論速記" },
            { start: "23:00", end: "00:00", activity: "早睡調整" }
        ],
        friday: [
            { start: "09:00", end: "12:00", activity: "全科模擬考" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "模考檢討+強化" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "16:30", activity: "休息準備" },
            { start: "16:30", end: "20:00", activity: "健身+晚餐" },
            { start: "20:00", end: "21:00", activity: "法緒憲法練習" },
            { start: "21:00", end: "22:00", activity: "重點筆記背誦" },
            { start: "22:00", end: "23:00", activity: "綜合整理" },
            { start: "23:00", end: "00:00", activity: "早睡調整" }
        ],
        saturday: [
            { start: "09:00", end: "10:30", activity: "專業科目總複習" },
            { start: "10:30", end: "12:00", activity: "易錯題型專練" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "考古題精練" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "20:00", activity: "休息+晚餐" },
            { start: "20:00", end: "22:00", activity: "考前猜題練習" },
            { start: "22:00", end: "23:00", activity: "考試注意事項" },
            { start: "23:00", end: "00:00", activity: "早睡調整" }
        ],
        sunday: [
            { start: "09:00", end: "12:00", activity: "普考模擬考(含法緒憲法)" },
            { start: "12:00", end: "13:00", activity: "午餐時間" },
            { start: "13:00", end: "15:00", activity: "模考總檢討" },
            { start: "15:00", end: "16:00", activity: "國英考古題練習" },
            { start: "16:00", end: "18:00", activity: "法緒憲法衝刺" },
            { start: "18:00", end: "20:00", activity: "晚餐+休息" },
            { start: "20:00", end: "22:00", activity: "全科快速複習" },
            { start: "22:00", end: "23:00", activity: "調整心態" },
            { start: "23:00", end: "00:00", activity: "早睡調整" }
        ]
    }
};

// 取得當前階段
function getCurrentStage() {
    const today = new Date();
    const month = today.getMonth() + 1;

    if (month >= 5 && month <= 7) return 'stage1';
    else if (month >= 8 && month <= 9) return 'stage2';
    else return 'stage3';
}

// 取得星期幾的英文
function getDayOfWeek() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
}

// 時間轉換為分鐘
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

// 格式化時間差
function formatTimeDiff(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) return `${hours}小時${mins}分鐘後`;
    return `${mins}分鐘後`;
}

// 更新當前活動顯示
function updateCurrentActivity() {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });

    // 更新時間
    document.getElementById('currentTime').textContent = currentTime;

    // 更新日期顯示（新格式）
    const weekdayElement = document.getElementById('currentWeekday');
    const dateNumberElement = document.getElementById('currentDateNumber');
    const monthYearElement = document.getElementById('currentMonthYear');

    if (weekdayElement && dateNumberElement && monthYearElement) {
        weekdayElement.textContent = now.toLocaleDateString('zh-TW', { weekday: 'long' });
        dateNumberElement.textContent = now.getDate();
        monthYearElement.textContent = now.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
    }

    // 保留舊的日期元素更新（如果存在）
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const currentDate = now.toLocaleDateString('zh-TW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        currentDateElement.textContent = currentDate;
    }

    const stage = getCurrentStage();
    const dayOfWeek = getDayOfWeek();
    const todaySchedule = schedules[stage][dayOfWeek] || schedules.stage1[dayOfWeek];

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let currentActivity = "休息時間";
    let nextActivity = "";
    let timeUntilNext = "";

    for (let i = 0; i < todaySchedule.length; i++) {
        const startMinutes = timeToMinutes(todaySchedule[i].start);
        const endMinutes = timeToMinutes(todaySchedule[i].end);

        // 處理跨午夜的情況
        const adjustedEndMinutes = endMinutes < startMinutes ? endMinutes + 24 * 60 : endMinutes;
        const adjustedCurrentMinutes = currentMinutes < startMinutes && endMinutes < startMinutes ? currentMinutes + 24 * 60 : currentMinutes;

        if (adjustedCurrentMinutes >= startMinutes && adjustedCurrentMinutes < adjustedEndMinutes) {
            currentActivity = todaySchedule[i].activity;

            // 找下一個活動
            if (i < todaySchedule.length - 1) {
                nextActivity = todaySchedule[i + 1].activity;
                const nextStartMinutes = timeToMinutes(todaySchedule[i + 1].start);
                timeUntilNext = formatTimeDiff(nextStartMinutes - currentMinutes);
            } else {
                // 如果是今天最後一個活動，顯示明天第一個活動
                const daysOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                const currentDayIndex = daysOrder.indexOf(dayOfWeek);
                const tomorrowIndex = (currentDayIndex + 1) % 7;
                const tomorrow = daysOrder[tomorrowIndex];

                if (schedules[stage][tomorrow]) {
                    const tomorrowSchedule = schedules[stage][tomorrow];
                    nextActivity = `明日：${tomorrowSchedule[0].activity}`;
                } else {
                    nextActivity = "明日：休息日";
                }
                timeUntilNext = "";
            }
            break;
        }
    }

    // 如果當前時間在所有活動之前
    if (currentMinutes < timeToMinutes(todaySchedule[0].start)) {
        currentActivity = "準備開始學習";
        nextActivity = todaySchedule[0].activity;
        timeUntilNext = formatTimeDiff(timeToMinutes(todaySchedule[0].start) - currentMinutes);
    }

    document.getElementById('currentActivity').textContent = currentActivity;
    document.getElementById('nextActivity').textContent = nextActivity;
    document.getElementById('timeUntil').textContent = timeUntilNext;
}

// 切換技巧內容顯示
function toggleTips(section) {
    const content = document.getElementById(`content-${section}`);
    const toggle = document.getElementById(`toggle-${section}`);

    content.classList.toggle('show');
    toggle.classList.toggle('expanded');
}

// 初始化並每分鐘更新
updateCurrentActivity();
setInterval(updateCurrentActivity, 60000);

// 當切換 tab 時也更新顯示
const originalShowTab = window.showTab;
window.showTab = function (tabId) {
    originalShowTab(tabId);
    updateCurrentActivity();
};

const btn = document.getElementById("backToTopBtn");

document.addEventListener('DOMContentLoaded', function () {
    // 如果需要預設展開某個區塊
    toggleTips('study-method');
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        btn.classList.add("show");
    } else {
        btn.classList.remove("show");
    }
});

btn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ========== 月份进度管理 ==========
function toggleMonth(month) {
    const content = document.getElementById(`content-${month}`);
    const toggle = document.getElementById(`toggle-${month}`);

    if (content && toggle) {
        content.classList.toggle('show');
        toggle.classList.toggle('expanded');
    }
}

function updateMonthProgress(month) {
    const content = document.getElementById(`content-${month}`);
    if (!content) return;

    const checkboxes = content.querySelectorAll('input[type="checkbox"]');
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

    const progressBar = document.getElementById(`progress-${month}`);
    const progressText = document.getElementById(`text-${month}`);

    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }

    if (progressText) {
        progressText.textContent = percentage + '%';
    }

    // 保存进度到localStorage
    saveMonthProgress(month, checked, total);
}

function saveMonthProgress(month, checked, total) {
    const progress = {
        checked: checked,
        total: total,
        percentage: Math.round((checked / total) * 100)
    };
    localStorage.setItem(`month-progress-${month}`, JSON.stringify(progress));
}

function loadMonthProgress() {
    const months = ['nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun'];

    months.forEach(month => {
        const saved = localStorage.getItem(`month-progress-${month}`);
        if (saved) {
            const progress = JSON.parse(saved);
            const progressBar = document.getElementById(`progress-${month}`);
            const progressText = document.getElementById(`text-${month}`);

            if (progressBar) {
                progressBar.style.width = progress.percentage + '%';
            }

            if (progressText) {
                progressText.textContent = progress.percentage + '%';
            }
        }
    });
}

// ========== 区块折叠管理 ==========
function toggleSection(section) {
    const content = document.getElementById(`content-${section}`);
    const toggle = document.getElementById(`toggle-${section}`);

    if (content && toggle) {
        content.classList.toggle('show');
        toggle.classList.toggle('expanded');
    }
}

// ========== 高考科目监控 ==========
const gaokaoSubjects = {
    mis: { name: '資訊管理', total: 17, lessons: [] },
    db: { name: '資料庫', total: 16, lessons: [] },
    net: { name: '資通網路', total: 15, lessons: [] },
    ds: { name: '資料結構', total: 25, lessons: [] },
    sec: { name: '資訊安全', total: 14, lessons: [] },
    prog: { name: '程式設計', total: 4, lessons: [] }
};

function initGaokaoSubjects() {
    Object.keys(gaokaoSubjects).forEach(subjectId => {
        const subject = gaokaoSubjects[subjectId];
        const container = document.getElementById(`lessons-${subjectId}`);

        if (!container) return;

        // 生成课程列表
        for (let i = 1; i <= subject.total; i++) {
            const lessonItem = document.createElement('div');
            lessonItem.className = 'lesson-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${subjectId}-lesson-${i}`;
            checkbox.onchange = () => updateGaokaoProgress(subjectId);

            const label = document.createElement('label');
            label.htmlFor = `${subjectId}-lesson-${i}`;
            label.textContent = `第 ${i} 堂`;

            lessonItem.appendChild(checkbox);
            lessonItem.appendChild(label);
            container.appendChild(lessonItem);
        }

        // 加载保存的进度
        loadGaokaoProgress(subjectId);
    });

    // 更新总体统计
    updateGaokaoOverallStats();
}

function toggleSubject(subjectId) {
    const content = document.getElementById(`subject-${subjectId}`);
    const arrow = document.getElementById(`arrow-${subjectId}`);

    if (content && arrow) {
        content.classList.toggle('active');
        arrow.classList.toggle('rotated');
    }
}

function updateGaokaoProgress(subjectId) {
    const subject = gaokaoSubjects[subjectId];
    const container = document.getElementById(`lessons-${subjectId}`);

    if (!container) return;

    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

    // 更新进度显示
    const progressText = document.getElementById(`progress-text-${subjectId}`);
    const percentText = document.getElementById(`percent-${subjectId}`);
    const badge = document.getElementById(`badge-${subjectId}`);

    if (progressText) {
        progressText.textContent = `${checked}/${total}堂`;
    }

    if (percentText) {
        percentText.textContent = `${percentage}%`;
    }

    // 根据完成率改变徽章颜色
    if (badge) {
        badge.removeAttribute('data-rate');
        if (percentage === 100) {
            badge.setAttribute('data-rate', 'complete');
        } else if (percentage >= 70) {
            badge.setAttribute('data-rate', 'high');
        } else if (percentage >= 40) {
            badge.setAttribute('data-rate', 'medium');
        } else {
            badge.setAttribute('data-rate', 'low');
        }
    }

    // 保存进度
    saveGaokaoProgress(subjectId, checked);

    // 更新总体统计
    updateGaokaoOverallStats();
}

function saveGaokaoProgress(subjectId, checked) {
    const checkboxStates = [];
    const container = document.getElementById(`lessons-${subjectId}`);

    if (container) {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((cb, index) => {
            checkboxStates[index] = cb.checked;
        });
    }

    localStorage.setItem(`gaokao-${subjectId}`, JSON.stringify(checkboxStates));
}

function loadGaokaoProgress(subjectId) {
    const saved = localStorage.getItem(`gaokao-${subjectId}`);

    if (saved) {
        const checkboxStates = JSON.parse(saved);
        const container = document.getElementById(`lessons-${subjectId}`);

        if (container) {
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach((cb, index) => {
                if (checkboxStates[index]) {
                    cb.checked = true;
                }
            });
        }
    }

    updateGaokaoProgress(subjectId);
}

function updateGaokaoOverallStats() {
    let totalLessons = 0;
    let totalCompleted = 0;

    Object.keys(gaokaoSubjects).forEach(subjectId => {
        const subject = gaokaoSubjects[subjectId];
        const container = document.getElementById(`lessons-${subjectId}`);

        if (container) {
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            const checked = Array.from(checkboxes).filter(cb => cb.checked).length;

            totalLessons += subject.total;
            totalCompleted += checked;
        }
    });

    const completionRate = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

    const completedEl = document.getElementById('gaokao-total-completed');
    const totalEl = document.getElementById('gaokao-total-lessons');
    const rateEl = document.getElementById('gaokao-completion-rate');

    if (completedEl) completedEl.textContent = totalCompleted;
    if (totalEl) totalEl.textContent = totalLessons;
    if (rateEl) rateEl.textContent = completionRate + '%';
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    // 加载月份进度
    loadMonthProgress();

    // 初始化高考科目
    initGaokaoSubjects();
});
