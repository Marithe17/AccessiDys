/* File: images.js
 *
 * Copyright (c) 2013-2016
 * Centre National d’Enseignement à Distance (Cned), Boulevard Nicephore Niepce, 86360 CHASSENEUIL-DU-POITOU, France
 * (direction-innovation@cned.fr)
 *
 * GNU Affero General Public License (AGPL) version 3.0 or later version
 *
 * This file is part of a program which is free software: you can
 * redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 */

'use strict';
/*jshint unused: false, undef:false */


var numberCalls = 0;
var sourcesUpload = [];
var counter = 0;
var helpers = require('../helpers/helpers');
var generalParams = require('../../env/generalParams.json');


var exec = require('child_process').exec;
var fs = require('fs');
var crypto = require('crypto');
var jschardet = require('jschardet');
var iconv = require('iconv-lite');


/* Upload Files */
exports.uploadFiles = function (req, res) {
    var fs = require('fs');
    var filesToUpload = [];
    sourcesUpload = [];
    counter = 0;
    if (!req.files.uploadedFile.length) {
        filesToUpload.push(req.files.uploadedFile);
        numberCalls = 1;
    } else {
        for (var i = 0; i < req.files.uploadedFile.length; i++) {
            filesToUpload.push(req.files.uploadedFile[i]);
        }
        numberCalls = filesToUpload.length;
    }
    // browse the list of files to upload
    var fileReaded = null;
    var bufferedFile = null;
    if (filesToUpload.length > 1) {
        var listFiles = [];

        for (var i = 0; i < filesToUpload.length; i++) { // jshint ignore:line
            fileReaded = fs.readFileSync(filesToUpload[i].path);
            bufferedFile = new Buffer(fileReaded).toString('base64');
            listFiles.push(bufferedFile);
            if (i == filesToUpload.length - 1) { // jshint ignore:line
                return res.jsonp(listFiles);
            }
        }
    } else {
        fileReaded = fs.readFileSync(filesToUpload[0].path);
        bufferedFile = new Buffer(fileReaded).toString('base64');
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
        return res.jsonp(bufferedFile);
    }
};


var http = require('http');
exports.sendPdf = function (req, responce) {
    var donneRecu = req.body;
    var url = donneRecu['lien']; // jshint ignore:line
    http.get(url, function (res) {
        var chunks = [];
        if (res.statusCode !== 200) {
            responce.jsonp(404, null);
        }
        var len = parseInt(res.headers['content-length'], 10);
        var byteCounter = 0;

        res.on('data', function (chunk) {
            chunks.push(chunk);
            byteCounter = byteCounter + chunk.length;
            console.log((100.0 * byteCounter / len));
            global.io.sockets.emit('pdfProgress', {
                fileProgress: (100.0 * byteCounter / len)
            });
        });

        res.on('end', function () {
            var jsfile = new Buffer.concat(chunks).toString('base64');
            responce.send(200, jsfile);
        });
    }).on('error', function () {
        responce.jsonp(404, null);
    });
};
var https = require('https');
exports.sendPdfHTTPS = function (req, responce) {
    var donneRecu = req.body;
    var url = donneRecu['lien']; // jshint ignore:line
    https.get(url, function (res) {
        var chunks = [];
        if (res.statusCode !== 200) {
            responce.jsonp(404, null);
        }

        var len = parseInt(res.headers['content-length'], 10);
        var byteCounter = 0;

        res.on('data', function (chunk) {
            chunks.push(chunk);
            byteCounter = byteCounter + chunk.length;
            console.log((100.0 * byteCounter / len));
            global.io.sockets.emit('pdfProgress', {
                fileProgress: (100.0 * byteCounter / len)
            });
        });

        res.on('end', function () {
            var jsfile = new Buffer.concat(chunks).toString('base64');

            responce.send(jsfile);
        });
    }).on('error', function () {
        responce.jsonp(404, null);
    });
};

exports.generateSign = function (req, res) {
    var md5 = require('MD5');
    if (req.body.filechunck) {

        res.send(200, {
            sign: md5(req.body.filechunck)
        });
    } else {
        res.send(400, null);
    }
};

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
}

// To put in an external file and to include later
var util = require('util');
var request = require('request');


