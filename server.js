var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname, query = urlObj.query;
    var reg = /\.(HTML|CSS|JS)/i;

    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase();
        var suffixType = 'text/plain';
        switch (suffix) {
            case 'HTML':
                suffixType = 'text/html';
                break;
            case 'CSS':
                suffixType = 'text/css';
                break;
            case 'JS':
                suffixType = 'text/javascript';
                break;
        }
        var conFile = fs.readFileSync('.' + pathname, 'utf-8');
        response.writeHead(200, {'content-type': suffixType + ';charset=utf-8'});
        response.end(conFile);
        return;
    }


    if (pathname == '/getData') {
        var n = query['n'];
        var con = fs.readFileSync('./json/page.json', 'utf8');
        con = JSON.parse(con);

        var ary = [];
        for (var i = (n - 1) * 10; i <= n * 10 - 1; i++) {
            if (i > con.length - 1) {
                break;
            }
            var curData = con[i];
            ary.push(curData);
        }
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
        response.end(JSON.stringify({
            total:Math.ceil(con.length/10),
            data:ary
        }));
        return;
    }
    response.writeHead(404);
    response.end(null);
});

server.listen(23232, function () {
    console.log('监听23232');
});