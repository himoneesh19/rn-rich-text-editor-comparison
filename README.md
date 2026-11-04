# Rich Text Editor Comparison Demo App

A clean, single-screen comparison app comparing two mobile rich text editors stacked vertically:

1. **Editor A (Software Mansion)**: [`react-native-enriched-html`](https://github.com/software-mansion/react-native-enriched)
   - **Architecture**: 100% Native Fabric Primitives (`UITextView` with TextKit 2 on iOS, `EditText` with Spannables on Android).
   - **Zero WebViews**: No browser runtime overhead, direct native event pipeline.
   - **Toolbar**: Pure native toggle methods (`toggleBold`, `toggleItalic`, `toggleUnderline`, `toggleStrikeThrough`, `toggleH1`, `toggleUnorderedList`) driven by the native `onChangeState` event without custom JavaScript shadow state machines.

2. **Editor B (10Tap)**: [`@10play/tentap-editor`](https://github.com/10play/10tap-editor)
   - **Architecture**: Embedded Web runtime powered by TipTap & ProseMirror via `react-native-webview`.
   - **Document Model**: ProseMirror schema and transaction tree.
   - **Toolbar**: Standard 10Tap Toolbar configured with Bold, Italic, Underline, Strikethrough, H1, and Bullet List.

---

## Screen Architecture

- **Single Scrollable Screen**: Both editors are stacked vertically in a non-conflicting layout (`dynamicHeight` on 10Tap and `scrollEnabled={false}` on `EnrichedTextInput` inside the outer `ScrollView`).
- **Cards**:
  - `1. react-native-enriched-html`
  - `2. @10play/tentap-editor`
- **Live HTML Output**: Underneath each editor, a real-time preview box displays the raw generated HTML string alongside character and tag counts.

---

## Physical Device Evaluation Guide

| Test Scenario | What to Observe |
|---|---|
| **1. Typing Fluidity & Latency** | Type continuously at high speed on Android soft keyboard (e.g. Gboard). Observe keystroke buffering or dropped characters. |
| **2. Trailing Space Boundary** | Type `"word "`, toggle Bold or Italic. Observe if the trailing space gets consumed or if the caret jumps unexpectedly. |
| **3. Toggle Behaviors** | Toggle formatting mid-sentence and mid-word; check button active states. |
| **4. Bullet List & Enter Key** | Create a bullet list item, press Enter to verify new item creation, and press Enter again on an empty line to cleanly exit the list. |
| **5. Caret & Soft Keyboard** | Dismiss and re-open the soft keyboard; verify cursor stability and scrolling. |

---

## Running the App

### Start Development Server
```bash
yarn start
# or
npx expo start
```

### Run on Android Device / Emulator
```bash
yarn android
# or
npx expo run:android
```

### Run on iOS Device / Simulator
```bash
yarn ios
# or
npx expo run:ios
```
