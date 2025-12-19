// 高考考古題記錄邏輯
const STORAGE_KEY = 'gaokao115ExamRecords';
let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentPage = 1;
const recordsPerPage = 10;

// 初始化
function init() {
    displayRecords();
    updateFilters();
    updateSubjectStats();
    updateDataLists();
    updateDashboardStats();

    // 監聽類型選擇變化
    document.getElementById('inputType').addEventListener('change', updateSubjectListByType);
}

// 新增記錄
function addRecord() {
    const year = document.getElementById('inputYear').value.trim();
    const exam = document.getElementById('inputExam').value.trim();
    const type = document.getElementById('inputType').value;
    const subject = document.getElementById('inputSubject').value.trim();
    const score = document.getElementById('inputScore').value.trim();
    const time = document.getElementById('inputTime').value.trim();
    const note = document.getElementById('inputNote').value.trim();

    if (!year || !exam || !type || !subject) {
        alert('請填寫基本欄位（年度、考別、類型、科目）！');
        return;
    }

    const newRecord = {
        id: Date.now(),
        year: year,
        exam: exam,
        type: type,
        subject: subject,
        score: score ? parseInt(score) : null,
        time: time ? parseInt(time) : null,
        note: note,
        timestamp: new Date().toLocaleString('zh-TW')
    };

    records.push(newRecord);
    saveRecords();

    // 清空輸入
    document.getElementById('inputYear').value = '';
    document.getElementById('inputExam').value = '';
    document.getElementById('inputType').value = '';
    document.getElementById('inputSubject').value = '';
    document.getElementById('inputScore').value = '';
    document.getElementById('inputTime').value = '';
    document.getElementById('inputNote').value = '';

    currentPage = 1;
    refreshUI();
    alert('新增成功！');
}

// 刪除記錄
function deleteRecord(id) {
    if (confirm('確定要刪除此記錄嗎？')) {
        records = records.filter(record => record.id !== id);
        saveRecords();
        refreshUI();
    }
}

// 清除所有記錄
function clearAllRecords() {
    if (confirm('確定要清除所有記錄嗎？此操作無法復原！')) {
        const userInput = prompt('請輸入 "delete" 以確認刪除所有記錄：');
        if (userInput === 'delete') {
            records = [];
            currentPage = 1;
            saveRecords();
            refreshUI();
            alert('所有記錄已清除！');
        }
    }
}

// 儲存資料
function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// 刷新介面
function refreshUI() {
    displayRecords();
    updateFilters();
    updateSubjectStats();
    updateDataLists();
    updateDashboardStats();
}

// 更新儀表板統計 (僅顯示總量)
function updateDashboardStats() {
    const totalPapersEl = document.getElementById('totalPapers');
    const totalSubjectsEl = document.getElementById('totalSubjects');

    if (!totalPapersEl) return;

    const total = records.length;
    const uniqueSubjects = new Set(records.map(r => r.subject)).size;

    totalPapersEl.textContent = total;
    if (totalSubjectsEl) totalSubjectsEl.textContent = uniqueSubjects;
}

