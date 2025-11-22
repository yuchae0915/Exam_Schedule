// 高考115專業科目數據配置
const gaokaoSubjectData = {
    mis: {
        name: '資訊管理 (MIS)',
        icon: '📚',
        totalLessons: 17,
        idPrefix: 'mis',
        startDate: '114.10.03',
        endDate: '114.12.12',
        description: '密集課程：約 2 個月結束，比網路晚開課但早結束'
    },
    db: {
        name: '資料庫 (DB)',
        icon: '💾',
        totalLessons: 16,
        idPrefix: 'db',
        startDate: '114.11.28',
        endDate: '115.01.23',
        description: '跨年度：跨越年底與年初，需注意 SQL 實作練習'
    },
    ds: {
        name: '資料結構 (DS)',
        icon: '📊',
        totalLessons: 25,
        idPrefix: 'ds',
        startDate: '115.01.23',
        endDate: '115.03.13',
        description: '年後衝刺：約 1.5 個月，時間短但難度高，需極度專注'
    },
    network: {
        name: '網路 (Network)',
        icon: '🌐',
        totalLessons: 15,
        idPrefix: 'network',
        startDate: '114.09.19',
        endDate: '114.12.26',
        description: '週期最長：橫跨 3 個多月，打底期，與資管高度重疊'
    },
    security: {
        name: '安全 (Security)',
        icon: '🔒',
        totalLessons: 14,
        idPrefix: 'security',
        startDate: '115.03.13',
        endDate: '115.04.24',
        description: '考前收尾：約 1.5 個月，接續在資料結構後，直通考前'
    }
};

const GAOKAO_STORAGE_KEY = 'gaokao115Progress';
const MONTH_STORAGE_KEY = 'gaokao115MonthProgress';

// ========== 科目學習監控 ==========

/**
 * 創建科目卡片
 */
function createGaokaoSubjectCard(subjectKey) {
    const data = gaokaoSubjectData[subjectKey];
    const container = document.getElementById(`gaokao-subject-${subjectKey}`);

    if (!data || !container) return;

    // 生成課程checkbox
    const lessonsMarkup = Array.from({ length: data.totalLessons }, (_, index) => {
        const number = index + 1;
        const id = `${data.idPrefix}-lesson-${number}`;
        return `
            <div class="lesson-item">
                <input type="checkbox" id="${id}" onchange="updateGaokaoSubjectProgress('${subjectKey}')">
                <label for="${id}">第 ${number} 堂</label>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <button class="collapse-btn" onclick="toggleGaokaoSubject('${subjectKey}')">
            <span>${data.icon} ${data.name}</span>
            <div class="progress-info">
                <span class="progress-badge" id="badge-${subjectKey}">
                    <span class="progress-value" id="progress-text-${subjectKey}">0/${data.totalLessons}堂</span>
                    <span class="progress-percent" id="percent-${subjectKey}">0%</span>
                </span>
                <span class="collapse-arrow" id="arrow-${subjectKey}">▼</span>
            </div>
        </button>
        <div class="collapse-content" id="subject-${subjectKey}">
            <div class="lesson-grid" id="lessons-${subjectKey}">
                ${lessonsMarkup}
            </div>
        </div>
    `;
}

/**
 * 切換科目折疊狀態
 */
function toggleGaokaoSubject(subjectId) {
    const content = document.getElementById(`subject-${subjectId}`);
    const arrow = document.getElementById(`arrow-${subjectId}`);

    if (content && arrow) {
        content.classList.toggle('active');
        arrow.classList.toggle('rotated');
    }
}

/**
 * 更新單一科目進度
 */
function updateGaokaoSubjectProgress(subjectKey) {
    const data = gaokaoSubjectData[subjectKey];
    const container = document.getElementById(`lessons-${subjectKey}`);

    if (!container || !data) return;

    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const total = data.totalLessons;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

    // 更新進度顯示
    const progressText = document.getElementById(`progress-text-${subjectKey}`);
    const percentText = document.getElementById(`percent-${subjectKey}`);
    const badge = document.getElementById(`badge-${subjectKey}`);

    if (progressText) {
        progressText.textContent = `${checked}/${total}堂`;
    }

    if (percentText) {
        percentText.textContent = `${percentage}%`;
    }

    // 根據完成率改變徽章顏色
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

    // 保存進度並更新總體統計
    saveGaokaoStates();
    updateGaokaoOverallStats();
}

/**
 * 保存所有科目進度到localStorage
 */
function saveGaokaoStates() {
    const states = {};
    Object.keys(gaokaoSubjectData).forEach(subjectKey => {
        const container = document.getElementById(`lessons-${subjectKey}`);
        if (container) {
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                states[checkbox.id] = checkbox.checked;
            });
        }
    });
    localStorage.setItem(GAOKAO_STORAGE_KEY, JSON.stringify(states));
}

