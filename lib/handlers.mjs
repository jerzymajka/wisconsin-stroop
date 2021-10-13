//dependencies
import helpers from './helpers.mjs';

const handlers = {};
handlers.unAuthorized = function (data, res) {
    res.writeHead(401);
    res.write('Musisz sie zalogowac, aby miec dostep do tej strony.');
    res.end();
}
handlers.notFound = function (data, res) {
    res.writeHead(404);
    res.write('Nie znaleziono strony.');
    res.end();
}
handlers.home = function (data, res) {
    if (data.method.toLowerCase() == 'get') {
        helpers.renderHtml(res, 'home.html');
    } else if (data.method.toLowerCase() == 'post') {
        helpers.renderHtml(res, 'home.html');
    } else {
        handlers.notFound(data, res);
    }
}
handlers.login = function (data, res) {
    if (data.method.toLowerCase() == 'get') {
        helpers.renderHtml(res, 'login.html');
    } else if (data.method.toLowerCase() == 'post') {
        let pwd = helpers.hash(data.payload.pwd);
        helpers.checkLogin(data.payload.email, pwd, res);
    } else {
        handlers.notFound(data, res);
    }
}
handlers.signup = function (data, res) {
    if (data.method.toLowerCase() == 'get') {
        helpers.renderHtml(res, 'signup.html');
    } else if (data.method.toLowerCase() == 'post') {
        let pwd = helpers.hash(data.payload.pwd);
        data.payload.pwd = pwd;
        const id = helpers.randomString(16);
        helpers.addToUser(data.payload.email, pwd, id, res, data.payload);
    } else {
        handlers.notFound(data, res);
    }
}
handlers.ankieta = function (data, res) {
    const hs = data.queryStr.hs != 'undefined' ? data.queryStr.hs : null;
    const ep = data.queryStr.ep != 'undefined' ? data.queryStr.ep : null;
    const id = data.queryStr.id != 'undefined' ? data.queryStr.id : null;
    if (helpers.checkToken(hs, ep, id) && parseInt(ep) > Date.now()) {
        if (data.method.toLowerCase() == 'get') {
            helpers.read('users', id, (err, fileData) => {
                if (!err) {
                    if (fileData.ankieta) {
                        //helpers.renderHtml(res, 'testy.html');
                        handlers.testy(data, res);
                    } else {
                        helpers.renderHtml(res, 'ankieta.html');
                    }
                } else {
                    console.log(err)
                }
            })
        } else if (data.method.toLowerCase() == 'post') {
            helpers.read('users', id, (err, fileData) => {
                if (!err) {
                    fileData.ankieta = true;
                    fileData.plec = data.payload.plec;
                    fileData.wiek = data.payload.wiek;
                    fileData.wyksztalcenie = data.payload.wyksztalcenie;
                    fileData.nalog = data.payload.nalog;
                    fileData.abstyn = data.payload.abstyn;
                    helpers.write('users', id, fileData, (err) => {
                        if (!err) {
                            res.writeHead(200);
                            res.end();
                        } else {
                            console.log(err);
                            res.writeHead(501);
                            res.write('Problem z serverem ' + err);
                            res.end();
                        }
                    })
                } else {
                    console.log(err)
                }
            })
        } else {
            handlers.notFound(data, res);
        }
    } else {
        handlers.unAuthorized(data, res);
    }
}
handlers.testy = function (data, res) {
    const hs = data.queryStr.hs != 'undefined' ? data.queryStr.hs : null;
    const ep = data.queryStr.ep != 'undefined' ? data.queryStr.ep : null;
    const id = data.queryStr.id != 'undefined' ? data.queryStr.id : null;
    if (helpers.checkToken(hs, ep, id) && parseInt(ep) > Date.now()) {
        if (data.method.toLowerCase() == 'get') {
            helpers.read('users', id, (err, fileData) => {
                if (!err) {
                    let str = fileData.stroop;
                    let wis = fileData.wisconsin;
                    if (!str && !wis) {
                        helpers.renderHtml(res, 'testyAll.html');
                    }
                    if (!str && wis) {
                        helpers.renderHtml(res, 'testyStr.html');
                    }
                    if (str && !wis) {
                        helpers.renderHtml(res, 'testyWis.html');
                    }
                    if (str && wis) {
                        helpers.renderHtml(res, 'testyNon.html');
                    }
                } else {
                    console.log(err);
                }
            })

        } else {
            handlers.notFound(data, res);
        }
    } else {
        handlers.unAuthorized(data, res);
    }
}
handlers.wisconsinp = function (data, res) {
    const hs = data.queryStr.hs != 'undefined' ? data.queryStr.hs : null;
    const ep = data.queryStr.ep != 'undefined' ? data.queryStr.ep : null;
    const id = data.queryStr.id != 'undefined' ? data.queryStr.id : null;
    if (helpers.checkToken(hs, ep, id) && parseInt(ep) > Date.now()) {
        if (data.method.toLowerCase() == 'get') {
            helpers.renderHtml(res, 'wisconsinProba.html');
        } else {
            handlers.notFound(data, res);
        }
    } else {
        handlers.unAuthorized(data, res);
    }
}
handlers.wisconsinp2 = function (data, res) {
    const hs = data.queryStr.hs != 'undefined' ? data.queryStr.hs : null;
    const ep = data.queryStr.ep != 'undefined' ? data.queryStr.ep : null;
    const id = data.queryStr.id != 'undefined' ? data.queryStr.id : null;
    if (helpers.checkToken(hs, ep, id) && parseInt(ep) > Date.now()) {
        if (data.method.toLowerCase() == 'get') {
            helpers.renderHtml(res, 'wisconsinProba2.html');
        } else {
            handlers.notFound(data, res);
        }
    } else {
        handlers.unAuthorized(data, res);
    }
}
handlers.wisconsint = function (data, res) {
    const hs = data.queryStr.hs != 'undefined' ? data.queryStr.hs : null;
    const ep = data.queryStr.ep != 'undefined' ? data.queryStr.ep : null;
    const id = data.queryStr.id != 'undefined' ? data.queryStr.id : null;
    if (helpers.checkToken(hs, ep, id) && parseInt(ep) > Date.now()) {
        if (data.method.toLowerCase() == 'get') {
            helpers.renderHtml(res, 'wisconsin.html');
        } else if (data.method.toLowerCase() == 'post') {
            helpers.read('users', id, (err, fileData) => {
                if (!err) {
                    fileData.wisconsin = true;
                    fileData.wiscResult = data.payload;
                    helpers.write('users', id, fileData, (err) => {
                        if (!err) {
                            res.writeHead(200);
                            res.end();
                        } else {
                            console.log(err);
                            res.writeHead(501);
                            res.write('Problem z serverem ' + err);
                            res.end();
                        }
                    })
                } else {
                    console.log(err);
                }
            })
        } else {
            handlers.notFound(data, res);
        }
    } else {
        handlers.unAuthorized(data, res);
    }
}
handlers.stroop_1 = function (data, res) {
    const hs = data.queryStr.hs != 'undefined' ? data.queryStr.hs : null;
    const ep = data.queryStr.ep != 'undefined' ? data.queryStr.ep : null;
    const id = data.queryStr.id != 'undefined' ? data.queryStr.id : null;
    if (helpers.checkToken(hs, ep, id) && parseInt(ep) > Date.now()) {
        if (data.method.toLowerCase() == 'get') {
            helpers.renderHtml(res, 'stroop_1.html');
        } else {
            handlers.notFound(data, res);
        }
    } else {
        handlers.unAuthorized(data, res);
    }
}
handlers.stroop_2 = function (data, res) {
    const hs = data.queryStr.hs != 'undefined' ? data.queryStr.hs : null;
    const ep = data.queryStr.ep != 'undefined' ? data.queryStr.ep : null;
    const id = data.queryStr.id != 'undefined' ? data.queryStr.id : null;
    if (helpers.checkToken(hs, ep, id) && parseInt(ep) > Date.now()) {
        if (data.method.toLowerCase() == 'get') {
            helpers.renderHtml(res, 'stroop_2.html');
        } else {
            handlers.notFound(data, res);
        }
    } else {
        handlers.unAuthorized(data, res);
    }
}
handlers.stroop_3 = function (data, res) {
    const hs = data.queryStr.hs != 'undefined' ? data.queryStr.hs : null;
    const ep = data.queryStr.ep != 'undefined' ? data.queryStr.ep : null;
    const id = data.queryStr.id != 'undefined' ? data.queryStr.id : null;
    if (helpers.checkToken(hs, ep, id) && parseInt(ep) > Date.now()) {
        if (data.method.toLowerCase() == 'get') {
            helpers.read('users', id, (err, fileData) => {
                if (!err) {
                    let str = fileData.stroopOne;
                    if (!str) {
                        helpers.renderHtml(res, 'stroop_3.html');
                    } else {
                        helpers.renderHtml(res, 'stroop_3b.html');
                    }
                } else {
                    console.log(err);
                }
            })
        } else if (data.method.toLowerCase() == 'post') {
            helpers.read('users', id, (err, fileData) => {
                if (!err) {
                    fileData.stroopOne = true;
                    fileData.stroopResultOne = data.payload;
                    helpers.write('users', id, fileData, (err) => {
                        if (!err) {
                            res.writeHead(200);
                            res.end();
                        } else {
                            console.log(err);
                            res.writeHead(501);
                            res.write('Problem z serverem ' + err);
                            res.end();
                        }
                    })
                } else {
                    console.log(err);
                }
            })
        } else {
            handlers.notFound(data, res);
        }
    } else {
        handlers.unAuthorized(data, res);
    }
}
handlers.stroop_4 = function (data, res) {
    const hs = data.queryStr.hs != 'undefined' ? data.queryStr.hs : null;
    const ep = data.queryStr.ep != 'undefined' ? data.queryStr.ep : null;
    const id = data.queryStr.id != 'undefined' ? data.queryStr.id : null;
    if (helpers.checkToken(hs, ep, id) && parseInt(ep) > Date.now()) {
        if (data.method.toLowerCase() == 'get') {
            helpers.renderHtml(res, 'stroop_4.html');
        } else if (data.method.toLowerCase() == 'post') {
            helpers.read('users', id, (err, fileData) => {
                if (!err) {
                    fileData.stroop = true;
                    fileData.stroopResultTwo = data.payload;
                    helpers.write('users', id, fileData, (err) => {
                        if (!err) {
                            res.writeHead(200);
                            res.end();
                        } else {
                            console.log(err);
                            res.writeHead(501);
                            res.write('Problem z serverem ' + err);
                            res.end();
                        }
                    })
                } else {
                    console.log(err);
                }
            })
        } else {
            handlers.notFound(data, res);
        }
    } else {
        handlers.unAuthorized(data, res);
    }
}
export default handlers;