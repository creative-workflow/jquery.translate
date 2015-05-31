(function() {
  var $, instance, root,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.JQueryTranslate = (function() {
    JQueryTranslate.options = {
      placeholderRegexp: /#{(.*)}/g,
      wrapper: '<span/>',
      attributes: ['title', 'alt', 'value', 'placeholder', 'label'],
      map: {
        'en': {
          'date.year': Math.max(2015, (new Date).getFullYear()),
          'language': function() {
            return jQuery.language();
          }
        }
      },
      transitDomNodes: function($items2hide, $items2show) {
        $items2hide.hide();
        return $items2show.fadeIn();
      }
    };

    function JQueryTranslate(options1) {
      this.options = options1;
      this.update = bind(this.update, this);
      this.resolvePlaceholder = bind(this.resolvePlaceholder, this);
      this.isTranslatable = bind(this.isTranslatable, this);
      this.translateSingle = bind(this.translateSingle, this);
      this.translate = bind(this.translate, this);
      this.translateElementAttributes = bind(this.translateElementAttributes, this);
      this.translateElement = bind(this.translateElement, this);
      this.addTranslation = bind(this.addTranslation, this);
      this.config = bind(this.config, this);
      this._lastUpdateLang = null;
      this._initialized = false;
      this.config(jQuery.extend(this.options, this.constructor.options));
    }

    JQueryTranslate.prototype.config = function(options) {
      if (!options && this._initialized) {
        return this.options;
      }
      this.options = jQuery.extend(this.options, options);
      if (!this._initialized) {
        this._initialized = true;
        jQuery(document).ready((function(_this) {
          return function() {
            jQuery('body').bind('language.change', _this.update);
            return _this.update();
          };
        })(this));
      }
      return this;
    };

    JQueryTranslate.prototype.addTranslation = function(language, map) {
      if (!jQuery.language.isValid(language)) {
        return this;
      }
      this._lastUpdateLang = null;
      this.options.map[language] = jQuery.extend(this.options.map[language], map);
      return this;
    };

    JQueryTranslate.prototype.translateElement = function($el, language) {
      var key;
      language = language || jQuery.language();
      key = $el.attr('data-translation-key');
      if (!key) {
        key = $el.text();
        $el.attr('data-translation-key', key);
      }
      $el.html(this.translate(key, language));
      return $el;
    };

    JQueryTranslate.prototype.translateElementAttributes = function($el, language) {
      var attribute, attrs, i, index, j, keys, len, len1, ref;
      language = language || jQuery.language();
      attrs = $el.attr('data-translation-attributes');
      if (attrs === '0') {
        return $el;
      }
      if (!attrs) {
        attrs = [];
        keys = [];
        ref = this.options.attributes;
        for (i = 0, len = ref.length; i < len; i++) {
          attribute = ref[i];
          if ($el.attr(attribute)) {
            attrs.push(attribute);
            keys.push($el.attr(attribute));
          }
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
      for (index = j = 0, len1 = attrs.length; j < len1; index = ++j) {
        attribute = attrs[index];
        $el.attr(attrs[index], this.translate(keys[index], language));
      }
      return $el;
    };

    JQueryTranslate.prototype.translate = function(key, language) {
      language = language || jQuery.language();
      if (!key || !this.options.map[language]) {
        return key;
      }
      if (this.isTranslatable(key, language)) {
        key = this.translateSingle(key, language);
      } else if (this.isTranslatable(key, jQuery.language.fallback())) {
        console.log("!jquery.translation::untranslated '" + key + "' in " + language);
        key = this.translateSingle(key, jQuery.language.fallback());
      }
      return this.resolvePlaceholder(key, language);
    };

    JQueryTranslate.prototype.translateSingle = function(key, language) {
      if (jQuery.isFunction(this.options.map[language][key])) {
        return this.options.map[language][key].call(language);
      }
      return this.options.map[language][key];
    };

    JQueryTranslate.prototype.isTranslatable = function(key, language) {
      language = language || jQuery.language();
      return key && this.options.map[language] && this.options.map[language][key];
    };

    JQueryTranslate.prototype.resolvePlaceholder = function(key, language) {
      var match;
      while (match = this.options.placeholderRegexp.exec(key)) {
        key = key.replace('#{' + match[1] + '}', this.translate(match[1], language));
      }
      return key;
    };

    JQueryTranslate.prototype.update = function(searchRoot) {
      if (this._lastUpdateLang === jQuery.language() && !searchRoot) {
        return;
      }
      jQuery('[data-translation-node]', searchRoot).each((function(_this) {
        return function(index, element) {
          return _this.options.transitDomNodes(jQuery('[data-translation-node-item]', element), jQuery("[data-translation-node-item='" + (jQuery.language()) + "']", element));
        };
      })(this));
      jQuery('[data-translation-key],[data-translation-attributes]', searchRoot).each((function(_this) {
        return function(index, element) {
          _this.translateElement(jQuery(element), jQuery.language());
          return _this.translateElementAttributes(jQuery(element), jQuery.language());
        };
      })(this));
      return this._lastUpdateLang = jQuery.language();
    };

    return JQueryTranslate;

  })();

  if (typeof jQuery !== 'undefined') {
    instance = new JQueryTranslate();
    $ = jQuery;
    $.extend({
      translate: function() {
        if (arguments.length === 2) {
          instance.addTranslation(arguments[0], arguments[1]);
          return this;
        }
        instance.config();
        if (!arguments.length) {
          return instance.config();
        }
        if (typeof arguments[0] === 'string') {
          arguments[0] = $(instance.config().wrapper).html(arguments[0]);
        }
        if ((arguments[0].length != null) > 0) {
          return instance.translateElementAttributes(instance.translateElement(arguments[0]));
        }
        instance.config(arguments[0]);
        return this;
      }
    });
    $.extend($.translate, instance);
    $.translate.instance = instance;
  }

}).call(this);
