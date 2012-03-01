var types   = ['GLenum','GLboolean','GLbitfield','GLvoid','GLbyte','GLshort',
             'GLint','GLubyte','GLushort','GLuint','GLsizei','GLfloat',
             'GLclampf','GLdouble','GLclampd'],
    nodeogl = require("./node-ogl");

for (var i=0; i<types.length; i++)
{
  // wtf is this?
  (function(i) {
    exports[types[i]] = function(value) {
      var ret = {};

      Object.defineProperty(ret, "type", {
        value        : types[i],
        configurable : false,
        enumerable   : true
      });

      Object.defineProperty(ret, "reference", {
        value        : true,
        configurable : false,
        enumerable   : true
      });
      ret.value = value;
      return ret;
    }
  })(i);
}

// TODO: filtering and possibly better namespacing
var util = require("util");
for (var key in nodeogl) {

  if (typeof nodeogl[key] === 'function') {
    (function(key, s) {
      exports[key] = function() {
        var ret = nodeogl[key].apply(s, arguments);
        var error = 0;//nodeogl["glGetError"]();
        if (error > 0) {
          util.puts("calling: " + key);
          util.puts("error: " + error);
          process.exit();
        }
        return ret;
      };
    })(key, this);
  } else {
    exports[key] = nodeogl[key];
  }
};

