const subjectData = {
    chinese: {
        name: '國文作文 + 測驗',
        icon: '📚',
        normalLessons: 5,
        reviewLessons: 4,
        idPrefix: 'chinese'
    },
    law: {
        name: '法學緒論',
        icon: '⚖️',
        normalLessons: 10,
        reviewLessons: 0,
        idPrefix: 'law'
    },
    constitution: {
        name: '憲法',
        icon: '🏛️',
        normalLessons: 9,
        reviewLessons: 0,
        idPrefix: 'constitution'
    },
    english: {
        name: '英文',
        icon: '🔤',
        normalLessons: 7,
        reviewLessons: 0,
        idPrefix: 'english'
    },
    computer: {
        name: '計算機概要',
        icon: '🖥️',
        normalLessons: 12,
        reviewLessons: 2,
        idPrefix: 'computer'
    },
    programming: {
        name: '程式設計概要',
        icon: '💻',
        normalLessons: 14,
        reviewLessons: 0,
        idPrefix: 'programming'
    },
    network: {
        name: '資通網路',
        icon: '🌐',
        normalLessons: 15,
        reviewLessons: 0,
        idPrefix: 'network'
    },
    'information-management': {
        name: '資訊管理 (資料處理)',
        icon: '📊',
        normalLessons: 17,
        reviewLessons: 3,
        idPrefix: 'information-management'
    },
    'information-security': {
        name: '資訊管理 (資通安全)',
        icon: '📊',
        normalLessons: 14,
        reviewLessons: 0,
        idPrefix: 'information-security'
    }
};

const subjectCategories = {
    common: ['chinese', 'law', 'constitution', 'english'],
    professional: ['programming', 'network', 'computer', 'information-management', 'information-security']
};

const STORAGE_KEY = 'lessonProgress';

function toggleCollapse(button) {
    const content = button.nextElementSibling;
    const arrow = button.querySelector('.collapse-arrow');

    if (content) {
        content.classList.toggle('active');
    }
    if (arrow) {
        arrow.classList.toggle('rotated');
    }
}

function createSubjectCard(subjectKey) {
    const data = subjectData[subjectKey];
    const container = document.getElementById(`${subjectKey}-subject-card`);

    if (!data || !container) return;

    const totalLessons = data.normalLessons + data.reviewLessons;

    const normalLessonsMarkup = Array.from({ length: data.normalLessons }, (_, index) => {
        const number = index + 1;
        const id = `${data.idPrefix}-${number}`;
        return `
            <div class="lesson-item">
                <input type="checkbox" id="${id}">
                <label for="${id}">第${number}堂</label>
            </div>
        `;
    }).join('');

    let reviewLessonsMarkup = '';
    if (data.reviewLessons > 0) {
        const reviewItems = Array.from({ length: data.reviewLessons }, (_, index) => {
            const number = index + 1;
            const id = `${data.idPrefix}-review-${number}`;
            return `
                <div class="lesson-item">
                    <input type="checkbox" id="${id}">
                    <label for="${id}">考衝班${number}</label>
                </div>
            `;
        }).join('');

        reviewLessonsMarkup = `
            <div class="review-section">
                <div class="review-title">📝 考衝班</div>
                <div class="lesson-grid">
                    ${reviewItems}
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <button class="collapse-btn">
            <span>${data.icon} ${data.name}</span>
            <div class="progress-info">
                <span class="progress-text">0/${totalLessons}堂 (0%)</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span class="collapse-arrow">▼</span>
            </div>
        </button>
        <div class="collapse-content">
            <div class="lesson-grid">
                ${normalLessonsMarkup}
            </div>
            ${reviewLessonsMarkup}
        </div>
    `;

    const collapseButton = container.querySelector('.collapse-btn');
    if (collapseButton) {
        collapseButton.addEventListener('click', () => toggleCollapse(collapseButton));
    }

    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
    });
}

function saveStates() {
    const states = {};
    document.querySelectorAll('.subject-card input[type="checkbox"]').forEach(checkbox => {
        states[checkbox.id] = checkbox.checked;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
}

function loadSavedStates() {
    const savedStates = localStorage.getItem(STORAGE_KEY);
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
        console.error('無法讀取課程進度資料：', error);
    }
}

function updateProgress() {
    const subjectStats = {};

    Object.keys(subjectData).forEach(subjectKey => {
        subjectStats[subjectKey] = updateSubjectProgress(subjectKey);
    });

    updateOverallStats(subjectStats);
    saveStates();
}

function updateSubjectProgress(subjectKey) {
    const card = document.getElementById(`${subjectKey}-subject-card`);
    if (!card) {
        return { completed: 0, total: 0 };
    }

    const checkboxes = card.querySelectorAll('input[type="checkbox"]');
    const checked = card.querySelectorAll('input[type="checkbox"]:checked');

    const total = checkboxes.length;
    const completed = checked.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const progressText = card.querySelector('.progress-text');
    const progressFill = card.querySelector('.progress-fill');

    if (progressText) {
        progressText.textContent = `${completed}/${total}堂 (${percentage}%)`;
    }
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }

    return { completed, total };
}

function updateOverallStats(subjectStats) {
    const totals = {
        common: { completed: 0, total: 0 },
        professional: { completed: 0, total: 0 }
    };

    subjectCategories.common.forEach(subjectKey => {
        const stats = subjectStats[subjectKey];
        if (!stats) return;
        totals.common.completed += stats.completed;
        totals.common.total += stats.total;
    });

    subjectCategories.professional.forEach(subjectKey => {
        const stats = subjectStats[subjectKey];
        if (!stats) return;
        totals.professional.completed += stats.completed;
        totals.professional.total += stats.total;
    });

    const totalCompleted = totals.common.completed + totals.professional.completed;
    const totalLessons = totals.common.total + totals.professional.total;
    const completionRate = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

    const totalCompletedElement = document.getElementById('total-completed');
    const totalLessonsElement = document.getElementById('total-lessons');
    const completionRateElement = document.getElementById('completion-rate');

    if (totalCompletedElement) totalCompletedElement.textContent = totalCompleted;
    if (totalLessonsElement) totalLessonsElement.textContent = totalLessons;
    if (completionRateElement) completionRateElement.textContent = `${completionRate}%`;

    renderProgressBadge('common-progress', totals.common.completed, totals.common.total);
    renderProgressBadge('professional-progress', totals.professional.completed, totals.professional.total);
}

function renderProgressBadge(elementId, completed, total) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    let rateClass = 'low';

    if (rate === 100) rateClass = 'complete';
    else if (rate >= 80) rateClass = 'high';
    else if (rate >= 50) rateClass = 'medium';

    element.innerHTML = `
        <span class="progress-badge" data-rate="${rateClass}">
            <span class="progress-value">${completed}/${total}</span>
            <span class="progress-percent">${rate}%</span>
        </span>
    `;
}

function initialiseDashboard() {
    Object.keys(subjectData).forEach(createSubjectCard);
    loadSavedStates();
    updateProgress();

    if (typeof initTimeDisplay === 'function') {
        initTimeDisplay({
            containerId: 'timeDisplayContainer',
            style: 'default'
        });
    }
}

document.addEventListener('DOMContentLoaded', initialiseDashboard);
