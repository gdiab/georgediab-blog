---
title: "Mary Had a Little LAMBda"
description: "Lambda expressions are anonymous functions that can contain expressions and statements, usable for creating delegates or expression tree types."
pubDatetime: 2011-08-19T00:00:00-08:00
tags: ["csharp", "dotnet", "lambda", "code"]
draft: false
source: "https://georgediab.com/2011/08/19/mary-had-a-little-lambda/"
---

Lambda expressions are anonymous functions that can contain expressions and statements, usable for creating delegates or expression tree types. They employ the `=>` operator, read as "goes to," where the left side specifies input parameters and the right side contains the expression or statement block.

In simple terms, lambda expressions function as shorthand methods or functions.

## Example: Filtering Odd Numbers

Consider this code that selects all odd numbers from an array:

```csharp
int[] arrayNumbers = new[] { 103, 88, 13, 16, 166, 117, 999, 22, 4, 9, 1 };

foreach (int i in arrayNumbers.Where(x => (x % 2) > 0))
{
    //% = modulo or mod. % 2 returns 0 if even, 1 if odd.
    Console.WriteLine(i);
    //results: 103 13 117 999 9 1
}
```

The power lies in readability. There's no need to locate another method to understand variable transformations—everything appears inline for immediate comprehension.

## Reference

- [MSDN Lambda Expressions Documentation](http://msdn.microsoft.com/en-us/library/bb397687.aspx)
