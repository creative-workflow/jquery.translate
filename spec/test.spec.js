(function() {
  describe('jquery.translate', function() {
    beforeEach(function() {
      var $;
      $ = jQuery;
      $.language({
        active: 'de',
        fallback: 'de',
        urlParam: 'lang',
        cookieName: 'lang',
        available: ['en', 'de']
      });
      $.translate('de', {
        'simple': 'einfach!',
        'anykey': 'Irgend eine taste #{language}',
        'only_german_key': 'nur in deutsch',
        'language': function() {
          return $.language();
        }
      });
      return $.translate('en', {
        'simple': 'simple!',
        'anykey': 'Any Key #{language}'
      });
    });
    return describe('#translate', function() {
      it('with two parameters adds a translation map', function() {
        expect($.translate.translate('new_key_in_da_house')).toEqual('new_key_in_da_house');
        $.translate('de', {
          'new_key_in_da_house': 'Neuer Eintrag'
        });
        return expect($.translate.translate('new_key_in_da_house')).toEqual('Neuer Eintrag');
      });
      it('with one string parameter calls translateElement', function() {
        spyOn($.translate, 'translateElement');
        spyOn($.translate, 'translateElementAttributes');
        $.translate('simple');
        expect($.translate.translateElement).toHaveBeenCalled();
        return expect($.translate.translateElementAttributes).toHaveBeenCalled();
      });
      it('with one jquery selector calls translateElement', function() {
        var selector;
        spyOn($.translate, 'translateElement');
        spyOn($.translate, 'translateElementAttributes');
        selector = $('<span>simple</span>');
        $.translate(selector);
        expect($.translate.translateElement).toHaveBeenCalled();
        return expect($.translate.translateElementAttributes).toHaveBeenCalled();
      });
      it('with zero parameter return the configuration', function() {
        var config;
        config = $.translate();
        return expect(config.wrapper).toEqual('<span/>');
      });
      describe('#translateElement', function() {
        it('translates a key and wraps it into an dom element', function() {
          var result;
          result = $.translate('simple');
          expect(result.data('translation-key')).toEqual('simple');
          return expect(result.text()).toEqual('einfach!');
        });
        it('translates a jquery object', function() {
          var result, selector;
          selector = $('<span>simple</span>');
          result = $.translate(selector);
          expect(result.data('translation-key')).toEqual('simple');
          return expect(result.text()).toEqual('einfach!');
        });
        return it('translates a jquery object into another language', function() {
          var result, selector;
          selector = $('<span>simple</span>');
          result = $.translate.translateElement(selector);
          expect(result.data('translation-key')).toEqual('simple');
          expect(result.text()).toEqual('einfach!');
          result = $.translate.translateElement(result, 'en');
          expect(result.data('translation-key')).toEqual('simple');
          return expect(result.text()).toEqual('simple!');
        });
      });
      describe('#translateElementAttributes', function() {
        it('translates a jquery object', function() {
          var result, selector;
          selector = $('<img alt="simple" title="anykey"/>').attr('data-translation-attributes', '');
          result = $.translate.translateElementAttributes(selector);
          expect(result.attr('alt')).toEqual('einfach!');
          return expect(result.attr('title')).toEqual('Irgend eine taste de');
        });
        return it('translates a jquery object into another language', function() {
          var result, selector;
          selector = $('<img alt="simple" title="anykey"/>').attr('data-translation-attributes', '');
          result = $.translate.translateElementAttributes(selector);
          expect(result.attr('alt')).toEqual('einfach!');
          expect(result.attr('title')).toEqual('Irgend eine taste de');
          result = $.translate.translateElementAttributes(selector, 'en');
          expect(result.attr('alt')).toEqual('simple!');
          return expect(result.attr('title')).toEqual('Any Key de');
        });
      });
      describe('#update', function() {
        it('updates inplace translations ', function() {
          var result, wrappedResult;
          result = $.translate('simple').attr('id', 'test');
          wrappedResult = $('<div/>').append(result);
          expect(result.data('translation-key')).toEqual('simple');
          expect(result.text()).toEqual('einfach!');
          $.language('en');
          $.translate.update(wrappedResult);
          expect(result.data('translation-key')).toEqual('simple');
          return expect(result.text()).toEqual('simple!');
        });
        it('updates translatable attributes ', function() {
          var result, wrappedResult;
          result = $('<div data-translation-node="1"/>').append('<div data-translation-node-item="de">Deutsch</div>').append('<div data-translation-node-item="en">German</div>');
          wrappedResult = $('<div/>').append(result);
          $('body').append(wrappedResult);
          $.translate.update(wrappedResult);
          expect($('[data-translation-node-item="de"]', wrappedResult).is(':visible')).toBeTruthy();
          expect($('[data-translation-node-item="en"]', wrappedResult).is(':visible')).not.toBeTruthy();
          $.language('en');
          $.translate.update(wrappedResult);
          expect($('[data-translation-node-item="de"]', wrappedResult).is(':visible')).not.toBeTruthy();
          return expect($('[data-translation-node-item="en"]', wrappedResult).is(':visible')).toBeTruthy();
        });
        return it('updates translation dom elements ', function() {
          var result, wrappedResult;
          result = $.translate('simple').attr('id', 'test');
          wrappedResult = $('<div/>').append(result);
          expect(result.data('translation-key')).toEqual('simple');
          expect(result.text()).toEqual('einfach!');
          $.language('en');
          $.translate.update(wrappedResult);
          expect(result.data('translation-key')).toEqual('simple');
          return expect(result.text()).toEqual('simple!');
        });
      });
      return describe('#translate', function() {
        it('translates a single key correct', function() {
          expect($.translate.translate('simple')).toEqual('einfach!');
          $.language('en');
          return expect($.translate.translate('simple')).toEqual('simple!');
        });
        it('falls back to default "de" if key not present', function() {
          $.language('en');
          return expect($.translate.translate('only_german_key')).toEqual('nur in deutsch');
        });
        it('returns the key if key not present', function() {
          return expect($.translate.translate('unknown_key')).toEqual('unknown_key');
        });
        it('can call methods as translation keys', function() {
          expect($.translate.translate('language')).toEqual('de');
          $.language('en');
          return expect($.translate.translate('language')).toEqual('en');
        });
        it('resolves inherited translation keys', function() {
          expect($.translate.translate('anykey')).toEqual('Irgend eine taste de');
          $.language('en');
          return expect($.translate.translate('anykey')).toEqual('Any Key en');
        });
        return it('can translate temporarily in an other language', function() {
          expect($.translate.translate('anykey')).toEqual('Irgend eine taste de');
          return expect($.translate.translate('anykey', 'en')).toEqual('Any Key de');
        });
      });
    });
  });

}).call(this);
