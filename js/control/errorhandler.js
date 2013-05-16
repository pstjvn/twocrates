goog.provide('k3d.control.ErrorHandler');

goog.require('k3d.ds.definitions');
goog.require('k3d.mb');
goog.require('pstj.control.Base');

/**
 * General handler for message bug errors. Implements needed logical actions
 *   upon classes of errors.
 * @constructor
 * @extends {pstj.control.Base}
 */
k3d.control.ErrorHandler = function() {
  goog.base(this);
  this.initialize();
};
goog.inherits(k3d.control.ErrorHandler, pstj.control.Base);
goog.addSingletonGetter(k3d.control.ErrorHandler);

goog.scope(function() {

  var _ = k3d.control.ErrorHandler.prototype;
  var mb = k3d.mb;
  var Static = k3d.ds.definitions.Static;

  /** @inheritDoc */
  _.initialize = function() {
    mb.Bus.subscribe(mb.Topic.ERROR, goog.bind(this.handleError, this));
  };

  /**
   * Handles the errors coming on the message bus
   * @param {number} error_index The error ID.
   * @param {number=} status_id The number of the status from the server.
   * @param {string=} message Optional string representing error message from
   *   te server.
   * @protected
   */
  _.handleError = function(error_index, status_id, message) {
    console.log('Error occured and is handled', error_index, status_id,
      message);
    switch (error_index) {
      case Static.SERVER_HTTP_ERROR:
        // server error occured
        break;
      case Static.UNPARSABLE_JSON:
        // cannot parse JSON.
        break;
      case Static.STRUCTURED_ERROR:
        // Error that is recognized on the server occured
        switch (status_id) {
          default:
            console.log(message);
        }
        break;
      case Static.RUNTIME:
        // Error occured by performing client side action that is not allowed.
        // TODO: show the message to the user...
        break;
    }
  };

});

