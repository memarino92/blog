---
title: Networking Problems in WSL 2
publishDate: Sep 11 2022
description: |
  How to totally bork (and fix) your WSL 2 localhost network stack
---

# Networking Problems in WSL 2

Recently I found myself trying to debug a styling issue that only appeared on real mobile devices - not simulated using in-browser DevTools. I wanted to access my dev environment, which was running on WSL 2, over a local network on my phone.

## The Problem

My first problem was that the server is only accessible over localhost - not shared over the network by default. The project in question is an [Astro](https://astro.build) project, which uses [Vite](https://vitejs.dev/) under the hood. Starting up the dev server returns this output:

```bash
npm run dev

> astro dev

  🚀  astro  v1.0.5 started in 41ms

  ┃ Local    http://localhost:3000/
  ┃ Network  use --host to expose


```

_"Seems simple enough"_, I thought. Use the `--host` flag to expose it over the network! After another quick trial and error (and Google search), I found that I need to put another set of `--` in between the command and the flag, so now we arrive here:

```bash
npm run dev -- --host

> astro dev --host

  🚀  astro  v1.0.5 started in 37ms

  ┃ Local    http://localhost:3000/
  ┃ Network  http://172.21.191.26:3000/
```

That still doesn't work on the phone though.
_"Shouldn't be too big of a deal"_ I thought, and so back to Google I went where I came across [this StackOverflow question](https://stackoverflow.com/questions/61002681/connecting-to-wsl2-server-via-local-network).

## The Other Problem

After reading through the replies in the StackOverflow post, I ran the following two commands from an elevated Powershell terminal in Windows:

```bash
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=172.21.106.44
```

```bash
netsh advfirewall firewall add rule name= "Open Port 3000" dir=in action=allow protocol=TCP localport=3000
```

It was at this point that everything began to fall apart. Now, I'd totally broken localhost - I had to use the explicit IP adress to access the sever from the same computer, and I _still_ didn't have access on my phone.

## The Solution to The Other Problem

I was stuck here for some time, but finally I wound up on the [netsh docs](https://docs.microsoft.com/en-us/windows-server/networking/technologies/netsh/netsh-interface-portproxy) and reverse engineered the commands that I would need to undo the mess that I'd created:

```bash
netsh advfirewall firewall delete rule name= "Open Port 3000" dir=in
```

```bash
netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=0.0.0.0
```

The purpose of sharing this is to try and help anyone who runs the first set of commands from StackOverflow and finds themselves in a similar situation.

In the end I tested on the mobile device by creating a PR with my changes and using [Netlify's](https://www.netlify.com/) deploy preview feature to be able to access the proposed changes on a public network. If anyone has insight on how to properly set up WSL 2 to act as a server on the local network, please let me know!
