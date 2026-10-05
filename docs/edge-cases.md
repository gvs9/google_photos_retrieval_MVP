# Edge Cases & Corner Scenarios — Guided "Memory Clue" Builder MVP

> Covers all layers: **UI · API Route · Groq LLM · Matcher · Data**

---

## Table of Contents

1. [Frontend — Input & Chip UI](#1-frontend--input--chip-ui)
2. [Frontend — Search Submission](#2-frontend--search-submission)
3. [API Route — Request Handling](#3-api-route--request-handling)
4. [Groq LLM — Translation Layer](#4-groq-llm--translation-layer)
5. [Matcher — Filtering Engine](#5-matcher--filtering-engine)
6. [Data — photos.json](#6-data--photosjson)
7. [Network & Environment](#7-network--environment)
8. [Summary Matrix](#8-summary-matrix)

---

## 1. Frontend — Input & Chip UI

### 1.1 Empty Main Input + No Chips Filled

| | |
|---|---|
| **Scenario** | User clicks "Search" without typing anything and without filling any chip |
| **Risk** | API is called with an empty payload — Groq receives no signal; results will be meaningless or empty |
| **Handling** | Disable the Search button unless `mainInput.trim().length > 0` OR at least one chip is filled |

```ts
const canSearch =
  mainInput.trim().length > 0 ||
  personChip.value !== null ||
  timeframeChip.value !== null ||
  visualChip.value !== null;
```

---

### 1.2 Chip Input Submitted with Whitespace Only

| | |
|---|---|
| **Scenario** | User expands a chip, types `"   "` (spaces), and presses Enter |
| **Risk** | Chip transitions to `filled` state with an empty/meaningless value |
| **Handling** | Trim the value before setting it; if empty after trim, revert chip to `idle` |

```ts
const trimmed = inputValue.trim();
if (!trimmed) {
  setChipState("idle");
} else {
  setChipState("filled");
  setValue(trimmed);
}
```

---

### 1.3 Chip Input with Very Long Value

| | |
|---|---|
| **Scenario** | User types a 200-character string into a chip input |
| **Risk** | Filled chip overflows its container and breaks layout |
| **Handling** | Cap chip display to `max-w-[180px]` with `truncate`; store full value for the API |

```tsx
<span className="max-w-[180px] truncate">{value}</span>
```

---

### 1.4 Rapid Chip Open/Close Toggling

| | |
|---|---|
| **Scenario** | User rapidly clicks a chip open and closed multiple times |
| **Risk** | Animation glitch; stale state; multiple inputs rendered |
| **Handling** | Each chip is controlled by a single state variable — only one can be `expanding` at a time. Consider collapsing any open chip when another is clicked |

```ts
// Collapse all others when expanding one
function expandChip(type: ChipType) {
  if (personChip.state === "expanding" && type !== "person") resetPerson();
  if (timeframeChip.state === "expanding" && type !== "timeframe") resetTimeframe();
  if (visualChip.state === "expanding" && type !== "visual") resetVisual();
}
```

---

### 1.5 Chip Dismissed Mid-Search

| | |
|---|---|
| **Scenario** | User clicks ⓧ on a chip while a search is already in-flight |
| **Risk** | The in-flight request still carries the old chip value; results may not match current UI state |
| **Handling** | Disable chip dismiss (and all chip interactions) while `isLoading === true` |

---

### 1.6 Main Input Pasted Content (Very Large)

| | |
|---|---|
| **Scenario** | User pastes a multi-paragraph block of text into the main input |
| **Risk** | Groq token limit exceeded; very slow response; poor translation quality |
| **Handling** | Cap main input at `maxLength={500}` and show a character counter near the limit |

---

## 2. Frontend — Search Submission

### 2.1 Double-Click / Rapid Submit

| | |
|---|---|
| **Scenario** | User double-clicks Search or rapidly clicks it multiple times |
| **Risk** | Multiple concurrent API calls; last-write-wins race condition on `results` state |
| **Handling** | Disable the button immediately on first click (`isLoading = true`). Optionally use `AbortController` to cancel any previous in-flight request |

```ts
const abortControllerRef = useRef<AbortController | null>(null);

async function handleSearch() {
  abortControllerRef.current?.abort();
  abortControllerRef.current = new AbortController();
  setIsLoading(true);
  try {
    const res = await fetch("/api/search", {
      signal: abortControllerRef.current.signal,
      ...
    });
    ...
  } catch (err) {
    if (err.name === "AbortError") return; // silently ignore cancelled requests
    setError("Something went wrong. Please try again.");
  } finally {
    setIsLoading(false);
  }
}
```

---

### 2.2 Search with Enter Key While Chip is Expanding

| | |
|---|---|
| **Scenario** | A chip is in `expanding` state (input focused); user presses Enter |
| **Risk** | Ambiguous intent — should Enter confirm the chip value or trigger a search? |
| **Handling** | Enter inside a chip input should **only** confirm that chip. Global Enter-to-search should only fire when no chip input is focused |

---

### 2.3 Component Unmount Mid-Fetch (Navigation)

| | |
|---|---|
| **Scenario** | User navigates away (or hot-reload) while a fetch is in progress |
| **Risk** | `setState` called on an unmounted component → React warning / memory leak |
| **Handling** | Use an `AbortController` tied to a `useEffect` cleanup |

```ts
useEffect(() => {
  return () => abortControllerRef.current?.abort();
}, []);
```

---

## 3. API Route — Request Handling

### 3.1 Malformed JSON Body

| | |
|---|---|
| **Scenario** | Client sends a request with invalid JSON (e.g., truncated body) |
| **Risk** | `req.json()` throws; unhandled exception crashes the route |
| **Handling** | Wrap `req.json()` in try/catch, return `400 Bad Request` |

```ts
let body: SearchRequest;
try {
  body = await req.json();
} catch {
  return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
}
```

---

### 3.2 Missing `conversational_text` Field

| | |
|---|---|
| **Scenario** | Body is valid JSON but `conversational_text` is absent or `null` |
| **Risk** | Groq receives a malformed or empty prompt |
| **Handling** | Validate field presence; return `400` with a descriptive message |

```ts
if (!body.conversational_text?.trim()) {
  return NextResponse.json(
    { error: "conversational_text is required" },
    { status: 400 }
  );
}
```

---

### 3.3 Unexpected Request Method (GET, PUT, etc.)

| | |
|---|---|
| **Scenario** | Non-POST request hits `/api/search` |
| **Risk** | Next.js App Router returns a generic 405; can confuse debugging |
| **Handling** | Export only `POST` from `route.ts`. Next.js will auto-reject other methods. Optionally add an explicit handler for clarity |

---

### 3.4 Request Body Too Large

| | |
|---|---|
| **Scenario** | A chip or main input contains an unusually large string |
| **Risk** | Next.js body size limit hit; Groq token budget exceeded |
| **Handling** | Enforce `maxLength` on inputs client-side (see §1.6). Server-side, check string lengths before calling Groq |

```ts
if (body.conversational_text.length > 1000) {
  return NextResponse.json({ error: "Input too long" }, { status: 413 });
}
```

---

## 4. Groq LLM — Translation Layer

### 4.1 Groq API Key Missing or Invalid

| | |
|---|---|
| **Scenario** | `GROQ_API_KEY` is not set in `.env.local`, or is expired/incorrect |
| **Risk** | Groq SDK throws an authentication error; unhandled crash |
| **Handling** | Check for the key at startup; catch Groq auth errors and return `503` |

```ts
// At module level in route.ts
if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set. Check your .env.local file.");
}
```

```ts
// In handler
catch (err: any) {
  if (err?.status === 401) {
    return NextResponse.json({ error: "Groq auth failed" }, { status: 503 });
  }
  throw err;
}
```

---

### 4.2 Groq Returns Malformed / Non-JSON Response

| | |
|---|---|
| **Scenario** | Despite `json_object` mode, Groq returns a response that fails `JSON.parse` (e.g., model hallucination, partial response) |
| **Risk** | `JSON.parse` throws; route crashes |
| **Handling** | Wrap JSON parsing in try/catch; return `502` if parse fails |

```ts
let groqOutput: GroqOutput;
try {
  groqOutput = JSON.parse(content);
} catch {
  return NextResponse.json(
    { error: "Failed to parse LLM response" },
    { status: 502 }
  );
}
```

---

### 4.3 Groq Returns Structurally Incorrect JSON

| | |
|---|---|
| **Scenario** | JSON is valid but missing expected fields (e.g., no `semantic_search_string`, or `metadata_filters` is `null`) |
| **Risk** | Matcher crashes with `TypeError: Cannot read properties of null` |
| **Handling** | Apply defensive defaults after parsing |

```ts
const safeOutput: GroqOutput = {
  metadata_filters: {
    people: groqOutput.metadata_filters?.people ?? [],
    location_inference: groqOutput.metadata_filters?.location_inference ?? [],
  },
  semantic_search_string: groqOutput.semantic_search_string ?? "",
};
```

---

### 4.4 Groq Rate Limit Hit (429)

| | |
|---|---|
| **Scenario** | Too many requests in a short window exceed the free-tier rate limit |
| **Risk** | Groq returns `429 Too Many Requests`; user sees a broken loading state |
| **Handling** | Catch the 429, return a user-friendly `429` response; display "Too many searches — please wait a moment" in the UI |

```ts
if (err?.status === 429) {
  return NextResponse.json(
    { error: "Rate limit reached. Please wait a moment." },
    { status: 429 }
  );
}
```

---

### 4.5 Groq Timeout / Network Failure

| | |
|---|---|
| **Scenario** | Groq API takes too long to respond or is unreachable |
| **Risk** | Request hangs indefinitely; user is stuck on loading state |
| **Handling** | Set a timeout using `AbortSignal.timeout()` on the Groq SDK call, or use `Promise.race` with a timeout |

```ts
const timeoutSignal = AbortSignal.timeout(10_000); // 10 seconds
const completion = await groq.chat.completions.create(
  { ... },
  { signal: timeoutSignal }
);
```

---

### 4.6 Groq Hallucinates People Not in the Database

| | |
|---|---|
| **Scenario** | User types "me and my brother" — Groq may invent a name like `["John"]` |
| **Risk** | `metadata_filters.people` contains names that don't exist in `photos.json` → zero results |
| **Handling** | This is expected MVP behaviour. The zero-results fallback (§5.1) handles it. Future improvement: validate Groq people output against a known people list |

---

### 4.7 Groq Returns `null` for All Fields

| | |
|---|---|
| **Scenario** | User input is too vague or in an unsupported language — Groq outputs `{ metadata_filters: { people: null, location_inference: null }, semantic_search_string: null }` |
| **Risk** | Matcher has nothing to filter on — returns all 20 photos or crashes |
| **Handling** | Treat null outputs as empty arrays/strings (§4.3 defensive defaults). Returning all photos is acceptable as a fallback |

---

## 5. Matcher — Filtering Engine

### 5.1 Zero Results (Both Passes Fail)

| | |
|---|---|
| **Scenario** | No photo passes both the people filter AND the semantic keyword filter |
| **Risk** | Empty array returned → blank results grid with no explanation |
| **Handling** | Two-tier fallback: first retry with OR logic (people OR semantic); if still empty, return `[]` and show the empty state message |

```ts
// Primary: AND filter
let results = photos.filter(p => peopleMatch(p) && semanticMatch(p));

// Fallback: OR filter
if (results.length === 0) {
  results = photos.filter(p => peopleMatch(p) || semanticMatch(p));
}

// Still empty: return [] — UI shows empty state
return results;
```

---

### 5.2 Case Sensitivity Mismatch

| | |
|---|---|
| **Scenario** | Groq returns `"sarah"` but `photos.json` stores `"Sarah"` |
| **Risk** | Case-sensitive comparison misses the match |
| **Handling** | Always normalise to lowercase before comparing |

```ts
photo.metadata.people.map(p => p.toLowerCase()).includes(name.toLowerCase())
```

---

### 5.3 Partial Name Match

| | |
|---|---|
| **Scenario** | Groq extracts `"Dave"` but the photo stores `"David"` |
| **Risk** | Exact match fails; photo is excluded |
| **Handling** | Use `startsWith` or `includes` for partial name matching, or allow the Groq prompt to normalise names to the full form where possible |

```ts
const nameMatch = photo.metadata.people.some(p =>
  p.toLowerCase().startsWith(name.toLowerCase()) ||
  name.toLowerCase().startsWith(p.toLowerCase())
);
```

---

### 5.4 Keyword is a Common Stop Word

| | |
|---|---|
| **Scenario** | `semantic_search_string` contains `"a, the, at, in, was"` — Groq includes filler words |
| **Risk** | Stop words match almost every `visual_tag`, polluting results with false positives |
| **Handling** | Filter out stop words before keyword matching |

```ts
const STOP_WORDS = new Set(["a","the","at","in","was","with","and","of","to","on"]);

const keywords = semantic_search_string
  .split(",")
  .map(k => k.trim().toLowerCase())
  .filter(k => k.length > 2 && !STOP_WORDS.has(k));
```

---

### 5.5 `photos.json` is Empty or Malformed

| | |
|---|---|
| **Scenario** | `photos.json` is accidentally cleared, or contains invalid JSON |
| **Risk** | Import fails at build time or matcher crashes at runtime |
| **Handling** | TypeScript import will catch JSON parse errors at build time. Add a runtime guard |

```ts
import photosRaw from "@/data/photos.json";

const photos = Array.isArray(photosRaw) ? photosRaw as Photo[] : [];
if (photos.length === 0) {
  console.warn("[matcher] photos.json is empty or could not be loaded.");
}
```

---

### 5.6 All Photos Match (Overly Broad Query)

| | |
|---|---|
| **Scenario** | Semantic string is `"photo"` or `"outdoor"` — matches nearly every record |
| **Risk** | All 20 photos are returned; results feel unhelpful |
| **Handling** | Acceptable for MVP. Future improvement: rank by match score (number of keyword overlaps) and return top N |

---

## 6. Data — photos.json

### 6.1 Duplicate IDs

| | |
|---|---|
| **Scenario** | Two photo objects share the same `id` value |
| **Risk** | React key warning during grid render; potential deduplication bugs |
| **Handling** | Use unique sequential IDs (`"1"` through `"20"`). Add a dev-time uniqueness check |

```ts
// Dev-only validation
const ids = photos.map(p => p.id);
const unique = new Set(ids);
if (ids.length !== unique.size) console.error("Duplicate photo IDs detected!");
```

---

### 6.2 Broken / Unavailable Image URLs

| | |
|---|---|
| **Scenario** | An Unsplash URL becomes unavailable or returns a 404 |
| **Risk** | Broken image icon renders in the grid |
| **Handling** | Add an `onError` handler on `<img>` to display a placeholder |

```tsx
<img
  src={photo.url}
  alt={photo.visual_tags.join(", ")}
  onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
/>
```

---

### 6.3 Missing Optional Fields on a Photo Object

| | |
|---|---|
| **Scenario** | A photo object in `photos.json` is missing `visual_tags` or `metadata.people` |
| **Risk** | Matcher crashes with `Cannot read properties of undefined (reading 'some')` |
| **Handling** | Use optional chaining and defaults in the matcher |

```ts
const tags = photo.visual_tags ?? [];
const people = photo.metadata?.people ?? [];
```

---

## 7. Network & Environment

### 7.1 User is Offline

| | |
|---|---|
| **Scenario** | User has no internet connection when clicking Search |
| **Risk** | `fetch` throws a network error; no user feedback |
| **Handling** | Catch network errors in `handleSearch` and display `"Check your internet connection"` |

```ts
catch (err: any) {
  if (!navigator.onLine) {
    setError("You appear to be offline. Please check your connection.");
  } else {
    setError("Something went wrong. Please try again.");
  }
}
```

---

### 7.2 `.env.local` Not Loaded (Production Build)

| | |
|---|---|
| **Scenario** | App is deployed without setting `GROQ_API_KEY` in the environment |
| **Risk** | All searches fail silently with a 500 error |
| **Handling** | Add a startup check (§4.1). Document deployment requirements clearly in `README.md` |

---

### 7.3 CORS / Same-Origin Assumptions

| | |
|---|---|
| **Scenario** | The route is called from a different origin (e.g., during testing with a separate frontend) |
| **Risk** | CORS error in browser |
| **Handling** | In the MVP, the frontend and API are served from the same Next.js origin — no CORS configuration needed. Note this if separating concerns later |

---

### 7.4 Groq SDK Version Mismatch

| | |
|---|---|
| **Scenario** | Future update to `groq-sdk` changes the API surface |
| **Risk** | Build or runtime errors after `npm update` |
| **Handling** | Pin the SDK version in `package.json`: `"groq-sdk": "^0.x.x"` and review release notes before upgrading |

---

## 8. Summary Matrix

| # | Layer | Scenario | Severity | Handling Strategy |
|---|---|---|---|---|
| 1.1 | UI | Empty submission | Medium | Disable Search button |
| 1.2 | UI | Whitespace-only chip | Low | Trim + revert to idle |
| 1.3 | UI | Very long chip value | Low | Truncate display, store full |
| 1.4 | UI | Rapid chip toggling | Low | Single expanding chip at a time |
| 1.5 | UI | Chip dismissed mid-search | Low | Lock UI during loading |
| 1.6 | UI | Large pasted input | Medium | `maxLength={500}` |
| 2.1 | UI | Double-click submit | Medium | `AbortController` + disable button |
| 2.2 | UI | Enter key ambiguity | Low | Scope Enter to chip context |
| 2.3 | UI | Unmount mid-fetch | Low | `AbortController` cleanup |
| 3.1 | API | Malformed JSON body | High | try/catch → 400 |
| 3.2 | API | Missing `conversational_text` | High | Validate → 400 |
| 3.3 | API | Wrong HTTP method | Low | Next.js auto-handles |
| 3.4 | API | Body too large | Medium | Server-side length check → 413 |
| 4.1 | Groq | Missing API key | Critical | Startup check → 503 |
| 4.2 | Groq | Non-JSON response | High | try/catch parse → 502 |
| 4.3 | Groq | Missing response fields | High | Defensive defaults |
| 4.4 | Groq | Rate limit (429) | Medium | Catch + user message |
| 4.5 | Groq | Timeout | Medium | `AbortSignal.timeout(10_000)` |
| 4.6 | Groq | Hallucinated names | Low | Zero-results fallback |
| 4.7 | Groq | All-null output | Medium | Defensive defaults → all photos |
| 5.1 | Matcher | Zero results | High | OR fallback → empty state |
| 5.2 | Matcher | Case mismatch | High | Lowercase normalisation |
| 5.3 | Matcher | Partial name | Medium | `startsWith` partial match |
| 5.4 | Matcher | Stop words in keywords | Medium | Stop word filter |
| 5.5 | Matcher | Empty/invalid photos.json | High | Runtime Array guard |
| 5.6 | Matcher | All photos match | Low | Acceptable; rank by score later |
| 6.1 | Data | Duplicate IDs | Low | Dev-time uniqueness check |
| 6.2 | Data | Broken image URL | Low | `onError` placeholder |
| 6.3 | Data | Missing photo fields | High | Optional chaining + defaults |
| 7.1 | Network | User offline | Medium | `navigator.onLine` check |
| 7.2 | Env | Missing env var in prod | Critical | Startup check + README |
| 7.3 | Network | CORS | Low | N/A for same-origin MVP |
| 7.4 | Env | SDK version mismatch | Low | Pin version in package.json |
