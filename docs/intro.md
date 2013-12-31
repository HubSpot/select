<link rel="stylesheet" href="/select/css/select-theme-default.css" />
<link rel="stylesheet" href="/select/css/select-theme-dark.css" />
<link rel="stylesheet" href="/select/css/select-theme-chosen.css" />
<script src="/select/deps/tether/tether.min.js"></script>
<script src="/select/deps/drop/drop.min.js"></script>
<script src="/select/select.min.js"></script>
<script>$(function(){ $('select').each(function(){ new Select({ el: this, className: $(this).attr('data-className') }); }); });</script>

## Select

Select is a javascript and CSS library for creating styleable select elements.

Select uses [Tether](http://github.hubspot.com/tether/docs/welcome) and [Drop](http://github.com/HubSpot/drop) to create and position its element container.

### Dependencies

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