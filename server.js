var http = require('http');

var nStatic = require('node-static');

var fileServer = new nStatic.Server('./public');

http.createServer(function (req, res) {
    
    fileServer.serve(req, res);

}).listen(5000,function(err){
    if (err)
      console.log(err)
    else  
      console.log('Interface sendo executada na porta 5000.');
});