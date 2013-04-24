goog.provide('k3d.control.Loader');

goog.require('goog.Uri');
goog.require('goog.async.Deferred');
goog.require('goog.net.XhrIo');
goog.require('k3d.ds.KitchenProject');
goog.require('k3d.ds.definitions');
goog.require('k3d.mb');
goog.require('pstj.control.Base');

/**
 * My new class description
 * @constructor
 * @extends {pstj.control.Base}
 */
k3d.control.Loader = function() {
  goog.base(this);
  this.isLoaded_ = false;
  this.isDirty_ = false;
  this.lastKnownServerError_ = 0;
  this.kitchenDef_ = new goog.async.Deferred();
};
goog.inherits(k3d.control.Loader, pstj.control.Base);
goog.addSingletonGetter(k3d.control.Loader);

goog.scope(function() {

  var _ = k3d.control.Loader.prototype;
  var Path = k3d.ds.definitions.Path;
  var Struct = k3d.ds.definitions.Struct;
  var Static = k3d.ds.definitions.Static;
  var mb = k3d.mb;

  /**
   * Gets the data for the kitchen project from the server if needed and
   *   returns a deferred.
   * @return {goog.async.Deferred}
   */
  _.getKitchen = function() {
    if (!this.isLoaded_) {
      goog.net.XhrIo.send(this.composeLoadUri_(),
        goog.bind(this.handleKitchenDataLoadEvent_, this));
    }
    return this.kitchenDef_;
  };

  /**
   * Gets the last recorded status error from laoding.
   * @return {number} The status.
   */
  _.getKitchenLoadStatus = function() {
    return this.lastKnownServerError_;
  };

  /**
   * Composes the URI path for kitchen project loading.
   * @return {string} The path part of the uri for loading the kitchen data.
   * @private
   */
  _.composeLoadUri_ = function() {
    var uri = goog.Uri.parse(window.location.href);
    if (uri.hasQuery()) {
      var kitchen_id = uri.getQueryData().get(Struct.KITCHEN_PROJECT_ID);
      if (goog.isString(kitchen_id)) {
        return Path.LOAD_KITCHEN + '?' + Struct.KITCHEN_PROJECT_ID + '=' +
          kitchen_id;
      }
    }
    return Path.LOAD_KITCHEN;
  };

  /**
   * Handles the load event from the xhr request for loading the project.
   * @param {goog.events.Event} e The COMPLETE event from the net package.
   * @private
   */
  _.handleKitchenDataLoadEvent_ = function(e) {
    var target = /** @type {goog.net.XhrIo} */ (e.target);
    if (!target.isSuccess()) {
      mb.Bus.publish(mb.Topic.ERROR, Static.SERVER_HTTP_ERROR);
      return;
    }
    var text = target.getResponseText();
    var data;
    try {
      data = goog.json.parse(text);
    } catch (err) {
      mb.Bus.publish(mb.Topic.ERROR, Static.UNPARSABLE_JSON);
      return;
    }
    if (data[Struct.STATUS] != 0) {
      this.lastKnownServerError_ = data[Struct.STATUS];
      mb.Bus.publish(mb.Topic.ERROR, Static.STRUCTURED_ERROR);
      return;
    }
    // we want to resolve the deffered onlypossitively, everything else as error
    // is published
    this.kitchenDef_.callback(new k3d.ds.KitchenProject(data[Struct.KITCHEN]));
  };
});
