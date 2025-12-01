const url = 'https://off.energy.mk.ua/api/schedule/active';
const timeBlackoutWarning = document.querySelector('.time-blackout-warning');
const timeLeftToOff = document.querySelector('.time-left-to-off');
const timeLeftToOn = document.querySelector('.time-left-to-on');
const timeRefreshedAt = document.getElementById('time-refreshed-at');
const refreshIcon = document.querySelector('.refresh-icon');
const groupInput = document.getElementById('group-selector');
const minutesDelay = 5;
const secondsDelay = 1;
const timeSchedule = document.querySelector('.time-schedule');

let allTimeIntervals = [];

const timeBlackoutInterval = [
    '00:00 - 00:30',
    '00:30 - 01:00',
    '01:00 - 01:30',
    '01:30 - 02:00',
    '02:00 - 02:30',
    '02:30 - 03:00',
    '03:00 - 03:30',
    '03:30 - 04:00',
    '04:00 - 04:30',
    '04:30 - 05:00',
    '05:00 - 05:30',
    '05:30 - 06:00',
    '06:00 - 06:30',
    '06:30 - 07:00',
    '07:00 - 07:30',
    '07:30 - 08:00',
    '08:00 - 08:30',
    '08:30 - 09:00',
    '09:00 - 09:30',
    '09:30 - 10:00',
    '10:00 - 10:30',
    '10:30 - 11:00',
    '11:00 - 11:30',
    '11:30 - 12:00',
    '12:00 - 12:30',
    '12:30 - 13:00',
    '13:00 - 13:30',
    '13:30 - 14:00',
    '14:00 - 14:30',
    '14:30 - 15:00',
    '15:00 - 15:30',
    '15:30 - 16:00',
    '16:00 - 16:30',
    '16:30 - 17:00',
    '17:00 - 17:30',
    '17:30 - 18:00',
    '18:00 - 18:30',
    '18:30 - 19:00',
    '19:00 - 19:30',
    '19:30 - 20:00',
    '20:00 - 20:30',
    '20:30 - 21:00',
    '21:00 - 21:30',
    '21:30 - 22:00',
    '22:00 - 22:30',
    '22:30 - 23:00',
    '23:00 - 23:30',
    '23:30 - 00:00'
];

async function loadAllTimeIntervals() {
    const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
    const data = await response.json();
    const groups = {
        '1.1': 14,
        '1.2': 15,
        '2.1': 16,
        '2.2': 17,
        '3.1': 19,
        '3.2': 20,
        '4.1': 21,
        '4.2': 22,
        '5.1': 24,
        '5.2': 25,
        '6.1': 26,
        '6.2': 27,
    };
    let times = {
        "1.1": [],
        "1.2": [],
        "2.1": [],
        "2.2": [],
        "3.1": [],
        "3.2": [],
        "4.1": [],
        "4.2": [],
        "5.1": [],
        "5.2": [],
        "6.1": [],
        "6.2": []
    };

    data.forEach(item => {
        if (item.outage_queue_id === groups["1.1"]) {
            times["1.1"].push(timeBlackoutInterval[item.time_series_id - 1]);
        }
        if (item.outage_queue_id === groups["1.2"]) {
            times["1.2"].push(timeBlackoutInterval[item.time_series_id - 1]);
        }
        if (item.outage_queue_id === groups["2.1"]) {
            times["2.1"].push(timeBlackoutInterval[item.time_series_id - 1]);
        }
        if (item.outage_queue_id === groups["2.2"]) {
            times["2.2"].push(timeBlackoutInterval[item.time_series_id - 1]);
        }
        if (item.outage_queue_id === groups["3.1"]) {
            times["3.1"].push(timeBlackoutInterval[item.time_series_id - 1]);
        }
        if (item.outage_queue_id === groups["3.2"]) {
            times["3.2"].push(timeBlackoutInterval[item.time_series_id - 1]);
        }
        if (item.outage_queue_id === groups["4.1"]) {
            times["4.1"].push(timeBlackoutInterval[item.time_series_id - 1]);
        }
        if (item.outage_queue_id === groups["4.2"]) {
            times["4.2"].push(timeBlackoutInterval[item.time_series_id - 1]);
        }
        if (item.outage_queue_id === groups["5.1"]) {
            times["5.1"].push(timeBlackoutInterval[item.time_series_id - 1]);
        }
        if (item.outage_queue_id === groups["5.2"]) {
            times["5.2"].push(timeBlackoutInterval[item.time_series_id - 1]);
        }
        if (item.outage_queue_id === groups["6.1"]) {
            times["6.1"].push(timeBlackoutInterval[item.time_series_id - 1]);
        }
        if (item.outage_queue_id === groups["6.2"]) {
            times["6.2"].push(timeBlackoutInterval[item.time_series_id - 1]);
        }
    });

    // Функция для сжатия интервалов
    function mergeIntervals(intervals) {
        // Сначала переводим строки в минуты
        const times = intervals.map(interval => {
            const [start, end] = interval.split(' - ').map(t => {
                const [h, m] = t.split(':').map(Number);
                return h * 60 + m;
            });
            return [start, end];
        });

        // Сортируем по началу интервала
        times.sort((a, b) => a[0] - b[0]);

        const merged = [];
        for (const [start, end] of times) {
            if (!merged.length || merged[merged.length - 1][1] < start) {
                merged.push([start, end]);
            } else {
                merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end);
            }
        }

        // Переводим обратно в формат "HH:MM - HH:MM"
        return merged.map(([start, end]) => {
            const pad = n => n.toString().padStart(2, '0');
            const startH = pad(Math.floor(start / 60));
            const startM = pad(start % 60);
            const endH = pad(Math.floor(end / 60));
            const endM = pad(end % 60);
            return `${startH}:${startM} - ${endH}:${endM}`;
        });
    }

    // Обрабатываем весь объект
    const mergedSchedule = Object.fromEntries(
        Object.entries(times).map(([key, intervals]) => [key, mergeIntervals(intervals)])
    );

    return mergedSchedule;
}

