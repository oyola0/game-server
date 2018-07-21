function Connection(ready) {
    const host = location.host;
    const connection = new WebSocket('ws://' + host, "echo-protocol");
    const that = this;    

    this.__events = {};

    if (typeof ready === 'function') {        
        connection.onopen = function (data) {
            ready();
        };
    }
    
    connection.onerror = function (error) {
        console.log('onerror', error);
    };

    connection.onmessage = function (message) {
        const data = JSON.parse(message.data);

        if (data.event && that.__events[data.event]) {
            that.__events[data.event](data);
        }
    };

    this.listen = function (event, cb) {
        that.__events[event] = cb;
    };  

    this.unlisten = function (event) {
        delete that.__events[event];
    };

    this.send = function (data) {
        connection.send(JSON.stringify(data));
    }

    this.close = function () {
        connection.close();
    };
};

export default Connection;