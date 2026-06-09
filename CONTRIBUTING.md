# Contributing to Confucius LMS

Welcome to Confucius LMS! We are thrilled that you'd like to contribute. Since this project is a purely static, Git-based Learning Management System, contributing is incredibly fast and completely free of complex local environments.

## 🤝 How to Contribute

Whether you are fixing a UI bug, adding a new feature to the Vanilla JS engine, or authoring a new Course using Markdown, all contributions are welcome!

### 1. Authoring New Courses
Confucius LMS relies on community-driven content. If you want to add a course:
1. Fork the repository.
2. Read the **Adding a Course** section in the `README.md`.
3. Create your course folder in `data/courses/[your-course]/`.
4. Write your lessons using clean Markdown (`.md`) and our special Task-List Quiz syntax.
5. Test your course locally to ensure all links and quizzes work perfectly.
6. Submit a Pull Request!

### 2. Developing the Core Engine
If you want to improve the LMS engine itself (the JavaScript, CSS, or HTML):
- **CSS Architecture**: We use a strict **Mobile-First** CSS methodology in `css/main.css`. Always style for a 320px screen by default, and use `@media (min-width: 1025px)` to add desktop enhancements.
- **JavaScript Engine**: The core engine lives in `js/app.js`. It is completely Vanilla JS. We do not use Webpack, React, or build steps. Keep PRs lightweight, performant, and dependency-free.
- **Markdown Parsing**: We use `marked.js` via CDN. Our custom quiz-generation logic relies on Regex interception before the Markdown is parsed. Check `app.js` if you wish to add new custom interactive components!

### 3. Submitting a Pull Request
- Ensure your fork is up to date with the main branch.
- Create a descriptive branch name (e.g., `feature/dark-mode-fix` or `course/advanced-python`).
- If your PR introduces UI changes, please include a screenshot in your PR description.
- Ensure you have tested your changes locally using a local web server (e.g., `python3 -m http.server 8000`).

## 📜 Code of Conduct
Please be respectful and constructive in issues and pull requests. We are building a collaborative, open educational platform.