function getTimeLeftToOffText() {
    const t = refreshTimeLeftToOff(allTimeIntervals[groupInput.value]);

    if (t.hours === 0) {
        return 'До отключения света: ' + t.minutes + ' мин.';
    }
    if (t.hours === null && t.minutes === null) {
        const now = new Date();
        const hoursLeft = 23 - now.getHours(); // оставшиеся полные часы
        const minutesLeft = 59 - now.getMinutes(); // оставшиеся минуты в текущем часе
        return `Свет включен до конца дня<br>До возможного отключения: ${hoursLeft} ч. ${minutesLeft} мин.`;
    }

    return 'До отключения света: ' + t.hours + ' ч. ' + t.minutes + ' мин.';
}

function getTimeLeftToOnText() {
    const t = refreshTimeLeftToOn(allTimeIntervals[groupInput.value]);
    if (t.hours === 0) {
        return 'До включения света: ' + t.minutes + ' мин.';
    }
    return 'До включения света: ' + t.hours + ' ч. ' + t.minutes + ' мин.';
}

function refreshTimeLeftToOff(intervals, now = new Date()) {
    const currMinutes = now.getHours() * 60 + now.getMinutes();

    const parsedMinutes = intervals.map(str => {
        let [start] = str.split(" - ");
        const [hours, minutes] = start.split(":").map(Number);

        let minutesTotal = hours * 60 + minutes;
        return minutesTotal;
    });

    const reversedParsedMinutesIntervals = parsedMinutes.reverse();
    if (reversedParsedMinutesIntervals[0] < currMinutes) {
        return {
            hours: null,
            minutes: null
        };
    }

    let minDiff = Infinity;

    for (const parsed of parsedMinutes) {
        let diff = parsed - currMinutes;

        // Если интервал сегодня уже прошёл — он будет завтра скорее всего в 24:00
        if (diff < 0) {
            diff = 24 * 60 - currMinutes;
        }
        if (diff < minDiff) minDiff = diff;
    }

    return {
        hours: Math.floor(minDiff / 60),
        minutes: minDiff % 60
    };
}

function refreshTimeLeftToOn(intervals, now = new Date()) {
    const currMinutes = now.getHours() * 60 + now.getMinutes();

    for (const str of intervals) {
        let [start, end] = str.split(" - ");
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);

        let startMin = sh * 60 + sm;
        let endMin = eh * 60 + em;

        // Интервал через полночь (например 21:30 - 00:00)
        if (endMin <= startMin) endMin += 24 * 60;

        let curr = currMinutes;
        if (curr < startMin) curr += 24 * 60; // перенос для ночных интервалов

        if (curr >= startMin && curr < endMin) {
            const diff = endMin - curr;
            return {
                hours: Math.floor(diff / 60),
                minutes: diff % 60
            };
        }
    }

    return { hours: 0, minutes: 0 };
}

