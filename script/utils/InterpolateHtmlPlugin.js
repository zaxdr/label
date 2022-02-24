function escapeStringRegexp(string) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string');
  }
  return string
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replace(/-/g, '\\x2d');
}



function InterpolateHtmlPlugin(htmlWebpackPlugin, replacements) {
  this.htmlWebpackPlugin = htmlWebpackPlugin;
  this.replacements = replacements;
}

InterpolateHtmlPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compilation.tap('InterpolateHtmlPlugin', compilation => {
    this.htmlWebpackPlugin
      .getHooks(compilation)
      .afterTemplateExecution.tap('InterpolateHtmlPlugin', data => {
        Object.keys(this.replacements).forEach(key => {
          const value = this.replacements[key];
          data.html = data.html.replace(
            new RegExp('%' + escapeStringRegexp(key) + '%', 'g'),
            value
          );
        });
      });
  });

}

module.exports = InterpolateHtmlPlugin;
