## Status

- **Fixed**: No
- **Feedback ID**: FB17409034
- **Resolution**: Pending

# Safari 18.4+ Linear/Radial Gradient Rendering Bug

## Issue Description

In Safari 18.4+, CSS linear and radial gradients with transparent borders fail to render correctly when an extension popup is reopened. This issue only occurs when the extension has an active service worker/background page.

## Reproduction Steps

1. Open the extension popup - gradients render correctly
2. Close the popup
3. Reopen the popup - gradients with transparent borders no longer render, showing fallback content

<img src="./screenshots/demo.gif" width="420">

## Technical Analysis

The issue is potentially related to WebKit commit [289101@main](https://results.webkit.org/commit?repository=webkit&id=289101@main), affecting gradient rendering in extension contexts.

Additional findings:

- The bug only manifests when there is an active service worker/background page
- The issue can be verified by removing the background script from manifest.json:

```diff
- "background": {
-     "scripts": [ "background.js" ],
-     "type": "module"
- },
```

When this section is removed, gradients render correctly on popup reopen.

- The issue also doesn't occur if the service worker terminates after a period of inactivity
- This suggests there might be a graphics context issue where resources are improperly held or shared between the service worker and popup contexts

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

## Environment

- Safari Version: 18.4+
- macOS: Sequoia 15.4.1+
- Extension Type: Safari Web Extension
