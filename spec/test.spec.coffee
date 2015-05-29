describe 'jquery.translate', ->
  beforeEach ->

    $ = jQuery
    $.language
      active: 'de'
      fallback: 'de'
      urlParam: 'lang'
      cookieName: 'lang'
      available: [
        'en'
        'de'
      ]

    $.translate 'de',
      'simple': 'einfach!'
      'anykey': 'Irgend eine taste #{language}'
      'only_german_key': 'nur in deutsch'
      'language': ->
        $.language()

    $.translate 'en',
      'simple': 'simple!'
      'anykey': 'Any Key #{language}'

  describe '#translate', ->
    it 'with two parameters adds a translation map', ->
      expect($.translate.translate('new_key_in_da_house')).toEqual 'new_key_in_da_house'

      $.translate 'de',
        'new_key_in_da_house': 'Neuer Eintrag'

      expect($.translate.translate('new_key_in_da_house')).toEqual 'Neuer Eintrag'

    it 'with one string parameter calls translateElement', ->
      spyOn($.translate, 'translateElement');
      spyOn($.translate, 'translateElementAttributes');

      $.translate('simple')
      expect($.translate.translateElement).toHaveBeenCalled()
      expect($.translate.translateElementAttributes).toHaveBeenCalled()

    it 'with one jquery selector calls translateElement', ->
      spyOn($.translate, 'translateElement');
      spyOn($.translate, 'translateElementAttributes');
      selector = $('<span>simple</span>')

      $.translate(selector)
      expect($.translate.translateElement).toHaveBeenCalled()
      expect($.translate.translateElementAttributes).toHaveBeenCalled()

    it 'with zero parameter return the configuration', ->
      config = $.translate()
      expect(config.wrapper).toEqual '<span/>'

    describe '#translateElement', ->
      it 'translates a key and wraps it into an dom element', ->
        result = $.translate('simple')
        expect(result.data('translation-key')).toEqual 'simple'
        expect(result.text()).toEqual 'einfach!'

      it 'translates a jquery object', ->
        selector = $('<span>simple</span>')
        result = $.translate(selector)
        expect(result.data('translation-key')).toEqual 'simple'
        expect(result.text()).toEqual 'einfach!'

      it 'translates a jquery object into another language', ->
        selector = $('<span>simple</span>')
        result = $.translate.translateElement(selector)
        expect(result.data('translation-key')).toEqual 'simple'
        expect(result.text()).toEqual 'einfach!'

        result = $.translate.translateElement(result, 'en')
        expect(result.data('translation-key')).toEqual 'simple'
        expect(result.text()).toEqual 'simple!'

    describe '#translateElementAttributes', ->
      it 'translates a jquery object', ->
        selector = $('<img alt="simple" title="anykey"/>').
          attr('data-translation-attributes', '')

        result = $.translate.translateElementAttributes(selector)

        expect(result.attr('alt')).toEqual 'einfach!'
        expect(result.attr('title')).toEqual 'Irgend eine taste de'

      it 'translates a jquery object into another language', ->
        selector = $('<img alt="simple" title="anykey"/>').
          attr('data-translation-attributes', '')

        result = $.translate.translateElementAttributes(selector)

        expect(result.attr('alt')).toEqual 'einfach!'
        expect(result.attr('title')).toEqual 'Irgend eine taste de'

        result = $.translate.translateElementAttributes(selector, 'en')

        expect(result.attr('alt')).toEqual 'simple!'
        expect(result.attr('title')).toEqual 'Any Key de'

    describe '#update', ->
      it 'updates inplace translations ', ->
        result = $.translate('simple').
          attr('id', 'test')

        wrappedResult = $('<div/>').append result

        expect(result.data('translation-key')).toEqual 'simple'
        expect(result.text()).toEqual 'einfach!'

        $.language 'en'
        $.translate.update wrappedResult

        expect(result.data('translation-key')).toEqual 'simple'
        expect(result.text()).toEqual 'simple!'

      it 'updates translatable attributes ', ->
        result = $('<div data-translation-node="1"/>').
          append('<div data-translation-node-item="de">Deutsch</div>').
          append('<div data-translation-node-item="en">German</div>')

        wrappedResult = $('<div/>').append result
        $('body').append(wrappedResult)
        $.translate.update wrappedResult
        
        expect($('[data-translation-node-item="de"]' ,wrappedResult).
          is(':visible')).toBeTruthy()
        expect($('[data-translation-node-item="en"]' ,wrappedResult).
          is(':visible')).not.toBeTruthy()

        $.language 'en'

        $.translate.update wrappedResult

        expect($('[data-translation-node-item="de"]' ,wrappedResult).
          is(':visible')).not.toBeTruthy()
        expect($('[data-translation-node-item="en"]' ,wrappedResult).
          is(':visible')).toBeTruthy()

      it 'updates translation dom elements ', ->
        result = $.translate('simple').
          attr('id', 'test')

        wrappedResult = $('<div/>').append result

        expect(result.data('translation-key')).toEqual 'simple'
        expect(result.text()).toEqual 'einfach!'

        $.language 'en'
        $.translate.update wrappedResult

        expect(result.data('translation-key')).toEqual 'simple'
        expect(result.text()).toEqual 'simple!'

    describe '#translate', ->
      it 'translates a single key correct', ->
        expect($.translate.translate('simple')).toEqual 'einfach!'

        $.language('en')
        expect($.translate.translate('simple')).toEqual 'simple!'

      it 'falls back to default "de" if key not present', ->
        $.language('en')
        expect($.translate.translate('only_german_key')).toEqual 'nur in deutsch'

      it 'returns the key if key not present', ->
        expect($.translate.translate('unknown_key')).toEqual 'unknown_key'

      it 'can call methods as translation keys', ->
        expect($.translate.translate('language')).toEqual 'de'

        $.language('en')
        expect($.translate.translate('language')).toEqual 'en'

      it 'resolves inherited translation keys', ->
        expect($.translate.translate('anykey')).toEqual 'Irgend eine taste de'

        $.language('en')
        expect($.translate.translate('anykey')).toEqual 'Any Key en'

      it 'can translate temporarily in an other language', ->
        expect($.translate.translate('anykey')).toEqual 'Irgend eine taste de'
        expect($.translate.translate('anykey', 'en')).toEqual 'Any Key de'
