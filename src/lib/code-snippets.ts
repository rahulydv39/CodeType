export type Chapter = {
  title: string;
  code: string | null;
};

export type Language = {
  name: string;
  chapters: Chapter[];
};

export const codeSnippets: Record<string, Language> = {
  typing: {
    name: "Typing Skills",
    chapters: [
      {
        title: "Easy: The Quick Brown Fox",
        code: `the quick brown fox jumps over the lazy dog`,
      },
      {
        title: "Moderate: Pangrams",
        code: `Sphinx of black quartz, judge my vow. The five boxing wizards jump quickly. Pack my box with five dozen liquor jugs.`,
      },
      {
        title: "Hard: Special Characters",
        code: `~ \` ! @ # $ % ^ & * ( ) _ - + = { } [ ] | \\ : ; " ' < > , . ? /`,
      },
    ],
  },
  javascript: {
    name: "JavaScript",
    chapters: Array.from({ length: 30 }, (_, i) => {
      const chapterNum = i + 1;
      if (chapterNum === 1) return { title: "Chapter 1: Variables", code: `const name = "CodeType";\nlet version = 1.0;\nvar isAwesome = true;\n\nfunction greet(user) {\n  console.log("Hello, " + user);\n}\n\ngreet(name);` };
      if (chapterNum === 2) return { title: "Chapter 2: Functions", code: `function add(a, b) {\n  return a + b;\n}\n\nconst multiply = (x, y) => {\n  return x * y;\n};\n\nconst result = add(5, 10);\nconsole.log(multiply(result, 2));` };
      if (chapterNum === 3) return { title: "Chapter 3: Arrays", code: `const numbers = [1, 2, 3, 4, 5];\nconst squares = numbers.map(n => n * n);\n\nconst evenSquares = squares.filter(sq => {\n  return sq % 2 === 0;\n});\n\nconsole.log(evenSquares);` };
      return { title: `Chapter ${chapterNum}: Content`, code: `// Chapter ${chapterNum} code for JavaScript` };
    }),
  },
  python: {
    name: "Python",
    chapters: Array.from({ length: 30 }, (_, i) => {
      const chapterNum = i + 1;
      if (chapterNum === 1) return { title: "Chapter 1: Hello World", code: `def main():\n    name = "Python"\n    print(f"Hello, {name}!")\n\nif __name__ == "__main__":\n    main()` };
      if (chapterNum === 2) return { title: "Chapter 2: Lists", code: `numbers = [1, 2, 3, 4, 5]\nsquared = [num**2 for num in numbers]\n\nfor s in squared:\n    if s > 10:\n        print(s)` };
      if (chapterNum === 3) return { title: "Chapter 3: Dictionaries", code: `user = {\n    "name": "Alice",\n    "age": 25,\n    "is_active": True\n}\n\nprint(f"{user['name']} is {user['age']} years old.")` };
      return { title: `Chapter ${chapterNum}: Content`, code: `# Chapter ${chapterNum} code for Python` };
    }),
  },
  html: {
    name: "HTML",
    chapters: Array.from({ length: 30 }, (_, i) => {
      const chapterNum = i + 1;
      if (chapterNum === 1) return { title: "Chapter 1: Basic Structure", code: `<!DOCTYPE html>\n<html>\n<head>\n  <title>My First Page</title>\n</head>\n<body>\n  <h1>Welcome</h1>\n  <p>This is a paragraph.</p>\n</body>\n</html>` };
      if (chapterNum === 2) return { title: "Chapter 2: Forms", code: `<form action="/submit" method="post">\n  <label for="username">Username:</label>\n  <input type="text" id="username" name="username">\n  \n  <button type="submit">Submit</button>\n</form>` };
      if (chapterNum === 3) return { title: "Chapter 3: Tables", code: `<table>\n  <tr>\n    <th>Firstname</th>\n    <th>Lastname</th>\n  </tr>\n  <tr>\n    <td>Peter</td>\n    <td>Griffin</td>\n  </tr>\n</table>` };
      return { title: `Chapter ${chapterNum}: Content`, code: `<!-- Chapter ${chapterNum} code for HTML -->` };
    }),
  },
  cpp: {
    name: "C++",
    chapters: Array.from({ length: 30 }, (_, i) => {
      const chapterNum = i + 1;
      if (chapterNum === 1) return { title: "Chapter 1: Basic I/O", code: `#include <iostream>\n#include <string>\n\nint main() {\n    std::string name;\n    std::cout << "Enter your name: ";\n    std::cin >> name;\n    std::cout << "Hello, " << name << "!" << std::endl;\n    return 0;\n}` };
      if (chapterNum === 2) return { title: "Chapter 2: Vectors", code: `#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> numbers = {1, 2, 3, 4, 5};\n    for (int num : numbers) {\n        std::cout << num << " ";\n    }\n    std::cout << std::endl;\n    return 0;\n}` };
      if (chapterNum === 3) return { title: "Chapter 3: Functions", code: `#include <iostream>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    int result = add(10, 20);\n    std::cout << "The sum is: " << result << std::endl;\n    return 0;\n}` };
      return { title: `Chapter ${chapterNum}: Content`, code: `// Chapter ${chapterNum} code for C++` };
    }),
  },
  typescript: {
    name: "TypeScript",
    chapters: Array.from({ length: 30 }, (_, i) => {
      const chapterNum = i + 1;
      return { title: `Chapter ${chapterNum}: Content`, code: `// Chapter ${chapterNum} code for TypeScript` };
    }),
  },
  c: {
    name: "C",
    chapters: Array.from({ length: 30 }, (_, i) => {
      const chapterNum = i + 1;
      return { title: `Chapter ${chapterNum}: Content`, code: `// Chapter ${chapterNum} code for C` };
    }),
  },
};
