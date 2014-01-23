<link rel="stylesheet" href="/select/css/select-theme-default.css" />
<link rel="stylesheet" href="/select/css/select-theme-dark.css" />
<link rel="stylesheet" href="/select/css/select-theme-chosen.css" />
<script src="/select/select.min.js"></script>
<script>$(function(){ $('select').each(function(){ new Select({ el: this, className: $(this).attr('data-className') }); }); });</script>

## Select

Select is a Javascript and CSS library for creating styleable select elements.  Unlike many other select-replacements, Select is designed
from the ground up to replicate the behavior of native select controls as much as is possible, providing a seemless experience for users.
That means it works properly when you type characters, use tab for focus, etc.

Use Select where you would use a native select.  It doesn't, and will never, provide any sort of search functionality, so you probably
don't want to use it on a list of more than a few hundred elements.

Select uses [Tether](http://github.hubspot.com/tether/docs/welcome) to efficiently position its element container.

### [Demo](http://github.hubspot.com/select/docs/welcome)

### Dependencies

None!

### Browser Support

IE9+ and all modern browsers

### Usage

#### Initialization

To initialize a single `selectElement`, simply create a `new Select` object.

```coffeescript
new Select
    el: selectElement
```

To initialize all selects on a page, you can use the `Select.init` method:

```coffeescript
Select.init()
```

By default, that will init all `select` elements, pass a `selector` to be more specific:

```coffeescript
Select.init({selector: '.my-select'})
```

You can pass any options you'd like to init your select's with into `init`:

```coffeescript
Select.init({className: 'select-theme-dark'})
```

#### The Select Object
  
The `Select` constructor returns a `Select` object.  You can also get the select instance by reading the `.selectInstance` property off of the
original `select` element:

```coffeescript
MySelect = new Select
  el: myElement

# OR

new Select
  el: myElement

MySelect = el.selectInstance
```

The `Select` object has the following properties:

- `.close()`: Close the dropdown, if it's open
- `.open()`: Open the dropdown, if it's closed
- `.toggle()`: Toggle between open and closed
- `.isOpen()`: Returns true if the dropdown is open
- `.change(val)`: Change the select to the option with the value provided
- `.value`: The current value of the select

You can also bind events on the select object:

- `.on(event, handler, [context])`: When `event` happens, call `handler`, with `context`
- `.off(event, [handler])`: Unbind the provided `event` - `handler` combination
- `.once(event, handler, [context])`: The next time `event` happens, call `handler`, with `context`

Events:

- `open`
- `close`
- `change`
- `highlight`

When the select's value changes, the value of the original `select` element it's based on will change
as well, so feel free to read the value from that element, or listen to it's `change` event.

#### Changing the theme

To change from the default theme, change the `className` property.

```coffeescript
new Select
    el: selectElement
    className: 'select-theme-dark'
```

#### Changing the positioning

Select has an option called `selectLikeAlignment` which allows you to change whether
the drop is positioned like a real
select element (with the currently selected option over the element) or like a canonical dropdown menu.

By default, this property is set to `"auto"`, meaning it will align the drop like a select only when the number of items in the options chooser does not cause it to scroll. The other options are `"always"` and never `"never"`.

In this example, we Select to always open the drop like a dropdown menu.

```coffeescript
new Select
    el: selectElement
    selectLikeAlignment: 'never'
```

### Themes

Currently there are three themes for Select.js.

<table>
<thead>
<tr>
<th>Theme</th>
<th>Class name</th>
<th></th>
</tr>
</thead>
<tbody>
<tr><td>Default</td><td>(No class name necessary)</td><td><select data-className="select-theme-default"><option value="" selected="selected">Select a state...</option> <option value="AL">Alabama</option> <option value="AK">Alaska</option> <option value="AZ">Arizona</option> <option value="AR">Arkansas</option> <option value="CA">California</option> <option value="CO">Colorado</option> <option value="CT">Connecticut</option> <option value="DE">Delaware</option> <option value="DC">District Of Columbia</option> <option value="FL">Florida</option> <option value="GA">Georgia</option> <option value="HI">Hawaii</option> <option value="ID">Idaho</option> <option value="IL">Illinois</option> <option value="IN">Indiana</option> <option value="IA">Iowa</option> <option value="KS">Kansas</option> <option value="KY">Kentucky</option> <option value="LA">Louisiana</option> <option value="ME">Maine</option> <option value="MD">Maryland</option> <option value="MA">Massachusetts</option> <option value="MI">Michigan</option> <option value="MN">Minnesota</option> <option value="MS">Mississippi</option> <option value="MO">Missouri</option> <option value="MT">Montana</option> <option value="NE">Nebraska</option> <option value="NV">Nevada</option> <option value="NH">New Hampshire</option> <option value="NJ">New Jersey</option> <option value="NM">New Mexico</option> <option value="NY">New York</option> <option value="NC">North Carolina</option> <option value="ND">North Dakota</option> <option value="OH">Ohio</option> <option value="OK">Oklahoma</option> <option value="OR">Oregon</option> <option value="PA">Pennsylvania</option> <option value="RI">Rhode Island</option> <option value="SC">South Carolina</option> <option value="SD">South Dakota</option> <option value="TN">Tennessee</option> <option value="TX">Texas</option> <option value="UT">Utah</option> <option value="VT">Vermont</option> <option value="VA">Virginia</option> <option value="WA">Washington</option> <option value="WV">West Virginia</option> <option value="WI">Wisconsin</option> <option value="WY">Wyoming</option></select></tr>
<tr><td>Dark</td><td>select-theme-dark</td><td><select data-className="select-theme-dark"><option value="" selected="selected">Select a state...</option> <option value="AL">Alabama</option> <option value="AK">Alaska</option> <option value="AZ">Arizona</option> <option value="AR">Arkansas</option> <option value="CA">California</option> <option value="CO">Colorado</option> <option value="CT">Connecticut</option> <option value="DE">Delaware</option> <option value="DC">District Of Columbia</option> <option value="FL">Florida</option> <option value="GA">Georgia</option> <option value="HI">Hawaii</option> <option value="ID">Idaho</option> <option value="IL">Illinois</option> <option value="IN">Indiana</option> <option value="IA">Iowa</option> <option value="KS">Kansas</option> <option value="KY">Kentucky</option> <option value="LA">Louisiana</option> <option value="ME">Maine</option> <option value="MD">Maryland</option> <option value="MA">Massachusetts</option> <option value="MI">Michigan</option> <option value="MN">Minnesota</option> <option value="MS">Mississippi</option> <option value="MO">Missouri</option> <option value="MT">Montana</option> <option value="NE">Nebraska</option> <option value="NV">Nevada</option> <option value="NH">New Hampshire</option> <option value="NJ">New Jersey</option> <option value="NM">New Mexico</option> <option value="NY">New York</option> <option value="NC">North Carolina</option> <option value="ND">North Dakota</option> <option value="OH">Ohio</option> <option value="OK">Oklahoma</option> <option value="OR">Oregon</option> <option value="PA">Pennsylvania</option> <option value="RI">Rhode Island</option> <option value="SC">South Carolina</option> <option value="SD">South Dakota</option> <option value="TN">Tennessee</option> <option value="TX">Texas</option> <option value="UT">Utah</option> <option value="VT">Vermont</option> <option value="VA">Virginia</option> <option value="WA">Washington</option> <option value="WV">West Virginia</option> <option value="WI">Wisconsin</option> <option value="WY">Wyoming</option></select></tr>
<tr><td>Chosen</td><td>select-theme-chosen</td><td><select data-className="select-theme-chosen"><option value="" selected="selected">Select a state...</option> <option value="AL">Alabama</option> <option value="AK">Alaska</option> <option value="AZ">Arizona</option> <option value="AR">Arkansas</option> <option value="CA">California</option> <option value="CO">Colorado</option> <option value="CT">Connecticut</option> <option value="DE">Delaware</option> <option value="DC">District Of Columbia</option> <option value="FL">Florida</option> <option value="GA">Georgia</option> <option value="HI">Hawaii</option> <option value="ID">Idaho</option> <option value="IL">Illinois</option> <option value="IN">Indiana</option> <option value="IA">Iowa</option> <option value="KS">Kansas</option> <option value="KY">Kentucky</option> <option value="LA">Louisiana</option> <option value="ME">Maine</option> <option value="MD">Maryland</option> <option value="MA">Massachusetts</option> <option value="MI">Michigan</option> <option value="MN">Minnesota</option> <option value="MS">Mississippi</option> <option value="MO">Missouri</option> <option value="MT">Montana</option> <option value="NE">Nebraska</option> <option value="NV">Nevada</option> <option value="NH">New Hampshire</option> <option value="NJ">New Jersey</option> <option value="NM">New Mexico</option> <option value="NY">New York</option> <option value="NC">North Carolina</option> <option value="ND">North Dakota</option> <option value="OH">Ohio</option> <option value="OK">Oklahoma</option> <option value="OR">Oregon</option> <option value="PA">Pennsylvania</option> <option value="RI">Rhode Island</option> <option value="SC">South Carolina</option> <option value="SD">South Dakota</option> <option value="TN">Tennessee</option> <option value="TX">Texas</option> <option value="UT">Utah</option> <option value="VT">Vermont</option> <option value="VA">Virginia</option> <option value="WA">Washington</option> <option value="WV">West Virginia</option> <option value="WI">Wisconsin</option> <option value="WY">Wyoming</option></select></tr>
</tbody>
</table>
