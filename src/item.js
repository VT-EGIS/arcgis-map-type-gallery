define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dojo/dom-class',
  'dojo/text!./template.html',
  'esri/layers/ArcGISDynamicMapServiceLayer',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/query'
], function (declare, _WidgetBase, _TemplatedMixin, domClass, template,
            ArcGISDynamicMapServiceLayer, array, lang, query) {
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,

    postCreate: function () {
      this.loadLayers();
      this._active = false;
    },

    loadLayers: function () {
      this.layers = array.map(this.layerUrls, lang.hitch(this, function (url, index) {
        var serviceLayer;

        serviceLayer = new ArcGISDynamicMapServiceLayer(url, {
          id: this.name + index
        });
        serviceLayer.hide();
        this.map.addLayer(serviceLayer, 1);

        return serviceLayer;
      }));
    },

    show: function () {
      this._active = true;
      domClass.add(this.domNode, 'mapType-selected');
      array.forEach(this.layers, function (layer) {
        layer.show();
      });
    },

    hide: function () {
      this._active = false;
      domClass.remove(this.domNode, 'mapType-selected');
      array.forEach(this.layers, function (layer) {
        layer.hide();
      });
    },

    isActive: function () {
      return this._active;
    }
  });
});
