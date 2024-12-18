var H5PUpgrades = H5PUpgrades || {};

H5PUpgrades['H5P.Column'] = (function () {
  return {
    1: {

      /**
       * Asynchronous content upgrade hook.
       * Upgrades content parameters to support Column 1.10.
       *
       * - Converts H5P.AppearIn to H5P.AdvancedText
       *
       * @param {Object} parameters
       * @param {function} finished
       */
      10: function (parameters, finished) {

        if (parameters && parameters.content) {

          // Go through content
          for (var i = 0; i < parameters.content.length; i++) {
            if (parameters.content[i] && parameters.content[i].content) {

              const content = parameters.content[i].content;
              if (content.library && content.library.split(' ')[0] === 'H5P.AppearIn') {

                content.library = 'H5P.AdvancedText 1.1';

                content.params = content.params || {};
                let roomName = '';
                if (content.params.appearRoom) {
                  roomName = content.params.appearRoom;
                }

                content.params.text = '<p>AppearIn support for embedded rooms has been deprecated and is no longer maintained. Access your room in a new tab with the following <a target="_blank" href="https://appear.in/' + roomName + '">link.</a></p>';
              }
            }
          }
        }

        // Done
        finished(null, parameters);
      },

      /**
       * Upgrades content to support Column 1.19
       *
       * - Restructures content data to match semantics changes
       * - Wraps all content in an H5P.RowColumn within an H5P.Row
       *
       * @param {object} parameters
       * @param {function} finished
       */
      19: function (parameters, finished) {
        if (parameters && parameters.content) {
          const oldContent = [...parameters.content];

          if (parameters.content?.filter(c => c.content?.library.includes('H5P.Row'))) {
            // Don't upgrade content that already uses H5P.Row
            finished(null, parameters);
            return;
          }

          const newRowColumn = {
            library: 'H5P.RowColumn 0.0', // make this 1.0 to match H5P.Row
            metadata: { contentType: 'Column', license: 'U', title: 'Untitled Column' }, // should this say RowColumn instead? what is the significance?
            params: {
              content: oldContent,
            },
            subContentId: H5P.createUUID(),
          };

          const newRow = {
            library: 'H5P.Row 1.0',
            metadata: { contentType: 'Row', license: 'U', title: 'Untitled Row' },
            params: {
              columns: [{
                content: newRowColumn,
                paddings: { unit: 'px' }, // maybe we should get rid of this since we aren't using it atm
                width: 100, // maybe this should be optional
              }],
            },
            subContentId: H5P.createUUID(),
          };

          parameters.content = [{
            content: newRow,
            useSeparator: 'auto',
          }];
        }

        finished(null, parameters);
      }

    }
  };
})();
