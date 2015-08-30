goog.provide('k3d.component.PopOver');

goog.require('pstj.ui.PopOverLayer');


/**
 * The instance used in the session.
 * @type {pstj.ui.PopOverLayer}
 * @private
 */
k3d.component.PopOver.instance_ = null;


/**
 * Getter for the instance used.
 * @return {pstj.ui.PopOverLayer}
 */
k3d.component.PopOver.getInstance = function() {
  if (goog.isNull(k3d.component.PopOver.instance_)) {
    k3d.component.PopOver.instance_ = new pstj.ui.PopOverLayer();
    // pre-render the component for it to be able to accept children that ahve
    // been already rendered
    k3d.component.PopOver.instance_.render();
  }
  return k3d.component.PopOver.instance_;
};
