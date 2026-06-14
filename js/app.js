let currentCourseData = null;
let currentLessonId = null;

document.addEventListener('DOMContentLoaded', () => {
    try { initTheme(); } catch (e) { console.error('Theme init failed', e); }
    try { initMobileNav(); } catch (e) { console.error('Nav init failed', e); }
    try { updateLearningStreak(); } catch (e) { console.error('Streak init failed', e); }

    const path = window.location.pathname;
    try {
        if (path.includes('lesson.html')) {
            initLesson();
        } else if (path.includes('my-courses.html')) {
            initMyCourses();
        } else if (path.includes('catalog.html')) {
            initCatalog();
        } else {
            initDashboard();
        }
    } catch (e) {
        console.error('Page init failed', e);
    }
});

// --- Mobile Navigation Logic ---
function initMobileNav() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('mobile-overlay');
    const sidebar = document.querySelector('.sidebar');

    function closeAll() {
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        try { sessionStorage.setItem('sidebarOpen', 'false'); } catch (e) {}
    }

    if (overlay) overlay.addEventListener('click', closeAll);

    if (sidebar) {
        // Prevent clicks inside the sidebar from accidentally triggering overlay or document clicks
        sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    if (menuBtn && sidebar) {
        const openMenu = (e) => {
            e.preventDefault(); // Prevent double firing if click also registers
            e.stopPropagation();
            sidebar.classList.add('open');
            if (overlay) overlay.classList.add('show');
            try { sessionStorage.setItem('sidebarOpen', 'true'); } catch (e) {}
        };

        menuBtn.addEventListener('click', openMenu);
        menuBtn.addEventListener('touchstart', openMenu, { passive: false });
    }

    // Persist sidebar state across page navigation on mobile
    try {
        if (sessionStorage.getItem('sidebarOpen') === 'true') {
            // Use a small timeout to avoid CSS transition pop on load
            setTimeout(() => {
                if (sidebar) sidebar.classList.add('open');
                if (overlay) overlay.classList.add('show');
            }, 10);
        }
    } catch (e) {}
}

// --- Theme Logic ---
function initTheme() {
    const btn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (!btn) return;

    // Check local storage for saved preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        icon.innerText = '🌙';
    }

    btn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        let theme = 'dark';
        if (document.body.classList.contains('light-mode')) {
            theme = 'light';
            icon.innerText = '🌙';
        } else {
            icon.innerText = '☀️';
        }
        localStorage.setItem('theme', theme);
    });
}

// --- Utility: Track Enrolled Courses ---
function trackCourseEnrollment(courseId) {
    let enrolled = JSON.parse(localStorage.getItem('myCourses')) || [];
    if (!enrolled.includes(courseId)) {
        enrolled.push(courseId);
        localStorage.setItem('myCourses', JSON.stringify(enrolled));
    }
}

// --- Utility: Track Completed Lessons ---
function trackCompletedLesson(courseId, lessonId) {
    let completed = JSON.parse(localStorage.getItem('completedLessons')) || [];
    const uniqueId = `${courseId}:${lessonId}`;
    if (!completed.includes(uniqueId)) {
        completed.push(uniqueId);
        localStorage.setItem('completedLessons', JSON.stringify(completed));
    }
}

// --- Utility: Track Learning Streak ---
function updateLearningStreak() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    let lastActiveDate = localStorage.getItem('lastActiveDate');
    let streak = parseInt(localStorage.getItem('learningStreak')) || 0;

    if (lastActiveDate !== today) {
        if (lastActiveDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastActiveDate === yesterdayStr) {
                streak += 1;
            } else {
                streak = 1; // Reset streak
            }
        } else {
            streak = 1; // First day
        }
        localStorage.setItem('lastActiveDate', today);
        localStorage.setItem('learningStreak', streak.toString());
    }
}

// --- My Courses ---
async function initMyCourses() {
    const grid = document.getElementById('course-grid');
    if (!grid) return;

    try {
        const res = await fetch('data/courses.json');
        const courses = await res.json();

        const enrolledIds = JSON.parse(localStorage.getItem('myCourses')) || [];
        const enrolledCourses = courses.filter(c => enrolledIds.includes(c.id));

        if (enrolledCourses.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; margin-top: 3rem;"><h3 style="margin-bottom: 1rem; color: var(--text-primary);">You haven\'t started any courses yet.</h3><a href="index.html" class="btn btn-primary">Browse Courses</a></div>';
            return;
        }

        grid.innerHTML = '';
        enrolledCourses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = `
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="card-footer">
                    <span class="tag">${course.category}</span>
                    <a href="lesson.html?id=${course.id}" class="btn btn-primary">Continue</a>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p style="color:var(--danger)">Failed to load your courses.</p>';
    }
}

// --- Catalog ---
async function initCatalog() {
    const grid = document.getElementById('course-grid');
    if (!grid) return;

    try {
        const res = await fetch('data/courses.json');
        const courses = await res.json();

        if (courses.length === 0) {
            grid.innerHTML = '<p>No courses available right now.</p>';
            return;
        }

        grid.innerHTML = '';
        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = `
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="card-footer">
                    <span class="tag">${course.category}</span>
                    <a href="lesson.html?id=${course.id}" class="btn btn-primary">Start Course</a>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p style="color:var(--danger)">Failed to load courses.</p>';
    }
}

