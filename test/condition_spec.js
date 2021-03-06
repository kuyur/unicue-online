var condition = require('../lib/nextc4js/condition');
var bufferutils = require('../lib/nextc4js/buffer-utils');
var test = require('tape');

var option = ['0x81~0x84', '0x30~0x39', '0x81~0xFE', '0x30~0x39'];
var option2 = ['0x90~0xE3', '0x30~0x39', '0x81~0xFE', '0x30~0x39'];

test('Condition unit test', function(t) {
  t.test('getIndexingOffset() - case1', function(assert) {
    var buffer = new Uint8Array([0x81, 0x30, 0x81, 0x30]);
    var chr = bufferutils.readUInt32BE(buffer, 0, 4);
    var con = condition.Condition.build(option);
    assert.equal(con.getIndexingOffset(chr), 0);
    assert.end();
  });

  t.test('getIndexingOffset() - case2', function(assert) {
    var buffer = new Uint8Array([0x84, 0x39, 0xFE, 0x39]);
    var chr = bufferutils.readUInt32BE(buffer, 0, 4);
    var con = condition.Condition.build(option);
    assert.equal(con.getIndexingOffset(chr), 50399);
    assert.end();
  });

  t.test('getIndexingOffset() - case3', function(assert) {
    var buffer = new Uint8Array([0x81, 0x30, 0x40, 0x30]);
    var chr = bufferutils.readUInt32BE(buffer, 0, 4);
    var con = condition.Condition.build(option);
    assert.equal(con.getIndexingOffset(chr), -1);
    assert.end();
  });

  t.test('getCodePoint()', function(assert) {
    var con = condition.Condition.build(option2);
    assert.equal(con.getCodePoint(0x10000 - 0x10000), 0x90308130);
    assert.equal(con.getCodePoint(0x10FFFF - 0x10000), 0xE3329A35);
    assert.end();
  });
});
