/**
 * @author Pavel Kondratenko (p.kondratenko)
 * @copyrights Rambler & Co
 * @created_at 05.11.15 13:38
 */

'use strict';

/**
 * Плагин позволяет использовать такую штуку как неймспейс при работе с data атрибутами dom объекта.
 * Функционал полностью аналогичен $.fn.data() за исключением того,
 *  что первым атрибутом в $.fn.datanamespace передается namespace.
 *
 * Например, вам нужно установить атрибут $node data-plugin-property == 'value':
 *  $node.datanamepsace('plugin', 'property', 'value');
 *
 * Этот плагин очень удобен при использовании в других плагинах, например, для передачи настроек из шаблона
 *  в плагин через data атрибуты.
 *
 * Например, вам нужно получить все data атрибуты начинающиеся с plugin:
 *  <div id="#node" data-plugin-color="red" data-plugin-size="big"/>
 *  javascript:
 *    var $node = $('#node');
 *    console.log($node.datanamespace('plugin'));
 *    // -> {color: "red", size: "big"}
 */
(function(factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') { // common.js module
    factory(require('jquery'));
  } else { // global component
    factory(jQuery);
  }
}(function($) {

  $.fn.datanamespace = function(namespace, key, value) {
    if (typeof namespace == 'string') {
      switch (true) {
        // return all namespaced data
        case typeof key === 'undefined':
          return getNamespacedData(this, namespace);
          break;

        // return namespaced property
        case typeof key === 'string' && typeof value === 'undefined':
          return getNamespacedValue(this, namespace, key);
          break;

        // set namespaced property
        case typeof key === 'string' && typeof value !== 'undefined':
          setNamespacedValue(this, namespace, key, value);
          return this;
          break;

        // set namespaced data
        case typeof key === 'object' && typeof value === 'undefined':
          setNamespacedData(this, namespace, key);
          return this;
          break;

        // throw error
        default:
          $.error('[jQuery] -> [datanamespace] Undefined error.');
      }
    } else {
      $.error('[jQuery] -> [datanamespace] Invalid namespace name.');
    }
  };


  /**
   * @param str
   * @returns {string|*|XML|void}
   */
  function camelize(str) {
    return str.replace(/(-|\.)(\w)/g, function(match, symbol) {
      return symbol.toUpperCase();
    });
  }

  /**
   * @param str
   * @returns {string|*|XML|void}
   */
  function uncamelize(str) {
    return str.replace(/[A-Z]/g, function(symbol, index) {
      return (index == 0 ? '' : '-') + symbol.toLowerCase();
    });
  }

  /**
   * @param namespace
   * @param key
   * @returns {string}
   */
  function convertNamespaceToPath(namespace, key) {
    return namespace.replace('.', '-') + (key ? '-' + key : '');
  }

  /**
   * @param $node
   * @param namespace
   * @param attributes
   */
  function setNamespacedData($node, namespace, attributes) {
    var prefix = convertNamespaceToPath(namespace) + '-';

    var data = {};
    $.each(attributes, function(value, key) {
      data[prefix + key] = value;
    });

    $node.data(data);
  }

  /**
   * @param $node
   * @param namespace
   * @returns {{}}
   */
  function getNamespacedData($node, namespace) {
    var prefix = camelize(namespace);

    var options = {};
    $.each($node.data(), function(index, value) {
      if (index.indexOf(prefix) === 0) {
        options[uncamelize(index.replace(prefix, ''))] = value;
      }
    });

    return options;
  }

  /**
   * @param $node
   * @param namespace
   * @param key
   * @param value
   */
  function setNamespacedValue($node, namespace, key, value) {
    $node.data(convertNamespaceToPath(namespace, key), value);
  }

  /**
   * @param $node
   * @param namespace
   * @param key
   * @returns {*}
   */
  function getNamespacedValue($node, namespace, key) {
    return $node.data(convertNamespaceToPath(namespace, key));
  }
}));