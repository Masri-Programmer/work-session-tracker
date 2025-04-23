let sessionCount = 1;

function addSession() {
    sessionCount++;
    const sessionsDiv = document.getElementById('sessions');
    const newSession = document.createElement('div');
    newSession.classList.add('session');
    newSession.innerHTML = `
        <div class="time-wrapper">
            <label for="session${sessionCount}-start">Session ${sessionCount} - Kommen:</label>
            <i class="fa-regular fa-clock"></i>
            <input type="time" id="session${sessionCount}-start" value="09:00">
        </div>
        <div class="time-wrapper">
            <label for="session${sessionCount}-end">Session ${sessionCount} - Gehen:</label>
            <i class="fa-regular fa-clock"></i>
            <input type="time" id="session${sessionCount}-end">
            </div>
            <button class="delete-session" onclick="deleteSession(this)">Delete Session ${sessionCount}</button>
    `;
    sessionsDiv.appendChild(newSession);
}

function deleteSession(button) {
    const sessionDiv = button.closest('.session');
    sessionDiv.remove();
}

function calculateWorkHours() {
    let totalSeconds = 0;

    document.querySelectorAll('.session').forEach((session, index) => {
        const startTime = document.getElementById(`session${index + 1}-start`).value;
        const endTime = document.getElementById(`session${index + 1}-end`).value;

        if (startTime && endTime) {
            let startSeconds = timeToSeconds(startTime);
            let endSeconds = timeToSeconds(endTime);

            // If the end time is earlier than the start time (indicating it crosses midnight)
            if (endSeconds < startSeconds) {
                endSeconds += 24 * 3600; // Add 24 hours (in seconds) to the end time
            }

            totalSeconds += (endSeconds - startSeconds);
        }
    });

    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
    const totalSecondsRemaining = totalSeconds % 60;

    const result = document.getElementById('result');
    result.style.display = 'block';
    result.textContent = `Total Work Time: ${totalHours} hours, ${totalMinutes} minutes, ${totalSecondsRemaining} seconds`;
}

function timeToSeconds(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 3600) + (minutes * 60);
}

function toggleTheme() {
    const themeToggleButton = document.querySelector('.theme-toggle');
    const isToggled = themeToggleButton.classList.contains('theme-toggle--toggled');

    // Toggle the theme by adding/removing classes
    if (isToggled) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }

    // Toggle the button class for visual indication
    themeToggleButton.classList.toggle('theme-toggle--toggled');
}

// Listen for system theme changes and update the theme accordingly
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

function updateThemeFromSystem() {
    const themeToggleButton = document.querySelector('.theme-toggle');

    if (systemTheme.matches) {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeToggleButton.classList.add('theme-toggle--toggled');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeToggleButton.classList.remove('theme-toggle--toggled');
    }
}

// Initialize the theme based on the current system theme
updateThemeFromSystem();

// Add an event listener to update the theme when the system's theme changes
systemTheme.addEventListener('change', updateThemeFromSystem);

document.querySelectorAll('input[type="time"]').forEach(input => {
    input.addEventListener('paste', (event) => {
        event.preventDefault();
        const pastedData = event.clipboardData.getData('text');

        const timeRegex = /^(\d{2}):(\d{2})(?::\d{2})?$/;
        const match = pastedData.match(timeRegex);

        if (match) {
            const hours = match[1].padStart(2, '0');
            const minutes = match[2].padStart(2, '0');
            input.value = `${hours}:${minutes}`;
        }
    });
});

// Ensure newly added time inputs also support paste functionality
function addSession() {
    sessionCount++;
    const sessionsDiv = document.getElementById('sessions');
    const newSession = document.createElement('div');
    newSession.classList.add('session');
    newSession.innerHTML = `
        <div class="time-wrapper">
            <label for="session${sessionCount}-start">Session ${sessionCount} - Kommen:</label>
            <i class="fa-regular fa-clock"></i>
            <input type="time" id="session${sessionCount}-start">
        </div>
        <div class="time-wrapper">
            <label for="session${sessionCount}-end">Session ${sessionCount} - Gehen:</label>
            <i class="fa-regular fa-clock"></i>
            <input type="time" id="session${sessionCount}-end">
        </div>
    `;
    sessionsDiv.appendChild(newSession);

    newSession.querySelectorAll('input[type="time"]').forEach(input => {
        input.addEventListener('paste', (event) => {
            event.preventDefault();
            const pastedData = event.clipboardData.getData('text');
            const timeRegex = /^(\d{2}):(\d{2})(?::\d{2})?$/;
            const match = pastedData.match(timeRegex);
            if (match) {
                const hours = match[1].padStart(2, '0');
                const minutes = match[2].padStart(2, '0');
                input.value = `${hours}:${minutes}`;
            }
        });
    });
}

function exportSchedule() {
    const schedule = [];

    document.querySelectorAll('.session').forEach((session, index) => {
        const startTime = document.getElementById(`session${index + 1}-start`).value;
        const endTime = document.getElementById(`session${index + 1}-end`).value;

        if (startTime && endTime) {
            schedule.push({
                session: `Session ${index + 1}`,
                start: startTime,
                end: endTime
            });
        }
    });

    const scheduleJSON = JSON.stringify(schedule, null, 2);
    console.log(scheduleJSON);

    // Display the data in the UI
    const result = document.getElementById('result');
    result.style.display = 'block';
    result.textContent = `Schedule:\n${schedule.map(s => `${s.session}: ${s.start} - ${s.end}`).join('\n')}`;

    // Offer as a download
    const blob = new Blob([scheduleJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schedule.json';
    link.textContent = 'Download Schedule';
    link.style.display = 'block';
    result.appendChild(link);
}

function addBreak() {
    const sessionsDiv = document.getElementById("sessions");

    // Create a new break div
    const breakDiv = document.createElement("div");
    breakDiv.classList.add("break");

    const breakLabel = document.createElement("label");
    breakLabel.innerText = "Break - Start:";
    breakDiv.appendChild(breakLabel);

    const breakStartInput = document.createElement("input");
    breakStartInput.type = "time";
    breakStartInput.classList.add("break-start");
    breakStartInput.value = "09:00"; // Default break start time set to 9:00 AM
    breakDiv.appendChild(breakStartInput);

    const breakEndLabel = document.createElement("label");
    breakEndLabel.innerText = "Break - End:";
    breakDiv.appendChild(breakEndLabel);

    const breakEndInput = document.createElement("input");
    breakEndInput.type = "time";
    breakEndInput.classList.add("break-end");
    breakEndInput.value = "09:30"; // Default break end time set to 9:30 AM (30-minute break)
    breakDiv.appendChild(breakEndInput);

    // Add the break to the sessions div
    sessionsDiv.appendChild(breakDiv);
}