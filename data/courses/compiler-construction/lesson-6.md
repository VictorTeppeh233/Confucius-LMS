# Lesson 6: Target Code Generation

## The Final Translation
The **Target Code Generation** phase (the Back-End) takes the highly optimized Intermediate Representation and translates it into the specific instructions of the target hardware (like x86-64 assembly or ARM64 assembly).

This phase is heavily tied to the physical architecture of the CPU. The compiler must understand the CPU's instruction set, memory architecture, and register layout.

## Register Allocation
One of the most complex and important problems in code generation is **Register Allocation**. 

Modern CPUs have a very limited number of high-speed memory slots called **registers** (often just 16 or 32 registers). Data in registers can be processed almost instantly, whereas fetching data from standard RAM is extremely slow. 

The IR often assumes there are an infinite number of virtual registers (like `t1, t2, ..., t100`). The Code Generator must map these infinite virtual registers to the limited physical registers. If there aren't enough physical registers, the compiler must "spill" variables to main memory, which creates a massive performance hit.

Compilers often solve the Register Allocation problem by translating it into a mathematical **Graph Coloring Problem**, treating variables as nodes and drawing edges between variables that are active at the same time.

## Peephole Optimization
Even after assembly code is generated, the compiler performs a final pass called **Peephole Optimization**. It looks at a tiny "peephole" of 2 or 3 assembly instructions at a time to find obvious inefficiencies.
For example, if it sees:
```assembly
MOV R1, R2
MOV R2, R1
```
It realizes the second instruction is redundant and deletes it.

---

**Quiz: What is the purpose of Register Allocation in the Code Generation phase?**
- [ ] To register the software with the operating system.
- [ ] To assign a variable a specific data type.
- [x] To efficiently map infinite virtual IR variables into the very limited number of physical CPU registers.
- [ ] To organize files in the computer's memory.

**Quiz: What mathematical concept is frequently used by modern compilers to solve the Register Allocation problem optimally?**
- [ ] Cryptography
- [ ] Binary Search
- [x] Graph Coloring
- [ ] Calculus
