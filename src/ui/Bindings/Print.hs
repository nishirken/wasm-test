module Bindings.Print where

import Asterius.Types

foreign import javascript "console.log(${1})" js_print_ref :: JSVal -> IO ()
foreign import javascript "console.log(${1})" js_print_int :: Int -> IO ()
foreign import javascript "console.log(${1})" _print_string :: JSString -> IO ()
foreign import javascript "prompt(${1})" _prompt :: JSString -> IO JSString

js_print_string :: String -> IO ()
js_print_string = _print_string . toJSString

js_prompt :: String -> IO String
js_prompt title = (_prompt $ toJSString title) >>= \x -> pure $ fromJSString x
