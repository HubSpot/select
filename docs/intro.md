<script src="docs/js/intro.js"></script>
<script src="tether.js"></script>
<script src="constraint.js"></script>
<script src="markAttachment.js"></script>
<link rel="stylesheet" href="docs/css/intro.css"></link>

## Select

Select is a javascript and CSS library for creating styleable select elements.

Select uses [Tether](http://github.hubspot.com/tether) and [Drop](http://github.hubspot.com/drop) to create and position its element container.

### Dependencies

- jQuery
- Tether – [GitHub](https://github.com/HubSpot/tether), [Download](https://github.com/HubSpot/tether/releases)
- Drop – [GitHub](https://github.com/HubSpot/drop), [Download](https://github.com/HubSpot/drop/releases)

### Usage

#### Initialization

To initialize a single `selectElement`, simply create a `new Select` object.

```coffeescript
new Select
    el: selectElement
```

To initialize all selects on a page, you could do something like this:

```coffeescript
$('select').each -> new Select el: @
```

#### Changing the theme

To change from the default theme, change the `className` property.

```coffeescript
new Select
    el: selectElement
    className: 'select-theme-dark'
```

#### Changing the positioning

Select has an option called `selectLikeAlignment` which allows you to change whether
the <span data-tooltip-content="Drop.js is a dependency of Select.js">drop</span> is positioned like a real
select element or like a canonical dropdown menu.

By default, this property is set to `"auto"`, meaning it will align the <span data-tooltip-content="Drop.js is a dependency of Select.js">drop</span> like a select only when the number of items in the options chooser does not cause it to scroll. The other options are `"always"` and never `"never"`.

In this example, we Select to always open the <span data-tooltip-content="Drop.js is a dependency of Select.js">drop</span> like a dropdown menu.

```coffeescript
new Select
    el: selectElement
    selectLikeAlignment: 'never'
```

### Themes

Currently there are two themes for Select.js.

<table>
<thead>
<tr>
<th>Theme</th>
<th>Class name</th>
<th></th>
</tr>
</thead>
<tbody>
<tr><td>Default</td><td>(No class name necessary)</td><td><select></select></tr>
<tr><td>Dark</td><td>sortable-theme-dark</td><td><select></select></tr>
</tbody>
</table>