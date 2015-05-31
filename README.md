# jquery.translate [![Build Status](https://travis-ci.org/creative-workflow/jquery.translate.svg?branch=master)](https://travis-ci.org/creative-workflow/jquery.translate) [![Code Climate](https://codeclimate.com/github/creative-workflow/jquery.translate/badges/gpa.svg)](https://codeclimate.com/github/creative-workflow/jquery.translate)

This plugin helps managing translations. Works also instant without reloading the page. You can use raw translations. Translations can be wrapped so that they can update instantly if the language is changed programmatically. Also there is a language node technique where nodes are shown or hidden depending on actual language.

## Usage
### javascript
Use a coffe 2 jscompiler, for ex. [http://js2.coffee](http://js2.coffee).

### coffee script
    #configuration
    $.translate
      placeholderRegexp: /#{(.*)}/g
      wrapper: '<span/>'
      attributes: [
        'title'
        'alt'
      ]
      transitDomNodes: ($items2hide, $items2show) ->
        $items2hide.hide()
        $items2show.fadeIn()

    #add translations
    $.translate 'de',
      'email': 'E-Mail'
      'doppelganger': 'Doppelgänger'
      'gemutlichkeit': 'Gemütlichkeit'

    #translate with wrapping
    $.translate('email')

    #change language -> see jquery.language
    $.language('de')

    #translate element and attributes
    $.translate($('.my-previous-wrapped-element'))

    #translate raw string with nested resolving
    $.translate.translate('email')

    #translate raw string in other language
    $.translate.translate('email', 'en')

### Parameter
#### placeholderRegexp
The RegExp used to find nested translations. Default is `/#{(.*)}/g`.
For ex.

    $.translate.translate('We have the year: #{date.year}')

#### wrapper
The Wrapper that comes around a plain translation key.

    Defaut: ""</span>"

It is wrapped because you can change the language by code and all translated strings will update automatically.
If you want to recycle a wrapper just add the data attribute `data-translation-key="map_key"`.

#### attributes
Attributes that will be translated if the dom element has the data attribute `data-translation-attributes="1"`. Default is
  * title
  * alt
  * value
  * placeholder
  * label

#### map
The translations in form of nested objects like:

    'de'
      'simple': 'einfach!'
      'anykey': 'Irgend eine taste #{language}'
      'language': ->
        $.language()
    'en'
      'simple': 'simple!'
      'anykey': 'Any Key #{language}'

#### transitDomNodes
If you use the language node syntax, this method will be called to hide the old and show the new language node. Default:

    transitDomNodes: ($items2hide, $items2show) ->
      $items2hide.hide()
      $items2show.fadeIn()

The language node syntax is:

    <div data-translation-node="1"/>
      <div data-translation-node-item="de">Deutsch</div>
      <div data-translation-node-item="en">German</div>
    </div>

### Functions
#### $.translate(options)
Calls `$.translate.config`.

#### $.translate(language, map)
Calls `$.translate.addTranslation`.

#### $.translate(key|jqueryObject)
Calls `$.translate.translateElement`. if a playin key is given, the key will be wrapped by `config.wrapper`.

#### $.translate.config(options)
Update the configuration.

#### $.translate.addTranslation(language, map)
Add translations to the translation map.

#### $.translate.translateElement($el[, language])
Translate a jquery element. If the key is not found it will fallback to the default language and triggers an event `translate.untranslated` with the parameter:

    {
      key: untranslated_key
      language: language
    }

#### $.translate.translateElementAttributes($el[, language])
Translate the attributes of a jquery element

#### $.translate.translate(key[, language])
Plain translation of a key and recursive resolving of nested translations.

#### $.translate.isTranslatable(key[, language])
Check if for a key is a translation available.

#### $.translate.update([searchRoot])
Update the hole document or a specific searchRoot. Updates simple translations, attributes and language nodes.

This method will be called automatically if the event `language.change` is fired from jquery.language `$.language('de')`.

### Dependencies
  * [jquery](https://jquery.com)
  * [jquery.language](https://github.com/creative-workflow/jquery.language)

### Resources
  * https://github.com/creative-workflow/jquery.translate
  * https://travis-ci.org/creative-workflow/jquery.translate
  * https://codeclimate.com/github/creative-workflow/jquery.translate
  * https://www.npmjs.com/package/jquery.translate
  * http://bower.io/search/?q=jquery.translate

### Authors

[Tom Hanoldt](https://github.com/monotom)

# Contributing

Check out the [Contributing Guidelines](CONTRIBUTING.md)
