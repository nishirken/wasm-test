module Bindings.Dom where

import Asterius.Types

foreign import javascript "document.querySelector(${1})" _get_el :: JSString -> IO JSVal
foreign import javascript "document.createElement(${1})" _make_el :: JSString -> IO JSVal
foreign import javascript "document.createTextNode(${1})" _make_text :: JSString -> IO JSVal
foreign import javascript "${1}.appendChild(${2})" js_append_element :: JSVal -> JSVal -> IO ()
foreign import javascript "${1}.addEventListener(${2}, ${3})" _add_listener :: JSVal -> JSString -> JSVal -> IO ()

js_get_element = _get_el . toJSString
js_make_element = _make_el . toJSString
js_make_text = _make_text . toJSString
js_add_listener = \x y f -> _add_listener x (toJSString y) f
