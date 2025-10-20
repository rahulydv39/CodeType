export type Chapter = {
  title: string;
  code: string | null;
};

export type Language = {
  name: string;
  chapters: Chapter[];
};

export const codeSnippets: Record<string, Language> = {
  javascript: {
    name: "JavaScript",
    chapters: [
      {
        title: "Chapter 1: Variables",
        code: `const name = "CodeType";
let version = 1.0;
var isAwesome = true;

function greet(user) {
  console.log("Hello, " + user);
}

greet(name);`,
      },
      {
        title: "Chapter 2: Functions",
        code: `function add(a, b) {
  return a + b;
}

const multiply = (x, y) => {
  return x * y;
};

const result = add(5, 10);
console.log(multiply(result, 2));`,
      },
      {
        title: "Chapter 3: Arrays",
        code: `const numbers = [1, 2, 3, 4, 5];
const squares = numbers.map(n => n * n);

const evenSquares = squares.filter(sq => {
  return sq % 2 === 0;
});

console.log(evenSquares);`,
      },
      ...Array.from({ length: 27 }, (_, i) => ({
        title: `Chapter ${i + 4}: Coming Soon`,
        code: null,
      })),
    ],
  },
  python: {
    name: "Python",
    chapters: [
      {
        title: "Chapter 1: Hello World",
        code: `def main():
    name = "Python"
    print(f"Hello, {name}!")

if __name__ == "__main__":
    main()`,
      },
      {
        title: "Chapter 2: Lists",
        code: `numbers = [1, 2, 3, 4, 5]
squared = [num**2 for num in numbers]

for s in squared:
    if s > 10:
        print(s)`,
      },
      {
        title: "Chapter 3: Dictionaries",
        code: `user = {
    "name": "Alice",
    "age": 25,
    "is_active": True
}

print(f"{user['name']} is {user['age']} years old.")`,
      },
       ...Array.from({ length: 27 }, (_, i) => ({
        title: `Chapter ${i + 4}: Coming Soon`,
        code: null,
      })),
    ],
  },
  html: {
    name: "HTML",
    chapters: [
      {
        title: "Chapter 1: Basic Structure",
        code: `<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>This is a paragraph.</p>
</body>
</html>`,
      },
      {
        title: "Chapter 2: Forms",
        code: `<form action="/submit" method="post">
  <label for="username">Username:</label>
  <input type="text" id="username" name="username">
  
  <button type="submit">Submit</button>
</form>`,
      },
      {
        title: "Chapter 3: Tables",
        code: `<table>
  <tr>
    <th>Firstname</th>
    <th>Lastname</th>
  </tr>
  <tr>
    <td>Peter</td>
    <td>Griffin</td>
  </tr>
</table>`,
      },
       ...Array.from({ length: 27 }, (_, i) => ({
        title: `Chapter ${i + 4}: Coming Soon`,
        code: null,
      })),
    ],
  },
  cpp: {
    name: "C++",
    chapters: [
      {
        title: "Chapter 1: Basic I/O",
        code: `#include <iostream>
#include <string>

int main() {
    std::string name;
    std::cout << "Enter your name: ";
    std::cin >> name;
    std::cout << "Hello, " << name << "!" << std::endl;
    return 0;
}`,
      },
      {
        title: "Chapter 2: Vectors",
        code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    return 0;
}`,
      },
      {
        title: "Chapter 3: Functions",
        code: `#include <iostream>

int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(10, 20);
    std::cout << "The sum is: " << result << std::endl;
    return 0;
}`,
      },
       ...Array.from({ length: 27 }, (_, i) => ({
        title: `Chapter ${i + 4}: Coming Soon`,
        code: null,
      })),
    ],
  },
};
