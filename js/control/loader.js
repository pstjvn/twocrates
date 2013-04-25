goog.provide('k3d.control.Loader');

goog.require('goog.Uri');
goog.require('goog.asserts');
goog.require('goog.async.Deferred');
goog.require('goog.json.NativeJsonProcessor');
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
  this.jsonProcessor_ = new goog.json.NativeJsonProcessor();
  this.handleSaveBound_ = goog.bind(this.handleSave, this);
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
   * Saves the kitchen data on the server.
   * @param {k3d.ds.KitchenProject} kitchen The project data structure to save.
   */
  _.saveKitchen = function(kitchen) {
    goog.net.XhrIo.send(Path.SAVE_KITCHEN, this.handleSaveBound_, 'POST',
      this.jsonProcessor_.stringify(kitchen), {
        'Content-Type': 'applicaion/json'});
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
   * Checks for known errors on responses.
   * @param {goog.events.Event} e The COMPLETE network event.
   * @return {Object} The parsed response object.
   * @protected
   */
  _.checkForErrors = function(e) {
    var target = /** @type {goog.net.XhrIo} */ (e.target);
    var data;
    if (!target.isSuccess()) {
      mb.Bus.publish(mb.Topic.ERROR, Static.SERVER_HTTP_ERROR);
      throw new Error('Request did not dinish with success');
    }
    var text = target.getResponseText();
    try {
       data = this.jsonProcessor_.parse(text);
    } catch (err) {
      mb.Bus.publish(mb.Topic.ERROR, Static.UNPARSABLE_JSON);
      throw new Error('Result cannot be parsed as json');
    }
    if (data[Struct.STATUS] != 0) {
      this.lastKnownServerError_ = data[Struct.STATUS];
      mb.Bus.publish(mb.Topic.ERROR, Static.STRUCTURED_ERROR);
      throw new Error('Status of result was not OK');
    }
    goog.asserts.assertObject(data);
    return data;
  };

  /**
   * Handles the save action of kitchen structures.
   * @param {goog.events.Event} e The COMPLETE network event.
   * @protected
   */
  _.handleSave = function(e) {
    var result;
    try {
      result = this.checkForErrors(e);
    } catch (err) {
    }
  };

  /**
   * Handles the load event from the xhr request for loading the project.
   * @param {goog.events.Event} e The COMPLETE event from the net package.
   * @private
   */
  _.handleKitchenDataLoadEvent_ = function(e) {
    var result;
    try {
      result = this.checkForErrors(e);
    } catch (err) {}
    // we want to resolve the deffered onlypossitively, everything else as error
    // is published
    this.kitchenDef_.callback(new k3d.ds.KitchenProject(
      result[Struct.KITCHEN]));
  };
});
