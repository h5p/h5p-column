/** @namespace H5PUpgrades */
var H5PUpgrades = H5PUpgrades || {};

H5PUpgrades['H5P.Column'] = (function ($) {
  return {
    1: {
      6: function (parameters, finished, extras) {
        extras.metadata = {
          title: 'It is working!',
          source: 'https://h5p.com',
          yearFrom: '101',
          yearTo: '333',
          authors: [{name:"Fuu",role:"sneaker"}],
          license: 'CC BY-SA',
          licenseVersion: '2.0',
          licenseExtras: '..fdfdf .df',
          authorComments: 'lalela'
        };
        // Done
        finished(null, parameters, extras);
      }
    }
  };
})(H5P.jQuery);
