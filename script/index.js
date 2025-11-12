(function () {
    const TIMEZONE = 'Asia/Taipei';
    const COUNTDOWN_CLASS_PREFIX = 'countdown--';

    const stateClasses = [
        `${COUNTDOWN_CLASS_PREFIX}urgent`,
        `${COUNTDOWN_CLASS_PREFIX}near`,
        `${COUNTDOWN_CLASS_PREFIX}far`,
        `${COUNTDOWN_CLASS_PREFIX}today`,
        `${COUNTDOWN_CLASS_PREFIX}finished`
    ];

    function parseDate(value) {
        if (!value) return null;
        // 允許 2026-07-04 或 2026/07/04，統一成 +08:00 的當地午夜
        const m = value.match(/^(\d{4})[\/-](\d{2})[\/-](\d{2})$/);
        if (!m) return null;
        const [_, y, mo, d] = m;
        return new Date(`${y}-${mo}-${d}T00:00:00+08:00`); // 台北時區
    }

    function setCountdownState(element, state) {
        element.classList.remove(...stateClasses);
        if (state) {
            element.classList.add(state);
        }
    }

    function updateCountdowns() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        document.querySelectorAll('[data-countdown-date]').forEach(element => {
            const targetDate = parseDate(element.dataset.countdownDate);

            if (!targetDate) {
                element.textContent = '-';
                setCountdownState(element, null);
                return;
            }

            const timeDiff = targetDate.getTime() - today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const weeksDiff = Math.ceil(daysDiff / 7);

            if (daysDiff > 0) {
                element.textContent = `${daysDiff} 天（約 ${weeksDiff} 週）`;
                if (daysDiff <= 30) setCountdownState(element, 'countdown--urgent');
                else if (daysDiff <= 90) setCountdownState(element, 'countdown--near');
                else setCountdownState(element, 'countdown--far');
            } else if (daysDiff === 0) {
                element.textContent = '今天！';
                setCountdownState(element, 'countdown--today');
            } else {
                element.textContent = '已結束';
                setCountdownState(element, 'countdown--finished');
            }
        });
    }

    // 把每一列的「考試日期」同步到同列 countdown 的 data-countdown-date（取區間起始日）
    function syncExamStartToCountdown() {
        document.querySelectorAll('tr').forEach(tr => {
            const dateCells = tr.querySelectorAll('.date-cell');
            const examCell = dateCells[1];            // 依你定義：第 1 個=報名、第 2 個=考試、第 3 個=放榜
            const countdownEl = tr.querySelector('.countdown');
            if (!examCell || !countdownEl) return;

            // 取純文字並清除括號備註與多餘空白/換行
            const raw = examCell.textContent || '';
            const cleaned = raw
                .replace(/\(.*?\)/g, '')   // 去掉括號備註
                .replace(/\s+/g, ' ')      // 正規化空白
                .trim();

            // 只擷取第一個日期（允許 yyyy/m/d 或 yyyy-mm-dd）
            const m = cleaned.match(/(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})/);
            if (!m) {
                // 沒有考試日期，清空 countdown
                countdownEl.removeAttribute('data-countdown-date');
                countdownEl.textContent = '-';
                return;
            }

            let [, y, mo, d] = m;
            mo = mo.padStart(2, '0');
            d = d.padStart(2, '0');

            // 設為 ISO（你後面的 parseDate 支援這格式最穩）
            countdownEl.setAttribute('data-countdown-date', `${y}-${mo}-${d}`);
        });
    }


    function updateCurrentTime(target) {
        if (!target) return;

        const now = new Date();
        const formatted = now.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: TIMEZONE
        });
        target.textContent = formatted;
    }

    function attachRefreshHandler(button, callbacks) {
        if (!button) return;

        const { refreshCountdowns, refreshTime } = callbacks;

        button.addEventListener('click', () => {
            refreshCountdowns();
            refreshTime();

            button.style.transform = 'scale(0.95)';
            const originalText = button.textContent;
            button.textContent = '✅ 已更新！';

            setTimeout(() => {
                button.style.transform = 'scale(1)';
                button.textContent = originalText;
            }, 1000);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const currentTimeElement = document.getElementById('current-time');
        const refreshButton = document.querySelector('[data-action="refresh-countdown"]');

        const refreshCountdowns = () => {
            syncExamStartToCountdown();  // 先同步
            updateCountdowns();          // 再重算倒數
        };
        const refreshTime = () => updateCurrentTime(currentTimeElement);

        refreshCountdowns();
        refreshTime();

        attachRefreshHandler(refreshButton, { refreshCountdowns, refreshTime });

        setInterval(refreshCountdowns, 60000);
        setInterval(refreshTime, 60000);
    });
})();
