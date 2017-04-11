var http = require('http'),
    httpProxy = require('http-proxy'),
    HttpProxyRules = require('http-proxy-rules');

// Set up proxy rules instance
var proxyRules = new HttpProxyRules({
    rules: {
        '.*/api': 'http://localhost:8080/PredictWeb/api', // Rule (1)
        '.*/rule2': 'http://localhost:8080/' // Rule (2)
    },
    default: 'http://localhost:4200' // default target
});

// Create reverse proxy instance
var proxy = httpProxy.createProxy({
	changeOrigin : true
});

/*
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Hostname', 'localhost:8080');
});
*/


// Create http server that leverages reverse proxy instance
// and proxy rules to proxy requests to different targets
http.createServer(function (req, res) {
    try {
        // a match method is exposed on the proxy rules instance
        // to test a request to see if it matches against one of the specified rules
        var target = proxyRules.match(req);
        if (target) {
	    //console.log(req.url);
	    //console.log(target);
            return proxy.web(req, res, {
                target: target
            });
        }

        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('The request url and path did not match any of the listed rules!');
    } catch (e) {
        console.log("Raised exception.");
    }
}).listen(8888);
