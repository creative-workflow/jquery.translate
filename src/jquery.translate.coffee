root = exports ? this

root.translate = do ->
  $              = jQuery
  initialized    = false
  lastUpdateLang = null

  t = (options) ->
    #add translation
    if arguments.length == 2
      t.addTranslation arguments[0], arguments[1]
      return this

    t.config()

    #no args given -> return t.options
    return t.options if arguments.length == 0

    #string to jquery element, could be selector or translation key or html
    if typeof arguments[0] == 'string'
      arguments[0] = $(t.options.wrapper).html(arguments[0])

    #translate an jquery element
    if arguments[0].length? > 0
      return t.translateElementAttributes(t.translateElement(arguments[0]))

    #set configuration
    t.config arguments[0]

    return t

  t.options =
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
        return $.language()
    transitDomNodes: ($items2hide, $items2show) ->
      $items2hide.hide()
      $items2show.fadeIn()

  t.config = (options) ->
    return t.options if !options and initialized

    t.options = $.extend(t.options, options)
    unless initialized
      initialized = true
      $(document).ready ->
        $('body').bind 'language.change', t.update
        t.update()

    return this

  t.addTranslation = (language, map) ->
    return this unless $.language.isValid(language)

    #reset for next update event
    lastUpdateLang = null
    t.options.map[language] = $.extend(t.options.map[language], map)

    return this

  t.translateElement = ($el, language) ->
    language = language || $.language()
    key      = $el.attr('data-translation-key')

    unless key #init element
      key = $el.text()
      $el.attr 'data-translation-key', key

    $el.html t.translate(key, language)
    return $el

  t.translateElementAttributes = ($el, language) ->
    language = language || $.language()
    attrs    = $el.attr('data-translation-attributes')
    return $el if attrs == '0'

    unless attrs #init element
      attrs = []
      keys = []
      i = 0
      while i < t.options.attributes.length
        if $el.attr(t.options.attributes[i])
          attrs.push t.options.attributes[i]
          keys.push $el.attr(t.options.attributes[i])
        i++
      $el.attr 'data-translation-attributes', attrs.join('|')
      $el.attr 'data-translation-keys', keys.join('|')
    else
      attrs = attrs.split('|')
      keys = $el.attr('data-translation-keys').split('|')

    if attrs.length == 0
      $el.attr 'data-translation-attributes', '0'
      return $el

    i = 0
    while i < attrs.length
      $el.attr attrs[i], t.translate(keys[i], language)
      i++

    $el

  t.translate = (key, language) ->
    language = language || $.language()

    return key if !key or !t.options.map[language]

    if t.isTranslatable(key, language)
      key = t.translateSingle(key, language)

    else if  t.isTranslatable(key, $.language.fallback())
      console.log "!jquery.translation::untranslated '#{key}' in #{language}"
      key = t.translateSingle(key, $.language.fallback())

    return t.resolvePlaceholder(key, language)

  t.translateSingle = (key, language) ->
    if $.isFunction(t.options.map[language][key])
      return  t.options.map[language][key].call(language)

    return t.options.map[language][key]

  t.isTranslatable = (key, language) ->
    language = language || $.language()
    return key && t.options.map[language] && t.options.map[language][key]

  t.resolvePlaceholder = (key, language) ->
    while match = t.options.placeholderRegexp.exec(key)
      key = key.replace('#{' + match[1] + '}', t.translate(match[1], language))
    key

  t.update = (searchRoot)->
    return if lastUpdateLang == $.language() && !searchRoot

    # console.log 'jquery.translate::update(' + $.language() + ')'
    $('[data-translation-node]', searchRoot).each ->
      #uset.config because it can be fired via event
      t.options.transitDomNodes $('[data-translation-node-item]', this),
        $("[data-translation-node-item='#{$.language()}']", this)

    $('[data-translation-key],[data-translation-attributes]',
      searchRoot).each ->
      t.translateElement $(this), $.language()
      t.translateElementAttributes $(this), $.language()

    lastUpdateLang = $.language()

  return t

if typeof jQuery != 'undefined'
  jQuery.extend translate: root.translate
