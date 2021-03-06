var fs = require('fs');
var decoder = require('../lib/nextc4js/decoder');
var encodingrule = require('../lib/nextc4js/encoding-rule');
var consts = require('../lib/nextc4js/consts');
var bufferutils = require('../lib/nextc4js/buffer-utils');
var test = require('tape');

var gbkOptions = {
  'name': 'gbk-decoder',
  'description': 'GBK to Unicode.',
  'version': 'CP936 with enhancement',
  'type': 'decoder',
  'path': 'charmaps/front-gbk2u-little-endian.map',
  'rules': [
    {
      'byte': 1,
      'condition': ['0x00~0x80']
    }, {
      'byte': 2,
      'condition': ['0x81~0xFE', '0x40~0xFE']
    }
  ],
  'segments': [{
    'begin': 0,
    'end': 127,
    'reference': 'ascii',
    'characterset': 'ascii'
  }, {
    'begin': 128,
    'end': 128,
    'reference': 'buffer',
    'offset': 0,
    'characterset': 'Euro Sign'
  }, {
    'begin': 129,
    'end': 33087,
    'reference': 'undefined',
    'characterset': 'undefined'
  }, {
    'begin': 33088,
    'end': 65535,
    'reference': 'buffer',
    'offset': 1,
    'characterset': 'GBK'
  }]
};

var big5Options = {
  'name': 'big5-decoder',
  'description': 'Big5 to Unicode.',
  'version': 'UAO 2.50',
  'type': 'decoder',
  'path': 'charmaps/front-b2u-little-endian.map',
  'rules': [
    {
      'byte': 1,
      'condition': ['0x00~0x7F']
    }, {
      'byte': 2,
      'condition': ['0x81~0xFE', '0x40~0xFE']
    }
  ],
  'segments': [{
    'begin': 0,
    'end': 127,
    'reference': 'ascii',
    'characterset': 'ascii'
  }, {
    'begin': 128,
    'end': 33087,
    'reference': 'undefined',
    'characterset': 'undefined'
  }, {
    'begin': 33088,
    'end': 65535,
    'reference': 'buffer',
    'offset': 0,
    'characterset': 'BIG5 UAO 2.50'
  }]
};

var gb18030Options = {
  'name': 'gb18030-decoder',
  'description': 'GB18030 to Unicode.',
  'version': 'GB18030-2005',
  'type': 'decoder',
  'path': 'charmaps/front-gb180302u-little-endian.map',
  'rules': [
    {
      'byte': 1,
      'condition': ['0x00~0x80']
    }, {
      "byte": 1,
      "condition": ["0xFF"]
    }, {
      'byte': 2,
      'condition': ['0x81~0xFE', '0x40~0xFE']
    }, {
      'byte': 4,
      'condition': ['0x81~0x84', '0x30~0x39', '0x81~0xFE', '0x30~0x39']
    }, {
      'byte': 4,
      'condition': ['0x90~0xE3', '0x30~0x39', '0x81~0xFE', '0x30~0x39']
    }
  ],
  'segments': [{
    'begin': 0,
    'end': 127,
    'reference': 'ascii',
    'characterset': 'ascii'
  }, {
    'begin': 128,
    'end': 128,
    'reference': 'buffer',
    'offset': 0,
    'characterset': 'Euro Sign'
  }, {
    'begin': 129,
    'end': 33087,
    'reference': 'undefined',
    'characterset': 'undefined'
  }, {
    'begin': 33088,
    'end': 65535,
    'reference': 'buffer',
    'offset': 1,
    'characterset': 'GBK'
  }, {
    'begin': 65536,
    'end': 2167439663,
    'reference': 'undefined',
    'characterset': 'undefined'
  }, {
    'begin': 2167439664,
    'end': 2218393145,
    'condition': ['0x81~0x84', '0x30~0x39', '0x81~0xFE', '0x30~0x39'],
    'reference': 'indexing-buffer',
    'offset': 32449,
    'characterset': 'Unicode (BMP)'
  }, {
    'begin': 2218393146,
    'end': 2419097903,
    'reference': 'undefined',
    'characterset': 'undefined'
  }, {
    'begin': 2419097904,
    'end': 3812228665,
    'condition': ['0x90~0xE3', '0x30~0x39', '0x81~0xFE', '0x30~0x39'],
    'reference': 'gb18030-unicode-sp-mapping',
    'characterset': 'Unicode (SP)'
  }, {
    'begin': 3812228666,
    'end': 4294967295,
    'reference': 'undefined',
    'characterset': 'undefined'
  }]
};

