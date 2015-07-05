define([
  'intern!object',
  'intern/chai!assert',
  'mapTypeWidget',
  'dojo/query',
  'intern/order!node_modules/sinon/lib/sinon',
  'dojo/NodeList-manipulate'
], function (registerSuite, assert, MapTypeGallery, dojoQuery, sinon) {
  var mapTypeGallery, mapFixture, galleryFixture, children, clickEvent,
      createFixture, mapTypes; 

  mapTypes = [
    {
      label : 'label1',
      thumbnail : 'http://path/to/thumbnail1.png',
      layerUrls : [
        'layer1.1',
        'layer1.2'
      ]
    },
    {
      label : 'label2',
      thumbnail : 'http://path/to/thumbnail2.png',
      layerUrls : [
        'layer2.1'
      ]
    }
  ];

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
    name: 'Map Type Gallery',

    beforeEach: function () {
      mapFixture = createFixture('map');
      galleryFixture = createFixture('maptype-gallery');

      mapTypeGallery = new MapTypeGallery({
        map: { addLayer: sinon.stub() },
        mapTypes: mapTypes
      }, 'maptype-gallery');

      children = mapTypeGallery.getChildren();
    },

    afterEach: function () {
      mapTypeGallery.destroy();
      galleryFixture.remove();
      mapFixture.remove();
    },

    'requires an array of map types': function () {
      var execFunc;

      execFunc = function () {
        new MapTypeGallery({
          map: { addLayer: sinon.stub() }
        }, 'maptype-gallery');
      }

      assert.throws(execFunc, Error, 'The option "mapTypes" is required');

      execFunc = function () {
        new MapTypeGallery({
          map: { addLayer: sinon.stub() },
          mapTypes: {}
        }, 'maptype-gallery');
      }

      assert.throws(execFunc, Error, 'The option "mapTypes" is required');

      execFunc = function () {
        new MapTypeGallery({
          map: { addLayer: sinon.stub() },
          mapTypes: []
        }, 'maptype-gallery');
      }

      assert.throws(execFunc, Error, 'The option "mapTypes" is required');
    },

    'checks if default map index is within range': function () {
      execFunc = function () {
        new MapTypeGallery({
          map: { addLayer: sinon.stub() },
          mapTypes: mapTypes,
          defaultMapTypeIndex: 3
        });
      }

      assert.throws(execFunc, Error, 'The option "defaultMapTypeIndex" is out of bounds');
    },

    'creates a gallery of map types': {
      'has the correct amount of list items': function () {
        assert.lengthOf(children, 2);
      },
    },

    'defaultMapTypeIndex': {
      'when not provided, selects the first one': function () {
        assert.isTrue(children[0].isActive());
        assert.isFalse(children[1].isActive());
      }, 

      'when provided, selects that one': function () {
        var children;

        mapTypeGallery.destroy();
        mapTypeGallery = new MapTypeGallery({
          map: { addLayer: sinon.stub() },
          mapTypes: mapTypes,
          defaultMapTypeIndex: 1
        }, 'maptype-gallery');

        children = mapTypeGallery.getChildren();
        assert.isFalse(children[0].isActive());
        assert.isTrue(children[1].isActive());
      }
    },

    'when a map type is selected': {
      'hides the current map type': function () {
        var dfd;

        dfd = this.async(1000);

        dojoQuery('img', children[1].domNode)[0].dispatchEvent(clickEvent());

        setTimeout(dfd.callback(function () {
          assert.isFalse(children[0].isActive());
        }), 100);
      },

      'displays the selected one': function () {
        var dfd;

        dfd = this.async(1000);

        dojoQuery('img', children[1].domNode)[0].dispatchEvent(clickEvent());

        setTimeout(dfd.callback(function () {
          assert.isTrue(children[1].isActive());
        }), 100);
      },

      'if map type changed, emits event': function () {
        var dfd, stub;

        dfd = this.async(1000);
        stub = sinon.stub(); 

        mapTypeGallery.on('basemap-changed', stub);
        dojoQuery('img', children[1].domNode)[0].dispatchEvent(clickEvent());

        setTimeout(dfd.callback(function () {
          var args;

          assert.isTrue(stub.calledOnce);
          args = stub.getCall(0).args;
          assert.lengthOf(args, 1);
          assert.strictEqual(args[0], 'label2');
        }), 200);
      },

      'if map type remained the same, does not emit event': function () {
        var dfd, stub;

        stub = sinon.stub(); 
        mapTypeGallery.on('basemap-changed', stub);
        dfd = this.async(1000);

        dojoQuery('img', children[0].domNode)[0].dispatchEvent(clickEvent());

        setTimeout(dfd.callback(function () {
          assert.isFalse(stub.calledOnce);
        }), 100);
      }
    }
  });
}); 
