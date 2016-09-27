var _ = require('underscore');
var LegendBaseDefModel = require('./legend-base-definition-model');

function _unquote (c) {
  return c.replace(/^"(.+(?="$))"$/, '$1');
}

module.exports = LegendBaseDefModel.extend({
  defaults: _.extend({}, LegendBaseDefModel.prototype.defaults,
    {
      type: 'custom',
      items: []
    }
  ),

  parse: function (r, opts) {
    var attrs = LegendBaseDefModel.prototype.parse.call(this, r);

    if (r.definition) {
      attrs.items = r.definition.categories.map(function (item) {
        return {
          name: item.title,
          color: item.color
        };
      });
    } else {
      attrs.items = this._inheritStyleCategories(opts.layerDefinitionModel.styleModel.get('fill').color);
    }
    return attrs;
  },

  toJSON: function () {
    return _.extend(
      {},
      _.omit(this.attributes, 'items', 'postHTMLSnippet', 'preHTMLSnippet'),
      {
        pre_html: this.get('preHTMLSnippet'),
        post_html: this.get('postHTMLSnippet')
      },
      {
        definition: {
          categories: this.get('items').map(function (item) {
            return {
              title: item.name,
              color: item.color
            };
          })
        }
      }
    );
  },

  _inheritStyleCategories: function (color) {
    var range = color.range.length;
    return _.range(range).map(function (v, index) {
      return {
        color: color.range[index],
        name: color.domain && _unquote(color.domain[index]) || ''
      };
    });
  }
});