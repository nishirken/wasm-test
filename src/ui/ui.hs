import Asterius.Types
import Foreign.StablePtr
import Bindings.Dom
import Bindings.Print

foreign import javascript "__asterius_jsffi.makeHaskellCallback(${1})" js_make_hs_callback :: StablePtr (IO ()) -> IO JSVal

printFromPrompt :: IO ()
printFromPrompt = js_prompt "Enter" >>= js_print_string

makeButton :: IO JSVal
makeButton = do
  button <- js_make_element "button"
  text <- js_make_text "Click me"
  cb <- newStablePtr printFromPrompt >>= js_make_hs_callback
  js_add_listener button "click" cb
  js_append_element button text
  pure button

main :: IO ()
main = do
  body <- js_get_element "body"
  button <- makeButton
  js_append_element body button
