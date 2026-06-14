const fs = require('fs');
const path = require('path');

const lessons = [
  { file: 'lesson-1.md', title: '1. Introduction to Compilers', mod_id: 'module-1', mod_title: 'Module 1: Front-end Analysis', order: 1 },
  { file: 'lesson-2.md', title: '2. Lexical Analysis', mod_id: 'module-1', mod_title: 'Module 1: Front-end Analysis', order: 2 },
  { file: 'lesson-3.md', title: '3. Syntax Analysis', mod_id: 'module-1', mod_title: 'Module 1: Front-end Analysis', order: 3 },
  { file: 'lesson-4.md', title: '4. Semantic Analysis', mod_id: 'module-1', mod_title: 'Module 1: Front-end Analysis', order: 4 },
  { file: 'lesson-5.md', title: '5. Optimization', mod_id: 'module-2', mod_title: 'Module 2: Back-end & Optimization', order: 5 },
  { file: 'lesson-6.md', title: '6. Code Generation', mod_id: 'module-2', mod_title: 'Module 2: Back-end & Optimization', order: 6 }
];

const dir = path.join(__dirname, '../data/courses/compiler-construction');

lessons.forEach(l => {
  const filepath = path.join(dir, l.file);
  let content = fs.readFileSync(filepath, 'utf8');
  
  // if it already has frontmatter, skip
  if (content.startsWith('---')) return;

  const fm = `---
title: "${l.title}"
module_id: "${l.mod_id}"
module_title: "${l.mod_title}"
order: ${l.order}
---

`;
  fs.writeFileSync(filepath, fm + content);
  console.log(`Added frontmatter to ${l.file}`);
});
