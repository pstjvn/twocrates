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
    console.log('Error occured and is handled', error_index, status_id, message);
    if (error_index == Static.SERVER_HTTP_ERROR) {
      // server error occured
    } else if (error_index == Static.UNPARSABLE_JSON) {
      // JSON cannot be parsed....
    } else if (error_index == Static.STRUCTURED_ERROR) {
      switch (status_id) {
        default:
          console.log(message);
      }
    }
  };

});

