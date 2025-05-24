<summary><strong>📦 Dev Scripts</strong></summary>

Start a storybook on local

```bash
npm run storybook
```

Reset storybook cache. Useful when changing themes.

```bash
npm run storybook-reset
```

Forces chromatic to push your latest to Storybook build. Useful for on the fly changes of stories, no pushing to repo, non-dev contributors can view.

```bash
npm run chromatic -- --force-rebuild
```

[StoryBook CLI options](https://storybook.js.org/docs/api/cli-options)
