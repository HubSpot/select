## Select

[![npm
version](https://badge.fury.io/js/tether-select.svg)](http://badge.fury.io/js/tether-select)
[![Bower
version](https://badge.fury.io/bo/tether-select.svg)](http://badge.fury.io/bo/tether-select)

Select.js is a Javascript and CSS library for creating styleable select elements.  It aims to reproduce the behavior of native controls as much as is possible, while allowing for complete styling with CSS.


## Install

__Dependencies__

* __[Tether](https://github.com/HubSpot/tether)__

Installing via `npm` and `bower` will bring in the above dependencies as well.


__npm__
```sh
$ npm install tether-select
```

__bower__
```sh
$ bower install tether-select
```

## Usage

```javascript
let selectInstance = new Select({
  el: document.querySelector('select.select-target'),
  className: 'select-theme-default'
})
```

[API Documentation](http://github.hubspot.com/select)

[Demo](http://github.hubspot.com/select/docs/welcome)


## Contributing

We encourage contributions of all kinds. If you would like to contribute in some way, please review our [guidelines for contributing](CONTRIBUTING.md).


## License
Copyright &copy; 2015 HubSpot - [MIT License](LICENSE)
