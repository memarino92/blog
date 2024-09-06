---
title: 'Functions as Component Parameters in Blazor'
description: 'How to make your components more reusuable by accepting functions as parameters'
publishDate: 'Sept 5 2024'
---

As I've been building out a component library at work, one of the trickier tasks is making components as reuable as possible so that they have utility not just in the current project but across all of the business domains that the component could be used in. This means that it can't be tightly coupled to one type, as these types are often tied to the project and not reusable.

To make the component generic, we start with the `@typeparam` directive, defining a symbol for our generic type. Here, we'll call it `TItem`.

In order to help genericize the component, we can use a form of dependency injection, where the caller has control over how the component operates by passing in a function.

`ExampleComponent.razor`:

```razor
@typeparam TItem

<p>@DisplayFunc(Thing)</p>

@code {
    [Parameter]
    public Func<TItem, string> DisplayFunc { get; set; }

    [Parameter]
    public TItem Thing { get; set; }
}
```

This component can now accept any number of types, and the caller can control which field gets displayed. The support for anonymous functions, or lambdas, helps streamline the calling code and prevents us from having to create another method, cluttering up the calling component or page.

This example is simple, but the application of this technique can be leveraged into complex use cases. Let's see an example of the same component accepting different types, and the caller controlling how the component displays it.

`ExamplePage.razor`:

```razor
@page "/"

<ExampleComponent Thing=@ThingOne DisplayFunc=@((x) => x.FieldOne ) />
<ExampleComponent Thing=@ThingTwo DisplayFunc=@((x) => $"{x.FirstName} {x.LastName}" ) />

@code {
    public ExampleClass ThingOne = new ExampleClass { FieldOne = "One", FieldTwo = "Two" };
    public ExamplePerson ThingTwo = new ExamplePerson { FirstName = "Michael", LastName = "Marino" };
    public class ExampleClass
    {
        public string FieldOne { get; set; }
        public string FieldTwo { get; set; }
    }
    public class ExamplePerson
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
```

A working example of the above code can be found [on Github here](https://github.com/memarino92/func-param).