// --- Dashboard ---
async function initDashboard() {
    const enrolledIds = JSON.parse(localStorage.getItem('myCourses')) || [];
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];
    const streak = parseInt(localStorage.getItem('learningStreak')) || 0;

    const metricEnrolled = document.getElementById('metric-enrolled');
    if (metricEnrolled) metricEnrolled.innerText = enrolledIds.length;

    const metricCompleted = document.getElementById('metric-completed');
    if (metricCompleted) metricCompleted.innerText = completedLessons.length;

    const metricStreak = document.getElementById('metric-streak');
    if (metricStreak) metricStreak.innerText = streak + (streak === 1 ? ' Day' : ' Days');

    const recentActivityContainer = document.getElementById('recent-activity-container');
    if (!recentActivityContainer) return;

    if (enrolledIds.length === 0) {
        recentActivityContainer.innerHTML = '<p style="color: var(--text-secondary);">You have no active courses right now. Go to the <a href="catalog.html" style="color: var(--accent-secondary);">Course Catalog</a> to get started!</p>';
        return;
    }

    try {
        const res = await fetch('data/courses.json');
        const courses = await res.json();

        const recentCourseId = enrolledIds[enrolledIds.length - 1];
        const recentCourse = courses.find(c => c.id === recentCourseId);

        if (recentCourse) {
            recentActivityContainer.innerHTML = `
                <div class="course-card" style="max-width: 400px; border-top: 5px solid var(--success);">
                    <h3>${recentCourse.title}</h3>
                    <p style="margin-bottom: 1rem;">Jump back in and continue learning where you left off.</p>
                    <a href="lesson.html?id=${recentCourse.id}" class="btn btn-primary" style="background: var(--success);">Continue Learning</a>
                </div>
            `;
        }
    } catch (err) {
        console.error(err);
    }
}

// --- Lesson / Course Viewer ---
async function initLesson() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    if (!courseId) {
        document.getElementById('loading').innerText = "Course ID not provided.";
        return;
    }

    try {
        const res = await fetch(`data/courses/${courseId}/index.json`);
        if (!res.ok) throw new Error('Network error');
        currentCourseData = await res.json();

        document.getElementById('course-title-sidebar').innerText = currentCourseData.title;
        document.getElementById('loading').classList.add('hidden');

        // Track that the user started this course
        trackCourseEnrollment(courseId);

        renderCurriculumSidebar();

        // Load first lesson by default
        if (currentCourseData.modules && currentCourseData.modules.length > 0) {
            const firstModule = currentCourseData.modules[0];
            if (firstModule.lessons && firstModule.lessons.length > 0) {
                loadLesson(firstModule.lessons[0].id);
            }
        }

    } catch (err) {
        console.error(err);
        document.getElementById('loading').innerText = "Failed to load course.";
    }
}

function renderCurriculumSidebar() {
    const list = document.getElementById('curriculum-list');
    list.innerHTML = '';

    currentCourseData.modules.forEach(module => {
        const moduleGroup = document.createElement('div');
        moduleGroup.className = 'module-group';

        const moduleHeader = document.createElement('div');
        moduleHeader.className = 'module-header open';
        moduleHeader.innerHTML = `<span>${module.title}</span><span class="toggle-icon">▼</span>`;

        const moduleLessons = document.createElement('div');
        moduleLessons.className = 'module-lessons open';

        moduleHeader.addEventListener('click', () => {
            moduleHeader.classList.toggle('open');
            moduleLessons.classList.toggle('open');
        });

        module.lessons.forEach(lesson => {
            const item = document.createElement('div');
            item.className = 'curriculum-item';
            item.innerText = lesson.title;
            item.id = `nav-${lesson.id}`;

            item.addEventListener('click', () => {
                loadLesson(lesson.id);
            });

            moduleLessons.appendChild(item);
        });

        moduleGroup.appendChild(moduleHeader);
        moduleGroup.appendChild(moduleLessons);
        list.appendChild(moduleGroup);
    });
}

