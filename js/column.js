var H5P = H5P || {};

/**
 * Will render a column with potentially multiple content instances in it
 *
 * @param {Array} content
 * @param {int} contentId
 * @returns {H5P.Columns} Instance
 */
H5P.Column = (function ($) {
        
  function C (content, contentId) {
    if (!(this instanceof H5P.Column)) {
      return new H5P.Column(content, contentId);
    }
    
    var defaults = {
      content: [],
    };
    this.params = $.extend(true, {}, defaults, content);

    this.content = new Array();
    this.$myDom;
    
    // Instantiate content instances
    for (var i = 0; i < this.params.content.length; i++) {
      var contentData = this.params.content[i];
      
      this.content.push(H5P.newRunnable(contentData, contentId));
    }
  }

  // Function for attaching the pages to a dom element.
  C.prototype.attach = function (target) {
    var $target;
    if (typeof(target) === "string") {
      $target = $('#' + target);
    }
    else {
      $target = $(target);
    }

    this.$myDom = $('<' + this.params.type + '>').appendTo($target);

    // Attach content
    for (var i = 0; i < this.content.length; i++) {
      var contentInstance = this.content[i];
      var $contentHolder = $('<div class="h5p-column-content"></div>');

      contentInstance.attach($contentHolder);
      this.$myDom.append($contentHolder);
    }

    this.$.trigger('resize');
    return this;
  };

  return C;
})(H5P.jQuery);
