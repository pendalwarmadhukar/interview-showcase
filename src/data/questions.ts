export interface Question {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  acceptance: number;
  solved: boolean;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  tags: string[];
}

export const questions: Question[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    acceptance: 49.2,
    solved: true,
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }
    ],
    tags: ["Array", "Hash Table"],
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Strings",
    acceptance: 40.5,
    solved: false,
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
    ],
    tags: ["String", "Stack"],
  },
  {
    id: 3,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked Lists",
    acceptance: 61.8,
    solved: true,
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }
    ],
    tags: ["Linked List", "Recursion"],
  },
  {
    id: 4,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Strings",
    acceptance: 33.8,
    solved: false,
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' }
    ],
    tags: ["Hash Table", "String", "Sliding Window"],
  },
  {
    id: 5,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    category: "Trees",
    acceptance: 63.2,
    solved: false,
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }
    ],
    tags: ["Tree", "BFS"],
  },
  {
    id: 6,
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Arrays",
    acceptance: 50.1,
    solved: true,
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." }
    ],
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
  },
  {
    id: 7,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Arrays",
    acceptance: 58.7,
    solved: false,
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }
    ],
    tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
  },
  {
    id: 8,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Arrays",
    acceptance: 36.1,
    solved: false,
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" }
    ],
    tags: ["Array", "Binary Search", "Divide and Conquer"],
  },
  {
    id: 9,
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked Lists",
    acceptance: 72.5,
    solved: true,
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }
    ],
    tags: ["Linked List", "Recursion"],
  },
  {
    id: 10,
    title: "Word Search II",
    difficulty: "Hard",
    category: "Graphs",
    acceptance: 29.4,
    solved: false,
    description: "Given an m x n board of characters and a list of strings words, return all words on the board.",
    examples: [
      { input: 'board = [["o","a","a","n"],["e","t","a","e"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]' }
    ],
    tags: ["Array", "String", "Backtracking", "Trie"],
  },
];

export const categories = ["All", "Arrays", "Strings", "Linked Lists", "Trees", "Graphs"];
