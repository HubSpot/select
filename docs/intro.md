<script src="docs/js/intro.js"></script>
<script src="tether.js"></script>
<script src="constraint.js"></script>
<script src="markAttachment.js"></script>
<link rel="stylesheet" href="docs/css/intro.css"></link>

## Select

Select is a javascript and CSS library for creating styleable select elements.

Select uses [`Tether` and `Drop`](http://github.hubspot.com/tether) to create and position its element container.

### Dependencies

- `Tether` – [Source](https://github.com/HubSpot/tether/blob/master/tether.js)
- `Drop` – [Source](https://github.com/HubSpot/tether/blob/master/drop.js)

### Usage

Simply call:

```coffeescript
new Select { el }
```

### Options

You can pass these when constructing `Select`.

- `el`: The original `<select>` element to convert
- `selectStyle` (`"auto"` (__default__), `"always"`, `"never"`. ): When `"always"`, aligns the options chooser the way a real `<select>` is aligned. When `"never"`, aligns the options chooser like a canonical dropdown menu. When `"auto"`, it will behave like a select only when the number of items in the options chooser does not cause it to scroll.

### Themes

More coming soon...