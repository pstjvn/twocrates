/**
 * @fileoverview Provides the loading and saving of data abstraction for the
 *   project. It handles transparently the loading and storing of data and is
 *   made accessible and available to all parts of the application by
 *   providing it as singleton.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('k3d.control.Loader');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.async.Deferred');
goog.require('goog.async.DeferredList');
goog.require('goog.dom');
goog.require('goog.json.NativeJsonProcessor');
goog.require('goog.net.XhrIo');
goog.require('k3d.ds.ItemList');
goog.require('k3d.ds.KitchenProject');
goog.require('k3d.ds.definitions');
goog.require('k3d.mb');
goog.require('pstj.configure');
goog.require('pstj.control.Base');
goog.require('pstj.ds.ImageList');
goog.require('pstj.ds.ImageList.EventType');
goog.require('pstj.ds.List');
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
   * Flag for the already requested items. 0 - kitchen, 1 - items, 2 -
   *   finishes, 3 - handles
   * @type {Array<boolean>}
   * @private
   */
  this.alreadyRequested_ = [false, false, false, false];
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
        if (goog.isFunction(this.onPreloadComplete_)) {
          this.onPreloadComplete_();
          this.onPreloadComplete_ = null;
        }
        setTimeout(goog.bind(function() {
          goog.dispose(this.progress_);
          goog.dom.removeNode(document.getElementById('progress'));
        }, this), 500);
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
   * The deferred for the finishes for the cabinets.
   * @type {goog.async.Deferred}
   * @private
   */
  this.finishesDef_ = new goog.async.Deferred();
  /**
   * The deferred for the handles items.
   * @type {goog.async.Deferred}
   * @private
   */
  this.handlesDef_ = new goog.async.Deferred();
  /**
   * Referrence to a json processor we will be using to serialize data.
   * @type {goog.json.NativeJsonProcessor}
   * @private
   */
  this.jsonProcessor_ = new goog.json.NativeJsonProcessor();
  /**
   * Instance bound handler for the completion of a project save action with
   *   server.
   * @type {Function}
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
   * Image loader list for images that are not immediately needed.
   * @type {pstj.ds.ImageList}
   * @private
   */
  this.lateImageLoader_ = new pstj.ds.ImageList();
  this.getHandler().listen(this.lateImageLoader_,
      pstj.ds.ImageList.EventType.READY, goog.bind(function() {
        this.allImagesDef_.callback();
        // clean up image storage that is not used.
        setTimeout(goog.bind(function() {
          // use chance and free up some memory
          this.getHandler().unlisten(this.imageLoader_,
              goog.events.EventType.LOAD, this.boundProgressNotifier_);
          goog.dispose(this.imageLoader_);
        }, this), 100);
      }, this));
  /**
   * Deferred for the all images loaded case.
   * @type {goog.async.Deferred}
   * @private
   */
  this.allImagesDef_ = new goog.async.Deferred();
  /**
   * Optional handler for when the preloading is complete.
   * @type {?function(): undefined}
   * @private
   */
  this.onPreloadComplete_ = null;

  this.getPreviewObject_ = null;
};
goog.inherits(k3d.control.Loader, pstj.control.Base);
goog.addSingletonGetter(k3d.control.Loader);


/**
 * The sequential index of items in the cache of requested flags.
 * @enum {number}
 * @protected
 */
k3d.control.Loader.Item = {
  KITCHEN: 0,
  ITEMS: 1,
  FINISHES: 2,
  HANDLES: 3
};

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
 * @param {function(): undefined=} opt_when_done Callback for when preloading is
 *   done.
 */
_.start = function(opt_when_done) {
  this.onPreloadComplete_ = opt_when_done || null;
  //this.progress_.render();
  this.progress_.decorate(goog.dom.getElement('progress'));

  /**
   * When all data is loaded, start loading the images.
   */
  goog.async.DeferredList.gatherResults([
    this.itemsDef_, this.finishesDef_, this.handlesDef_
  ]).addCallback(goog.bind(function(results) {
    // collect all images from all data and then load it...
    var imagelist = [];
    goog.array.forEach(results, function(list) {
      list.forEach(function(item) {
        var src = item.getProp(Struct.PICTURE);
        if (goog.isNull(src)) {
          src = item.getProp(Struct.DRAWING_IMAGE);
          if (!goog.isNull(src) && src != '') {
            goog.array.insert(imagelist, src);
          }
          src = item.getProp(Struct.SIDE_IMAGE);
          if (!goog.isNull(src) && src != '') {
            goog.array.insert(imagelist, src);
          }
        } else if (src != '') {
          goog.array.insert(imagelist, src);
        }
      });
    });
    if (goog.array.isEmpty(imagelist)) {
      this.allImagesDef_.callback();
    } else {
      goog.array.forEach(imagelist, function(image) {
        this.lateImageLoader_.loadImage(goog.global['ASSETS_PREFIX'] + image);
      }, this);
    }
  }, this));

  this.getKitchen().addCallback(goog.bind(this.preloadKitchenImages, this)).
      addCallback(this.boundProgressNotifier_);

};


/**
 * Internal method to check if a data struture has already been requested
 *   from the server.
 * @param {k3d.control.Loader.Item} item The index of the item to check.
 * @return {boolean} true if the item has been already requested.
 * @private
 */
_.hasBeenRequested_ = function(item) {
  return this.alreadyRequested_[item];
};


/**
 * Simple getter for the deferred object allows it to be used in gathered
 *   deferreres.
 * @return {goog.async.Deferred}
 */
