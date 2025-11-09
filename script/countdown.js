class CountdownTimer {
    constructor({ display, startButton, pauseButton, stopButton, inputs }) {
        this.display = display;
        this.startButton = startButton;
        this.pauseButton = pauseButton;
        this.stopButton = stopButton;
        this.inputs = inputs;

        this.intervalId = null;
        this.totalSeconds = 0;
        this.initialSeconds = 0;
        this.isRunning = false;
        this.wasPaused = false;
    }

    init() {
        this.bindEvents();
        this.syncFromInputs();
    }

    bindEvents() {
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.togglePause());
        this.stopButton.addEventListener('click', () => this.stop());

        this.inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (!this.isRunning && !this.wasPaused) {
                    this.syncFromInputs();
                }
            });
        });
    }

    readInputs() {
        const [hoursInput, minutesInput, secondsInput] = this.inputs;

        const hours = this.clampValue(hoursInput.value, 0, 23);
        const minutes = this.clampValue(minutesInput.value, 0, 59);
        const seconds = this.clampValue(secondsInput.value, 0, 59);

        hoursInput.value = hours;
        minutesInput.value = minutes;
        secondsInput.value = seconds;

        return hours * 3600 + minutes * 60 + seconds;
    }

    clampValue(value, min, max) {
        const parsed = Number.parseInt(value, 10);
        if (Number.isNaN(parsed)) return min;
        return Math.min(Math.max(parsed, min), max);
    }

    syncFromInputs() {
        this.totalSeconds = this.readInputs();
        this.initialSeconds = this.totalSeconds;
        this.updateDisplay();
    }

    start() {
        if (!this.isRunning) {
            if (!this.wasPaused) {
                this.syncFromInputs();
                if (this.totalSeconds <= 0) {
                    alert('請設定大於 0 的時間！');
                    return;
                }
            }

            this.runTimer();
        }
    }

    runTimer() {
        this.isRunning = true;
        this.wasPaused = false;
        this.pauseButton.textContent = '暫停';

        this.toggleInputs(true);
        this.updateButtonStates({ start: true, pause: false, stop: false });
        this.display.classList.remove('finished');

        this.intervalId = window.setInterval(() => {
            this.totalSeconds -= 1;
            this.updateDisplay();

            if (this.totalSeconds <= 0) {
                this.finish();
            }
        }, 1000);
    }

    togglePause() {
        if (!this.isRunning && !this.wasPaused) {
            return;
        }

        if (this.wasPaused) {
            this.runTimer();
            return;
        }

        window.clearInterval(this.intervalId);
        this.intervalId = null;
        this.isRunning = false;
        this.wasPaused = true;

        this.pauseButton.textContent = '繼續';
        this.updateButtonStates({ start: false, pause: false, stop: false });
        this.startButton.disabled = false;
    }

    stop() {
        window.clearInterval(this.intervalId);
        this.intervalId = null;

        this.isRunning = false;
        this.wasPaused = false;

        this.pauseButton.textContent = '暫停';
        this.updateButtonStates({ start: false, pause: true, stop: true });
        this.toggleInputs(false);
        this.syncFromInputs();
        this.display.classList.remove('finished');
    }

    finish() {
        window.clearInterval(this.intervalId);
        this.intervalId = null;

        this.isRunning = false;
        this.wasPaused = false;

        this.updateButtonStates({ start: false, pause: true, stop: true });
        this.pauseButton.textContent = '暫停';
        this.toggleInputs(false);

        this.display.textContent = '時間到！';
        this.display.classList.add('finished');

        const message = this.formatCompletionMessage(this.initialSeconds);
        if (message) {
            alert(message);
        }
    }

    formatCompletionMessage(totalSeconds) {
        if (totalSeconds <= 0) return '';

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const parts = [];
        if (hours > 0) parts.push(`${hours}小時`);
        if (minutes > 0) parts.push(`${minutes}分`);
        if (seconds > 0 || totalSeconds < 60) parts.push(`${seconds}秒`);

        return `倒數完成！總時間: ${parts.join('')}`;
    }

    updateDisplay() {
        const hours = Math.floor(this.totalSeconds / 3600);
        const minutes = Math.floor((this.totalSeconds % 3600) / 60);
        const seconds = this.totalSeconds % 60;

        const formatted = hours > 0
            ? `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`
            : `${this.pad(minutes)}:${this.pad(seconds)}`;

        this.display.textContent = formatted;
    }

    pad(value) {
        return value.toString().padStart(2, '0');
    }

    toggleInputs(disabled) {
        this.inputs.forEach(input => {
            input.disabled = disabled;
        });
    }

    updateButtonStates({ start, pause, stop }) {
        this.startButton.disabled = start;
        this.pauseButton.disabled = pause;
        this.stopButton.disabled = stop;
    }
}

function initCountdownTimer() {
    const display = document.getElementById('display');
    const startButton = document.getElementById('startBtn');
    const pauseButton = document.getElementById('pauseBtn');
    const stopButton = document.getElementById('stopBtn');
    const inputs = [
        document.getElementById('hours'),
        document.getElementById('minutes'),
        document.getElementById('seconds')
    ];

    if (!display || inputs.some(input => !input) || !startButton || !pauseButton || !stopButton) {
        return;
    }

    const timer = new CountdownTimer({
        display,
        startButton,
        pauseButton,
        stopButton,
        inputs
    });

    timer.init();
    return timer;
}

window.addEventListener('DOMContentLoaded', initCountdownTimer);
