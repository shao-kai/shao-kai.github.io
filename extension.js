(function(ext) {
    var connectCode = 1;
    function processInput(bytes){
        connectCode = 2;
        //console.log(String.fromCharCode.apply(null, bytes));
    }
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: connectCode, msg: 'Ready'};
    };

    ext._deviceConnected = function(dev) {
        if (device) {
            device.open({ bitRate: 115200, ctsFlowControl: 0 });
            device.set_receive_handler(processInput);
        }else{
            tryNextDevice();
        }
    };
    ext._deviceRemoved = function(dev) {
        connectCode = 1;
    };

    // Functions for block with type 'w' will get a callback function as the 
    // final argument. This should be called to indicate that the block can
    // stop waiting.
    ext.wait_a = function(callback) {
        var msg = new Uint8Array([0xff,0x55,0x08,0x00,0x02,0x08,0x07,0x02,0x00,0x00,0x14,0x00]);
        device.send(msg.buffer);
        window.setTimeout(function() {
            callback(11);
        }, 1000);
    };

    ext.wait_b = function(callback) {
        var msg = new Uint8Array([0xff,0x55,0x08,0x00,0x02,0x08,0x07,0x02,0x00,0x00,0x00,0x00]);
        device.send(msg.buffer);
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
    ScratchExtensions.register('mCore', descriptor, ext, {type: 'serial'});
})({});