_.getAllImagesLoadedDeferred = function() {
  return this.allImagesDef_;
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
  this.imageLoader_.loadImage(goog.global['ASSETS_PREFIX'] + src);
};


/**
 * Gets the data for the kitchen project from the server if needed and
 *   returns a deferred.
 * @return {goog.async.Deferred} The deferred object to subscribe to.
 */
_.getKitchen = function() {
  if (!this.hasBeenRequested_(k3d.control.Loader.Item.KITCHEN)) {
    this.alreadyRequested_[k3d.control.Loader.Item.KITCHEN] = true;
    goog.net.XhrIo.send(this.composeLoadUri_(), goog.bind(function(e) {

      try {
        var result = this.checkForErrors(e);
      } catch (err) {
        return;
      }

      if (this.hasData(result)) {
        this.kitchenDef_.callback(new k3d.ds.KitchenProject(
            result[Struct.KITCHEN]));
      } else {
        this.kitchenDef_.errback();
      }

    }, this));
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
        'Content-Type': 'applicaion/json'
      });
};


/**
 * Getter for the list of all available items.
 * @return {goog.async.Deferred} The deferred object to subscribe to.
 */
_.getItems = function() {
  if (!this.hasBeenRequested_(k3d.control.Loader.Item.ITEMS)) {
    this.alreadyRequested_[k3d.control.Loader.Item.ITEMS] = true;
    goog.net.XhrIo.send(Path.LOAD_ITEMS, goog.bind(function(e) {

      try {
        var result = this.checkForErrors(e);
      } catch (err) {
        return;
      }

      if (this.hasData(result)) {
        this.itemsDef_.callback(new k3d.ds.ItemList(result[Struct.DATA]));
      } else {
        this.itemsDef_.errback(null);
      }

    }, this));
  }
  return this.itemsDef_;
};


/**
 * Checks if the returned object has 'data' attribute. Only some responses
 *   use this.
 * @param {Object} result The response from th server, parsed into JS
 *   object.
 * @return {boolean}
 * @protected
 */
_.hasData = function(result) {
  if (!goog.isDef(result[Struct.DATA])) {
    mb.Bus.publish(mb.Topic.ERROR, Static.NO_DATA, Struct.STATUS);
    return false;
  }
  return true;
};


/**
 * Getter for the finishes, returns the deferred object holding the data
 *   structure.
 * @return {goog.async.Deferred} The deferred object.
 */
_.getFinishes = function() {
  if (!this.hasBeenRequested_(k3d.control.Loader.Item.FINISHES)) {
    this.alreadyRequested_[k3d.control.Loader.Item.FINISHES] = true;
    goog.net.XhrIo.send(Path.LOAD_FINISHES, goog.bind(function(e) {

      try {
        var result = this.checkForErrors(e);
      } catch (err) {
        return;
      }

      if (this.hasData(result)) {
        this.finishesDef_.callback(new pstj.ds.List(result[Struct.DATA]));
      } else {
        this.finishesDef_.errback(null);
      }

    }, this));
  }
  return this.finishesDef_;
};


/**
 * Getter for the handles, returns the deferred object holding the data
 *   structure.
 * @return {goog.async.Deferred} The deferred object.
 */
_.getHandles = function() {
  if (!this.hasBeenRequested_(k3d.control.Loader.Item.HANDLES)) {
    this.alreadyRequested_[k3d.control.Loader.Item.HANDLES] = true;
    goog.net.XhrIo.send(Path.LOAD_HANDLES, goog.bind(function(e) {

      try {
        var result = this.checkForErrors(e);
      } catch (err) {
        return;
      }

      if (this.hasData(result)) {
        this.handlesDef_.callback(new pstj.ds.List(result[Struct.DATA]));
      } else {
        this.handlesDef_.errback(null);
      }

    }, this));
  }
  return this.handlesDef_;
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
    mb.Bus.publish(mb.Topic.ERROR, Static.STRUCTURED_ERROR,
        data[Struct.STATUS], data[Struct.ERROR_MESSAGE]);
    //throw new Error('Status of result was not OK');
  }
  goog.asserts.assertObject(data);
  return data;
};


/**
 * Attempt to assign the project to a user on the backend.
 * @param {pstj.ds.RecordID} project_id The id of the project to assign to the
 * current user.
 */
_.assignProject = function(project_id) {
  goog.net.XhrIo.send(Path.ASSIGN_KITCHEN + '?kitchen_project_id=' +
      project_id, goog.bind(function(e) {
        try {
          this.checkForErrors(e);
        } catch (err) {
          return;
        }
      }, this));
};


/**
 * Gteer for the preview of the kitchen project.
 * @param {pstj.ds.RecordID} id The prject id to preview.
 * @param {function(Object): undefined} callback The callback to use with
 *   the result.
 */
_.getPreview = function(id, callback) {
  if (!goog.isNull(this.getPreviewObject_)) {
    this.getPreviewObject_.abort();
  }
  goog.net.XhrIo.send(Path.GENERATE_PREVIEW + '/' + id,
      goog.bind(function(e) {

        try {
          var result = this.checkForErrors(e);
        } catch (err) {
          return;
        }
        // The JSON is constructed on different system and does not match our so
        // we should skip the check on data consistency.
        callback(result);
      }, this));
};


/**
 * Handles the save action of kitchen structures.
 * @param {goog.events.Event} e The COMPLETE network event.
 * @protected
 */
_.handleSave = function(e) {
  try {
    this.checkForErrors(e);
  } catch (err) {}
};
});  // goog.scope
