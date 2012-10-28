var ejs = require('ejs')
  , fs = require('fs')

var files = {
    'petal-fragment' : __dirname + '/../lib/shaders/petal-fragment.glsl'
  , 'petal-vertex'   : __dirname + '/../lib/shaders/petal-vertex.glsl'
};

Object.keys(files).forEach(function (name) {
  files[name] = fs.readFileSync(files[name], 'utf8')
    .replace(/^\s+|\s$/g, '')
})

var templates = {
  index : __dirname + '/index.ejs'
};

Object.keys(templates).forEach(function (name) {
  templates[name] = fs.readFileSync(templates[name], 'utf8')
  templates[name] = ejs.compile(templates[name])
});

fs.writeFileSync(__dirname + '/../public/index.html', templates.index({
  files: files
}), 'utf8')