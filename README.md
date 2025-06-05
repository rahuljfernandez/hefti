<summary><strong>📦 Dev Scripts</strong></summary>

Start app on local

```bash
npm run dev
```

Start a storybook on local

```bash
npm run storybook
```

Reset storybook cache. Useful when changing themes.

```bash
npm run storybook-reset
```

Run this after a git push to update Chromatic/Storybook to reflect latest branch/main

```bash
npm run chromatic
```

Forces chromatic to push your latest to Storybook build. Useful for on the fly changes of stories, no pushing to repo, non-dev contributors can view.

```bash
npm run chromatic -- --force-rebuild
```

[StoryBook CLI options](https://storybook.js.org/docs/api/cli-options)
