<!-- markdownlint-disable-file MD025 -->

# Filtering

You can filter the events in `calendar` and `view`.
There could be many cases to use filter, I make it as callback function. Sorry for all non-developers. But it's not so difficult.
The basic concept is here.

```js
filter: (event) => {
  IF THIS EVENT SHOULD BE INCLUDED, return true
  IF NOT, return false
}
```

By Example

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

# Sorting

You can also use sorting in `view`. (`calendar` doesn't support sorting, because to display sorted events depends on each view.)
Concept is similar.

```js
sort: (eventA, eventB) => {
  IF eventA SHOULD BE PRIOR TO eventB, return NEGATIVE VALUE
  IF NOT, return POSITIVE VALUE
}
```

By Example;

```js
sort: (a, b) => {
  return a.duration - b.duration;
};
```

This code says, **If duration of event A is smaller than that of event B, event A is prior to event B - sort by smaller duration**

Example 2;

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

# Transforming

You can also use transforming in `view`. (`calendar` doesn't support transforming, because to display transformed events depends on each view.)

Concept;

```js
transform: (event)=>{
  IF THIS event NEED some property TO BE CHANGED,
  CHANGE THAT property
  THEN, return event
}

```

By Example;

```js
transform: (event) => {
  if (event.title.search("Birthday") > -1) {
    // If the event might include "Birthday" in its title,
    event.icon = "fxemoji:birthdaycake"; // Set icon of that event
  }
  return event; // Return that event.
};
```

> **Note:** Since MagicMirror² v2.35, the config is delivered to the browser via JSON. In browser-based setups, callback functions can break when they depend on symbols outside the serialized config scope (for example, standalone helper functions declared outside `let config = {}`). Keep `transform` self-contained or reference helpers through `config.myHelper(event)`. For icon assignment by category, prefer `iconMap` because it is plain data and works in all setups.

# Icon Map

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
