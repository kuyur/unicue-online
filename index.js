var { DecoderMultibyte, utils, loadDefault } = require('nextc4.js');

var option = {
  "name": "Greek(CP1253)",
  "description": "Greek to Unicode.",
  "version": "Microsoft CP1253",
  "type": "decoder",
  "buffer": "data:application/octet-stream;base64,rCD9/xogkgEeICYgICAhIP3/MCD9/zkg/f/9//3//f/9/xggGSAcIB0gIiATIBQg/f8iIf3/OiD9//3//f/9/6AAhQOGA6MApAClAKYApwCoAKkA/f+rAKwArQCuABUgsACxALIAswCEA7UAtgC3AIgDiQOKA7sAjAO9AI4DjwOQA5EDkgOTA5QDlQOWA5cDmAOZA5oDmwOcA50DngOfA6ADoQP9/6MDpAOlA6YDpwOoA6kDqgOrA6wDrQOuA68DsAOxA7IDswO0A7UDtgO3A7gDuQO6A7sDvAO9A74DvwPAA8EDwgPDA8QDxQPGA8cDyAPJA8oDywPMA80DzgP9/w==",
  "byte": 2,
  "rules": [
    {
      "condition": [
        "0x00~0xFF"
      ]
    }
  ],
  "segments": [
    {
      "begin": 0,
      "end": 127,
      "reference": "ascii",
      "characterset": "ascii"
    },
    {
      "begin": 128,
      "end": 255,
      "reference": "buffer",
      "offset": 0,
      "characterset": "CP1253"
    }
  ]
};
var cp1253 = new DecoderMultibyte(option);

var codepoints = cp1253.decode(new Uint8Array([0x41, 0x42, 0x43, 0x80, 0xDC, 0xDD, 0xDE, 0xDF]));
console.log(utils.buffer.toString(codepoints));

var context = loadDefault();
console.log(context.getDecoderNames());
console.log(context.getEncoderNames());
