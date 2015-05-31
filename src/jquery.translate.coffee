root = exports ? this

class root.JQueryTranslate
  @options =
    placeholderRegexp: /#{(.*)}/g
    wrapper: '<span/>'
    attributes: [
      'title'
      'alt'
      'value'
      'placeholder'
      'label'
    ]
    map: 'en':
      'date.year': Math.max(2015, (new Date).getFullYear())
      'language': ->
        return jQuery.language()
    transitDomNodes: ($items2hide, $items2show) ->
      $items2hide.hide()
      $items2show.fadeIn()

  constructor: (@options) ->
    @_lastUpdateLang = null
    @_initialized    = false
    @config jQuery.extend(@options, @constructor.options)

  config: (options) =>
    return @options if !options and @_initialized

    @options = jQuery.extend(@options, options)
    unless @_initialized
      @_initialized = true
      jQuery(document).ready =>
        jQuery('body').bind 'language.change', @update
        @update()

    return this

  addTranslation: (language, map) =>
    return this unless jQuery.language.isValid(language)

    #reset for next update event
    @_lastUpdateLang = null
    @options.map[language] = jQuery.extend(@options.map[language], map)

    return this

  translateElement: ($el, language) =>
    language = language || jQuery.language()
    key      = $el.attr('data-translation-key')

    unless key #init element
      key = $el.text()
      $el.attr 'data-translation-key', key

    $el.html @translate(key, language)
    return $el

  translateElementAttributes: ($el, language) =>
    language = language || jQuery.language()
    attrs    = $el.attr('data-translation-attributes')
    return $el if attrs == '0'

    unless attrs #init element
      attrs = []
      keys = []
      for attribute in @options.attributes
        if $el.attr attribute
          attrs.push attribute
          keys.push $el.attr(attribute)

      $el.attr 'data-translation-attributes', attrs.join('|')
      $el.attr 'data-translation-keys', keys.join('|')
    else
      attrs = attrs.split('|')
      keys = $el.attr('data-translation-keys').split('|')

    if attrs.length == 0
      $el.attr 'data-translation-attributes', '0'
      return $el

    for attribute, index in attrs
      $el.attr attrs[index], @translate(keys[index], language)

    $el

  translate: (key, language) =>
    language = language || jQuery.language()

    return key if !key || !@options.map[language]

    if @isTranslatable(key, language)
      key = @translateSingle(key, language)

    else if @isTranslatable(key, jQuery.language.fallback())
      jQuery('body').trigger 'translate.untranslated', [{
        key: key
        language: language
      }]
      key = @translateSingle(key, jQuery.language.fallback())

    return @resolvePlaceholder(key, language)

  translateSingle: (key, language) =>
    if jQuery.isFunction(@options.map[language][key])
      return  @options.map[language][key].call(language)

    return @options.map[language][key]

  isTranslatable: (key, language) =>
    language = language || jQuery.language()
    return key && @options.map[language] && @options.map[language][key]

  resolvePlaceholder: (key, language) =>
    while match = @options.placeholderRegexp.exec(key)
      key = key.replace('#{' + match[1] + '}', @translate(match[1], language))
    key

  update: (searchRoot)=>
    return if @_lastUpdateLang == jQuery.language() && !searchRoot

    jQuery('[data-translation-node]', searchRoot).each (index, element) =>
      #useconfig because it can be fired via event
      @options.transitDomNodes jQuery('[data-translation-node-item]', element),
        jQuery("[data-translation-node-item='#{jQuery.language()}']", element)

    jQuery('[data-translation-key],[data-translation-attributes]',
      searchRoot).each (index, element) =>
      @translateElement jQuery(element), jQuery.language()
      @translateElementAttributes jQuery(element), jQuery.language()

    @_lastUpdateLang = jQuery.language()

if typeof jQuery != 'undefined'
  instance = new JQueryTranslate()
  $        = jQuery

  $.extend translate: ->
    #add translation
    if arguments.length == 2
      instance.addTranslation arguments[0], arguments[1]
      return this

    instance.config()

    #no args given -> return options
    return instance.config() unless arguments.length

    #string to jquery element, could be selector or translation key or html
    if typeof arguments[0] == 'string'
      arguments[0] = $(instance.config().wrapper).html(arguments[0])

    #translate an jquery element
    if arguments[0].length? > 0
      return instance.translateElementAttributes(
        instance.translateElement(arguments[0]))

    #set configuration
    instance.config arguments[0]
    this

  #for calling instance methods directly
  $.extend $.translate, instance

  #for test stubbing we need the real instance, the real this
  $.translate.instance = instance
