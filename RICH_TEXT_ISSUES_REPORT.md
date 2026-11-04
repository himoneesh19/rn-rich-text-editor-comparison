# Technical Evaluation Report: Rich Text Editor Issues & Root Causes

**Target Project:** `us-text-editor-demo-app`  
**Target Library:** `react-native-enriched-html` (v1.1.x / v1.2.x by Software Mansion) vs `@10play/tentap-editor` (v1.1.x)  
**Devices Tested:** Samsung Galaxy S21 FE 5G (`SM_G990E`, Android 14 / One UI)  

---

## Executive Summary

During physical device evaluation of Software Mansion's pure-native editor (`react-native-enriched-html`), two major usability defects were observed:
1. **Trailing Boundary Style Stripping:** Typing a formatted word, turning the style OFF at the word boundary, and typing a character/space causes the completed word to **retroactively lose its formatting**.
2. **Invisible Bold Text:** Normal text and Bold text appear visually identical on Samsung/Android devices due to missing algorithmic fake-bold synthesis in native spans.

Both issues stem directly from native Android span handling in `react-native-enriched-html`. Neither issue occurs in Editor B (`@10play/tentap-editor`), which uses the industry-standard ProseMirror engine.

---

## 1. Issue: Trailing Boundary Style Stripping

### A. Symptom & Reproduction
1. Turn Strikethrough (or Italic/Bold) **ON**.
2. Type a word: `hello` (caret resting directly against the 'o' -> `hello|`).
3. Turn Strikethrough **OFF** on the toolbar.
4. Press **Space** (or type any letter `'a'`).
5. **Result:** The strikethrough is completely wiped off `"hello"`, both visually and in the underlying HTML output (`<s>hello</s>` disappears).

### B. Root Cause Breakdown in [`InlineStyles.kt`](file:///home/himoneesh-sharma/Downloads/workspace/us-text-editor-demo-app/node_modules/react-native-enriched-html/android/src/main/java/com/swmansion/enriched/textinput/styles/InlineStyles.kt)
The bug is caused by an execution chain across three native components:

| Component | Code Location | Role in the Bug |
| :--- | :--- | :--- |
| **`afterTextChanged()`** | Line 110 | **The Trigger:** Fired on every keystroke. Because the style was toggled OFF, `spanState` is `null`, which prompts it to call `splitSpanOnInsertion()`. |
| **`splitSpanOnInsertion()`** | Line 188 | **The Faulty Logic:** Intended to split a span if typing *inside* it. However, it queries `spannable.getSpans(insertStart, insertEnd)` where Android considers spans ending at `insertStart` as touching the query range. |
| **`removeSpan(span)`** | Line 200 | **The Destructive Line:** Unconditionally deletes the span off `"hello"` before checking if the span actually ended before/at the insertion point. |

```kotlin
// InlineStyles.kt (Lines 194-201)
val spans = spannable.getSpans(insertStart, insertEnd, type)
for (span in spans) {
  val spanStart = spannable.getSpanStart(span)
  val spanEnd = spannable.getSpanEnd(span)
  if (spanStart < 0 || spanEnd < 0) continue

  spannable.removeSpan(span) // ❌ DELETES the styling off the previous word!
  ...
```

*Note on Mobile Keyboards:* Android keyboards (Gboard/Samsung Keyboard) use an active composition region (`SPAN_COMPOSING`). When a letter or space is inserted, the IME replaces the composing word, magnifying the span deletion across the entire word.

### C. Industry Standard vs Current Implementation
* **Industry Standard ("Stored Marks" Pattern):** Modern editors (Google Docs, Word, Apple Notes, TipTap/ProseMirror) treat completed document text as **immutable / closed**. Toggling a button OFF only updates an in-memory buffer (`storedMarks`). It **never** touches or slices existing document spans when typing subsequent characters.
* **The Pragmatic Native Fix (`patch-package`):**
  Add a single guard condition immediately before Line 200 in `InlineStyles.kt`:
  ```kotlin
  val spanEnd = spannable.getSpanEnd(span)
  if (spanStart < 0 || spanEnd < 0) continue

  // ✅ PREVENTS DELETING COMPLETED WORDS:
  if (spanEnd <= insertStart) continue

  spannable.removeSpan(span)
  ```

