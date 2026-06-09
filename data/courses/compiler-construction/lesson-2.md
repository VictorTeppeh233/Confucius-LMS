# Lesson 2: Lexical Analysis

## The Role of the Lexical Analyzer
The **Lexical Analyzer** (also known as a Scanner or Lexer) is the first phase of the compiler. Its primary job is to read the raw source code character by character and group those characters into meaningful sequences called **lexemes**. 

For every valid lexeme, the lexical analyzer produces a **token** to pass along to the next phase (Syntax Analysis).

### Tokens, Patterns, and Lexemes
To understand lexical analysis, you must distinguish between three terms:
1. **Token**: An abstract classification representing a specific concept in the language (e.g., `IDENTIFIER`, `NUMBER`, `KEYWORD_IF`).
2. **Lexeme**: The actual sequence of characters in the source code that matches the pattern for a token (e.g., `count`, `42`, `if`).
3. **Pattern**: The formal rule that defines what sequences of characters form a specific token (often defined using Regular Expressions).

### Regular Expressions and Finite Automata
Lexical analyzers rely heavily on formal language theory. Patterns for tokens are mathematically defined using **Regular Expressions (Regex)**. 

To implement a lexer efficiently, these regular expressions are converted into **Deterministic Finite Automata (DFA)**. A DFA is a state machine that reads input characters and transitions between states. When it reaches an "accepting state", it knows a valid token has been formed. Tools like `Lex` or `Flex` can automatically generate high-speed C/C++ lexers purely from regular expression rules!

---

**Quiz: What is the mathematical foundation used to define the patterns for tokens in Lexical Analysis?**
- [ ] Context-Free Grammars
- [ ] Turing Machines
- [x] Regular Expressions
- [ ] Binary Search Trees

**Quiz: What is the difference between a lexeme and a token?**
- [ ] A lexeme is an error, a token is valid code.
- [x] A lexeme is the actual character string in the code, while a token is the abstract category it belongs to.
- [ ] They are the exact same thing.
- [ ] A token is produced by the parser, while a lexeme is produced by the lexer.
