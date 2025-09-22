// time-display.js - 可重複使用的時間顯示模組

class TimeDisplay {
    constructor(options = {}) {
        this.containerId = options.containerId || 'timeDisplayContainer';
        this.showDate = options.showDate !== false;
        this.showTime = options.showTime !== false;
        this.updateInterval = options.updateInterval || 60000; // 預設每分鐘更新
        this.style = options.style || 'default'; // default, compact, minimal
    }

    // 初始化時間顯示
    init() {
        this.createTimeDisplay();
        this.updateTime();
        setInterval(() => this.updateTime(), this.updateInterval);
    }

    // 建立時間顯示的 HTML 結構
    createTimeDisplay() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        let html = '';

        if (this.style === 'default') {
            html = `
                <div class="time-display-widget">
                    <div class="time-info">
                        <div class="date-display">
                            <span class="weekday" id="td-weekday"></span>
                            <span class="date-number" id="td-dateNumber"></span>
                            <span class="month-year" id="td-monthYear"></span>
                        </div>
                        <span class="current-time" id="td-time"></span>
                    </div>
                </div>
            `;
        } else if (this.style === 'compact') {
            html = `
                <div class="time-display-compact">
                    <span class="time-part" id="td-time"></span>
                    <span class="date-part" id="td-date"></span>
                </div>
            `;
        } else if (this.style === 'minimal') {
            html = `
                <div class="time-display-minimal">
                    <span id="td-datetime"></span>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // 更新時間
    updateTime() {
        const now = new Date();

        if (this.style === 'default') {
            const weekday = document.getElementById('td-weekday');
            const dateNumber = document.getElementById('td-dateNumber');
            const monthYear = document.getElementById('td-monthYear');
            const time = document.getElementById('td-time');

            if (weekday) weekday.textContent = now.toLocaleDateString('zh-TW', { weekday: 'long' });
            if (dateNumber) dateNumber.textContent = now.getDate();
            if (monthYear) monthYear.textContent = now.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
            if (time) time.textContent = now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
        } else if (this.style === 'compact') {
            const time = document.getElementById('td-time');
            const date = document.getElementById('td-date');

            if (time) time.textContent = now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
            if (date) date.textContent = now.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' });
        } else if (this.style === 'minimal') {
            const datetime = document.getElementById('td-datetime');
            if (datetime) {
                datetime.textContent = `${now.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })} ${now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}`;
            }
        }
    }
}

// 快速初始化函數
function initTimeDisplay(options = {}) {
    const timeDisplay = new TimeDisplay(options);
    timeDisplay.init();
    return timeDisplay;
}