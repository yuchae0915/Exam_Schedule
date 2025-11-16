// 高考115專業科目數據配置
const gaokaoSubjectData = {
    mis: {
        name: '資訊管理 (MIS)',
        icon: '📚',
        totalLessons: 17,
        idPrefix: 'mis'
    },
    db: {
        name: '資料庫 (DB)',
        icon: '💾',
        totalLessons: 16,
        idPrefix: 'db'
    },
    ds: {
        name: '資料結構 (DS)',
        icon: '📊',
        totalLessons: 25,
        idPrefix: 'ds'
    },
    netsec: {
        name: '網路+安全 (Net+Sec)',
        icon: '🌐🔒',
        totalLessons: 29,
        idPrefix: 'netsec'
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

// ========== 月度卡片生成 ==========

/**
 * 生成任务卡片 HTML
 */
function generateTaskCard(task) {
    const detailHtml = task.detail ? `<br><small>${task.detail}</small>` : '';
    return `
        <div class="task-card ${task.status}">
            <div class="task-icon">${task.icon}</div>
            <div class="task-text">${task.text}${detailHtml}</div>
        </div>
    `;
}

/**
 * 生成里程碑项 HTML
 */
function generateMilestoneItem(milestone) {
    const marker = milestone.status === 'completed' ? '✓' : '○';
    const statusClass = milestone.status === 'completed' ? 'completed' : '';
    return `
        <div class="milestone-item ${statusClass}">
            <span class="milestone-marker">${marker}</span>
            <span>${milestone.text}</span>
        </div>
    `;
}

/**
 * 计算月份完成进度
 */
function calculateMonthProgress(data) {
    let totalItems = 0;
    let completedItems = 0;

    // 计算任务完成数
    if (data.tasks) {
        totalItems += data.tasks.length;
        completedItems += data.tasks.filter(t => t.status === 'completed').length;
    }

    // 处理6月份的特殊结构
    if (data.phases) {
        data.phases.forEach(phase => {
            if (phase.tasks) {
                totalItems += phase.tasks.length;
                completedItems += phase.tasks.filter(t => t.status === 'completed').length;
            }
        });
    }

    // 计算里程碑完成数
    if (data.milestones) {
        totalItems += data.milestones.length;
        completedItems += data.milestones.filter(m => m.status === 'completed').length;
    }

    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
        completed: completedItems,
        total: totalItems,
        percentage: percentage
    };
}

/**
 * 生成进度条 HTML
 */
function generateProgressBar(monthKey, progress) {
    const progressClass =
        progress.percentage === 100 ? 'progress-complete' :
        progress.percentage >= 70 ? 'progress-high' :
        progress.percentage >= 40 ? 'progress-medium' : 'progress-low';

    return `
        <div class="month-progress-container">
            <div class="progress-stats">
                <span class="progress-label">月度完成度</span>
                <span class="progress-value">${progress.completed}/${progress.total}</span>
                <span class="progress-percent">${progress.percentage}%</span>
            </div>
            <div class="progress-bar-wrapper">
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill ${progressClass}" style="width: ${progress.percentage}%"></div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 生成单个月份卡片
 */
function generateMonthCard(monthKey, data) {
    const progress = calculateMonthProgress(data);
    const progressBarHtml = generateProgressBar(monthKey, progress);

    // 6月份有特殊的两阶段结构
    if (monthKey === 'jun') {
        const phasesHtml = data.phases.map(phase => `
            <div class="task-category">
                <div class="category-header">
                    <span class="category-icon">${phase.icon}</span>
                    <span>${phase.title}</span>
                </div>
                <div class="task-grid">
                    ${phase.tasks.map(generateTaskCard).join('')}
                </div>
            </div>
        `).join('');

        return `
            <div class="tips-section month-card" data-month="${monthKey}">
                <h3 style="margin-top: 0;">
                    <span class="month-icon">${data.icon}</span>
                    <span>${data.title}</span>
                    <span class="month-date">${data.date}</span>
                </h3>
                ${progressBarHtml}
                <div class="tips-content">
                    <div class="tip-item">
                        ${phasesHtml}
                        <div class="task-category">
                            <div class="category-header">
                                <span class="category-icon">✅</span>
                                <span>完成標準</span>
                            </div>
                            <div class="milestone-list">
                                ${data.milestones.map(generateMilestoneItem).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 其他月份的标准结构
    return `
        <div class="tips-section month-card" data-month="${monthKey}">
            <h3 style="margin-top: 0;">
                <span class="month-icon">${data.icon}</span>
                <span>${data.title}</span>
                <span class="month-date">${data.date}</span>
            </h3>
            ${progressBarHtml}
            <div class="tips-content">
                <div class="tip-item">
                    <div class="task-category">
                        <div class="category-header">
                            <span class="category-icon">🎯</span>
                            <span>主要任務</span>
                        </div>
                        <div class="task-grid">
                            ${data.tasks.map(generateTaskCard).join('')}
                        </div>
                    </div>

                    <div class="task-category">
                        <div class="category-header">
                            <span class="category-icon">✅</span>
                            <span>完成標準</span>
                        </div>
                        <div class="milestone-list">
                            ${data.milestones.map(generateMilestoneItem).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染所有月份卡片
 */
function renderMonthCards() {
    if (typeof monthsData === 'undefined' || typeof monthsOrder === 'undefined') {
        console.error('月份数据未加载');
        return;
    }

    const container = document.querySelector('.month-card-container');
    if (!container) return;

    // 生成所有月份卡片
    const cardsHtml = monthsOrder.map(monthKey =>
        generateMonthCard(monthKey, monthsData[monthKey])
    ).join('');

    container.innerHTML = cardsHtml;

    // 默认显示第一个月份
    const firstCard = container.querySelector('.month-card');
    if (firstCard) {
        firstCard.classList.add('active');
    }
}

/**
 * 渲染月份切换按钮
 */
function renderMonthButtons() {
    if (typeof monthsButtonLabels === 'undefined' || typeof monthsOrder === 'undefined') {
        console.error('月份按钮数据未加载');
        return;
    }

    const container = document.querySelector('.month-buttons-container');
    if (!container) return;

    const buttonsHtml = monthsOrder.map((monthKey, index) => {
        const activeClass = index === 0 ? 'active' : '';
        return `<button class="month-tab-btn ${activeClass}" data-month="${monthKey}">${monthsButtonLabels[monthKey]}</button>`;
    }).join('');

    container.innerHTML = buttonsHtml;

    // 使用事件委托处理按钮点击
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('month-tab-btn')) {
            const month = e.target.getAttribute('data-month');
            switchMonth(month);
        }
    });
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

    // 設置當前月份按鈕為active
    const currentButton = document.querySelector(`.month-tab-btn[data-month="${month}"]`);
    if (currentButton) {
        currentButton.classList.add('active');
    }
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

    // 檢查是否存在月份容器（只在主頁面初始化）
    const hasMonthContainer = document.querySelector('.month-card-container') !== null;
    const hasMonthButtonContainer = document.querySelector('.month-buttons-container') !== null;

    if (hasMonthContainer || hasMonthButtonContainer) {
        // 渲染月份按鈕
        if (hasMonthButtonContainer) {
            renderMonthButtons();
        }

        // 渲染月份卡片
        if (hasMonthContainer) {
            renderMonthCards();
        }

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

    // 只有在存在時間顯示元素時才初始化時間顯示
    if (document.getElementById('currentTime')) {
        initTimeDisplay();
    }

    initBackToTop();
});