exports.getOneDriveDownloadLink = function (req, responce) {
    var body = req.body;

    if (body.url) {
        console.log('body.url', body.url);
        request({url: body.url, followRedirect: false}, function (error, response, body) {
            console.log('response.headers.location', response.headers.location);
            if (!error) {
                var redirect = response.headers.location;

                if (redirect) {
                    redirect = redirect.replace('redir', 'download');
                    responce.send(200, redirect);
                } else {
                    responce.send(error, 500);
                }

            } else {
                responce.send(error, 500);
            }
        });
    } else {
        responce.send(error, 400);
    }


};


exports.htmlPage = function (req, responce) {
    var donneRecu = req.body;
    var url = donneRecu['lien']; // jshint ignore:line

    console.log('lien', url);

    try {
        url = decodeURIComponent(url);
    }catch(e){
        console.log('lien', url);
    }

    request(url, function (error, response, body) {

        if (!error) {
            var data = null;

            try {
                data = decodeURIComponent(body);

            } catch (e) {
                data = body;
            }

            var charsetDetected = jschardet.detect(data);
            var enc;
            if (charsetDetected && charsetDetected.encoding) {
                enc = charsetDetected.encoding.toLowerCase();
            } else {
                enc = 'UTF-8';
            }
            console.log('charset');
            var charset = response.headers['content-type'];
            if (charset.indexOf('UTF-8') <= -1 && charset.indexOf('utf-8') <= -1 && charset.indexOf('utf8') <= -1) {

                console.log('decode');
                var html = iconv.decode(data, enc);
                responce.send(200, html);
            } else {
                responce.send(200, data.toString('utf-8'));
            }

        } else {
            responce.send(error, 500);
        }
    });

};

exports.downloadFIle = function (req, res) {
    var query = req.query;

    if (query.url) {
        request(query.url, function (error, response, body) {

            if (!error) {

                res.send(200, decodeURIComponent(body));

            } else {
                res.send(error, 400);
            }
        });
    } else {
        res.send(error, 400);
    }


};


function traverseEpub(obj, foundUrl) {
    for (var key in obj) {
        if (typeof (obj[key]) === 'object') {
            if (obj[key].content) {
                foundUrl.push(obj[key].content[0].$.src);
            }
            if (obj[key].navPoint && obj[key].navPoint.length > 0) {
                traverseEpub(obj[key].navPoint, foundUrl);
            }
        }
    }
}


var sizeOf = require('image-size');

function imageDownloader(rawImageList, htmlArray, tmpFolder, imgArray, responce, counter) {
    var canvasWidth = generalParams.MAX_WIDTH;
    var dimensions;
    if (rawImageList[counter] && rawImageList[counter].length > 2) {

        try {
            dimensions = sizeOf(rawImageList[counter]);
        } catch (e) {
            dimensions = {
                width: 700
            };
        }

        if (dimensions && dimensions.width < generalParams.MAX_WIDTH + 1) {

            try {
                var fileReaded = fs.readFileSync(rawImageList[counter]);
                var newValue = rawImageList[counter].replace(tmpFolder, '');
                var folderName = /((\/+)([A-Za-z0-9_%]*)(\/+))/i.exec(newValue)[0];
                var imgRefLink = newValue.replace(folderName, '');
                imgArray.push({
                    'link': imgRefLink,
                    'data': new Buffer(fileReaded).toString('base64')
                });

            } catch (e) {} finally {
                counter++;

                console.log(counter);
                if (rawImageList[counter]) {
                    imageDownloader(rawImageList, htmlArray, tmpFolder, imgArray, responce, counter);
                } else {
                    exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {});
                    responce.send(200, {
                        'html': htmlArray,
                        'img': imgArray
                    });
                }
            }
        } else if (dimensions && dimensions.width > generalParams.MAX_WIDTH) {

            var extension = rawImageList[counter].lastIndexOf('.');
            var originalImageLink = rawImageList[counter].substring(0, extension);
            var resisedImg = originalImageLink + '2' + rawImageList[counter].substring(extension, rawImageList[counter].length);

            exec('/usr/local/bin/gm convert -size ' + canvasWidth + ' ' + rawImageList[counter].replace(/\s+/g, '\\ ') + ' -resize ' + canvasWidth + ' +profile "*" ' + resisedImg.replace(/\s+/g, '\\ '), function(error, htmlresult, stderr) {

                try {
                    var fileReaded = fs.readFileSync(resisedImg);
                    var newValue = rawImageList[counter].replace(tmpFolder, '');
                    var folderName = /((\/+)([A-Za-z0-9_%]*)(\/+))/i.exec(newValue)[0];
                    var imgRefLink = newValue.replace(folderName, '');

                    imgArray.push({
                        'link': imgRefLink,
                        'data': new Buffer(fileReaded).toString('base64')
                    });
                } catch (e) {

                } finally {
                    counter++;

                    if (rawImageList[counter]) {
                        imageDownloader(rawImageList, htmlArray, tmpFolder, imgArray, responce, counter);
                    } else {
                        exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {});
                        responce.send(200, {
                            'html': htmlArray,
                            'img': imgArray
                        });
                    }
                }
            });
        } else {
            if (rawImageList[counter]) {
                imageDownloader(rawImageList, htmlArray, tmpFolder, imgArray, responce, counter);
            } else {

                exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {});

                responce.send(200, {
                    'html': htmlArray,
                    'img': imgArray
                });
            }
        }


    }
}


