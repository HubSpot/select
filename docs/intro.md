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

### Methods

Coming soon...

### Options

You can pass these when constructing `Select`.

- `el`: The original `<select>` element to convert
- `autoAlign` (Default `false`): When `true`, aligns the options chooser the way a real `<select>` is aligned. When `false`, aligns the options chooser like a canonical dropdown menu.

### Themes

More coming soon...