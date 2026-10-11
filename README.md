# Task: Student Grade Report Calculator

## Description

In this exercise, you will write small, reusable functions that calculate totals and averages, convert an average into a letter grade, and build a formatted report for each student. The focus is on **`for` loops, functions, and reusing functions inside other functions**.

## Rules

- Use **function declarations** (`function name() {}`), not arrow functions.
- Use standard **`for` loops only** (no `.map()`, `.filter()`, `.forEach()` or `.reduce()`).
- Each function must do **one job only**.
- Do not copy and paste logic. If a function already does the job, **call it**.
- Write all code, variable names and comments in English.

## Instructions & Step-by-Step Guidance

### 1. Starter Data
Copy this array into your script:

```javascript
const students = [
  { name: "Amara", scores: [78, 85, 92, 66] },
  { name: "Daniel", scores: [55, 61, 48, 70] },
  { name: "Sofia", scores: [95, 88, 91, 97] }
];
```

### 2. Function 1: `calculateTotal(scores)`
- Write a function named `calculateTotal` that accepts one parameter: an array of numbers.
- Inside the function, use a `for` loop to add up every number in the array.
- **Return** the total.

### 3. Function 2: `calculateAverage(scores)`
- Write a function named `calculateAverage` that accepts an array of numbers.
- **Call `calculateTotal(scores)`** to get the total. Do not write a second loop.
- Divide the total by the number of scores (`scores.length`) and return the result.
- Edge case: if the array is empty, return `0` (this avoids dividing by zero).

### 4. Function 3: `getGrade(average)`
- Write a function named `getGrade` that accepts a number (the average).
- Return a letter grade as a string:

| Average | Grade |
|---|---|
| 70 or more | "A" |
| 60 to 69 | "B" |
| 50 to 59 | "C" |
| 40 to 49 | "D" |
| Below 40 | "F" |

- Tip: check from the highest grade down. A score of 75 passes `>= 70`, so you never need to check an upper limit.

### 5. Function 4: `findHighestScore(scores)`
- Write a function named `findHighestScore` that accepts an array of numbers.
- Create a variable called `highest` and start it as `scores[0]`.
- Use a `for` loop to go through the array. If a score is bigger than `highest`, replace `highest` with it.
- **Return** `highest`.

### 6. Function 5: `generateReport(student)`
- Write a function named `generateReport` that accepts **one student object** (for example `{ name: "Amara", scores: [...] }`).
- Inside this function:
  - call `calculateAverage(student.scores)` and store the result
  - call `getGrade(...)` using that average
  - call `findHighestScore(student.scores)`
  - format the average to 2 decimal places using `.toFixed(2)`
- **Return** a Template Literal string in this format:

```
"[name]: Average [average] (Grade [grade]), Highest score [highest]"
```

### 7. Execution & Testing
- Use a `for` loop to go through the `students` array. On each loop, call `generateReport(...)` for that student inside a `console.log()`.
- Also test the edge case by logging `calculateAverage([])`.

## Expected Output

```
Amara: Average 80.25 (Grade A), Highest score 92
Daniel: Average 58.50 (Grade C), Highest score 70
Sofia: Average 92.75 (Grade A), Highest score 97
0
```

## Checklist

- [ ] There is only one place in the code that adds up scores (`calculateTotal`)
- [ ] `calculateAverage` calls `calculateTotal` instead of repeating the loop
- [ ] `generateReport` calls three other functions
- [ ] All functions use `return` (none of them use `console.log` inside)
- [ ] The output matches the example exactly, including the `.50` on Daniel's average
- [ ] No arrow functions, `.map()`, `.filter()`, `.forEach()` or `.reduce()`

## Key Concepts to Practice

- **`for` loops:** summing values and tracking the biggest value.
- **Parameters & arguments:** passing data into functions cleanly.
- **Return values:** sending a result out of a function so another function can use it.
- **Function reuse and composition:** `calculateAverage` uses `calculateTotal`, and `generateReport` uses everything.
- **Clean code:** each function does one job.

## Stretch Goals

- Write `findLowestScore(scores)` and add "Lowest score" to the report.
- Write `countPassingScores(scores)` that returns how many scores are 40 or more, and add it to the report.
- Write `findBestStudent(students)` that loops through the array, reuses `calculateAverage`, and returns the name of the student with the highest average.
