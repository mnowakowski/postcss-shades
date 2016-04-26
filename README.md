# postcss-shades

Simple PostCSS plugin which returns shades of color.
Range of shades: 100, 200, 300, 400, 500, 600, 700, 900.
'500' is the base.

## Usage

    postcss([ require('postcss-shades') ])

## Example

```css
a {
    color: shades(#3A4E58, 600);
}
```

Output:
```css
a {
    color: #2E3E46;
}
```
