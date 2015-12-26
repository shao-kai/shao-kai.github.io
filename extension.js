(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // Functions for block with type 'w' will get a callback function as the 
    // final argument. This should be called to indicate that the block can
    // stop waiting.
    ext.wait_a = function(callback) {
        window.setTimeout(function() {
            callback(11);
        }, 1000);
    };

    ext.wait_b = function(callback) {
        window.setTimeout(function() {
            callback(23);
        }, 1000);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'wait a', 'wait_a'],
             ['R', 'wait b', 'wait_b']
        ]
    };

    // Register the extension
    ScratchExtensions.register('Random wait extension', descriptor, ext);
})({});
