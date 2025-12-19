// 從 localStorage 載入資料
let records = JSON.parse(localStorage.getItem('examRecords')) || [];
let currentPage = 1;
const recordsPerPage = 10;

// 初始化
function init() {
    displayRecords();
    updateFilters();
    updateSubjectStats();
    updateDataLists();

    // 監聽類型選擇變化
    document.getElementById('inputType').addEventListener('change', updateSubjectListByType);
}

// 新增記錄（保持原有功能，只在最後加上重置頁碼）
function addRecord() {
    const year = document.getElementById('inputYear').value.trim();
    const exam = document.getElementById('inputExam').value.trim();
    const type = document.getElementById('inputType').value;
    const subject = document.getElementById('inputSubject').value.trim();

    if (!year || !exam || !type || !subject) {
        alert('請填寫所有欄位！');
        return;
    }

    const exists = records.some(record =>
        record.year === year &&
        record.exam === exam &&
        record.type === type &&
        record.subject === subject
    );

    if (exists) {
        alert('此記錄已存在！');
        return;
    }

    const newRecord = {
        id: Date.now(),
        year: year,
        exam: exam,
        type: type,
        subject: subject,
        timestamp: new Date().toLocaleString('zh-TW')
    };

    records.push(newRecord);
    saveRecords();

    document.getElementById('inputYear').value = '';
    document.getElementById('inputExam').value = '';
    document.getElementById('inputType').value = '';
    document.getElementById('inputSubject').value = '';

    currentPage = 1;
    displayRecords();
    updateFilters();
    updateSubjectStats();
    updateDataLists();

    alert('新增成功！');
}


// 刪除記錄（加上檢查當前頁面）
function deleteRecord(id) {
    if (confirm('確定要刪除此記錄嗎？')) {
        records = records.filter(record => record.id !== id);
        saveRecords();

        // 檢查當前頁是否還有記錄
        const filteredRecords = getFilteredRecords();
        const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }

        displayRecords();
        updateFilters();
        updateSubjectStats();
        updateDataLists();
    }
}

// 修改 clearAllRecords 函數
function clearAllRecords() {
    if (confirm('確定要清除所有記錄嗎？此操作無法復原！')) {
        const userInput = prompt('請輸入 "delete" 以確認刪除所有記錄：');

        if (userInput === 'delete') {
            records = [];
            currentPage = 1;  // 重置頁碼
            saveRecords();
            displayRecords();
            updateFilters();
            updateSubjectStats();
            updateDataLists();  // 如果有使用 datalist 功能
            alert('所有記錄已清除！');
        } else if (userInput !== null) {  // 使用者輸入了但不是 "delete"
            alert('輸入錯誤，取消刪除操作。');
        }
    }
}

// 儲存到 localStorage
function saveRecords() {
    localStorage.setItem('examRecords', JSON.stringify(records));
}

