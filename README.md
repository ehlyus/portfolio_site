# Elijah's Personal Site

This is the code base for Elijah's portfolio site. If using this project as a template please fork and give credit. Thank you.

Please Note; 
- in order to access gsap club plugins, you will need to modify all club plugin imports to utilize the gsap trial library or purchase access to club plugins and add an npmrc to the project with your club plugin token.
- you will also need to supply your own main 3d model asset and update the reference to the model as well as camera angles and animations in Gallery.svelte component

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
