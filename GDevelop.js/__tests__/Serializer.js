const initializeGDevelopJs = require('../../Binaries/embuild/GDevelop.js/libGD.js');

describe('libGD.js object serialization', function() {
  let gd = null;
  beforeAll((done) => (initializeGDevelopJs().then(module => {
    gd = module;
    done();
  })));

  describe('gd.SerializerElement', function() {
    it('should support operations on its value', function() {
      var element = new gd.SerializerElement();
      element.setStringValue('aaa');
      expect(element.getStringValue()).toBe('aaa');

      element.setIntValue(123);
      expect(element.getIntValue()).toBe(123);

      element.setDoubleValue(123.457);
      expect(element.getDoubleValue()).toBeCloseTo(123.457);
    });
    it('should cast values from a type to another', function() {
      var element = new gd.SerializerElement();
      element.setStringValue('123');
      expect(element.getStringValue()).toBe('123');
      expect(element.getIntValue()).toBe(123);
      expect(element.getDoubleValue()).toBe(123.0);

      element.setStringValue('true');
      expect(element.getBoolValue()).toBe(true);
      element.setBoolValue(false);
      expect(element.getBoolValue()).toBe(false);
    });
    it('should support operations on its children', function() {
      var element = new gd.SerializerElement();

      expect(element.hasChild('Missing')).toBe(false);
      var child1 = element.addChild('Child1');
      expect(element.hasChild('Child1')).toBe(true);
      expect(element.getChild('Child1').ptr).toBe(child1.ptr);

      var child2 = new gd.SerializerElement();
      child2.addChild('subChild').setStringValue('Hello world!');
      element.addChild('Child2');
      element.setChild('Child2', child2);

      expect(
        element
          .getChild('Child2')
          .getChild('subChild')
          .getStringValue()
      ).toBe('Hello world!');
    });
  });

  describe('gd.Serializer', function() {
    it('should serialize a Text Object', function() {
      var obj = new gd.TextObject('testObject');
      obj.setType('TextObject::Text');
      obj.setName('testObject');
      obj.setString('Text of the object, with 官话 characters');
      obj.setTags('inventory, player');

      var serializedObject = new gd.SerializerElement();
      obj.serializeTo(serializedObject);
      var jsonObject = gd.Serializer.toJSON(serializedObject);
      serializedObject.delete();
      obj.delete();

      expect(jsonObject).toBe(
        '{"bold": false,"italic": false,"name": "testObject","smoothed": true,"tags": "inventory, player","type": "TextObject::Text","underlined": false,"variables": [],"behaviors": [],"string": "Text of the object, with 官话 characters","font": "","characterSize": 20,"color": {"b": 0,"g": 0,"r": 0}}'
      );
    });
  });

  describe('gd.Serializer.fromJSON', function() {
    it('should unserialize and reserialize JSON', function() {
      var json =
        '{"a": {"a1": {"name": "","referenceTo": "/a/a1"}},"b": {"b1": "world"},"c": {"c1": 3},"things": {"0": {"name": "layout0","referenceTo": "/layouts/layout"},"1": {"name": "layout1","referenceTo": "/layouts/layout"},"2": {"name": "layout2","referenceTo": "/layouts/layout"},"3": {"name": "layout3","referenceTo": "/layouts/layout"},"4": {"name": "layout4","referenceTo": "/layouts/layout"}}}';

      var element = gd.Serializer.fromJSON(json);
      var outputJson = gd.Serializer.toJSON(element);

      expect(outputJson).toBe(json);
    });
  });

  describe('gd.Serializer.fromJSObject', function() {
    it('should unserialize and reserialize JSON', function() {
      var json =
        '{"a": {"a1": {"name": "","referenceTo": "/a/a1"}},"b": {"b1": "world"},"c": {"c1": 3},"things": {"0": {"name": "layout0","referenceTo": "/layouts/layout"},"1": {"name": "layout1","referenceTo": "/layouts/layout"},"2": {"name": "layout2","referenceTo": "/layouts/layout"},"3": {"name": "layout3","referenceTo": "/layouts/layout"},"4": {"name": "layout4","referenceTo": "/layouts/layout"}}}';
      var object = JSON.parse(json);

      var element = gd.Serializer.fromJSObject(object);
      var outputJson = gd.Serializer.toJSON(element);

      expect(outputJson).toBe(json);
    });
  });
});
