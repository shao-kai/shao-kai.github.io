(function(ext) {
    var connectCode = 1;
    var device;
    function processInput(bytes){
        clearTimeout(watchdog);
        connectCode = 2;
        //console.log(String.fromCharCode.apply(null, bytes));
    }
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        if(connectCode == 1){
            return { status:1, msg:'Disconnected' };
        }
        
        return { status:2, msg:'Connected' };
    };
    var potentialDevices = [];
    ext._deviceConnected = function(dev) {
        potentialDevices.push(dev);
        if (!device)
          tryNextDevice();
    };
    ext._deviceRemoved = function(dev) {
        connectCode = 1;
    };

    var poller = null;
  var watchdog = null;
  function tryNextDevice() {
    device = potentialDevices.shift();
    if (!device) return;

    device.open({ stopBits: 0, bitRate: 115200, ctsFlowControl: 0 });
    console.log('Attempting connection with ' + device.id);
    device.set_receive_handler(function(data) {
      var inputData = new Uint8Array(data);
      processInput(inputData);
    });

    watchdog = setTimeout(function() {
      clearInterval(poller);
      poller = null;
      device.set_receive_handler(null);
      device.close();
      device = null;
      tryNextDevice();
    }, 5000);
  }

    // Functions for block with type 'w' will get a callback function as the 
    // final argument. This should be called to indicate that the block can
    // stop waiting.
    ext.wait_a = function(callback) {
        var msg = new Uint8Array([0xff,0x55,0x08,0x00,0x02,0x08,0x07,0x02,0x00,0x00,0x14,0x00]);
        device.send(msg.buffer);
        window.setTimeout(function() {
            callback();
        }, 1000);
    };

    ext.wait_b = function(callback) {
        var msg = new Uint8Array([0xff,0x55,0x08,0x00,0x02,0x08,0x07,0x02,0x00,0x00,0x00,0x00]);
        device.send(msg.buffer);
        window.setTimeout(function() {
            callback();
        }, 1000);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'wait a', 'wait_a'],
            ['w', 'wait b', 'wait_b']
        ]
    };

    // Register the extension
    ScratchExtensions.register('mCore', descriptor, ext, {type: 'serial'});
})({});
