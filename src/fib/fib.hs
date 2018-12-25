{-# LANGUAGE BangPatterns #-}

fib :: Int -> Int
fib n = iter 0 1 0
  where
    iter !n1 n2 i
      | i == n = n1
      | otherwise = iter n2 (n1 + n2) (i + 1)

foreign import javascript "console.log(${1})" js_print_int :: Int -> IO ()

main :: IO ()
main = js_print_int $ fib 13344
