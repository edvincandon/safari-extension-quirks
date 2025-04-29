# Safari Extension Quirks

A repository tracking issues and quirks encountered when developing Safari Web Extensions. Each directory contains a reproducible demo for a specific problem.

## Current Issues

| Issue                                                                  | Description                                                  | Fixed | Feedback ID |
| ---------------------------------------------------------------------- | ------------------------------------------------------------ | ----- | ----------- |
| [MV3 Service Worker History Clear](./mv3-service-worker-history-clear) | Browser history clearing affects MV3 service workers         | Yes   | FB14991802  |
| [MV3 WASM CSP Conflict](./mv3-wasm-csp-conflict)                       | WASM cannot be enabled while maintaining secure CSP settings | No    | Pending     |
| [MV3 Popup Gradient Rendering](./mv3-popup-gradient-rendering)         | CSS gradients in extension popups render incorrectly         | No    | Pending     |
