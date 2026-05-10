# Filtering, Sorting, Transforming & Icon Map

## Filtering

You can filter the events in `calendar` and `view`.
There could be many cases to use filter, I make it as callback function. Sorry for all non-developers. But it's not so difficult.
The basic concept is here.

```js
filter: (event) => {
  IF THIS EVENT SHOULD BE INCLUDED, return true
  IF NOT, return false
}
```

By Example:

```js
filter: (event) => {
  if (event.isFullday == true) {
    return true;
  } else {
    return false;
  }
};
```

This code says **If this event is fullday event, use it. But if not so, drop it from event list**. When you need only `fullday` events, this could be useful.

## Sorting

You can also use sorting in `view`. (`calendar` doesn't support sorting, because to display sorted events depends on each view.)
Concept is similar.

```js
sort: (eventA, eventB) => {
  IF eventA SHOULD BE PRIOR TO eventB, return NEGATIVE VALUE
  IF NOT, return POSITIVE VALUE
}
```

By Example:

```js
sort: (a, b) => {
  return a.duration - b.duration;
};
```

This code says, **If duration of event A is smaller than that of event B, event A is prior to event B - sort by smaller duration**

Example 2:

```js
sort: (a, b) => {
  if (a.calendarSeq == b.calendarSeq) {
    return a.startDate - b.startDate;
  } else {
    return a.calendarSeq - b.calendarSeq;
  }
};
```

This means **Sort by calendar Sequence first. when sequence of two events are same, compare startDate and earlier is prior**.

## Transforming

You can modify event properties (like icon, color, or title) before rendering in `view`. (`calendar` doesn't support transforming, because transformed events depend on each view.)

**⚠️ Prefer `iconMap`**: For assigning icons by category, use `iconMap` (see [Icon Map](#icon-map) below) instead of `transform`. It's simpler, doesn't require null guards, survives JSON serialization in all MagicMirror² setups, and is less error-prone.

Concept:

```js
transform: (event) => {
  // Inspect and modify event properties as needed
  if (/* some condition on event */) {
    event.icon = "some-icon";  // or modify color, title, etc.
  }
  return event;
}
```

**Example 1 – Single check (safest):**

```js
transform: (event) => {
  if (event.title?.includes("Birthday")) {
    event.icon = "fxemoji:birthday-cake";
  }
  return event;
};
```

**Example 2 – Multiple checks (best practice):**

```js
transform: (event) => {
  const title = (event.title || "").toLowerCase();

  if (title.includes("birthday")) {
    event.icon = "fxemoji:birthday-cake";
  } else if (title.includes("vacation")) {
    event.icon = "noto:beach-with-umbrella";
  } else if (title.includes("meeting")) {
    event.icon = "noto:briefcase";
  }

  return event;
};
```

**⚠️ Null-safety & self-contained rules:**

- Always guard `event.title` before calling methods on it
- Use `event.title?.includes(...)` (optional chaining) for single checks
- Use `(event.title || "").toLowerCase()` before multiple checks
- Keep `transform` self-contained—don't reference external helpers
- ❌ Old pattern: `event.title.search(...)` **will crash** if title is missing (see [#465](https://github.com/MagicMirrorModules/MMM-CalendarExt2/issues/465))

## Icon Map

The `iconMap` view option assigns icons to events based on their categories. Unlike `transform`, it is plain data (string → string mapping), survives JSON serialization, and works in all MagicMirror² setups.

```js
iconMap: {
  Birthday: "fxemoji:birthdaycake",
  Health: "noto:hospital",
  Work: "noto:briefcase",
  Vacation: "noto:beach-with-umbrella",
  Family: "noto:family",
}
```

Icon names use the `prefix:name` format from [Iconify](https://icon-sets.iconify.design/) (e.g. `noto:hospital`, `mdi:home`). For backwards compatibility, the legacy `prefix-name` format (e.g. `noto-hospital`) is automatically converted.

For each event, the module checks `event.categories` (in order) against the keys of `iconMap`. The first match sets `event.icon`. If the event already has an icon set (for example from calendar config defaults or `transform`), `iconMap` does not override it.

For `categories` to be populated, the iCal event must include a `CATEGORIES` property. See [Event-Object.md](Event-Object.md) for the full event shape.
