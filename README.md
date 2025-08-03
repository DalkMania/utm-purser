# UTM Purser

This is a library that allows you to save user data from first website visit to signup of to local storage.
Heavily inpired by [UTM params saver](https://github.com/szymansd/utm-params) and [Purser](https://github.com/bilbof/purser).

This is a combination based on those projects.

## Usage

```js
import UTMPurser from "utm-purser";

UTMPurser.init(); // this will init the purse

UTMPurser.get(); // this will return all params from localStorage

const addPurserValuesToMarketoForms = (form) => {
  // Add UTMPurser values to form submissions
  ...
  ...
}
```