/**
 * 載入所有科目進度
 */
function loadGaokaoStates() {
    const savedStates = localStorage.getItem(GAOKAO_STORAGE_KEY);
    if (!savedStates) return;

    try {
        const parsed = JSON.parse(savedStates);
        Object.entries(parsed).forEach(([id, checked]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = Boolean(checked);
            }
        });
    } catch (error) {
        console.error('無法讀取高考課程進度資料：', error);
    }
}

/**
 * 更新總體統計
 */
function updateGaokaoOverallStats() {
    let totalLessons = 0;
    let totalCompleted = 0;

    Object.keys(gaokaoSubjectData).forEach(subjectKey => {
        const data = gaokaoSubjectData[subjectKey];
        const container = document.getElementById(`lessons-${subjectKey}`);

        if (container) {
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            const checked = Array.from(checkboxes).filter(cb => cb.checked).length;

            totalLessons += data.totalLessons;
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

// ========== 月度進度管理 ==========

/**
 * 切換月份顯示
 */
function switchMonth(month) {
    // 隱藏所有月份卡片
    const allMonthCards = document.querySelectorAll('.month-card');
    allMonthCards.forEach(card => {
        card.classList.remove('active');
    });

    // 顯示選中的月份卡片
    const selectedCard = document.querySelector(`.month-card[data-month="${month}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }

    // 更新按鈕狀態
    const allButtons = document.querySelectorAll('.month-tab-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // 找到對應的按鈕並設為active
    const buttons = document.querySelectorAll('.month-tab-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(month)) {
            btn.classList.add('active');
        }
    });
}

/**
 * 切換戰略時間軸階段顯示
 */
function switchPhase(phase) {
    // 隱藏所有階段
    const allPhases = document.querySelectorAll('.timeline-phase');
    allPhases.forEach(phaseEl => {
        phaseEl.classList.remove('active');
    });

    // 顯示選中的階段
    const selectedPhase = document.querySelector(`.timeline-phase[data-phase="${phase}"]`);
    if (selectedPhase) {
        selectedPhase.classList.add('active');
    }

    // 更新按鈕狀態
    const allButtons = document.querySelectorAll('.month-tab-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // 找到對應的按鈕並設為active
    const buttons = document.querySelectorAll('.month-tab-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(phase)) {
            btn.classList.add('active');
        }
    });
}

/**
 * 更新月度進度
 */
function updateMonthProgress(month) {
    const monthCard = document.querySelector(`.month-card[data-month="${month}"]`);
    if (!monthCard) return;

    const checkboxes = monthCard.querySelectorAll('input[type="checkbox"]');
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

    // 保存月份進度
    saveMonthStates();
}

/**
 * 保存所有月份進度到localStorage
 */
function saveMonthStates() {
    const states = {};
    const months = ['nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun'];

    months.forEach(month => {
        const monthCard = document.querySelector(`.month-card[data-month="${month}"]`);
        if (monthCard) {
            const checkboxes = monthCard.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox.id) {
                    states[checkbox.id] = checkbox.checked;
                }
            });
        }
    });

    localStorage.setItem(MONTH_STORAGE_KEY, JSON.stringify(states));
}

/**
 * 載入所有月份進度
 */
function loadMonthStates() {
    const savedStates = localStorage.getItem(MONTH_STORAGE_KEY);
    if (!savedStates) return;

    try {
        const parsed = JSON.parse(savedStates);
        Object.entries(parsed).forEach(([id, checked]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = Boolean(checked);
            }
        });
    } catch (error) {
        console.error('無法讀取月度進度資料：', error);
    }
}

/**
 * 初始化所有月份進度顯示
 */
function initMonthProgress() {
    const months = ['nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun'];
    months.forEach(month => {
        updateMonthProgress(month);
    });
}

// ========== 區塊折疊管理 ==========

/**
 * 切換區塊顯示
 */
function toggleSection(section) {
    const content = document.getElementById(`content-${section}`);
    const toggle = document.getElementById(`toggle-${section}`);

    if (content && toggle) {
        content.classList.toggle('show');
        toggle.classList.toggle('expanded');
    }
}

// ========== 自動選擇當前月份與階段 ==========

/**
 * 根據當前日期自動選擇月份和階段
 */
function autoSelectCurrentMonthAndPhase() {
    const now = new Date();
    const month = now.getMonth() + 1; // 0-11 -> 1-12

    let monthKey = '';
    let phaseKey = '';


    switch (month) {
        case 11:
            monthKey = 'nov';
            phaseKey = 'phase1';
            break;
        case 12:
            monthKey = 'dec';
            phaseKey = 'phase1';
            break;
        case 1:
            monthKey = 'jan';
            phaseKey = 'phase1';
            break;
        case 2:
            monthKey = 'feb';
            phaseKey = 'phase1';
            break;
        case 3:
            monthKey = 'mar';
            phaseKey = 'phase2';
            break;
        case 4:
            monthKey = 'apr';
            phaseKey = 'phase2';
            break;
        case 5:
            monthKey = 'may';
            phaseKey = 'phase3';
            break;
        case 6:
            monthKey = 'jun';
            phaseKey = 'phase3';
            break;
    }

    // 如果有對應的月份，則切換
    if (monthKey) {
        // 檢查該月份的按鈕是否存在，避免報錯
        const btn = document.querySelector(`.month-tab-btn[onclick*="${monthKey}"]`);
        if (btn) {
            switchMonth(monthKey);
        }
    }

    // 如果有對應的階段，則切換
    if (phaseKey) {
        // 檢查該階段的按鈕是否存在
        const btn = document.querySelector(`.month-tab-btn[onclick*="${phaseKey}"]`);
        if (btn) {
            switchPhase(phaseKey);
        }
    }
}

// ========== 初始化 ==========

/**
 * 初始化儀表板
 */
function initGaokao115Dashboard() {
    // 檢查是否存在科目監控容器（只在科目監控頁面初始化）
    const hasSubjectMonitor = document.getElementById('gaokao-subject-mis') !== null;

    if (hasSubjectMonitor) {
        // 創建所有科目卡片
        Object.keys(gaokaoSubjectData).forEach(createGaokaoSubjectCard);

        // 載入保存的狀態
        loadGaokaoStates();

        // 更新所有進度顯示
        Object.keys(gaokaoSubjectData).forEach(updateGaokaoSubjectProgress);
    }

    // 檢查是否存在月份進度（只在主頁面初始化）
    const hasMonthProgress = document.querySelector('.month-card') !== null;

    if (hasMonthProgress) {
        // 載入月份狀態
        loadMonthStates();

        // 初始化月份進度
        initMonthProgress();
    }
}

// ========== 時間顯示功能 ==========

/**
 * 更新當前時間和日期顯示
 */
function updateTimeDisplay() {
    const now = new Date();

    // 更新時間
    const currentTimeEl = document.getElementById('currentTime');
    if (currentTimeEl) {
        currentTimeEl.textContent = now.toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 更新日期顯示
    const weekdayElement = document.getElementById('currentWeekday');
    const dateNumberElement = document.getElementById('currentDateNumber');
    const monthYearElement = document.getElementById('currentMonthYear');

    if (weekdayElement && dateNumberElement && monthYearElement) {
        weekdayElement.textContent = now.toLocaleDateString('zh-TW', { weekday: 'long' });
        dateNumberElement.textContent = now.getDate();
        monthYearElement.textContent = now.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long'
        });
    }
}

/**
 * 初始化時間顯示（每秒更新一次）
 */
function initTimeDisplay() {
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 1000); // 每秒更新
}

// ========== 返回頂部按鈕 ==========

/**
 * 初始化返回頂部按鈕
 */
function initBackToTop() {
    const btn = document.getElementById("backToTopBtn");

    if (!btn) return;

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
}

// DOM載入完成後初始化
document.addEventListener('DOMContentLoaded', function () {
    initGaokao115Dashboard();

    // 自動選擇當前月份和階段
    autoSelectCurrentMonthAndPhase();

    // 只有在存在時間顯示元素時才初始化時間顯示
    if (document.getElementById('currentTime')) {
        initTimeDisplay();
    }

    initBackToTop();
});
