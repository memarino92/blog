---
title: The Monty Hall Problem
publishDate: Mar 23 2022
description: |
  Simulating the classic probability puzzle using python
---

# The Monty Hall Problem

Back in May 2020 I was working my way through the Computer Science Career Path on Codecademy. While watching an episode of Brooklyn 99 in which several characters fight over the correct answer to The Monty Hall Problem, I was reminded of my own former fascination with this puzzle. The answer is so unintuitive at first one refuses to believe it.

Well I set out to put my newfound skills to the test and simulate possible outcomes to prove the correct strategy. You can see the writeup that I did then, as well as the simulation code, [here on my GitHub.](https://github.com/memarino92/testing_monty_hall/blob/master/Proving%20the%20Monty%20Hall%20Problem%20Experimentally.ipynb)

I was pretty proud of that code then, and I'm still proud of it now. It was the first original programming challenge that I put myself to and it gave me the confidence to convince myself that I was actually making progress.

Imposter syndrome is rampant in software development and I think an import part of combatting it is taking an objective look back at how far you've come. Look at code you wrote months or years ago and you'll likely find things that jump out at you that are ripe for improvement. Those are the areas in which you've grown since you first wrote that code!

Anyway, I posted that python code on Reddit and got some feedback - drop the object-oriented crap and here's how you do it in 7 lines:

```py
>>> from random import randint
>>> guess = [ randint(0, 2) for _ in range(1000) ]
>>> sum(g == 2 for g in guess)
353

>>> open = [ (randint(0, 1) if g == 2 else 1 - g) for g in guess ]
>>> switch = [ 3 - g - o for g, o in zip(guess, open) ]
>>> sum(s == 2 for s in switch)
647

>>> all( (g != 2) == (s == 2) for g, s in zip(guess, switch) )
True
```

Thanks for the education [u/misho88](https://www.reddit.com/user/misho88)!
