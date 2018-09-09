(module
  (import "console" "log" (func $log (param f32)))
  (import "env" "buffer" (memory 1))
  (func (export "log_add")
    i32.const 0
    f32.load
    i32.const 4 
    f32.load
    f32.add
    call $log)
)
