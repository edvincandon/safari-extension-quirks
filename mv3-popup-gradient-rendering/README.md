# Safari 18.4+ Linear/Radial Gradient Rendering Bug

## Issue Description

In Safari 18.4+, CSS linear and radial gradients with transparent borders fail to render correctly when an extension popup is reopened.

## Reproduction Steps

1. Open the extension popup - gradients render correctly
2. Close the popup
3. Reopen the popup - gradients with transparent borders no longer render, showing fallback content (skull emoji)

## Technical Analysis

The issue relates to WebKit commit [289101@main](https://results.webkit.org/commit?repository_id=webkit&id=289101@main), affecting gradient rendering in extension contexts.

### Working Example

```css
.gradient {
  background: linear-gradient(to right, #ffcbb8, #ffdfd0, #e2d7f0);
  border: none; /* Works correctly */
}
```

### Failing Example

```css
.gradient {
  background: linear-gradient(to right, #ffcbb8, #ffdfd0, #e2d7f0);
  border: 1px solid transparent; /* Fails to render on popup reopen */
}
```

The same issue affects `radial-gradient()` with transparent borders.

## Workaround

Remove transparent borders from elements with gradient backgrounds.

## Environment

- Safari Version: 18.4+
- macOS: Sequoia 15.4.1+
- Extension Type: Safari Web Extension
