(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.translate = (function() {
    var $, initialized, lastUpdateLang, t;
    $ = jQuery;
    initialized = false;
    lastUpdateLang = null;
    t = function(options) {
      if (arguments.length === 2) {
        t.addTranslation(arguments[0], arguments[1]);
        return this;
      }
      t.config();
      if (arguments.length === 0) {
        return t.options;
      }
      if (typeof arguments[0] === 'string') {
        arguments[0] = $(t.options.wrapper).html(arguments[0]);
      }
      if ((arguments[0].length != null) > 0) {
        return t.translateElementAttributes(t.translateElement(arguments[0]));
      }
      t.config(arguments[0]);
      return t;
    };
    t.options = {
      placeholderRegexp: /#{(.*)}/g,
      wrapper: '<span/>',
      attributes: ['title', 'alt', 'value', 'placeholder', 'label'],
      map: {
        'en': {
          'date.year': Math.max(2015, (new Date).getFullYear()),
          'language': function() {
            return $.language();
          }
        }
      },
      transitDomNodes: function($items2hide, $items2show) {
        $items2hide.hide();
        return $items2show.fadeIn();
      }
    };
    t.config = function(options) {
      if (!options && initialized) {
        return t.options;
      }
      t.options = $.extend(t.options, options);
      if (!initialized) {
        initialized = true;
        $(document).ready(function() {
          $('body').bind('language.change', t.update);
          return t.update();
        });
      }
      return this;
    };
    t.addTranslation = function(language, map) {
      if (!$.language.isValid(language)) {
        return this;
      }
      lastUpdateLang = null;
      t.options.map[language] = $.extend(t.options.map[language], map);
      return this;
    };
    t.translateElement = function($el, language) {
      var key;
      language = language || $.language();
      key = $el.attr('data-translation-key');
      if (!key) {
        key = $el.text();
        $el.attr('data-translation-key', key);
      }
      $el.html(t.translate(key, language));
      return $el;
    };
    t.translateElementAttributes = function($el, language) {
      var attrs, i, keys;
      language = language || $.language();
      attrs = $el.attr('data-translation-attributes');
      if (attrs === '0') {
        return $el;
      }
      if (!attrs) {
        attrs = [];
        keys = [];
        i = 0;
        while (i < t.options.attributes.length) {
          if ($el.attr(t.options.attributes[i])) {
            attrs.push(t.options.attributes[i]);
            keys.push($el.attr(t.options.attributes[i]));
          }
          i++;
        }
        $el.attr('data-translation-attributes', attrs.join('|'));
        $el.attr('data-translation-keys', keys.join('|'));
      } else {
        attrs = attrs.split('|');
        keys = $el.attr('data-translation-keys').split('|');
      }
      if (attrs.length === 0) {
        $el.attr('data-translation-attributes', '0');
        return $el;
      }
      i = 0;
      while (i < attrs.length) {
        $el.attr(attrs[i], t.translate(keys[i], language));
        i++;
      }
      return $el;
    };
    t.translate = function(key, language) {
      language = language || $.language();
      if (!key || !t.options.map[language]) {
        return key;
      }
      if (t.isTranslatable(key, language)) {
        key = t.translateSingle(key, language);
      } else if (t.isTranslatable(key, $.language.fallback())) {
        console.log("!jquery.translation::untranslated '" + key + "' in " + language);
        key = t.translateSingle(key, $.language.fallback());
      }
      return t.resolvePlaceholder(key, language);
    };
    t.translateSingle = function(key, language) {
      if ($.isFunction(t.options.map[language][key])) {
        return t.options.map[language][key].call(language);
      }
      return t.options.map[language][key];
    };
    t.isTranslatable = function(key, language) {
      language = language || $.language();
      return key && t.options.map[language] && t.options.map[language][key];
    };
    t.resolvePlaceholder = function(key, language) {
      var match;
      while (match = t.options.placeholderRegexp.exec(key)) {
        key = key.replace('#{' + match[1] + '}', t.translate(match[1], language));
      }
      return key;
    };
    t.update = function(searchRoot) {
      if (lastUpdateLang === $.language() && !searchRoot) {
        return;
      }
      $('[data-translation-node]', searchRoot).each(function() {
        return t.options.transitDomNodes($('[data-translation-node-item]', this), $("[data-translation-node-item='" + ($.language()) + "']", this));
      });
      $('[data-translation-key],[data-translation-attributes]', searchRoot).each(function() {
        t.translateElement($(this), $.language());
        return t.translateElementAttributes($(this), $.language());
      });
      return lastUpdateLang = $.language();
    };
    return t;
  })();

  if (typeof jQuery !== 'undefined') {
    jQuery.extend({
      translate: root.translate
    });
  }

}).call(this);
