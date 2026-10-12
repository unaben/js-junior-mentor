# Task: Online Store Order Calculator

## Description

In this exercise, you will build a small set of functions that price an online order. You'll calculate line totals, subtotals, discounts, shipping and VAT, then combine them into an invoice line for each customer. The focus is on `for` loops, nested data, functions that call other functions, and functions that return objects.

## Rules

- Use function declarations (`function name() {}`), not arrow functions.
- Use standard `for` loops only (no `.map()`, `.filter()`, `.forEach()` or `.reduce()`).
- Each function must do one job only.
- Do not copy and paste logic. If a function already does the job, call it.
- No function may use `console.log` inside it. Only the testing code at the bottom may log.
- `Math.round()` and `.toFixed()` are allowed.
- Write all code, variable names and comments in English.

## Instructions & Step-by-Step Guidance

### 1. Starter Data

Copy this array into your script:

```javascript
const orders = [
  {
    customer: "Amara",
    items: [
      { name: "Keyboard", price: 45.5, quantity: 1 },
      { name: "Mouse", price: 19.99, quantity: 2 }
    ]
  },
  {
    customer: "Daniel",
    items: [
      { name: "Monitor", price: 189.99, quantity: 1 },
      { name: "HDMI Cable", price: 7.5, quantity: 3 },
      { name: "Desk Mat", price: 14, quantity: 1 }
    ]
  },
  { customer: "Sofia", items: [] },
  {
    customer: "Kelechi",
    items: [
      { name: "Laptop Stand", price: 32, quantity: 2 },
      { name: "USB Hub", price: 24.99, quantity: 4 }
    ]
  }
];
```

### 2. Function 1: `calculateLineTotal(item)`

- Accepts one item object, for example `{ name: "Mouse", price: 19.99, quantity: 2 }`.
- Returns `price * quantity`.

### 3. Function 2: `calculateSubtotal(items)`

- Accepts an array of item objects.
- Use a `for` loop and call `calculateLineTotal(...)` on each item. Do not multiply price and quantity here.
- Returns the sum. An empty array returns `0`.

### 4. Function 3: `countItems(items)`

- Accepts an array of item objects.
- Returns the total quantity across all items (not the number of different products).
- Example: 1 keyboard + 2 mice = `3`.

### 5. Function 4: `getDiscountRate(subtotal)`

Accepts a number and returns the discount rate as a decimal:

| Subtotal      | Rate   |
| ------------- | ------ |
| 200 or more   | `0.15` |
| 100 to 199.99 | `0.10` |
| 50 to 99.99   | `0.05` |
| Below 50      | `0`    |

Tip: check from the highest tier down, as in the grade calculator.

### 6. Function 5: `roundToTwoDecimals(value)`

- Accepts a number and returns it rounded to 2 decimal places **as a number** (not a string).
- Hint: `Math.round(value * 100) / 100`.
- This function exists so that money values always add up to the penny.

### 7. Function 6: `calculateShipping(amountAfterDiscount)`

- If the amount is `0`, shipping is `0` (nothing to ship).
- If the amount is `100` or more, shipping is free (`0`).
- Otherwise, shipping is `4.99`.

### 8. Function 7: `findTopItem(items)`

- Accepts an array of item objects.
- Returns the **name** of the item with the highest line total (price × quantity). Reuse `calculateLineTotal`.
- If the array is empty, return the string `"None"`.
- Tip: track both the best name and the best line total as you loop.

### 9. Function 8: `calculateOrderBreakdown(order)`

Accepts one order object and returns an **object** with these five properties, each rounded with `roundToTwoDecimals`:

- `subtotal`: from `calculateSubtotal`
- `discount`: subtotal × `getDiscountRate(subtotal)`
- `vat`: 20% of the amount after discount (subtotal minus discount)
- `shipping`: from `calculateShipping`, using the amount after discount
- `total`: amount after discount + vat + shipping

Round each step before using it in the next one. This is what keeps the printed numbers adding up.

### 10. Function 9: `generateInvoice(order)`

- Call `calculateOrderBreakdown`, `countItems` and `findTopItem`.
- Return a template literal in exactly this format, using `.toFixed(2)` for every money value:

```
[customer]: [count] items | Subtotal £[subtotal] | Discount -£[discount] | VAT £[vat] | Shipping £[shipping] | Total £[total] | Top item: [name]
```

### 11. Execution & Testing

1. Use a `for` loop over `orders` and log `generateInvoice(...)` for each one.
2. Test the discount boundaries by logging `getDiscountRate(49.99)`, `getDiscountRate(50)`, `getDiscountRate(100)` and `getDiscountRate(200)`.
3. Test the edge case by logging `findTopItem([])`.

## Expected Output

```
Amara: 3 items | Subtotal £85.48 | Discount -£4.27 | VAT £16.24 | Shipping £4.99 | Total £102.44 | Top item: Keyboard
Daniel: 5 items | Subtotal £226.49 | Discount -£33.97 | VAT £38.50 | Shipping £0.00 | Total £231.02 | Top item: Monitor
Sofia: 0 items | Subtotal £0.00 | Discount -£0.00 | VAT £0.00 | Shipping £0.00 | Total £0.00 | Top item: None
Kelechi: 6 items | Subtotal £163.96 | Discount -£16.40 | VAT £29.51 | Shipping £0.00 | Total £177.07 | Top item: USB Hub
0
0.05
0.1
0.15
None
```

## Checklist

- [ ] Price × quantity is calculated in only one place (`calculateLineTotal`)
- [ ] `calculateSubtotal` calls `calculateLineTotal` instead of repeating the maths
- [ ] `findTopItem` reuses `calculateLineTotal`
- [ ] `calculateOrderBreakdown` returns an object, not a string
- [ ] `generateInvoice` calls three other functions and does no calculations of its own
- [ ] No function (except the test code) uses `console.log`
- [ ] Every money value on the invoice has exactly 2 decimal places, including `Shipping £0.00`
- [ ] Sofia's empty order works without errors or `NaN`
- [ ] No arrow functions, `.map()`, `.filter()`, `.forEach()` or `.reduce()`
- [ ] The output matches the example exactly

## Key Concepts to Practice

- **Nested data:** looping over an array of objects that contain their own arrays.
- **Function composition:** small functions feeding larger ones several layers deep.
- **Returning objects:** sending several related values out of one function.
- **Boundary testing:** checking values right on the edge of each rule (49.99, 50, 100, 200).
- **Defensive code:** handling empty orders without crashing.
- **Floating-point money:** why `roundToTwoDecimals` exists, since `0.1 + 0.2` isn't exactly `0.3` in JavaScript.

## Stretch Goals

1. Write `calculateRevenue(orders)` that loops over all orders and returns the sum of every `total`. With the starter data it should be `510.53`.
2. Write `findBestCustomer(orders)` that returns the name of the customer with the highest `total`. With the starter data it should be `"Daniel"`.
3. Make `calculateLineTotal` defensive: if `quantity` is `0` or negative, or `price` is negative, return `0`. Then add a test item that proves it works.
