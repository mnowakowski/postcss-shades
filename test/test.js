import { equal } from 'assert';
import postcss from 'postcss';
import mix from './../index';

const verify = function(input, expected, done) {
  postcss([ mix() ])
    .process(input)
    .then((result) => {
      equal(result.css, expected);
      equal(result.warnings().length, 0);
      done();
    }).catch((error) => { done(error); });
};

it('color with regular black and white', (done)=> {
  verify(
      `a { color: shades(#3A4E58, 600); }`,
      `a { color: #2E3E46; }`,
  done);
});

it('color with custom black and white', (done)=> {
  verify(
      `a { color: shades(#E0211B, 600, #ffefe9, #400000); }`,
      `a { color: #C01A16; }`,
  done);
});

it('color for border', (done)=> {
  verify(
      `a { border: 1px solid shades(#E0211B, 600, #ffefe9, #400000); }`,
      `a { border: 1px solid #C01A16; }`,
  done);
});

it('color in rgb', (done)=> {
  verify(
      `a { color: shades(#E0211B, 600, #ffefe9, #400000, false); }`,
      `a { color: rgb(192, 26, 22); }`,
  done);
});
