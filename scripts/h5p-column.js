H5P.Column = (function (EventDispatcher) {

  /**
   * Glossary Test Constructor
   *
   * @class
   * @param {Object} params Describes task behavior
   * @param {number} id Content identifier
   * @param {Object} data User specific data to adapt behavior
   */
  function Column(params, id, data) {
    var self = this;

    // Initialize event inheritance
    EventDispatcher.call(self);

    // Column wrapper element
    var wrapper;

    // H5P content in the column
    var instances = [];

    /**
     * @private
     *
     * @param {Object} content Parameters
     */
    var addRunnable = function (content) {
      // Create container for content
      var container = document.createElement('div');
      container.classList.add('h5p-column-content');

      // Content overrides
      if (content.library.split(' ')[0] === 'H5P.Video') {
        // Prevent video from growing endlessly since height is unlimited.
        content.params.visuals.fit = false;
      }

      // Create content instance
      var instance = H5P.newRunnable(content, id, H5P.jQuery(container), true); // TODO: Add content state ?

      // Bubble events
      bubbleUp(instance, 'resize', self);

      // Keep track of all instances
      instances.push(instance);

      // Add to DOM wrapper
      wrapper.appendChild(container);
    };

    /**
     * Creates a wrapper and the column content the first time the column
     * is attached to the DOM.
     *
     * @private
     */
    var createHTML = function () {
      // Create wrapper
      wrapper = document.createElement('div');

      // Add content
      for (var i = 0; i < params.content.length; i++) {
        addRunnable(params.content[i]);
      }
    };

    /**
     * Attach the column to the given container
     *
     * @param {H5P.jQuery} $container
     */
    self.attach = function ($container) {
      if (wrapper === undefined) {
        // Create wrapper and content
        createHTML();
      }

      // Add to DOM
      $container.addClass('h5p-column').html('').append(wrapper);
    };

    // Resize children to fit inside parent
    bubbleDown(self, 'resize', instances);
  }

  // Extends the event dispatcher
  Column.prototype = Object.create(EventDispatcher.prototype);
  Column.prototype.constructor = Column;

  /**
   * Makes it easy to bubble events from parent to children
   *
   * @private
   * @param {Object} origin Origin of the Event
   * @param {string} eventName Name of the Event
   * @param {Array} targets Targets to trigger event on
   */
  function bubbleDown(origin, eventName, targets) {
    origin.on(eventName, function (event) {
      if (origin.bubblingUpwards) {
        return; // Prevent send event back down.
      }

      for (var i = 0; i < targets.length; i++) {
        targets[i].trigger(eventName, event);
      }
    });
  };

  /**
   * Makes it easy to bubble events from child to parent
   *
   * @private
   * @param {Object} origin Origin of the Event
   * @param {string} eventName Name of the Event
   * @param {Object} target Target to trigger event on
   */
  function bubbleUp(origin, eventName, target) {
    origin.on(eventName, function (event) {
      // Prevent target from sending event back down
      target.bubblingUpwards = true;

      // Trigger event
      target.trigger(eventName, event);

      // Reset
      target.bubblingUpwards = false;
    });
  }

  return Column;
})(H5P.EventDispatcher);
