define([
  'dojo/_base/declare',
  'esri/map',
  'app/config',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dijit/Dialog',
  'dojo/query',
  'mapTypeWidget'
], function (declare, map, config, array, lang, Dialog, query, MapTypeWidget) {
  return declare([], {
    constructor: function () {
      this.map = new map('map', config.map);
      this.map.on('load', lang.hitch(this, 'addMapTypeWidget')); 
    },

    addMapTypeWidget: function () {
      this.mapTypeWidget = new MapTypeWidget({
        mapTypes: config.mapTypes,
        map: this.map,
        defaultMapTypeIndex: 1,
        'class': 'list'
      });

      this.mapTypeWidget.on('basemap-changed', function (name) {
        console.log('Basemap changed to ' + name);
      });

      this.mapTypeDialog = new Dialog({
        title: 'Map Type',
        content: this.mapTypeWidget,
        id: 'map-type-dialog'
      });

      query('#map-type').on('click', lang.hitch(this, function (evt) {
        this.mapTypeDialog.show();
      }));
    },
  });
});
