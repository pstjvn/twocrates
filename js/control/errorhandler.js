goog.provide('k3d.control.ErrorHandler');

goog.require('goog.events');
goog.require('goog.ui.Component.EventType');
goog.require('k3d.component.Notice');
goog.require('k3d.component.PopOver');
goog.require('k3d.ds.definitions');
goog.require('k3d.ds.strings');
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
  this.noticeDialog_ = new k3d.component.Notice();
  goog.events.listen(this.noticeDialog_, goog.ui.Component.EventType.ACTION,
    function() {
      k3d.component.PopOver.getInstance().setVisible(false);
    });
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

          // There is no project with this id, redirect to creating a new
          // project.
          case 6:
          case 21:

            window.location.href = k3d.ds
              .definitions.Path.NO_SUCH_PROJECT_REDIRECT;

            break;

          // User is unkown, we cannot save
          case 20:
            this.noticeDialog_.setText(k3d.ds.strings.assignwithoutloggin);

            k3d.component.PopOver.getInstance().addChild(
              this.noticeDialog_, true);

            k3d.component.PopOver.getInstance().setVisible(true);

            break;

          // User already has 5 projects saved
          case 13:
            this.noticeDialog_.setText(k3d.ds.strings.nomoresaves);

            k3d.component.PopOver.getInstance().addChild(
              this.noticeDialog_, true);

            k3d.component.PopOver.getInstance().setVisible(true);

            break;

          // Project is once already saved
          case 19:
            this.noticeDialog_.setText(k3d.ds.strings.alreadysaved);

            k3d.component.PopOver.getInstance().addChild(
              this.noticeDialog_, true);

            k3d.component.PopOver.getInstance().setVisible(true);
            break;

          default:
            //console.log(message);
        }
        break;
      case Static.RUNTIME:
        // Error occured by performing client side action that is not allowed.
        // TODO: show the message to the user...
        break;
    }
  };

});

