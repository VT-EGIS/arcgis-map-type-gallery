define([
  'dojo/_base/declare',
  'dojo/_base/lang'
], function (declare, lang) {
  return declare([], {
    constructor: function (opts) {
      lang.mixin(this, opts);
      this.visibleLayers = [];
    },
    setVisibleLayers: function (layers) {
      this.visibleLayers = layers;
    },
    show: function () {},
    hide: function () {}
  });
});