async function refreshSchedule(timeIntervals) {
    const frag = document.createDocumentFragment();
    timeIntervals.forEach(i => {
        const div = document.createElement('div');
        div.textContent = i;
        const span = document.createElement('span');
        span.textContent = getHoursShutdown(i);
        span.classList.add('shutdown-left-hours');
        div.appendChild(span);
        frag.appendChild(div);
    });

    const nowHours = new Date().getHours();
    const hoursFromTimesIntervals = timeIntervals.map(i => {
        const [start] = i.split(' - ');
        return start.split(':').map(Number)[0];
    });
    // получить индекс следующего отключения и этот же интекс повесить класс, чтобы остальные сделать полупрозрачными
    const nextIndex = hoursFromTimesIntervals.findIndex(h => h > nowHours);
    if (nextIndex !== -1) {
        frag.children[nextIndex].classList.add('awaiting-blackout');
    }

    timeSchedule.replaceChildren(frag);
}

function getHoursShutdown(timeIntervalStr) {
    const [start, end] = timeIntervalStr.split(' - ');
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;
    if (endMin <= startMin) endMin += 24 * 60;
    const diff = endMin - startMin;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return hours + (minutes ? '.' + Math.round((minutes / 60) * 10) : '') + ' ч.';
}

function isBlackoutNow(timeIntervalsArray) {
    const normalizedIntervals = timeIntervalsArray.map(interval => {
        const [start, end] = interval.split(' - ');
        if (end === "00:00") {
            return start + " - " + "24:00"
        }
        return start + " - " + end;
    });

    function isNowInRange(rangeStr) {
        const [start, end] = rangeStr.split(" - ");

        const toMinutes = t => {
            const [h, m] = t.split(":").map(Number);
            return h * 60 + m;
        };

        const now = new Date();
        const nowMin = now.getHours() * 60 + now.getMinutes();

        const startMin = toMinutes(start);
        const endMin = toMinutes(end);

        return nowMin >= startMin && nowMin < endMin;
    }

    return normalizedIntervals.find(r => isNowInRange(r)) || false;
}

async function refreshAllData() {
    //allTimeIntervals = await loadAllTimeIntervalsFake();
    allTimeIntervals = await loadAllTimeIntervals();
    console.log(allTimeIntervals[groupInput.value]);

    if (isBlackoutNow(allTimeIntervals[groupInput.value])) {
        timeBlackoutWarning.classList.remove('hidden');
        timeLeftToOff.classList.add('hidden');
        timeLeftToOn.classList.remove('hidden');
    } else if (!isBlackoutNow(allTimeIntervals[groupInput.value])) {
        timeBlackoutWarning.classList.add('hidden');
        timeLeftToOff.classList.remove('hidden');
        timeLeftToOn.classList.add('hidden');
    }

    refreshSchedule(allTimeIntervals[groupInput.value]);
    const now = new Date();
    timeRefreshedAt.textContent = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
}

function startRefreshIntervalIn(minutes) {
    setInterval(() => {
        refreshAllData();
    }, minutes * 60 * 1000);
}

function startRefreshCountersIn(seconds) {
    setInterval(() => {
        refreshCounters();
    }, seconds * 1000);
}

function refreshCounters() {
    timeLeftToOn.textContent = getTimeLeftToOnText();
    timeLeftToOff.innerHTML = getTimeLeftToOffText();
}

function loadAllTimeIntervalsFake() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                "4.1": ["11:30 - 12:00", "20:00 - 20:30"],
                "6.1": ["10:00 - 15:00"]
            });
        }, 200); // 200мс для реалистичности
    });
}

refreshIcon.addEventListener('click', () => {
    const timeDelay = 2000;

    refreshAllData();
    refreshIcon.classList.add('spin');
    setTimeout(() => {
        refreshIcon.classList.remove('spin');
    }, timeDelay);
});

document.querySelectorAll(".group-item").forEach(item => {
    item.addEventListener('mousedown', event => {
        const selectedGroup = item.textContent.trim();
        groupInput.value = selectedGroup;

        refreshSchedule(allTimeIntervals[groupInput.value]);
        refreshCounters();
    });
});

document.querySelector("#group-selector").addEventListener('focus', () => {
    document.querySelector(".groups").classList.remove("hidden-groups-animation");
});

document.querySelector("#group-selector").addEventListener('blur', () => {
    document.querySelector(".groups").classList.add("hidden-groups-animation");
});

refreshAllData();
startRefreshIntervalIn(minutesDelay);
startRefreshCountersIn(secondsDelay);