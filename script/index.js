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
        const date = value ? new Date(value) : null;
        return Number.isNaN(date?.getTime()) ? null : date;
    }

    function setCountdownState(element, state) {
        element.classList.remove(...stateClasses);
        if (state) {
            element.classList.add(state);
        }
    }

    function formatCountdown(days, weeks) {
        return `${days} 天（約 ${weeks} 週）`;
    }

    function updateCountdowns(countdownItems) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        countdownItems.forEach(({ element, targetDate }) => {
            if (!targetDate) {
                element.textContent = '-';
                setCountdownState(element, null);
                return;
            }

            const timeDiff = targetDate.getTime() - today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const weeksDiff = Math.ceil(daysDiff / 7);

            if (daysDiff > 0) {
                element.textContent = formatCountdown(daysDiff, weeksDiff);

                if (daysDiff <= 30) {
                    setCountdownState(element, `${COUNTDOWN_CLASS_PREFIX}urgent`);
                } else if (daysDiff <= 90) {
                    setCountdownState(element, `${COUNTDOWN_CLASS_PREFIX}near`);
                } else {
                    setCountdownState(element, `${COUNTDOWN_CLASS_PREFIX}far`);
                }
            } else if (daysDiff === 0) {
                element.textContent = '今天！';
                setCountdownState(element, `${COUNTDOWN_CLASS_PREFIX}today`);
            } else {
                element.textContent = '已結束';
                setCountdownState(element, `${COUNTDOWN_CLASS_PREFIX}finished`);
            }
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

    function createCountdownItems() {
        return Array.from(document.querySelectorAll('[data-countdown-date]')).map(element => ({
            element,
            targetDate: parseDate(element.dataset.countdownDate)
        }));
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
        const countdownItems = createCountdownItems();
        const currentTimeElement = document.getElementById('current-time');
        const refreshButton = document.querySelector('[data-action="refresh-countdown"]');

        const refreshCountdowns = () => updateCountdowns(countdownItems);
        const refreshTime = () => updateCurrentTime(currentTimeElement);

        refreshCountdowns();
        refreshTime();

        attachRefreshHandler(refreshButton, { refreshCountdowns, refreshTime });

        setInterval(refreshCountdowns, 60000);
        setInterval(refreshTime, 60000);
    });
})();
