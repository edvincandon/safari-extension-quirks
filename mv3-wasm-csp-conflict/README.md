## Status

- **Fixed**: No
- **Feedback ID**: Pending
- **Resolution**: Pending

# Safari MV3 WASM CSP Conflict

## Issue Description

In Safari WebKit extensions using Manifest V3, there's a critical issue with Content Security Policy (CSP) directives for WebAssembly execution. Extensions cannot enable WASM execution in extension pages (including popups) while maintaining secure CSP settings, despite service workers supporting WASM execution under the same policies.

## The Problem

1. Setting `wasm-unsafe-eval` in the CSP works for service workers but not for extension pages (eg: popups)
2. Not setting a CSP doesn't enable WASM in either context
3. The only workaround creates a significant security vulnerability by completely removing script-src restrictions

> **Note**: MV3 makes a critical distinction - Extension pages (popup, options) have stricter CSP enforcement than service workers. If the extension uses a background script rather than a service worker, then the same restrictions as extension pages apply.

## Technical Analysis

The issue stems from WebKit's CSP implementation for extensions:

1. MV3 extension pages cannot modify the `script-src` directive to include `wasm-unsafe-eval` due to WebKit's policy enforcement. `script-src` directive mutation seems prohibited for MV3 extensions in WebKit :
   [ContentSecurityPolicySourceList.cpp#L320](https://github.com/WebKit/WebKit/blob/4d5cc63cf05c21240d6a5c90bdc60f9b8b00c7a4/Source/WebCore/page/csp/ContentSecurityPolicySourceList.cpp#L320)

2. However, if no `script-src` directive is set at all, WebKit doesn't apply the expected default restrictions. Completely empty CSP or one without script-src allows unrestricted script execution : [ContentSecurityPolicyDirectiveList.cpp#L65](https://github.com/WebKit/WebKit/blob/4d5cc63cf05c21240d6a5c90bdc60f9b8b00c7a4/Source/WebCore/page/csp/ContentSecurityPolicyDirectiveList.cpp#L65)

3. Service workers are treated differently and can execute WASM with the proper directive.

### Scenario 1: Setting `wasm-unsafe-eval` (Partially Works)

```diff
"content_security_policy": {
+   "extension_pages": "script-src 'self' 'wasm-unsafe-eval';"
}
```

Result: WASM works in service workers but fails in extension pages.

### Scenario 2: No CSP Configuration (Fails)

```diff
- "content_security_policy": {
-   "extension_pages": "script-src 'self' 'wasm-unsafe-eval';"
- }
```

Result: WASM fails in both contexts.

### Scenario 3: Empty CSP or No script-src (Insecure but Works)

```diff
"content_security_policy": {
-   "extension_pages": "script-src 'self' 'wasm-unsafe-eval';"
+   "extension_pages": ""
}
```

OR

```diff
"content_security_policy": {
-   "extension_pages": "script-src 'self' 'wasm-unsafe-eval';"
+   "extension_pages": "object-src 'self';"
}
```

Result: WASM works in both contexts, but creates a serious security vulnerability as it allows unrestricted script execution, including `eval()` and loading external scripts.

## Security Implications

The only working solution currently requires removing script-src restrictions, which:

- Allows arbitrary script execution
- Enables potentially malicious code injection
- Violates basic extension security principles

## Possible Workarounds

1. Spawn a worker from extension pages
2. Maintain a separate codebase without WASM for Safari
3. Compile WASM to ASM.js

## Demo Extension

This repository includes a demonstration extension that allows you to:

1. View the current manifest CSP configuration
2. Test WASM loading in both popup and service worker contexts
3. Observe the behavior differences between contexts

#### How to Use the Demo

1. Install the extension in Safari
2. Open the extension popup
3. The extension automatically:
   - Logs the current manifest's CSP configuration
   - Attempts to load WASM in the popup context

#### Manual Tests

Two buttons are available for testing:

- **Trigger Popup WASM**: Executes a simple WASM addition function (2+2) in the popup context
- **Trigger SW WASM**: Sends a message to the service worker to perform the same WASM addition

#### Expected Results

With the default configuration `script-src 'self' 'wasm-unsafe-eval'`:

- Popup WASM operations will fail with compilation errors
- Service worker WASM operations will succeed

Try modifying the CSP in manifest.json to test the different scenarios described in this document.

## Environment

- Safari Version: 18.4
- macOS: Sequoia 15.4+
- Extension Type: Safari Web Extension (MV3)
