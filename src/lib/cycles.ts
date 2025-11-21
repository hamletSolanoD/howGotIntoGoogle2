export const THEMES = [
  "Arrays, Two Pointers, Sliding Window",
  "HashMaps, Sets, Linked Lists",
  "Binary Search, Intervals",
  "Trees DFS/BFS",
  "Graphs + Heaps",
  "Backtracking + Greedy",
  "DP (1D)",
  "Arrays Avanzado",
  "HashMaps + Tries",
  "Binary Search Avanzado",
  "Binary Trees + BST",
  "Graphs + Dijkstra",
  "Backtracking Avanzado",
  "DP (2D)"
];

export const THEME_DETAILS: Record<string, { 
  description: string; 
  keyProblems: string[];
  difficulty: string;
}> = {
  "Arrays, Two Pointers, Sliding Window": {
    description: "Fundamentos de manipulación de arrays, técnicas de dos punteros para optimización y ventanas deslizantes para subarrays.",
    keyProblems: [
      "Two Sum",
      "Container With Most Water",
      "Longest Substring Without Repeating Characters",
      "Trapping Rain Water"
    ],
    difficulty: "Easy → Medium"
  },
  "HashMaps, Sets, Linked Lists": {
    description: "Estructuras de datos fundamentales para búsqueda O(1) y manipulación de listas enlazadas.",
    keyProblems: [
      "Reverse Linked List",
      "Linked List Cycle",
      "Group Anagrams",
      "LRU Cache"
    ],
    difficulty: "Easy → Hard"
  },
  "Binary Search, Intervals": {
    description: "Búsqueda binaria en arrays ordenados y manipulación de intervalos.",
    keyProblems: [
      "Binary Search",
      "Search in Rotated Sorted Array",
      "Merge Intervals",
      "Insert Interval"
    ],
    difficulty: "Medium"
  },
  "Trees DFS/BFS": {
    description: "Recorridos de árboles en profundidad y amplitud, manipulación de estructuras arbóreas.",
    keyProblems: [
      "Invert Binary Tree",
      "Maximum Depth of Binary Tree",
      "Binary Tree Level Order Traversal",
      "Serialize and Deserialize Binary Tree"
    ],
    difficulty: "Easy → Hard"
  },
  "Graphs + Heaps": {
    description: "Algoritmos de grafos (DFS/BFS) y colas de prioridad con heaps.",
    keyProblems: [
      "Number of Islands",
      "Clone Graph",
      "Kth Largest Element",
      "Top K Frequent Elements"
    ],
    difficulty: "Medium → Hard"
  },
  "Backtracking + Greedy": {
    description: "Algoritmos de retroceso para exploración exhaustiva y estrategias greedy para optimización.",
    keyProblems: [
      "Permutations",
      "Combination Sum",
      "Word Search",
      "Jump Game"
    ],
    difficulty: "Medium → Hard"
  },
  "DP (1D)": {
    description: "Programación dinámica unidimensional para problemas de optimización.",
    keyProblems: [
      "Climbing Stairs",
      "House Robber",
      "Coin Change",
      "Longest Increasing Subsequence"
    ],
    difficulty: "Medium"
  },
  "Arrays Avanzado": {
    description: "Técnicas avanzadas de arrays: prefix sums, kadane, sliding window complejo.",
    keyProblems: [
      "Maximum Subarray",
      "Product of Array Except Self",
      "3Sum",
      "Subarray Sum Equals K"
    ],
    difficulty: "Medium → Hard"
  },
  "HashMaps + Tries": {
    description: "Estructuras de datos avanzadas para strings y búsquedas eficientes.",
    keyProblems: [
      "Implement Trie",
      "Word Search II",
      "Design Add and Search Words Data Structure",
      "Longest Common Prefix"
    ],
    difficulty: "Medium → Hard"
  },
  "Binary Search Avanzado": {
    description: "Búsqueda binaria en espacios de soluciones y arrays especiales.",
    keyProblems: [
      "Find Minimum in Rotated Sorted Array",
      "Search a 2D Matrix",
      "Koko Eating Bananas",
      "Median of Two Sorted Arrays"
    ],
    difficulty: "Medium → Hard"
  },
  "Binary Trees + BST": {
    description: "Árboles binarios de búsqueda y sus propiedades especiales.",
    keyProblems: [
      "Validate Binary Search Tree",
      "Kth Smallest Element in BST",
      "Lowest Common Ancestor",
      "Construct Binary Tree from Preorder and Inorder"
    ],
    difficulty: "Medium → Hard"
  },
  "Graphs + Dijkstra": {
    description: "Algoritmos de caminos más cortos y grafos ponderados.",
    keyProblems: [
      "Network Delay Time",
      "Cheapest Flights Within K Stops",
      "Course Schedule",
      "Word Ladder"
    ],
    difficulty: "Medium → Hard"
  },
  "Backtracking Avanzado": {
    description: "Problemas complejos de backtracking: N-Queens, Sudoku, particionamiento.",
    keyProblems: [
      "N-Queens",
      "Sudoku Solver",
      "Palindrome Partitioning",
      "Letter Combinations of Phone Number"
    ],
    difficulty: "Hard"
  },
  "DP (2D)": {
    description: "Programación dinámica bidimensional: grids, subsecuencias, knapsack.",
    keyProblems: [
      "Unique Paths",
      "Longest Common Subsequence",
      "Edit Distance",
      "Regular Expression Matching"
    ],
    difficulty: "Medium → Hard"
  }
};

export const DAYS_ES = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
export const DAYS_FULL_ES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
export const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function getThemeForDate(date: string | Date): string {
  const start = new Date("2024-11-20");
  const current = typeof date === 'string' ? new Date(date) : date;
  const diffDays = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return THEMES[diffDays % 14];
}

export function getCycleDay(date: string | Date): number {
  const start = new Date("2024-11-20");
  const current = typeof date === 'string' ? new Date(date) : date;
  const diffDays = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return (diffDays % 14) + 1;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getWeekDates(referenceDate: Date = new Date()): Date[] {
  const dayOfWeek = referenceDate.getDay();
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
}

export function getMonthDates(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const dates: Date[] = [];
  
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  
  return dates;
}