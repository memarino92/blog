---
title: 'Applying arbitrary attributes to Blazor components'
description: 'Using the CaptureUnmatchedValues property to apply attributes to your custom Blazor components'
publishDate: 'Aug 1 2024'
---

## Using the `CaptureUnmatchedValues` property to create more HTML-like components

This technique, which is taken for granted in other component paradigms, allows you to embrace how native HTML operates and exercise the ability to apply arbitrary attributes to your custom components.

### Setting the scene - a `<Button>` component

Let's say you're building out a component library and you want to create a `<Button>` component to keep styling consistent across the app.
I'll be using Tailwind because that's what I prefer, but the idea will be the same regardless of how you choose to author your CSS.

Starting from an empty .NET 8 Blazor app, I installed Tailwind by following the instructions on the [TailwindCSS Docs](https://tailwindcss.com/docs/installation).

First, our `<Button>` component - in a new file `Components\Button.razor`:

```razor
<button class="h-10 p-2 rounded border bg-cyan-500 text-white hover:bg-cyan-300 transition">
    @ChildContent
</button>

@code {
    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
```

And let's put it on an empty page:

```razor
<div class="flex flex-col gap-2 w-max p-5">

    <h1 class="text-2xl font-bold">Check out my button!</h1>

    <Button>Click me!</Button>

</div>
```

Great! Now we have our own custom-stlyed `<Button>` component. It doesn't do much though. Let's use it to increment a counter. Make sure to add a `@rendermode` directive at the top of the page to tell the framework that components on this page are interactive.

```razor
@page "/"
@rendermode InteractiveServer

<PageTitle>Home</PageTitle>

<div class="flex flex-col gap-2 w-max p-5">

    <h1 class="text-2xl font-bold">Check out my button!</h1>

    <Button @onclick=@(() => count++)>Click me!</Button>

    <p> The curent count is: @count</p>

</div>

@code {
    private int count = 0;
}
```

If you try to run the preceding code, you'll get an `InvalidOperationException` to the effect of `"Button' does not have a property matching the name 'onclick'"`. Why doesn't this work though? If we swapped out our capital "B" `<Button>` for a `<button>` this would work just fine.

Here one might start thinking about wrapping a div around the `Button` to place the event handler on, or passing a callback to the component and handle the `@onclick` directive inside the component. Does that mean we'd have to do that for any directive we wanted to apply? What if we wanted to use some business logic to disable the button - another parameter? Wouldn't it be nice if we could just handle all that at the call site like we could a regular `<button>`?

Well, allow me to introduce:

## The `CaptureUnmatchedValues` Property

By creating a `[Parameter]` with the `CaptureUnmatchedValues` property set to true, we can capture any arbitrary attribute applied to the component in a `Dictionary<string, object>`. Once we have those, we can apply them to the underlying `<button>` element with the `@attributes` directive, like so:

```razor
<button class="h-10 p-2 rounded border bg-cyan-500 text-white hover:bg-cyan-300 transition"
    @attributes=@CapturedAttributes>
    @ChildContent
</button>

@code {
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? CapturedAttributes { get; set; }
}
```

Head back to the browser and your `<Button>` and counter should be working! So what if we wanted to disable it? With a regular button, you just give it the `disabled` attribute. Well, now that we're applying our attribute dictionary to the underlying component, we can do the same thing here!

```razor
    <Button @onclick=IncrementCount disabled>Click me!</Button>
```

And it (doesn't) work(s)! Amazing. It still looks the same though - make sure to add some different styling for the disabled state:

```razor
<button class="h-10 p-2 rounded border bg-cyan-500 text-white hover:bg-cyan-300 transition disabled:bg-gray-300"
    @attributes=@CapturedAttributes>
    ...
```

We could even add a second `<Button>` to control whether the first one is disabled:

```razor
@page "/"
@rendermode InteractiveServer

<PageTitle>Home</PageTitle>

<div class="flex flex-col gap-2 w-max p-5">

    <h1 class="text-2xl font-bold">Check out my button!</h1>

    <Button @onclick=@(() => count++) disabled=@isDisabled>Click me!</Button>
    <Button @onclick=@(() => isDisabled = !isDisabled)>Disable button 1</Button>

    <p> The curent count is: @count</p>

</div>

@code {
    private int count = 0;
    private bool isDisabled = false;
}
```

And there you have it! This technique is hugely powerful, and very useful with all sort of input and action components. You do have to be mindful of where you're placing the attributes when passing to components with significant amounts of markup, but this technique can lead to a real reduction in complexity when applied properly.

You can find a working demo of the code shared in this article [on GitHub here](https://github.com/memarino92/blazor-captured-attributes).