async function loadLesson(lessonId) {
    currentLessonId = lessonId;

    // Update active state in sidebar
    document.querySelectorAll('.curriculum-item').forEach(el => el.classList.remove('active'));
    const navItem = document.getElementById(`nav-${lessonId}`);
    if (navItem) navItem.classList.add('active');

    // Find lesson metadata
    let flatLessons = [];
    if (currentCourseData.modules) {
        currentCourseData.modules.forEach(m => flatLessons = flatLessons.concat(m.lessons));
    } else {
        flatLessons = currentCourseData.lessons || []; // Fallback for old format
    }
    const lessonData = flatLessons.find(l => l.id === lessonId);
    if (!lessonData) return;

    const titleEl = document.getElementById('lesson-title');
    titleEl.innerText = lessonData.title;
    titleEl.classList.remove('hidden');

    const blocksDiv = document.getElementById('lesson-blocks');
    blocksDiv.innerHTML = '<div style="text-align: center; color: var(--text-secondary); margin: 2rem 0;">Loading content...</div>';

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('id');

        const res = await fetch(`data/courses/${courseId}/${lessonData.file}`);
        if (!res.ok) throw new Error('Failed to fetch lesson content');

        let rawText = await res.text();
        rawText = rawText.replace(/\r\n/g, '\n'); // Normalize newlines
        
        // Strip markdown frontmatter
        rawText = rawText.replace(/^---\n[\s\S]*?\n---\n/, '');

        let quizCounter = 1;

        // Preprocess custom task-list quizzes
        const quizRegex = /\*\*Quiz:\s*(.*?)\*\*\n((?:-\s*\[[ xX]\].*?(?:\n|$))+)/gi;

        let processedText = rawText.replace(quizRegex, (match, question, optionsBlock) => {
            const qNum = quizCounter++;
            let optionsHTML = '';
            let answerIdx = -1;

            const optionLines = optionsBlock.trim().split('\n');
            optionLines.forEach((line, idx) => {
                const isCorrect = line.includes('[x]') || line.includes('[X]');
                if (isCorrect) answerIdx = idx;

                // Extract the text after the brackets
                const optText = line.replace(/-\s*\[[ xX]\]\s*/, '').trim();
                optionsHTML += `<div class="quiz-option" data-idx="${idx}">${optText}</div>`;
            });

            return `
<div class="quiz-container">
    <div class="quiz-header"><span class="quiz-number">Question ${qNum}</span></div>
    <div class="quiz-question">${question}</div>
    <div class="quiz-options">${optionsHTML}</div>
    <div class="quiz-feedback"></div>
    <button class="btn btn-primary" style="margin-top: 1rem;" onclick="checkAnswer(this, ${answerIdx})">Submit</button>
</div>
`;
        });

        // Parse remaining markdown
        const htmlContent = marked.parse(processedText);
        blocksDiv.innerHTML = htmlContent;

        // Attach click listeners for the newly injected quizzes
        const quizContainers = blocksDiv.querySelectorAll('.quiz-container');
        quizContainers.forEach(container => {
            const optionEls = container.querySelectorAll('.quiz-option');
            optionEls.forEach(optEl => {
                optEl.addEventListener('click', () => {
                    optionEls.forEach(o => o.classList.remove('selected'));
                    optEl.classList.add('selected');
                });
            });
        });

        // Update Next/Prev buttons
        const lessonIndex = flatLessons.findIndex(l => l.id === lessonId);
        const navDiv = document.getElementById('lesson-navigation');
        const btnPrev = document.getElementById('btn-prev-lesson');
        const btnNext = document.getElementById('btn-next-lesson');

        if (navDiv) {
            navDiv.style.display = 'flex';

            if (lessonIndex > 0) {
                btnPrev.disabled = false;
                btnPrev.onclick = () => loadLesson(flatLessons[lessonIndex - 1].id);
            } else {
                btnPrev.disabled = true;
                btnPrev.onclick = null;
            }

            if (lessonIndex < flatLessons.length - 1) {
                btnNext.disabled = false;
                btnNext.innerText = 'Next →';
                btnNext.onclick = () => loadLesson(flatLessons[lessonIndex + 1].id);
            } else {
                btnNext.disabled = true;
                btnNext.innerText = 'Finish Course';
                btnNext.onclick = null;
            }
        }

        // Scroll to top when changing lessons
        document.querySelector('.lesson-main-area').scrollTop = 0;

        // Track completed lesson
        trackCompletedLesson(courseId, lessonData.id);

    } catch (err) {
        console.error(err);
        blocksDiv.innerHTML = '<div style="color: var(--danger); margin: 2rem 0;">Failed to load lesson content. Check console for details.</div>';
    }
}

window.checkAnswer = function (btn, correctIdx) {
    const container = btn.closest('.quiz-container');
    const selected = container.querySelector('.quiz-option.selected');
    const feedback = container.querySelector('.quiz-feedback');
    const options = container.querySelectorAll('.quiz-option');

    if (!selected) {
        feedback.innerText = "Select an answer first.";
        feedback.className = 'quiz-feedback show error';
        return;
    }

    const selectedIdx = parseInt(selected.getAttribute('data-idx'));

    options.forEach(opt => opt.classList.remove('correct', 'wrong'));

    if (selectedIdx === correctIdx) {
        selected.classList.add('correct');
        feedback.innerText = "Correct! Well done.";
        feedback.className = 'quiz-feedback show success';
    } else {
        selected.classList.add('wrong');
        options[correctIdx].classList.add('correct');
        feedback.innerText = "Incorrect. See the correct answer.";
        feedback.className = 'quiz-feedback show error';
    }

    options.forEach(opt => opt.style.pointerEvents = 'none');
    btn.style.display = 'none';
};
