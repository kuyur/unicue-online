var fs = require('fs');
var converter = require('../lib/nextc4js/converter');
var bufferutils = require('../lib/nextc4js/buffer-utils');
var consts = require('../lib/nextc4js/consts');
var test = require('tape');

var sim2traOptions= {
  'name': 'simp2tra-medium',
  'description': 'Simplified Chinese character to Traditional Chinese character basing on UCS2 (Unicode BMP).',
  'version': 'Unicode 4.0 Unihan(Wikipedia version)',
  'type': 'converter',
  'path': 'charmaps/medium-simp2tra-little-endian.map',
  'bytes': 2,
  'segments':[
    {
      'begin': 0,
      'end': 13725,
      'reference': 'self',
      'characterset': 'Unicode BMP'
    }, {
      'begin': 13726,
      'end': 40863,
      'reference': 'buffer',
      'offset': 0,
      'characterset': 'Unicode BMP'
    }, {
      'begin': 40864,
      'end': 65535,
      'reference': 'self',
      'characterset': 'Unicode BMP'
    }, {
      'begin': 65536,
      'end': 1114111,
      'reference': 'self',
      'characterset': 'Unicode SP'
    }
  ]
};

var tra2simpOptions = {
  'name': 'tra2simp-medium',
  'description': 'Traditional Chinese character to Simplified Chinese character basing on UCS2 (Unicode BMP).',
  'version': 'Unicode 4.0 Unihan(Wikipedia version)',
  'type': 'converter',
  'path': 'charmaps/medium-tra2simp-little-endian.map',
  'bytes': 2,
  'segments':[
    {
      'begin': 0,
      'end': 17078,
      'reference': 'self',
      'characterset': 'Unicode BMP'
    }, {
      'begin': 17079,
      'end': 40860,
      'reference': 'buffer',
      'offset': 0,
      'characterset': 'Unicode BMP'
    }, {
      'begin': 40861,
      'end': 65535,
      'reference': 'self',
      'characterset': 'Unicode BMP'
    }, {
      'begin': 65536,
      'end': 1114111,
      'reference': 'self',
      'characterset': 'Unicode SP'
    }
  ]
};

test('Simplified Chinese to Traditional Chinese Converter unit test', function(t) {
  t.test('convert()', function(assert) {
    var charmap = fs.readFileSync(sim2traOptions.path);
    var s2t = new converter.Converter(sim2traOptions, new Uint16Array(charmap.buffer));
    var text = '????????????????????????';
    var buffer = s2t.convert(bufferutils.toBuffer(text));
    assert.equal(buffer != null, true);
    var converted = bufferutils.toString(buffer);
    assert.equal(converted, '????????????????????????');
    assert.end();
  });
});

test('Traditional Chinese to Simplified Chinese Converter unit test', function(t) {
  t.test('convert()', function(assert) {
    var charmap = fs.readFileSync(tra2simpOptions.path);
    var t2s = new converter.Converter(tra2simpOptions, new Uint16Array(charmap.buffer));
    var text = '????????????????????????';
    var buffer = t2s.convert(bufferutils.toBuffer(text));
    assert.equal(buffer != null, true);
    var converted = bufferutils.toString(buffer);
    assert.equal(converted, '????????????????????????');
    assert.end();
  });
});
