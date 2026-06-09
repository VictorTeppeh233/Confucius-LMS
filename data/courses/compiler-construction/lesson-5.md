# Lesson 5: Intermediate Code & Optimization

## Intermediate Representation (IR)
Once the compiler has verified that the source code is syntactically and semantically correct, it generates an **Intermediate Representation (IR)**. 

Why not generate assembly code right away? 
IR acts as a universal bridge. If you have a compiler that supports 3 languages (C, C++, Rust) and 3 architectures (x86, ARM, RISC-V), without IR, you would need to write 9 different compilers! With a shared IR, you just need 3 front-ends to generate the IR, and 3 back-ends to translate the IR into machine code. (This is exactly how LLVM works).

### Three-Address Code (TAC)
A very common form of IR is **Three-Address Code**. It breaks complex expressions down into simple, assembly-like instructions that have at most three operands.
Example: `x = a + b * c` becomes:
```text
t1 = b * c
x = a + t1
```

## Middle-End Optimization
The optimizer takes the IR and transforms it to make the program run faster or use less memory. These transformations are "machine-independent", meaning they improve the logic of the code regardless of what CPU it will eventually run on.

Common optimizations include:
- **Constant Folding**: Evaluating constant expressions at compile-time (e.g., replacing `x = 3 * 4` with `x = 12`).
- **Dead Code Elimination**: Removing code that is unreachable or computes a value that is never used.
- **Loop Unrolling**: Expanding loops to reduce the overhead of jump instructions.

---

**Quiz: What is the primary architectural benefit of using an Intermediate Representation (IR)?**
- [ ] It is faster for the programmer to write.
- [x] It separates the front-end from the back-end, allowing compilers to easily support multiple languages and architectures.
- [ ] It prevents viruses from running in the code.
- [ ] It automatically fixes logical bugs in the source code.

**Quiz: Replacing `y = 5 + 10` with `y = 15` during compilation is an example of what optimization technique?**
- [x] Constant Folding
- [ ] Loop Unrolling
- [ ] Dead Code Elimination
- [ ] Lexical Scanning
