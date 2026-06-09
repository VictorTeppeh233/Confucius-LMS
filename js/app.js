let currentCourseData = null;
let currentLessonId = null;

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    
    const path = window.location.pathname;
    if (path.includes('lesson.html')) {
        initLesson();
    } else if (path.includes('my-courses.html')) {
        initMyCourses();
    } else {
        initDashboard();
    }
});

// --- Mobile Navigation Logic ---
function initMobileNav() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const curriculumBtn = document.getElementById('mobile-curriculum-btn');
    const overlay = document.getElementById('mobile-overlay');
    const sidebar = document.querySelector('.sidebar');
    const currSidebar = document.querySelector('.curriculum-sidebar');
    
    function closeAll() {
        if(sidebar) sidebar.classList.remove('open');
        if(currSidebar) currSidebar.classList.remove('open');
        if(overlay) overlay.classList.remove('show');
    }
    
    if (overlay) overlay.addEventListener('click', closeAll);
    
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            closeAll();
            sidebar.classList.add('open');
            overlay.classList.add('show');
        });
    }
    
    if (curriculumBtn && currSidebar) {
        curriculumBtn.addEventListener('click', () => {
            closeAll();
            currSidebar.classList.add('open');
            overlay.classList.add('show');
        });
    }
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

// --- Dashboard ---
async function initDashboard() {
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
        if (currentCourseData.lessons && currentCourseData.lessons.length > 0) {
            loadLesson(currentCourseData.lessons[0].id);
        }
        
    } catch (err) {
        console.error(err);
        document.getElementById('loading').innerText = "Failed to load course.";
    }
}

function renderCurriculumSidebar() {
    const list = document.getElementById('curriculum-list');
    list.innerHTML = '';
    
    currentCourseData.lessons.forEach(lesson => {
        const item = document.createElement('div');
        item.className = 'curriculum-item';
        item.innerText = lesson.title;
        item.id = `nav-${lesson.id}`;
        
        item.addEventListener('click', () => {
            loadLesson(lesson.id);
        });
        
        list.appendChild(item);
    });
}

async function loadLesson(lessonId) {
    currentLessonId = lessonId;
    
    // Update active state in sidebar
    document.querySelectorAll('.curriculum-item').forEach(el => el.classList.remove('active'));
    const navItem = document.getElementById(`nav-${lessonId}`);
    if (navItem) navItem.classList.add('active');
    
    // Find lesson metadata
    const lessonData = currentCourseData.lessons.find(l => l.id === lessonId);
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
        const lessonIndex = currentCourseData.lessons.findIndex(l => l.id === lessonId);
        const navDiv = document.getElementById('lesson-navigation');
        const btnPrev = document.getElementById('btn-prev-lesson');
        const btnNext = document.getElementById('btn-next-lesson');
        
        if (navDiv) {
            navDiv.style.display = 'flex';
            
            if (lessonIndex > 0) {
                btnPrev.disabled = false;
                btnPrev.onclick = () => loadLesson(currentCourseData.lessons[lessonIndex - 1].id);
            } else {
                btnPrev.disabled = true;
                btnPrev.onclick = null;
            }
            
            if (lessonIndex < currentCourseData.lessons.length - 1) {
                btnNext.disabled = false;
                btnNext.innerText = 'Next →';
                btnNext.onclick = () => loadLesson(currentCourseData.lessons[lessonIndex + 1].id);
            } else {
                btnNext.disabled = true;
                btnNext.innerText = 'Finish Course';
                btnNext.onclick = null;
            }
        }
        
        // Scroll to top when changing lessons
        document.querySelector('.lesson-main-area').scrollTop = 0;
        
    } catch(err) {
        console.error(err);
        blocksDiv.innerHTML = '<div style="color: var(--danger); margin: 2rem 0;">Failed to load lesson content. Check console for details.</div>';
    }
}

window.checkAnswer = function(btn, correctIdx) {
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
