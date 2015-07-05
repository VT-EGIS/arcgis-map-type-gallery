define([
  'intern!object',
  'intern/chai!assert',
  'mapTypeWidget/item',
  'intern/order!node_modules/sinon/lib/sinon',
  'tests/stubs/esri/layers/ArcGISDynamicMapServiceLayer',
  'dojo/dom-class',
  'dojo/NodeList-manipulate'
], function (registerSuite, assert, Item, sinon, ArcGISDynamicMapServiceLayer, domClass) {
  var clickEvent, createFixture, hide_stub, show_stub;

  clickEvent = function () {
    var evt;

    evt = document.createEvent('MouseEvent');
    evt.initMouseEvent('click', true, false);
    return evt;
  };

  createFixture = function (id) {
    var body, div;

    div = document.createElement('div');
    div.id = id;
    body = document.getElementsByTagName('body')[0];
    body.appendChild(div);
    return div;
  };

  registerSuite({
    name: 'Map Type Item',

    beforeEach: function () {
      widget = new Item({
        layerUrls : [
          'layer1.1',
          'layer1.2'
        ],
        name: 'label1',
        map: { addLayer: sinon.stub() },
        url: 'url',
        id: 'id'
      });
    },

    afterEach: function () {
      widget.destroy();
    },

    'loads the layers of the map': function () {
      assert.isTrue(widget.map.addLayer.calledTwice);
    },

    'show': {
      beforeEach: function () {
        show_stub = sinon.stub(ArcGISDynamicMapServiceLayer.prototype, 'show');
        widget.show();
      },
      afterEach: function () {
        show_stub.restore();
      },
      'adds the css class': function () {
        assert.isTrue(domClass.contains(widget.domNode, 'mapType-selected'));
      },
      'shows the layer': function () {
        assert.isTrue(show_stub.calledTwice);
      }
    },

    'hide': {
      beforeEach: function () {
        hide_stub = sinon.stub(ArcGISDynamicMapServiceLayer.prototype, 'hide');
        widget.hide();
      },
      afterEach: function () {
        hide_stub.restore();
      },
      'removes the css class': function () {
        assert.isFalse(domClass.contains(widget.domNode, 'mapType-selected'));
      },
      'hides the layer': function () {
        assert.isTrue(hide_stub.calledTwice);
      }
    },

    'isActive': function () {
      widget.show();
      assert.isTrue(widget.isActive());
      widget.hide();
      assert.isFalse(widget.isActive());
    }
  });
}); 