var btoa = require('btoa'); // jshint ignore:line

exports.epubUpload = function (req, responce) {

    var xml2js = require('xml2js');
    var foundUrl = [];
    var filesToUpload = [];
    var htmlArray = [];
    var imgArray = [];
    var orderedHtmlFile = [];
    var counter;
    var i, y;
    var tmpFolder = '';
    var canvasWidth = generalParams.MAX_WIDTH;
    var exitHTML = false;
    var existantHtml;

    if (!req.files.uploadedFile.length) {
        filesToUpload.push(req.files.uploadedFile);
        numberCalls = 1;
    } else {
        for (i = 0; i < req.files.uploadedFile.length; i++) {
            filesToUpload.push(req.files.uploadedFile[i]);
        }
        numberCalls = filesToUpload.length;
    }
    //FOR MAC
    //exec('mktemp -d /tmp/temp.XXXX', function (error, tmpFolder, stderr) {

    //FOR LINUX
    exec('mktemp -d ', function (error, tmpFolder, stderr) {
        console.log('________________________TMP_FOLDER____________________');
        console.log(tmpFolder);
        tmpFolder = tmpFolder.replace(/\s+/g, '');
        console.log(filesToUpload[0].path);
        exec('unzip ' + filesToUpload[0].path + ' -d ' + tmpFolder, function (error, stdout, stderr) {
            console.log('_____________________EXTRACT________________________');
            exec('find ' + tmpFolder + ' -type f -name \'*.xhtml\' -o -name \'*.html\' -o -name \'*.htm\' -o -name \'*.xml\'', function (error, sizesList, stderr) {
                existantHtml = sizesList;
                sizesList = sizesList.split('\n');
                var bigHtml = 0;
                var tooManyHtml = false;
                /*
                 * Check if the added file contains a number of html element lower than the limit fixed
                 */
                if (sizesList.length < generalParams.HTML_NUMBER_LIMIT) {
                    for (var i = 0; i < sizesList.length; i++) {
                        if (sizesList[i].length > 5) {
                            var stats = fs.statSync(sizesList[i]);
                            var fileSizeInBytes = stats['size']; // jshint ignore:line
                            var fileSizeInKB = fileSizeInBytes / 1024;
                            if (fileSizeInKB > generalParams.HTML_SINGLE_SIZE_LIMIT) {
                                console.log(sizesList[i]);
                                console.log(fileSizeInKB);
                                bigHtml = true;
                            }
                        }
                    }
                } else {
                    tooManyHtml = true;
                    console.log('too many html files > ' + generalParams.HTML_NUMBER_LIMIT);
                }
                if (tooManyHtml) {
                    exec('rm -rf ' + tmpFolder, function (error, deleteResponce, stderr) {

                    });
                    responce.send(200, {
                        'html': [],
                        'img': [],
                        'oversized': false,
                        'tooManyHtml': true,
                        'oversizedIMG': false
                    });
                } else if (bigHtml) {
                    console.log('this epub contains oversized html');
                    exec('rm -rf ' + tmpFolder, function (error, deleteResponce, stderr) {

                    });
                    responce.send(200, {
                        'html': [],
                        'img': [],
                        'oversized': true,
                        'tooManyHtml': false,
                        'oversizedIMG': false
                    });
                } else {
                    exec('find ' + tmpFolder + ' -name *.ncx', function (error, ncx, stderr) {
                        console.log('__________________NCX______________________');
                        console.log(ncx);
                        ncx = ncx.replace(/\s+/g, '');
                        fs.readFile(ncx, 'utf8', function (err, data) {
                            xml2js.parseString(data, function (err, result) {
                                console.log('xml parsed');
                                traverseEpub(result.ncx.navMap, foundUrl);
                                for (i = 0; i < foundUrl.length; i++) {
                                    if (foundUrl[i].indexOf('#') > 0) {
                                        foundUrl[i] = foundUrl[i].substring(0, foundUrl[i].indexOf('#'));
                                    }
                                }
                                for (i = 0; i < foundUrl.length; i++) {
                                    counter = false;
                                    for (y = 0; y < orderedHtmlFile.length; y++) {
                                        if (orderedHtmlFile[y] === foundUrl[i]) {
                                            counter = true;
                                            break;
                                        }
                                    }
                                    if (counter === false) {
                                        orderedHtmlFile.push(foundUrl[i]);
                                    }
                                }

                                exec('find ' + tmpFolder + ' -type f -name \'*.xhtml\' -o -name \'*.html\' -o -name \'*.htm\' -o -name \'*.xml\'', function (error, htmlresult, stderr) {
                                    console.log('__________________XHTML AND HTML______________________');
                                    var htmlFound = htmlresult.split('\n');
                                    for (i = 0; i < orderedHtmlFile.length; i++) {
                                        for (y = 0; y < htmlFound.length; y++) {
                                            if (htmlFound[y].indexOf(orderedHtmlFile[i]) > -1) {

                                                var fileReaded = fs.readFileSync(htmlFound[y], 'utf8');

                                                htmlArray.push({
                                                    'link': orderedHtmlFile[i],
                                                    'dataHtml': btoa(fileReaded)
                                                });
                                                if (htmlArray.length >= orderedHtmlFile.length) {
                                                    console.log('html traitement finished going to images');
                                                    exitHTML = true;
                                                    break;
                                                } else {
                                                    break;
                                                }

                                            }
                                        }
                                        if (exitHTML) {
                                            break;
                                        }
                                    }
                                    if (exitHTML) {

                                        exec('du -hs ' + tmpFolder, function (error, dirSize, stderr) {
                                            exec('du -csh $(find ' + tmpFolder + ' -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" | xargs) | tail -n1', function (error, allImgSize, stderr) {
                                                if (allImgSize === 0 || dirSize === allImgSize) {
                                                    exec('rm -rf ' + tmpFolder, function (error, deleteResponce, stderr) {

                                                    });

                                                    responce.send(200, {
                                                        'html': htmlArray,
                                                        'img': []
                                                    });
                                                } else {
                                                    if (allImgSize > generalParams.IMG_SIZE_LIMIT) {
                                                        exec('rm -rf ' + tmpFolder, function (error, deleteResponce, stderr) {

                                                        });

                                                        responce.send(200, {
                                                            'html': [],
                                                            'img': [],
                                                            'oversized': false,
                                                            'tooManyHtml': false,
                                                            'oversizedIMG': true
                                                        });
                                                    } else {
                                                        console.log('Searching for images');
                                                        exec('find ' + tmpFolder + ' -name *.png -o -name *.jpg -o -name *.jpeg -o -name *.PNG -o -name *.JPG -o -name *.JPEG  ', function (error, imgFound, stderr) {
                                                            console.log('__________________IMG______________________');
                                                            imgFound = imgFound.split('\n');
                                                            if (imgFound.length > 1) {
                                                                imageDownloader(imgFound, htmlArray, tmpFolder, imgArray, responce, 0);
                                                            } else {
                                                                exec('rm -rf ' + tmpFolder, function (error, deleteResponce, stderr) {

                                                                });

                                                                responce.send(200, {
                                                                    'html': htmlArray,
                                                                    'img': []
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        });
                                    }


                                });
                            });
                        });
                    });
                }

            });

        });
    });
};

exports.externalEpub = function (req, responce) {
    var sizeOf = require('image-size');
    var xml2js = require('xml2js');
    var AdmZip = require('adm-zip');
    var url = req.body.lien;
    var protocole = null;
    var filesToUpload = [];
    var tmpFolder = '';
    var htmlArray = [];
    var imgArray = [];
    var orderedHtmlFile = [];
    var counter;
    var i, y;
    var tmpFolder = ''; // jshint ignore:line
    var foundUrl = [];
    var canvasWidth = generalParams.MAX_WIDTH;
    var exitHTML = false;
    var existantHtml;

    if (isUrl(url)) {
        if (url.indexOf('https') > -1) {
            protocole = https;
        } else {
            protocole = http;
        }

        protocole.get(url, function (res) {
            var data = [],
                dataLen = 0;
            var chunks = [];
            if (res.statusCode !== 200) {
                helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
                responce.jsonp(404, null);
            }
            var len = parseInt(res.headers['content-length'], 10);
            var byteCounter = 0;
            res.on('data', function (chunk) {
                data.push(chunk);
                dataLen += chunk.length;

                chunks.push(chunk);
                byteCounter = byteCounter + chunk.length;

                global.io.sockets.emit('epubProgress', {
                    fileProgress: (100.0 * byteCounter / len)
                });
            });
            res.on('end', function () {
                var jsfile = new Buffer.concat(chunks);

                var buf = new Buffer(dataLen);

                for (var i = 0, len = data.length, pos = 0; i < len; i++) {
                    data[i].copy(buf, pos);
                    pos += data[i].length;
                }

                var zip = new AdmZip(buf);
                var zipEntries = zip.getEntries();


                exec('mktemp -d', function (error, tmpFolder, stderr) {
                    console.log('________________________TMP_FOLDER____________________');
                    console.log(tmpFolder);
                    tmpFolder = tmpFolder.replace(/\s+/g, '');
                    console.log('_____________________EXTRACT________________________');
                    zip.extractAllTo(tmpFolder, /*overwrite*/ true);

                    exec('find ' + tmpFolder + '-type f -name "*.xhtml" -o -name "*.html" -o -name "*.htm" -o -name "*.xml"', function (error, sizesList, stderr) {

                        existantHtml = sizesList;
                        sizesList = sizesList.split('\n');
                        var bigHtml = 0;
                        var tooManyHtml = false;

                        if (sizesList.length < generalParams.HTML_NUMBER_LIMIT) {
                            for (var i = 0; i < sizesList.length; i++) {

                                if (sizesList[i].length > 5) {
                                    var stats = fs.statSync(sizesList[i]);
                                    var fileSizeInBytes = stats['size']; // jshint ignore:line
                                    var fileSizeInKB = fileSizeInBytes / 1024;
                                    // console.log(fileSizeInKB);
                                    if (fileSizeInKB > generalParams.HTML_SINGLE_SIZE_LIMIT) {
                                        bigHtml++;
                                    }
                                }
                            }
                        } else {
                            tooManyHtml = true;
                            console.log('too many html files > ' + generalParams.HTML_NUMBER_LIMIT);
                        }
                        if (tooManyHtml) {
                            exec('rm -rf ' + tmpFolder, function (error, deleteResponce, stderr) {

                            });
                            responce.send(200, {
                                'html': [],
                                'img': [],
                                'oversized': false,
                                'tooManyHtml': true,
                                'oversizedIMG': false
                            });
                        } else if (bigHtml > 1) {
                            console.log('this epub contains oversized html');
                            exec('rm -rf ' + tmpFolder, function (error, deleteResponce, stderr) {

                            });
                            responce.send(200, {
                                'html': [],
                                'img': [],
                                'oversized': true,
                                'tooManyHtml': false,
                                'oversizedIMG': false
                            });
                        } else {
                            exec('find ' + tmpFolder + ' -name *.ncx', function (error, ncx, stderr) {
                                console.log('__________________NCX______________________');
                                console.log(ncx);
                                console.log('my ncx');
                                ncx = ncx.replace(/\s+/g, '');

                                fs.readFile(ncx, 'utf8', function (err, data) {

                                    xml2js.parseString(data, function (err, result) {
                                        console.log('xml parsed');
                                        traverseEpub(result.ncx.navMap, foundUrl);
                                        for (i = 0; i < foundUrl.length; i++) {
                                            if (foundUrl[i].indexOf('#') > 0) {
                                                foundUrl[i] = foundUrl[i].substring(0, foundUrl[i].indexOf('#'));
                                            }
                                        }
                                        for (i = 0; i < foundUrl.length; i++) {
                                            counter = false;
                                            for (y = 0; y < orderedHtmlFile.length; y++) {
                                                if (orderedHtmlFile[y] === foundUrl[i]) {
                                                    counter = true;
                                                    break;
                                                }
                                            }
                                            if (counter === false) {
                                                orderedHtmlFile.push(foundUrl[i]);
                                            }
                                        }

                                        exec('find ' + tmpFolder + ' -type f -name "*.xhtml" -o -name "*.html" -o -name "*.htm" -o -name "*.xml"', function (error, htmlresult, stderr) {

                                            var sizesList = htmlresult.split('\n');
                                            var bigHtml = 0;
                                            var tooManyHtml = false;
                                            if (sizesList.length < generalParams.HTML_NUMBER_LIMIT) {
                                                for (var i = 0; i < sizesList.length; i++) {

                                                    if (sizesList[i].length > 5) {
                                                        var stats = fs.statSync(sizesList[i]);
                                                        var fileSizeInBytes = stats['size']; // jshint ignore:line
                                                        var fileSizeInKB = fileSizeInBytes / 1024;
                                                        if (fileSizeInKB > generalParams.HTML_SINGLE_SIZE_LIMIT) {
                                                            bigHtml++;
                                                        }
                                                    }
                                                }
                                            } else {
                                                tooManyHtml = true;
                                                console.log('too many html files > ' + generalParams.HTML_NUMBER_LIMIT);
                                            }
                                            if (tooManyHtml) {
                                                exec('rm -rf ' + tmpFolder, function (error, deleteResponce, stderr) {
                                                });
                                                responce.send(200, {
                                                    'html': [],
                                                    'img': [],
                                                    'oversized': false,
                                                    'tooManyHtml': true,
                                                    'oversizedIMG': false
                                                });
                                            } else if (bigHtml > 1) {
                                                console.log('this epub contains oversized html');
                                                exec('rm -rf ' + tmpFolder, function (error, deleteResponce, stderr) {

                                                });
                                                responce.send(200, {
                                                    'html': [],
                                                    'img': [],
                                                    'oversized': true,
                                                    'tooManyHtml': false,
                                                    'oversizedIMG': false
                                                });
                                            } else {
                                                console.log('________HTML_______XHTML_________HTM_____XML______');
                                                // console.log(htmlFound);
                                                var htmlFound = htmlresult.split('\n');
                                                console.log('===HTML FOUND===>' + htmlFound.length);
                                                console.log('===ORDER HTML===>' + orderedHtmlFile.length);
                                                for (var z = 0; z < orderedHtmlFile.length; z++) {
                                                    for (y = 0; y < htmlFound.length; y++) {
                                                        if (htmlFound[y].indexOf(orderedHtmlFile[z]) > -1) {
                                                            var fileReaded = fs.readFileSync(htmlFound[y], 'utf8');
                                                            htmlArray.push({
                                                                'link': orderedHtmlFile[z],
                                                                'dataHtml': fileReaded
                                                            });
                                                            if (htmlArray.length >= orderedHtmlFile.length) {
                                                                exitHTML = true;
                                                            } else {
                                                                break;
                                                            }

                                                        }
                                                    }
                                                    if (exitHTML) {
                                                        break;
                                                    }
                                                }
                                                if (exitHTML) {
                                                    console.log('Searching for images');
                                                    exec('find ' + tmpFolder + ' -name *.png -o -name *.jpg -o -name *.jpeg -o -name *.PNG -o -name *.JPG -o -name *.JPEG  ', function (error, imgFound, stderr) {
                                                        console.log('__________________IMG______________________');
                                                        imgFound = imgFound.split('\n');
                                                        console.log('image Found ', imgFound.length);
                                                        if (imgFound.length > 1) {
                                                            imageDownloader(imgFound, htmlArray, tmpFolder, imgArray, responce, 0);
                                                        } else {
                                                            exec('rm -rf ' + tmpFolder, function (error, deleteResponce, stderr) {
                                                            });
                                                            responce.send(200, {
                                                                'html': htmlArray,
                                                                'img': []
                                                            });
                                                        }
                                                    });
                                                }
                                            }


                                        });
                                    });
                                });
                            });
                        }
                    });

                });
            });

        }).on('error', function () {
            helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
            responce.jsonp(404, null);
        });

    } else {
        responce.send(400, {
            'code': -1,
            'message': 'le lien est pas correcte'
        });
    }
};