// 顯示記錄列表
function displayRecords() {
    const container = document.getElementById('recordsContainer');
    const filteredRecords = getFilteredRecords();

    if (filteredRecords.length === 0) {
        container.innerHTML = '<div class="no-records">尚無記錄</div>';
        return;
    }

    const sortedRecords = filteredRecords.sort((a, b) => b.id - a.id);
    const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const pageRecords = sortedRecords.slice(startIndex, startIndex + recordsPerPage);

    let html = `
        <table class="record-table">
            <thead>
                <tr>
                    <th>年度/考別</th>
                    <th>科目</th>
                    <th>分數</th>
                    <th>費時</th>
                    <th>備註</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
    `;

    pageRecords.forEach(record => {
        // 分數樣式
        let scoreClass = 'score-low';
        if (record.score >= 80) scoreClass = 'score-high';
        else if (record.score >= 60) scoreClass = 'score-medium';

        const scoreDisplay = record.score !== null
            ? `<span class="score-badge ${scoreClass}">${record.score}</span>`
            : '<span style="color:#999">-</span>';

        html += `
            <tr>
                <td>${record.year} ${record.exam}</td>
                <td>${record.subject}</td>
                <td>${scoreDisplay}</td>
                <td>${record.time ? record.time + '分' : '-'}</td>
                <td>${record.note ? `<span class="record-note">${record.note}</span>` : ''}</td>
                <td>
                    <button class="btn btn-delete" onclick="deleteRecord(${record.id})">刪除</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    if (totalPages > 1) html += createPagination(totalPages, filteredRecords.length);
    container.innerHTML = html;
}

// 更新科目統計 (詳細版)
function updateSubjectStats() {
    const container = document.getElementById('subjectStatsContainer');
    const subjectGroups = {};

    // 分組
    records.forEach(r => {
        if (!subjectGroups[r.subject]) {
            subjectGroups[r.subject] = {
                scores: [],
                times: [],
                count: 0
            };
        }
        if (r.score !== null && !isNaN(r.score)) {
            subjectGroups[r.subject].scores.push(r.score);
        }
        if (r.time !== null && !isNaN(r.time)) {
            subjectGroups[r.subject].times.push(r.time);
        }
        subjectGroups[r.subject].count++;
    });

    if (Object.keys(subjectGroups).length === 0) {
        container.innerHTML = '<div class="no-subject-stats">尚無統計資料</div>';
        return;
    }

    let html = '<div class="subject-stats-grid">';

    Object.entries(subjectGroups).sort().forEach(([subject, data]) => {
        const scores = data.scores;
        const times = data.times;
        const hasScores = scores.length > 0;
        const hasTimes = times.length > 0;

        // 計算統計數據
        const avg = hasScores ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : '-';
        const max = hasScores ? Math.max(...scores) : '-';
        const passed = scores.filter(s => s >= 60).length;
        const passRate = hasScores ? Math.round((passed / scores.length) * 100) : '-';
        const avgTime = hasTimes ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : '-';

        // 顏色判斷
        let avgClass = '';
        if (avg !== '-') {
            if (avg >= 80) avgClass = 'stat-good';
            else if (avg < 60) avgClass = 'stat-bad';
        }

        html += `
            <div class="subject-stat-card">
                <div class="subject-stat-header">
                    <h3>${subject}</h3>
                    <span class="subject-total-count">共 ${data.count} 份</span>
                </div>
                <div class="subject-stat-body">
                    <div class="stat-row">
                        <span class="stat-label">平均分</span>
                        <span class="stat-value ${avgClass}">${avg}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">最高分</span>
                        <span class="stat-value">${max}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">及格率</span>
                        <span class="stat-value">${passRate !== '-' ? passRate + '%' : '-'}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">平均費時</span>
                        <span class="stat-value">${avgTime !== '-' ? avgTime + '分' : '-'}</span>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// 取得篩選後的記錄
function getFilteredRecords() {
    const yearFilter = document.getElementById('filterYear').value;
    const examFilter = document.getElementById('filterExam').value;
    const subjectFilter = document.getElementById('filterSubject').value;

    return records.filter(record => {
        if (yearFilter && record.year !== yearFilter) return false;
        if (examFilter && record.exam !== examFilter) return false;
        if (subjectFilter && record.subject !== subjectFilter) return false;
        return true;
    });
}

// 篩選記錄
function filterRecords() {
    currentPage = 1;
    displayRecords();
}

// 更新篩選器與 DataList
function updateFilters() {
    const years = [...new Set(records.map(r => r.year))].sort((a, b) => b - a);
    const exams = [...new Set(records.map(r => r.exam))].sort();
    const subjects = [...new Set(records.map(r => r.subject))].sort();

    updateSelect('filterYear', years, '全部年度');
    updateSelect('filterExam', exams, '全部考別');
    updateSelect('filterSubject', subjects, '全部科目');
}

function updateDataLists() {
    const years = [...new Set(records.map(r => r.year))].sort((a, b) => b - a);
    const exams = [...new Set(records.map(r => r.exam))].sort();
    const subjects = [...new Set(records.map(r => r.subject))].sort();

    updateDatalist('yearList', years);
    updateDatalist('examList', exams);
    updateDatalist('subjectList', subjects);
}

function updateSelect(id, items, defaultText) {
    const select = document.getElementById(id);
    const current = select.value;
    select.innerHTML = `<option value="">${defaultText}</option>` +
        items.map(item => `<option value="${item}">${item}</option>`).join('');
    select.value = current;
}

function updateDatalist(id, items) {
    const datalist = document.getElementById(id);
    datalist.innerHTML = items.map(item => `<option value="${item}">`).join('');
}

// 根據類型更新科目列表
function updateSubjectListByType() {
    const type = document.getElementById('inputType').value;
    const subjectList = document.getElementById('subjectList');

    let subjects = [];
    if (type) {
        subjects = [...new Set(records.filter(r => r.type === type).map(r => r.subject))].sort();
    } else {
        subjects = [...new Set(records.map(r => r.subject))].sort();
    }
    updateDatalist('subjectList', subjects);
}

// 分頁相關函數
function createPagination(totalPages, totalRecords) {
    let html = '<div class="pagination">';
    html += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>上一頁</button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span>...</span>';
        }
    }

    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>下一頁</button>`;
    html += `</div>`;
    return html;
}

function changePage(page) {
    const totalPages = Math.ceil(getFilteredRecords().length / recordsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayRecords();
    }
}

function toggleDeleteButton() {
    const checkbox = document.getElementById('confirmDelete');
    const btn = document.getElementById('deleteButton');
    btn.disabled = !checkbox.checked;
    if (checkbox.checked) setTimeout(() => { checkbox.checked = false; btn.disabled = true; }, 30000);
}

window.onload = init;
