# Confucius LMS

A lightweight, purely static Learning Management System (LMS) designed to run perfectly on GitHub Pages with zero backend required. Built with a sleek, Stanford-inspired glassmorphism theme and a fully Mobile-First responsive architecture.

Confucius LMS operates entirely on a "Git-CMS" architecture. Course content is authored using Markdown (`.md`) files and simple JSON registries, meaning your content is completely managed, versioned, and deployed via Git.

## 🚀 Features
- **Zero Backend**: Runs purely on HTML, CSS (Mobile-First), and Vanilla JavaScript.
- **Markdown-First Authoring**: Write courses naturally in `.md` files with YAML Frontmatter. No complex database required.
- **Interactive Quizzes**: Generate auto-grading quizzes natively inside Markdown using standard checklists (`- [x]`).
- **Dark/Light Mode**: Built-in persistent theme toggling.
- **Modern UI Layout**: Fully responsive, mobile-first design with unified sidebars, maximizing reading space on desktop.
- **Local Enrollment Tracking**: Tracks started courses locally in the user's browser without a database.

---

## 📚 Adding a Course

Because Confucius LMS uses Git as its CMS, adding a course is as simple as creating a folder and writing some Markdown.

### Step 1: Create the Course Folder
Navigate to `data/courses/` and create a new folder named after your course ID (e.g., `data/courses/my-new-course/`).

### Step 2: Register the Course
Open `data/courses.json` and add your course to the global registry so the Dashboard can find it:
```json
{
  "id": "my-new-course",
  "title": "My New Course",
  "description": "A short description for the course card.",
  "category": "Technology"
}
```

### Step 3: Write the Lessons with Frontmatter
Inside your folder, create your lesson files (e.g., `lesson-1.md`). Every lesson MUST have a YAML frontmatter block at the top to define its metadata:

```yaml
---
title: "1. Welcome"
module_id: "module-1"
module_title: "Module 1: Introduction"
order: 1
---

# Hello World!
```
You can use standard Markdown like `# Headings`, `**bold text**`, and lists below the frontmatter.

### Step 4: Build the Curriculum
Once your markdown files are ready, you do not need to manually create an `index.json` file. Instead, run the built-in Node script from the root directory:
```bash
node scripts/build.js
```
This script will automatically scan your frontmatter, validate your orders and titles, and instantly compile the `index.json` required by the frontend application.

**To add an interactive Quiz, use the special Quiz Syntax:**
Type a bold question starting with `Quiz:`, followed immediately by a checklist. Put an `x` in the correct box.
```markdown
**Quiz: What is the primary output of a compiler?**
- [ ] Source code
- [x] Machine code
- [ ] A syntax tree
- [ ] HTML
```
*The LMS engine will automatically extract this and turn it into clickable, auto-grading UI buttons!*

---

## 🛠 Running Locally
Since the LMS fetches local JSON and Markdown files via JavaScript, you must run it through a local server to avoid CORS browser errors.

Using Python 3 (installed on most Macs/Linux):
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.
