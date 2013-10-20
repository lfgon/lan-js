describe("lan.TcpProbe", function() {
  var subject = new lan.TcpProbe('192.168.0.1');

  it("should be defined", function() {
    expect(lan.TcpProbe).toBeDefined();
  });

  it("should throw an exception when created with no addresses", function() {
    expect(function() { new lan.TcpProbe(); }).toThrow();
  });

  describe("fire(callback)", function() {
    // we put a spec in a var here so we can use it in 2 contexts
    // ensures that the callback parameter eventually is called
    var call_check = function() {
      var opts = { callback: function(){} };
      var probe = new lan.TcpProbe('127.0.0.1:9999');
      var ran = false;
      runs(function() {
        probe.fire(function() { ran = true; });
      });
      waitsFor(function() {
        return ran;
      }, lan.TcpProbe.TIMEOUT+1);
    };

    it("should eventually call the callback parameter", call_check);

    describe("on a browser that supports WebSockets", function() {

      describe("against a port that WebSockets supports", function() {

        it("should eventually call the callback parameter", call_check);

        it("should send a WebSockets request", function() {
          var probe = new lan.TcpProbe('192.168.0.1:8080');
          spyOn(probe, '_send_websocket_request');
          probe.fire();
          expect(probe._send_websocket_request).toHaveBeenCalled();
        });
      });

      describe("against a port that WebSockets does not support", function() {
        it("should eventually call the callback parameter", call_check);

        it("should fallback to sending an image request", function() {
          var probe = new lan.TcpProbe('192.168.0.1:21');
          spyOn(probe, '_send_img_request');
          probe.fire();
          expect(probe._send_img_request).toHaveBeenCalled();
        });
      });
    });

    describe("on a browser that does not support WebSocket", function() {
      var ws = window.WebSockets;
      beforeEach(function(){ window.WebSockets = null; });
      afterEach(function(){ window.WebSockets = ws; });

      it("should eventually call the callback parameter", call_check);

      it("should fallback to sending an image request", function() {
        var probe = new lan.TcpProbe('192.168.0.1:21');
        spyOn(probe, '_send_img_request');
        probe.fire();
        expect(probe._send_img_request).toHaveBeenCalled();
      });
    });

    // describe 
  });
});
