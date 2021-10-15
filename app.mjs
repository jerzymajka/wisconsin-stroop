import http from 'http';
import url from 'url'
import fs from 'fs'
import path from 'path';
import handlers from './lib/handlers.mjs';
import helpers from './lib/helpers.mjs';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
import {
    StringDecoder
} from 'string_decoder';

const router = {
    '': handlers.home,
    'ankieta': handlers.ankieta,
    'testy': handlers.testy,
    'login': handlers.login,
    'signup': handlers.signup,
    'wisconsint': handlers.wisconsint,
    'wisconsinp': handlers.wisconsinp,
    'wisconsinp2': handlers.wisconsinp2,
    'stroop_1': handlers.stroop_1,
    'stroop_2': handlers.stroop_2,
    'stroop_3': handlers.stroop_3,
    'stroop_4': handlers.stroop_4,
    'results': handlers.results,
    'admin': handlers.admin,
    'admin_2': handlers.admin_2,
    'home': handlers.home
}
//common part for http and https server
const unifiedServer = function (req, res, urlParsed) {
    //const urlParsed = url.parse(req.url, true);
    const decoder = new StringDecoder("utf-8");
    let buffer = "";
    req.on('data', function (data) {
        buffer += decoder.write(data);
    })
    req.on("end", function () {
        buffer += decoder.end();
        const data = {
            'urlParsed': urlParsed,
            'path': urlParsed.pathname,
            'method': req.method.toLowerCase(),
            'queryStr': urlParsed.query,
            'headers': req.headers,
            'decoder': decoder,
            'payload': helpers.parseJson(buffer)
        }
        //choose the handler
        let trimmedPath = data.path.replace("/", "");
        let chooseHandler = typeof (router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.notFound;
        //default handler
        chooseHandler(data, res);
    })
}
const server = http.createServer(function (req, res) {
    const urlParsed = url.parse(req.url, true);
    const reqUrl = urlParsed.pathname;
    /*console.log(req.url);
    console.log(req.method)
    console.log(reqUrl);*/
    let extention = reqUrl.split('.')[1];
    if (extention == 'gif') {
        fs.readFile(path.join(__dirname, './gif', reqUrl), (err, data) => {
            if (!err) {
                res.writeHead(200, {
                    'Content-Type': 'image/gif'
                })
                res.write(data, 'utf8');
                res.end();
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                })
                res.end('Problem z odczytaniem pliku. Jeśli problem będzie się powtarzał, skontaktuj się z jerzy.majka67@gmail.com');
            }

        });
    } else {
        unifiedServer(req, res, urlParsed);
    }
});
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
server.listen(port, function () {
    console.log('Server start at port 3000')
})