if (!fs.existsSync('test/out')) {
  fs.mkdirSync('test/out');
}

test('GBK Decoder unit test', function(t) {
  t.test('decode()', function(assert) {
    var charmap = fs.readFileSync(gbkOptions.path);
    var gbkTextBuffer = fs.readFileSync('test/txt/gbk/02-gbk.txt');
    var gbkDecoder = new decoder.Multibyte(gbkOptions, new Uint16Array(charmap.buffer));
    var unicodeBuffer = gbkDecoder.decode(gbkTextBuffer);
    assert.equal(unicodeBuffer != null, true);
    var unicodeString = bufferutils.toString(unicodeBuffer);
    assert.equal(unicodeString, '??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????');
    assert.end();
  });
});

test('Big5 Decoder unit test', function(t) {
  t.test('decode()', function(assert) {
    var charmap = fs.readFileSync(big5Options.path);
    var big5TextBuffer = fs.readFileSync('test/txt/big5/02-big5.cue');
    var big5Decoder = new decoder.Multibyte(big5Options, new Uint16Array(charmap.buffer));
    var unicodeBuffer = big5Decoder.decode(big5TextBuffer);
    assert.equal(unicodeBuffer != null, true);
    var utf8Buffer = encodingrule.UTF8.encode(unicodeBuffer);
    fs.open('test/out/decoding-test-big5-in-utf8-out.cue', 'w+', function(err, fd) {
      fs.writeSync(fd, consts.UTF8_BOM, 0, consts.UTF8_BOM.length, 0);
      fs.writeSync(fd, utf8Buffer, 0, utf8Buffer.length, consts.UTF8_BOM.length);
      fs.closeSync(fd);
    });
    assert.end();
  });
});

test('GB18030 Decoder unit test', function(t) {
  t.test('decode()', function(assert) {
    var charmap = fs.readFileSync(gb18030Options.path);
    var gb18030Decoder = new decoder.Multibyte(gb18030Options, new Uint16Array(charmap.buffer));
    var gb18030TextBuffer = fs.readFileSync('test/txt/gb18030/gb18030.txt');
    var unicodeBuffer = gb18030Decoder.decode(gb18030TextBuffer);
    assert.equal(unicodeBuffer != null, true);
    var utf16leBuffer = encodingrule.UTF16LE.encode(unicodeBuffer);
    fs.open('test/out/decoding-test-gb18030-in-utf16le-out.txt', 'w+', function(err, fd) {
      fs.writeSync(fd, consts.UTF16LE_BOM, 0, consts.UTF16LE_BOM.length, 0);
      fs.writeSync(fd, utf16leBuffer, 0, utf16leBuffer.length, consts.UTF16LE_BOM.length);
      fs.closeSync(fd);
    });

    var utf16beBuffer = encodingrule.UTF16BE.encode(unicodeBuffer);
    fs.open('test/out/decoding-test-gb18030-in-utf16be-out.txt', 'w+', function(err, fd) {
      fs.writeSync(fd, consts.UTF16BE_BOM, 0, consts.UTF16BE_BOM.length, 0);
      fs.writeSync(fd, utf16beBuffer, 0, utf16beBuffer.length, consts.UTF16BE_BOM.length);
      fs.closeSync(fd);
    });

    assert.end();
  });
});

test('UTF16LE Decoder unit test', function(t) {
  t.test('decode() - performance', function(assert) {
    var ts = new Date;
    var utf16TextBuffer = fs.readFileSync('test/txt/utf-16/bungakusyoujyo-unicode.txt');
    var unicodeBuffer = decoder.UTF16LE.decode(utf16TextBuffer);
    assert.equal(decoder.UTF16LE.hasBom(utf16TextBuffer), true);
    assert.equal(unicodeBuffer != null, true);
    var utf8Buffer = encodingrule.UTF8.encode(unicodeBuffer);
    fs.writeFileSync('test/out/decoding-test-utf16le-in-utf8-out.txt', utf8Buffer, {flag: 'w+'});
    console.log('Consumed time: ' + (new Date - ts) + 'ms');
    assert.end();
  });
});