---

## 2. Issue: Normal vs. Bold Looking Identical on Android

### A. Symptom
In `react-native-enriched-html`, text formatted with Bold (`<b>`) renders with the exact same visual weight as unformatted normal text on physical Samsung Galaxy / One UI devices.

### B. Root Cause: `StyleSpan(Typeface.BOLD)` vs. Missing Fake-Bold
1. **How Enriched Implements Bold:**
   In [`EnrichedBoldSpan.kt`](file:///home/himoneesh-sharma/Downloads/workspace/us-text-editor-demo-app/scratch/package/android/src/main/java/com/swmansion/enriched/common/spans/EnrichedBoldSpan.kt), the library inherits directly from Android's standard `StyleSpan`:
   ```kotlin
   open class EnrichedBoldSpan(enrichedStyle: EnrichedStyle) : StyleSpan(Typeface.BOLD), EnrichedInlineSpan
   ```
   Android's native `StyleSpan(Typeface.BOLD)` only sets the style flag `Typeface.create(oldTypeface, Typeface.BOLD)`. It does **not** modify paint rendering flags.
2. **Missing Faux-Bold Fallback:**
   On Samsung One UI devices, the default system font (Samsung Sans / One UI Sans) lacks an independent bold weight file mapped to the generic typeface query. 
   * When standard React Native renders `<Text style={{fontWeight: 'bold'}}>`, its internal helper (`ReactTypefaceUtils.java`) automatically calls `paint.setFakeBoldText(true)` as a fallback.
   * `react-native-enriched-html` **does not enable `setFakeBoldText(true)`** in its custom spans. Consequently, if the system typeface lacks a bold variant, the native text engine renders bold glyphs with normal weight.
3. **Contrast with TenTap (WebView):**
   Editor B (`@10play/tentap-editor`) runs in Chromium/Blink (`react-native-webview`). Web browsers have built-in algorithmic font-weight synthesis—whenever `<b>` or `font-weight: 700` is requested, the browser automatically applies an outline stroke to thicken the glyphs regardless of system font files.

---

## 3. Comparison Summary Table

| Feature / Behavior | Editor A: `react-native-enriched-html` | Editor B: `@10play/tentap-editor` |
| :--- | :--- | :--- |
| **Engine Core** | Native Android `EditText` & `Spannable` | WebKit/Chromium (`react-native-webview`) + TipTap/ProseMirror |
| **Typing Latency** | **Near 0 ms** (direct OS UI thread) | ~10–30 ms (IPC bridge between WebView & React Native) |
| **Trailing Space / Word Toggle** | ❌ **Buggy:** Strips styling from completed word (`splitSpanOnInsertion`). | ✅ **Standard:** Uses Stored Marks; completed word remains untouched. |
| **Bold Visibility (Samsung/Android)** | ❌ **Identical:** Relies on `StyleSpan` without `setFakeBoldText(true)`. | ✅ **Clear:** Browser engine automatically synthesizes faux-bold. |
| **Maturity Level** | Early-stage (v1.x), requires active patching. | Battle-tested (8+ years of ProseMirror upstream production use). |

---

## 4. Recommendations for Engineering Leadership

1. **If choosing `react-native-enriched-html` (Editor A):**
   * Must maintain a native patch via `patch-package` for [`InlineStyles.kt`](file:///home/himoneesh-sharma/Downloads/workspace/us-text-editor-demo-app/node_modules/react-native-enriched-html/android/src/main/java/com/swmansion/enriched/textinput/styles/InlineStyles.kt) (`spanEnd <= insertStart`) to prevent text corruption.
   * Must supply an explicit custom `fontFamily` with dedicated bold weights (e.g. `Roboto-Bold`) to make bold text visible on Samsung devices.
2. **If choosing `@10play/tentap-editor` (Editor B):**
   * Formatting boundaries, stored marks, and font weights work out-of-the-box with zero native patches.
   * Trade-off: Slightly higher RAM footprint and initial mount latency due to WebView hosting.

