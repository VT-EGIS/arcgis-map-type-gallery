define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_Container',
  'dojo/on',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dijit/registry',
  './item',
  'dojo/Evented'
], function (declare, _WidgetBase, _TemplatedMixin, _Container, on, lang,
             array, registry, Item, Evented) {
  return declare([_WidgetBase, _Container, Evented, _TemplatedMixin], {

    templateString: '<ul></ul>',

    postMixInProperties: function () {
      if(!(this.mapTypes &&
          (this.mapTypes instanceof Array) &&
           this.mapTypes.length)) {
        throw new Error('The option "mapTypes" is required');
      }
      if(this.defaultMapTypeIndex >= this.mapTypes.length) {
        throw new Error('The option "defaultMapTypeIndex" is out of bounds');
      }
      this.defaultMapTypeIndex = this.defaultMapTypeIndex || 0;
    },

    postCreate: function() {
      this.createGallery();
      this.attachEventHandlers();
      this.currentItem = this.getChildren()[this.defaultMapTypeIndex]; 
      this.currentItem.show();
    },

    attachEventHandlers : function () {
      on(this.domNode, 'img:click', lang.hitch(this, function (evt) {
        var item;

        evt.preventDefault();

        item = registry.getEnclosingWidget(evt.target);

        if(!item.isActive()) {
          this.emit('basemap-changed', item.name);
          this.currentItem.hide();
          this.currentItem = item;
          this.currentItem.show();
        }
      }));
    },

    createGallery : function () {
      array.forEach(this.mapTypes, lang.hitch(this, function (mapType, index) {
        this.addChild(new Item({
          name : mapType.label,
          id   : 'mapType-gallery-item-' + index,
          url  : mapType.thumbnail,
          layerUrls: mapType.layerUrls,
          map: this.map,
          imgClass: this.imgClass
        }));
      }));
    }
  });
});
