---
title: Caesar's Box
publishDate: Mar 26 2022
description: |
  Cracking ancient codes using modern tools

setup: |
  import EncoderComponent from './encoder-component.tsx';
---

# Caesar's Box

Published {new Date(frontmatter.publishDate).toLocaleDateString()}

## Learn To Program BASIC

In the distant past of 1998, a now basically-defunct but then relatively well-known game publisher called Interplay released an educational title called _Learn to Program BASIC_. Shortly thereafter, I picked up a copy at the Scholastic book fair and got my first taste of real programming. It was, in short, very 90s. I did learn quite a bit though, and the foundational programming concepts of BASIC that I learned stuck with me and definitely influenced my way of thinking as I grew older.

In the accompanying booklet, there were some practice problems for the player to solve after they'd finished the main game. One of them described the Caesar's Box code, an ancient method of cryptography supposedly invented by the big man J. Caesar himself. First, you write the message you wish to encode in a square grid, so `HELLO INTERNET` would look like:
| | | | |
|-|-|-|-|
|H|E|L|L|
|O| |I|N|
|T|E|R|N|
|E|T| | |

If the length message you wish to encode doesn't work out to be a perfect square (and it rarely does, because math and language just don't work that way) then you can either fill in the remaining spaces with dummy letters, or just leave them blank. Then, you just copy the message reading the columns top-to-bottom, instead of left-to-right like you filled them in. The resulting encoded message comes out looking like this:

`HOTEE ETLIR LNN `

One of the nice things about this is that the same method is used to encrypt and decrypt messages (a very basic form of _symmetric cryptography_). The challenge was to write a program that could be used to encode or decode messages in this manner.

This problem bounced around in my head for a looong, long time. Over the years, I taught some other friends the method of encoding messages by hand and would use it to pass notes and engage in other such mischief. Well, I'm happy to report, that roughly 20 years after this challenge was first presented to me I've finally cracked the case! I never did figure out how to do it in BASIC, but today I'd like to walk you through a solution I came up with as one of my first exercises in learning Typescript.

We'll write our encoder very much in the fashion that we would encode a message by hand. We'll do it all as one function, with a string - the original message - as the one input parameter, and the encoded message as the return value (also a string).

```ts
const encoder = (message: string): string => {
  // TODO
  return '';
};
```

Next, we'll need to figure out what size box, or grid, we need to make to contain our message. Too small, and we won't be able to fit the whole thing. If the length of our message is a perfect square, then we can take the square root of that as our side length. If not, we can still take the square root and just round up to the next integer.

```ts
const encoder = (message: string): string => {
  const gridSize = Math.ceil(Math.sqrt(message.length));

  return '';
};
```

Make sure that the length of our message will match up exactly once we place it in the grid by padding it with spaces until its length is a perfect square.

```ts
const encoder = (message: string): string => {
  const gridSize = Math.ceil(Math.sqrt(message.length));
  const paddedMessage = message.slice().padEnd(gridSize ** 2);

  return '';
};
```

Now, we'll need to actually grid-ify our message. We'll start with an empty array, and then add an empty array inside of it - that'll be our first row. Then we'll add each letter one by one to the inner array until the row is the right length for our grid, add a new empty array for our next row, and repeat until the grid is fully populated.

```ts
const encoder = (message: string): string => {
  const gridSize = Math.ceil(Math.sqrt(message.length));
  let paddedMessage = message.slice().padEnd(gridSize ** 2);
  let messageGrid: Array<string[]> = [];

  // Fill in our message grid
  for (let i = 0; i < gridSize; i++) {
    messageGrid[i] = [];
    while (messageGrid[i].length < gridSize) {
      messageGrid[i].push(paddedMessage[0]);
      paddedMessage = paddedMessage.slice(1);
    }
  }

  return '';
};
```

If we were to inspect our message grid with our test message, it would look like this:

```bash
[
  ['H', 'E', 'L', 'L'],
  ['O', ' ', 'I', 'N'],
  ['T', 'E', 'R', 'N'],
  ['E', 'T', ' ', ' '],
]
```

Excellent! Now all we need to do is flatten our grid by reading the columns, just like if we were doing it by hand. We'll do this using nested loops to track our indexes. This is a good opportunity to think about what we're naming our iterators - the typical `i` or `j` aren't quite as clear as they could be. Let's call them `rowIndex` and `columnIndex` to keep better track of what's what, and build our output string one character at a time.

```ts
const encoder = (message: string): string => {
  const gridSize = Math.ceil(Math.sqrt(message.length));
  let paddedMessage = message.slice().padEnd(gridSize ** 2);
  let messageGrid: Array<string[]> = [];

  // Fill in our message grid
  for (let i = 0; i < gridSize; i++) {
    messageGrid[i] = [];
    while (messageGrid[i].length < gridSize) {
      messageGrid[i].push(paddedMessage[0]);
      paddedMessage = paddedMessage.slice(1);
    }
  }

  // Flatten our message grid into the encoded message
  let outputString = '';
  for (let columnIndex = 0; columnIndex < gridSize; columnIndex++) {
    for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
      outputString += messageGrid[rowIndex][columnIndex];
    }
  }

  return outputString;
};
```

That's it, our encoder function is done! Play around with it using the input below, powered by the same function we just wrote. Try copying the scrambled message and pasting it back in the input to see the symmetric nature of our encoder at work.

---

<EncoderComponent client:visible />

---

Now you may be thinking that there wasn't a whole lot of Typescript-y stuff going on in our encoder, and you'd be right! A large part of the benefit of using Typescript is in the tooling - being able to know for certain what methods and properties are available on a given object at dev time is a huge boon to developer productivity, and it only takes a couple tweaks from standard Javascript to utilize. This is a great example of how you can start adopting Typescript slowly and incrementally in a project, just by changing the extention on a file and following the errors your editor or IDE presents you.

Of course, there's many other ways we could have accomplished this encoder. You could do it without ever building an actual message grid, and with lower time and space complexity. Improving on this method or devising new ones is left as an excercise for the reader. If you come up with a new way to accomplish this, I'd love to see it! You can find me on twitter at [@mmarino92](https://twitter.com/mmarino92).

To close us out, here's a compilation of the movies included at the start of each chapter of _Learn to Program BASIC_. You'll see what I mean about the 90s aspect of the game but it's a fun watch, and definitely had a lasting impression on me! Enjoy!

<iframe width="560" height="315" src="https://www.youtube.com/embed/uBYz9syhNAA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
