# Lesson 1: Introduction to Compilers

## What is a Compiler?
At its core, a **compiler** is a complex software system that translates a program written in a high-level, human-readable programming language (the source language) into an equivalent program in a lower-level language (the target language), which is typically machine code or assembly.

Unlike an interpreter, which executes source code line-by-line in real-time, a compiler translates the entire program before any execution begins. This separation of translation and execution leads to highly optimized, performant executables (like `.exe` or ELF binaries).

## The Front-End and Back-End Model
Modern compilers (such as LLVM or GCC) are conceptually divided into three distinct parts:
1. **The Front-End**: Understands the source code. It validates syntax and semantics, ensuring the code follows the rules of the programming language. It produces an Intermediate Representation (IR).
2. **The Optimizer (Middle-End)**: Performs transformations on the IR to improve execution speed or reduce memory footprint without altering the program's observable behavior.
3. **The Back-End**: Maps the optimized IR to the specific instruction set of the target hardware architecture (e.g., x86, ARM, RISC-V).

## The Phases of Compilation
The translation process is broken down into a pipeline of strictly defined phases:
- **Lexical Analysis (Scanner)**: Chunks characters into tokens.
- **Syntax Analysis (Parser)**: Builds a syntax tree defining grammatical structure.
- **Semantic Analysis**: Enforces meaning (e.g., type checking).
- **Intermediate Code Generation**: Produces a machine-agnostic representation.
- **Code Optimization**: Speeds up the intermediate code.
- **Target Code Generation**: Outputs actual assembly or machine code.

---

**Quiz: What is the primary difference between a compiler and an interpreter?**
- [ ] A compiler executes code line-by-line, while an interpreter translates the whole program first.
- [x] A compiler translates the entire program before execution, while an interpreter executes code line-by-line.
- [ ] Compilers are only used for hardware, while interpreters are used for software.
- [ ] There is no difference; they are synonyms for the same process.

**Quiz: Which major compiler component is responsible for analyzing the source language (syntax and semantics)?**
- [ ] The Back-End
- [ ] The Optimizer
- [x] The Front-End
- [ ] The Linker
