var express = require('express');
var http = require('http');
var url = require('url');

var middleware = function(req, res) {
  var pathname = url.parse(req.url).pathname;
  res.type('application/json; charset=utf-8').sendfile('data'+pathname+'.json');
};

var instagram = function(req, res) {
  var ig = require('instagram-node').instagram();
  ig.use({ client_id: '',
         client_secret: ''});
  ig.tag_media_recent('ruisrock', function(err, medias, pagination, limit) {
    //res.send(JSON.stringify(medias));
    var data = [];
    medias.forEach(function(media){
      var obj = {}; 
      obj.link = media.link;
      obj.title = (media.caption==null)?"":media.caption.text;
      obj.thumbnail = media.images.thumbnail.url;
      obj.small_image = media.images.low_resolution.url;
      obj.image = media.images.standard_resolution.url;
      obj.likes = media.likes.count;
      obj.tags = media.tags;
      data.push(obj);
    });
    res.send(JSON.stringify(data));
  });
}

var app = express()
  .use('/api/instagram', instagram)
  .use('/api', middleware)
  .use('/public', express.static(__dirname + '/public'));

var port = Number(process.env.PORT || 8080);
http.createServer(app).listen(port);
console.log('Running at port '+port);
