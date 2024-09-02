---
title: 'Building a dialog component in Blazor'
description: 'Building a dialog in Blazor using modern web APIs'
publishDate: 'Jul 14 2024'
---

## Dialogs and Modals in Blazor

For a long time, dialogs and modals have been mostly left to library authors to implement. There's a lot of great choices out there that are battle-tested, but with new APIs being added to the browser all the time, it's always good to take a step back and re-assess if that's really necessary.

Here's the thing: there's really not much to making a dialog these days! This article will walk you through making a simple dialog, and show you how to let the browser do all the heavy lifting.

## The `<dialog>` Element

Here's the straight dope from MDN on what the dialog element is and how to use it.

[MDN Explainer on `<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)

Somethings to note:

Unlike most elements, a `<dialog>` is not displayed by default. This makes it behave like you would expect it to if it were coming from a library - hidden by default, with methods to call to show and hide the dialog or modal. It also removes the necessity of changing styles at runtime; just style the element like you would any other with css, and let the browser take care of the showing/hiding.

Let's start with an empty Blazor webapp (.NET 8+)

```bash
mkdir blazor-dialog && cd $_
dotnet new blazor -e && dotnet new gitignore
dotnet watch
```

You should see a simple Hello World pop up in your browser. Nice!

I usually commit right after I run any kind of generator command. If you're following along, now's as good of a time as any.

```bash
git init && git add . && git commit "first commit"
```

## JavaScript API

We're going to need some JavaScript to implement this, so let's create a js file and import it in `App.razor`:

```bash
touch wwwroot/app.js
```

```html
<body>
  <Routes />
  <script src="_framework/blazor.web.js"></script>
  <script src="app.js"></script>
</body>
```

Wait a second - JavaScript? I thought the whole point of Blazor was so I could avoid the lawless land of js and stick to my nice, comfy, strongly typed C#. Alas, has you read through the MDN link at the top of this article, you might have noticed that dialogs have a JavaScript API to open and close them. It's just as well - all of our C# code, whether running server-side or as a wasm bundle on the client, has to go over a js bridge if it wants to manipulate the DOM.

The javascript is brief:

```js
var ModalFunctions = {};

ModalFunctions.showModal = (element) => element.showModal();
ModalFunctions.closeModal = (element) => element.close();
```

That's it? That's it!

_Note_: The use of `var` in the preceding example is not because I'm out of touch with how to write modern javascript. To call these functions, we need them added to the global `window` scope, something that [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) or [`const` explicitly do not.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) There's some other gymnastics that can be done to avoid using `var` if you really want to, because I'll admit, it does feel a little wrong in this day and age. However, simply using `var` is by far the easiest way to accomplish this. Most modern javascript is being Babel-ed down to pre-ES2015 JS anyway. Get over it (at me just as much as at all y'all).

Now, let's create our `Dialog` component.

## Creating a `<Dialog>` Blazor component

```bash
touch Components/Dialog.razor
```

And inside that:

```razor
@inject IJSRuntime JS

<dialog @ref=Element>
    @ChildContent
</dialog>

@code {
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    public ElementReference? Element { get; set; }

    public async Task ShowModal() => await JS.InvokeVoidAsync("AppFunctions.showModal", Element);
    public async Task CloseModal() => await JS.InvokeVoidAsync("AppFunctions.closeModal", Element);
}
```

Not a whole lot going on here, but let's break it down.

At the top of the file, we inject an instance of `IJSRuntime` so that we can use it later to call our JavaScript functions in `app.js` (remember that from like, two seconds ago?)

Below that is our actual Razor markup. We have the `<dialog>` element itself, on which we've placed an `@ref` attribute (is that what MS calls these?). The value of this is what we're referencing in the code as our property `Element` of type `ElementReference?` (nullable because it might not be set yet if we try and access it before render).

In-between the opening and closing `<dialog>` tags we place our `RenderFragment?` parameter named `ChildContent`. This allows us to use our capital-"D" `<Dialog>` element just like we would a regular `<dialog>`, with the content between the opening and closing tags.

Finally, we have our `ShowModal` and `CloseModal` methods. We make these public so we can call them from outside of the component.

## Usage

Now, let's open up our `Home.razor` page:

```razor
@page "/"

<PageTitle>Home</PageTitle>

<h1>Hello, world!</h1>

Welcome to your new app.
```

Underneath the provided Hello World, we'll put a button to open our modal, and inside the modal we'll put a button to close it.

```razor
<button>Open dialog</button>

<Dialog>
    <p>This is a dialog</p>
    <button>Close dialog</button>
</Dialog>
```

Then, we add our event handlers. To call the `ShowModal` and `CloseModal` methods on our `<Dialog>` component, we'll need to use an `@ref` attribute just like we did for the `ElementReference`, but this time it'll have a reference to the `Dialog` instance itself.

```razor
<button @onclick=OpenModal>Open dialog</button>

<Dialog @ref=Dialog>
    <p>This is a dialog</p>
    <button @onclick=CloseModal>Close dialog</button>
</Dialog>

@code {
    public Dialog? Dialog { get; set; }
    public async Task OpenModal() => await Dialog.ShowModal();
    public async Task CloseModal() => await Dialog.CloseModal();
}
```

Finally, we'll need to tell Blazor that this needs to be rendered in an interactive render mode - the template comes standard with interactive server components configured, so we'll use that. Add this line at the top of the page:

```razor
@rendermode InteractiveServer
```

And that should do it! To recap, if you're following along, your `Home.razor` should now look like this:

```razor
@page "/"
@rendermode InteractiveServer

<PageTitle>Home</PageTitle>

<h1>Hello, world!</h1>

Welcome to your new app.

<button @onclick=OpenModal>Open dialog</button>

<Dialog @ref=Dialog>
    <p>This is a dialog</p>
    <button @onclick=CloseModal>Close dialog</button>
</Dialog>

@code {
    public Dialog? Dialog { get; set; }
    public async Task OpenModal() => await Dialog.ShowModal();
    public async Task CloseModal() => await Dialog.CloseModal();
}
```

Well there you have it. From here, you can expand the `<Dialog>` component to respect more parameters to prevent closing with `Esc`, style it just like any other element, or style the backdrop by selecting the `::backdrop` pseudo-element.
