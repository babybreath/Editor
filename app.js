var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var koa = require('koa');
var app = koa();
var serve = require('koa-static');
var bodyParser = require('koa-bodyparser');
var router = require('koa-router')();
var parse = require('co-busboy');
router.post('/submit', function * (next){
	var params = this.request.body;
	console.log(params)
	this.body = {ret: 0};
});
router.post('/upload', function * (next){
	if (!this.request.is('multipart/*')) return yield next;

	var parts = parse(this, {
		autoFields: true,
		checkFile: function (fieldname, file, filename) {
	      if (path.extname(filename) !== '.jpg') {
	        var err = new Error('invalid jpg image');
	        err.status = 400;
	        return err;
	      }
	    }
	})
	var part;
	var filename = crypto.randomBytes(32).toString('hex');
	var resUrl = '/file/' + filename;
	var writer = fs.createWriteStream(path.join(__dirname, 'public/file', filename));
	while (part = yield parts) {
	// it's a stream
	part.pipe(writer)
	}
	console.log('and we are done parsing the form!')
	// .field holds all the fields in key/value form
	console.log(parts.field._csrf)
	// .fields holds all the fields in [key, value] form
	console.log(parts.fields[0])
	this.body = {error: 0, url: resUrl};
})

var staticPath = path.join(__dirname, 'public');

app.use(serve(staticPath));

app.use(bodyParser());

app.use(router.routes())
	.use(router.allowedMethods());

app.listen(3000);

console.log('listening on port 3000');