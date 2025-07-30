---
title: "Customization"
date: 2018-12-29T11:02:05+06:00
type: "post"
author: "Somrat"
---

**Doc-List** has been built to be as configurable as possible.


### Change the logo

In `config.toml` you will find a logo variable. you can change your logo there.

<div class="alert rounded-0 alert-info">
The size of the logo will adapt automatically
</div>

### Change the favicon

If your favicon is a png, just drop off your image in your local `static/images/` folder and name it `favicon.png`

If you need to change this default behavior, create a new file in `layouts/partials/` named `head.html`. Then write something like this:

```html
<link rel="shortcut icon" href="/images/favicon.png" type="image/x-icon" />
```

### Change default colors

**Doc-List** support change color. You can change the colors from `config.toml`. You can change the colors of the template as you want.


```toml
[params]
  # Change default color scheme with a color name or color code.
  primaryColor = "yourColor"
  secondaryColor = "yourColor"
  textColor = "yourColor"
  textColorDark = "yourColor"
  whiteColor = "yourColor"
```