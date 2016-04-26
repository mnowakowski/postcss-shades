import postcss from 'postcss';
import balanced from 'balanced-match';
import Color from 'color';
import { try as postcssTry } from 'postcss-message-helpers';

const shades = (color, weight, black = '#000000', white = '#ffffff', hex = true) => {
    let rgbC = Color(color).rgbArray();
    let refC = rgbC;
    let r = rgbC[0];
	let g = rgbC[1];
	let b = rgbC[2];
    let percent = 0;

	if (weight > 500) {
		refC = Color(black).rgbArray();
		percent = (weight - 500) / 500;
	} else if (weight < 500) {
        refC = Color(white).rgbArray();
		percent = (500 - weight) / 500;
	}

	r = Math.round(refC[0] * percent + r * (1-percent));
	g = Math.round(refC[1] * percent + g * (1-percent));
	b = Math.round(refC[2] * percent + b * (1-percent));

    let rgb = `rgb(${r}, ${g}, ${b})`;

	return (hex === true) ? Color(`rgb(${r}, ${g}, ${b})`).hexString() : rgb;
}

const transformColor = (string, source) => {
  if (string.indexOf('shades(') === -1) {
    return string;
  }

  const value = balanced('(', ')', string).body;

  if (!value) { throw new Error(`Missing closing parentheses in "${string}"`, source); }

  return shades.apply(null, value.split(/,\s*(?![^()]*\))/));
};

const transformDecl = (decl) => {
  if (!decl.value || decl.value.indexOf('shades(') === -1) {
    return;
  }
  decl.value = postcssTry(() => transformColor(decl.value, decl.source), decl.source )
};

export default postcss.plugin('postcss-shades', () =>
  (style) => { style.walkDecls(transformDecl); }
);