// 顯示記錄
function displayRecords() {
    const container = document.getElementById('recordsContainer');
    const filteredRecords = getFilteredRecords();

    if (filteredRecords.length === 0) {
        container.innerHTML = '<div class="no-records">尚無記錄</div>';
        return;
    }
    // 按照 id (timestamp) 降序排序，最新的在最前面
    const sortedRecords = filteredRecords.sort((a, b) => b.id - a.id);
    // 計算分頁
    const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const pageRecords = sortedRecords.slice(startIndex, endIndex);
    let html = `
        <table class="record-table">
            <thead>
                <tr>
                    <th>年度</th>
                    <th>考別</th>
                    <th>類型</th>
                    <th>科目</th>
                    <th>建立時間</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
    `;

    pageRecords.forEach(record => {
        html += `
            <tr>
                <td>${record.year}</td>
                <td>${record.exam}</td>
                <td>${record.type || '未分類'}</td>
                <td>${record.subject}</td>
                <td>${record.timestamp}</td>
                <td>
                    <button class="btn btn-delete" onclick="deleteRecord(${record.id})">刪除</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';

    // 加入分頁控制
    if (totalPages > 1) html += createPagination(totalPages, filteredRecords.length);

    container.innerHTML = html;
}

// 建立分頁控制項
function createPagination(totalPages, totalRecords) {
    let html = '<div class="pagination">';

    // 上一頁按鈕
    html += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>上一頁</button>`;

    // 頁碼按鈕
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    if (startPage > 1) {
        html += `<button class="page-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            html += `<span>...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span>...</span>`;
        }
        html += `<button class="page-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }

    // 下一頁按鈕
    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>下一頁</button>`;

    // 顯示記錄資訊
    const startRecord = (currentPage - 1) * recordsPerPage + 1;
    const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);
    html += `<span class="page-info">顯示 ${startRecord}-${endRecord} / 共 ${totalRecords} 筆</span>`;

    html += '</div>';
    return html;
}

// 切換頁面
function changePage(page) {
    const filteredRecords = getFilteredRecords();
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayRecords();
    }
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

// 更新篩選器選項
function updateFilters() {
    // 取得所有唯一值
    const years = [...new Set(records.map(r => r.year))].sort((a, b) => b - a);
    const exams = [...new Set(records.map(r => r.exam))].sort();
    const subjects = [...new Set(records.map(r => r.subject))].sort();

    // 更新年度選項
    const yearSelect = document.getElementById('filterYear');
    const currentYear = yearSelect.value;
    yearSelect.innerHTML = '<option value="">全部年度</option>';
    years.forEach(year => {
        yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
    });
    yearSelect.value = currentYear;

    // 更新考別選項
    const examSelect = document.getElementById('filterExam');
    const currentExam = examSelect.value;
    examSelect.innerHTML = '<option value="">全部考別</option>';
    exams.forEach(exam => {
        examSelect.innerHTML += `<option value="${exam}">${exam}</option>`;
    });
    examSelect.value = currentExam;

    // 更新科目選項
    const subjectSelect = document.getElementById('filterSubject');
    const currentSubject = subjectSelect.value;
    subjectSelect.innerHTML = '<option value="">全部科目</option>';
    subjects.forEach(subject => {
        subjectSelect.innerHTML += `<option value="${subject}">${subject}</option>`;
    });
    subjectSelect.value = currentSubject;
}

// 更新科目統計
function updateSubjectStats() {
    const container = document.getElementById('subjectStatsContainer');

    // 依類型分組統計
    const typeGroups = {
        '共同科目': {},
        '專業科目': {},
        '未分類': {}
    };

    records.forEach(record => {
        const type = record.type || '未分類';
        if (!typeGroups[type]) {
            typeGroups[type] = {};
        }
        if (!typeGroups[type][record.subject]) {
            typeGroups[type][record.subject] = [];
        }
        typeGroups[type][record.subject].push(record);
    });

    // 移除空的分類
    Object.keys(typeGroups).forEach(type => {
        if (Object.keys(typeGroups[type]).length === 0) {
            delete typeGroups[type];
        }
    });

    if (Object.keys(typeGroups).length === 0) {
        container.innerHTML = '<div class="no-subject-stats">尚無科目統計資料</div>';
        return;
    }

    let html = '';

    // 依序顯示共同科目、專業科目、未分類
    const typeOrder = ['共同科目', '專業科目', '未分類'];
    typeOrder.forEach(type => {
        if (!typeGroups[type]) return;

        const subjects = typeGroups[type];
        const totalCount = Object.values(subjects).reduce((sum, records) => sum + records.length, 0);

        let typeClass = '';
        if (type === '共同科目') typeClass = 'common';
        else if (type === '專業科目') typeClass = 'professional';

        html += `
            <div class="type-section">
                <div class="type-header ${typeClass}" onclick="toggleType('${type}')">
                    <span class="type-name">${type}</span>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span class="type-count">${Object.keys(subjects).length} 科目 / ${totalCount} 筆</span>
                        <span class="type-toggle" id="type-toggle-${type}">▼</span>
                    </div>
                </div>
                <div class="type-content" id="type-content-${type}">
                    <div class="type-subjects-grid">
        `;

        Object.entries(subjects)
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([subject, subjectRecords]) => {
                html += `
                    <div class="subject-card">
                        <div class="subject-header" onclick="toggleSubject('${type}-${subject}')">
                            <div class="subject-info">
                                <span class="subject-name">${subject}</span>
                                <span class="subject-count">${subjectRecords.length} 筆</span>
                            </div>
                            <span class="toggle-icon" id="toggle-${type}-${subject}">▼</span>
                        </div>
                        <div class="subject-content" id="content-${type}-${subject}">
                            <div class="subject-records">
                `;

                subjectRecords
                    .sort((a, b) => b.year.localeCompare(a.year))
                    .forEach(record => {
                        html += `
                            <div class="subject-record-item">
                                <span>${record.year}年 - ${record.exam}</span>
                                <button class="btn btn-delete" onclick="deleteRecord(${record.id})">刪除</button>
                            </div>
                        `;
                    });

                html += `
                            </div>
                        </div>
                    </div>
                `;
            });

        html += `
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// 修改 toggleSubject 函數以支援新的 ID 格式
function toggleSubject(subjectId) {
    const content = document.getElementById(`content-${subjectId}`);
    const icon = document.getElementById(`toggle-${subjectId}`);

    if (content && icon) {
        content.classList.toggle('show');
        icon.classList.toggle('expanded');
    }
}

// 新增 toggleType 函數
function toggleType(type) {
    const content = document.getElementById(`type-content-${type}`);
    const toggle = document.getElementById(`type-toggle-${type}`);

    content.classList.toggle('show');
    toggle.classList.toggle('expanded');
}

// 新增函數：更新 datalist 選項
function updateDataLists() {
    // 取得所有唯一值
    const years = [...new Set(records.map(r => r.year))].sort((a, b) => b - a);
    const exams = [...new Set(records.map(r => r.exam))].sort();
    const subjects = [...new Set(records.map(r => r.subject))].sort();

    // 更新年度 datalist
    const yearList = document.getElementById('yearList');
    yearList.innerHTML = '';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        yearList.appendChild(option);
    });

    // 更新考別 datalist
    const examList = document.getElementById('examList');
    examList.innerHTML = '';
    exams.forEach(exam => {
        const option = document.createElement('option');
        option.value = exam;
        examList.appendChild(option);
    });

    // 更新科目 datalist
    const subjectList = document.getElementById('subjectList');
    subjectList.innerHTML = '';
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        subjectList.appendChild(option);
    });
}

// 新增函數：根據類型篩選科目建議
function updateSubjectListByType() {
    const selectedType = document.getElementById('inputType').value;
    const subjectList = document.getElementById('subjectList');
    subjectList.innerHTML = '';

    if (selectedType) {
        // 只顯示該類型的科目
        const filteredSubjects = [...new Set(
            records
                .filter(r => r.type === selectedType)
                .map(r => r.subject)
        )].sort();

        filteredSubjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            subjectList.appendChild(option);
        });
    } else {
        // 顯示所有科目
        const subjects = [...new Set(records.map(r => r.subject))].sort();
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            subjectList.appendChild(option);
        });
    }
}

// 控制刪除按鈕的啟用/禁用
function toggleDeleteButton() {
    const checkbox = document.getElementById('confirmDelete');
    const deleteButton = document.getElementById('deleteButton');

    deleteButton.disabled = !checkbox.checked;

    // 3秒後自動取消勾選（額外的安全機制）
    if (checkbox.checked) {
        setTimeout(() => {
            checkbox.checked = false;
            deleteButton.disabled = true;
        }, 30000); // 30秒後自動取消
    }
}

// 頁面載入時初始化
window.onload = init;