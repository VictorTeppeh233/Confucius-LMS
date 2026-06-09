# Lesson 4: Semantic Analysis

## Beyond Syntax
A program can have perfect syntax but still be completely invalid. Consider the following pseudo-code:
```c
int x = "Hello World";
```
This sentence is grammatically correct. It follows the structure: `[Type] [Identifier] = [Expression];`. The parser will happily build an AST for it. However, it makes no sense to assign a string literal to an integer variable. 

This is where **Semantic Analysis** comes in. It checks the program for *meaning* and ensures that the rules of the language are followed.

## Type Checking
The most critical task of the semantic analyzer is **Type Checking**. 
- **Static Typing**: Languages like Java, C++, and Rust perform type checking during compilation. The compiler proves that no type errors will occur at runtime.
- **Dynamic Typing**: Languages like Python and JavaScript defer type checking until the code is actually running.

The compiler traverses the Abstract Syntax Tree and verifies that operands are compatible with their operators. If you try to multiply a boolean by an array, the semantic analyzer throws a compiler error.

## The Symbol Table
To perform semantic analysis, the compiler maintains a crucial data structure called the **Symbol Table**. 
The Symbol Table tracks every variable, function, and class declared in the program. It stores critical metadata, such as:
- The identifier's name.
- Its data type (e.g., integer, float, custom class).
- Its scope (global, local to a function, inside a specific loop block).
- Its memory location (calculated later).

When the semantic analyzer encounters a variable usage (e.g., `x = 5`), it looks up `x` in the Symbol Table to ensure it was declared, is in scope, and is of a compatible type.

---

**Quiz: What is the primary purpose of the Symbol Table?**
- [ ] To convert code to binary.
- [ ] To check for missing semicolons.
- [x] To track metadata (like type and scope) for every identifier used in the program.
- [ ] To optimize mathematical equations.

**Quiz: Checking if a string is being incorrectly assigned to an integer variable happens during which phase?**
- [ ] Lexical Analysis
- [ ] Syntax Analysis
- [x] Semantic Analysis
- [ ] Code Generation
