goog.provide('k3d.control.Loader');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.async.Deferred');
goog.require('goog.json.NativeJsonProcessor');
goog.require('goog.net.XhrIo');
goog.require('k3d.ds.KitchenProject');
goog.require('k3d.ds.definitions');
goog.require('k3d.mb');
goog.require('pstj.configure');
goog.require('pstj.control.Base');
goog.require('pstj.ds.ImageList');
goog.require('pstj.widget.Progress');

/**
 * This is our loader controler class. Use the instance getter to always refer
 *   correctly to it.
 * @constructor
 * @extends {pstj.control.Base}
 */
k3d.control.Loader = function() {
  goog.base(this);
  /**
   * Flag if the kitchen project as already been requested, this will
   *   guarantee that we request the project only once.
   * @type {boolean}
   * @private
   */
  this.kitchenAsBeenRequest_ = false;

  /**
   * Referrence to the last known server error.
   * @type {number}
   * @private
   */
  this.lastKnownServerError_ = 0;

  /**
   * Reference to the image list configured on server to be preloaded.
   * @type {Array.<string>}
   * @private
   */
  this.preloadImageList_ = goog.global['PRELOAD_IMAGE_LIST'];
  /**
   * The progress bar to use while initial loading is performed.
   * @type {pstj.widget.Progress}
   * @private
   */
  this.progress_ = new pstj.widget.Progress();
  this.progress_.setContent(goog.asserts.assertString(
    pstj.configure.getRuntimeValue('PRELOAD_TEXT', '', 'TWOCRATES.STRINGS'),
    'Value of TWOCRATES.STRINGS.PRELOAD_TEXT should be string'));
  this.getHandler().listenOnce(this.progress_, goog.events.EventType.LOAD,
    function() {
      goog.dispose(this.progress_);
      if (goog.isFunction(this.onPreloadComplete_)) {
        this.onPreloadComplete_();
        this.onPreloadComplete_ = null;
      }
    });

  /**
   * The deferred object for the kitchen project data structure.
   * @type {goog.async.Deferred}
   * @private
   */
  this.kitchenDef_ = new goog.async.Deferred();

  /**
   * The deferred object for the cabinets / items list.
   * @type {goog.async.Deferred}
   * @private
   */
  this.itemsDef_ = new goog.async.Deferred();

  /**
   * Referrence to a json processor we will be using to serialize data.
   * @type {goog.json.NativeJsonProcessor}
   * @private
   */
  this.jsonProcessor_ = new goog.json.NativeJsonProcessor();

  /**
   * Instance bound handler for the completion of a project save action with
   *   server.
   * @type {function(this: k3d.control.Loader, goog.events.Event): undefined}
   * @private
   */
  this.handleSaveBound_ = goog.bind(this.handleSave, this);

  /**
   * Instance bound handler for the successful completion of a loader task.
   * @type {function(this: k3d.control.Loader): undefined}
   * @private
   */
  this.boundProgressNotifier_ = goog.bind(function() {
    this.progress_.progress();
  }, this);

  /**
   * Images loader instance to use when preloading initial images.
   * @type {pstj.ds.ImageList}
   * @private
   */
  this.imageLoader_ = new pstj.ds.ImageList();
  this.getHandler().listen(this.imageLoader_, goog.events.EventType.LOAD,
    this.boundProgressNotifier_);

  /**
   * Optional handler for when the preloading is complete.
   * @type {?function(): undefined}
   * @private
   */
  this.onPreloadComplete_ = null;

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
   * Start the loading process, it is best if this is called as soon as
   *   possible as it will provide automatically the UI for the progress
   *   notification.
   * @param {function(): undefined=} when_done Callback for when preloading is
   *   done.
   */
  _.start = function(when_done) {
    this.onPreloadComplete_ = when_done || null;
    this.progress_.render();
    this.getKitchen().addCallback(goog.bind(this.preloadKitchenImages, this)).
      addCallback(this.boundProgressNotifier_);
  };

  /**
   * Preloads all images (kitchen project referred images and UI images)
   * @param {k3d.ds.KitchenProject} project The compiled data structure for a
   *   kitchen project.
   * @protected
   */
  _.preloadKitchenImages = function(project) {
    var images = project.getImageReferences();
    var preloadcount = 1; //project data,  later on ..finishes, handles
    preloadcount = preloadcount + this.preloadImageList_.length;
    preloadcount = preloadcount + images.length;
    this.progress_.setModel(preloadcount);
    goog.array.forEach(this.preloadImageList_, this.loadImage_, this);
    goog.array.forEach(images, this.loadImage_, this);
  };

  /**
   * Helper function to load a single image at a time via the image loader.
   * @param {string} src The image source URL.
   * @private
   */
  _.loadImage_ = function(src) {
    this.imageLoader_.loadImage(src);
  };

  /**
   * Gets the data for the kitchen project from the server if needed and
   *   returns a deferred.
   * @return {goog.async.Deferred} The deferred object to subscribe to.
   */
  _.getKitchen = function() {
    if (!this.kitchenAsBeenRequest_) {
      this.kitchenAsBeenRequest_ = true;
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
   * Getter for the list of all available items.
   * @return {goog.async.Deferred} The deferred object to subscribe to.
   */
  _.getItems = function() {
    if (!this.itemsDef_.hasFired()) {
      goog.net.XhrIo.send(Path.LOAD_ITEMS, goog.bind(function(e) {
        try {
          var result = this.checkForErrors(e);
        } catch (err) {
          return;
        }
        // TODO: Fix this so that appropriate list items be used.
        this.itemsDef_.callback(new pstj.ds.List(result[Struct.DATA]));
      }, this));
    }
    return this.itemsDef_;
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
    } catch (err) {
      return;
    }
    // we want to resolve the deffered onlypossitively, everything else as error
    // is published
    this.kitchenDef_.callback(new k3d.ds.KitchenProject(
      result[Struct.KITCHEN]));
  };
});
