"use strict";

(() => {
  const __asterius_root =
    (typeof self === "object" && self.self === self && self) ||
    (typeof global === "object" && global.global === global && global) ||
    this;

  __asterius_root.newAsteriusInstance = async req => {
    const __asterius_jsffi_JSRefs = [,],
      __asterius_jsffi_JSRef_revs = new Map();
    function __asterius_jsffi_newJSRef(e) {
      let i = __asterius_jsffi_JSRef_revs.get(e);
      if (i === undefined) {
        i = __asterius_jsffi_JSRefs.push(e) - 1;
        __asterius_jsffi_JSRef_revs.set(e, i);
      }
      return i;
    }
    function __asterius_jsffi_newTempJSRef(e) {
      return __asterius_jsffi_JSRefs.push(e) - 1;
    }
    function __asterius_jsffi_mutTempJSRef(i, f) {
      __asterius_jsffi_JSRefs[i] = f(__asterius_jsffi_JSRefs[i]);
    }
    function __asterius_jsffi_freezeTempJSRef(i) {
      const e = __asterius_jsffi_JSRefs[i];
      delete __asterius_jsffi_JSRefs[i];
      return e;
    }
    function __asterius_bigint_abs(bi) {
      return bi < BigInt(0) ? -bi : bi;
    }
    function __asterius_bigint_decode(i) {
      const x = BigInt(i);
      return x & BigInt(1)
        ? __asterius_jsffi_JSRefs[x >> BigInt(1)]
        : x >> BigInt(1);
    }
    function __asterius_bigint_encode(bi) {
      return Number(
        __asterius_bigint_abs(bi) >> BigInt(52)
          ? (BigInt(__asterius_jsffi_newJSRef(bi)) << BigInt(1)) | BigInt(1)
          : bi << BigInt(1)
      );
    }
    function __asterius_number_decomp(d) {
      const [, sgn, i, f] = /^(-?)([01]+)\.?([01]*)$/.exec(d.toString(2));
      let s = i + f,
        acc = BigInt(0),
        e = f ? -f.length : 0;
      while (s) {
        const c = s.slice(0, 53);
        s = s.slice(c.length);
        acc = (acc << BigInt(c.length)) | BigInt(Number.parseInt(c, 2));
      }
      if (acc !== BigInt(0))
        while ((acc & BigInt(1)) === BigInt(0)) {
          acc = acc >> BigInt(1);
          e += 1;
        }
      return [sgn ? -acc : acc, e];
    }
    const __asterius_stdio_bufs = [, "", ""];
    let __asterius_debug_log_enabled = true;
    function __asterius_debug_log_info(msg) {
      if (__asterius_debug_log_enabled) console.log("[INFO] " + msg);
    }
    let __asterius_wasm_instance = null,
      __asterius_mem_cap = null,
      __asterius_mem_size = null,
      __asterius_last_mblock = null,
      __asterius_last_block = null,
      __asterius_TSOs = [,];
    function __asterius_show_I(x) {
      return x.toString(16).padStart(8, "0");
    }
    function __asterius_show_I64(lo, hi) {
      return (
        "0x" +
        (__asterius_show_I(hi) + __asterius_show_I(lo))
          .replace(/^0+/, "")
          .padStart(8, "0")
      );
    }
    function __asterius_make_symbol_lookup_table(sym_map) {
      let tbl = {};
      for (const [k, v] of Object.entries(sym_map)) tbl[v & 0xffffffff] = k;
      return tbl;
    }
    const __asterius_statics_lookup_table = __asterius_make_symbol_lookup_table(
        req.staticsSymbolMap
      ),
      __asterius_function_lookup_table = __asterius_make_symbol_lookup_table(
        req.functionSymbolMap
      );
    function __asterius_show_func_sym(x) {
      return __asterius_function_lookup_table[x & 0xffffffff];
    }
    function __asterius_show_I64_with_sym(lo, hi) {
      switch (hi) {
        case 2097143:
          return (
            __asterius_show_I64(lo, hi) +
            (__asterius_statics_lookup_table[lo]
              ? "(" + __asterius_statics_lookup_table[lo] + ")"
              : "")
          );
        case 2097133:
          return (
            __asterius_show_I64(lo, hi) +
            (__asterius_function_lookup_table[lo]
              ? "(" + __asterius_function_lookup_table[lo] + ")"
              : "")
          );
        default:
          return __asterius_show_I64(lo, hi);
      }
    }
    const __asterius_SPT = [,];
    function __asterius_newStablePtr(obj) {
      return __asterius_SPT.push(obj) - 1;
    }
    function __asterius_deRefStablePtr(sp) {
      return __asterius_SPT[sp];
    }
    function __asterius_freeStablePtr(sp) {
      delete __asterius_SPT[sp];
    }
    function __asterius_memory_trap(p_lo, p_hi) {
      if (p_hi !== 2097143) {
        throw new WebAssembly.RuntimeError(
          "[ERROR] Memory trap caught invalid memory access at " +
            __asterius_show_I64(p_lo, p_hi)
        );
      }
    }
    const __asterius_jsffi_instance = {
      JSRefs: __asterius_jsffi_JSRefs,
      newJSRef: __asterius_jsffi_newJSRef,
      newTempJSRef: __asterius_jsffi_newTempJSRef,
      mutTempJSRef: __asterius_jsffi_mutTempJSRef,
      freezeTempJSRef: __asterius_jsffi_freezeTempJSRef,
      makeHaskellCallback: s => () => {
        const export_funcs = __asterius_wasm_instance.exports;
        export_funcs.rts_evalIO(__asterius_deRefStablePtr(s));
      },
      makeHaskellCallback1: s => ev => {
        const export_funcs = __asterius_wasm_instance.exports;
        export_funcs.rts_evalIO(
          export_funcs.rts_apply(
            __asterius_deRefStablePtr(s),
            export_funcs.rts_mkInt(__asterius_jsffi_newJSRef(ev))
          )
        );
      },
      Integer: {
        mkInteger_init: non_neg =>
          __asterius_jsffi_newTempJSRef([
            Boolean(non_neg),
            BigInt(0),
            BigInt(0)
          ]),
        mkInteger_prepend: (i, x) =>
          __asterius_jsffi_mutTempJSRef(i, ([non_neg, shift_bits, tot]) => [
            non_neg,
            shift_bits + BigInt(31),
            (BigInt(x) << shift_bits) | tot
          ]),
        mkInteger_finalize: i => {
          let [non_neg, , bi] = __asterius_jsffi_freezeTempJSRef(i);
          bi = non_neg ? bi : -bi;
          return __asterius_bigint_encode(bi);
        },
        smallInteger: x => __asterius_bigint_encode(BigInt(x)),
        wordToInteger: x => __asterius_bigint_encode(BigInt(x)),
        integerToWord: i =>
          Number(BigInt.asUintN(64, __asterius_bigint_decode(i))),
        integerToInt: i =>
          Number(BigInt.asIntN(64, __asterius_bigint_decode(i))),
        plusInteger: (i0, i1) =>
          __asterius_bigint_encode(
            __asterius_bigint_decode(i0) + __asterius_bigint_decode(i1)
          ),
        minusInteger: (i0, i1) =>
          __asterius_bigint_encode(
            __asterius_bigint_decode(i0) - __asterius_bigint_decode(i1)
          ),
        timesInteger: (i0, i1) =>
          __asterius_bigint_encode(
            __asterius_bigint_decode(i0) * __asterius_bigint_decode(i1)
          ),
        negateInteger: i =>
          __asterius_bigint_encode(-__asterius_bigint_decode(i)),
        eqInteger: (i0, i1) =>
          __asterius_bigint_decode(i0) === __asterius_bigint_decode(i1),
        neqInteger: (i0, i1) =>
          __asterius_bigint_decode(i0) !== __asterius_bigint_decode(i1),
        absInteger: i =>
          __asterius_bigint_encode(
            __asterius_bigint_abs(__asterius_bigint_decode(i))
          ),
        signumInteger: i => {
          const bi = __asterius_bigint_decode(i);
          return __asterius_bigint_encode(
            BigInt(bi > BigInt(0) ? 1 : bi === BigInt(0) ? 0 : -1)
          );
        },
        leInteger: (i0, i1) =>
          __asterius_bigint_decode(i0) <= __asterius_bigint_decode(i1),
        gtInteger: (i0, i1) =>
          __asterius_bigint_decode(i0) > __asterius_bigint_decode(i1),
        ltInteger: (i0, i1) =>
          __asterius_bigint_decode(i0) < __asterius_bigint_decode(i1),
        geInteger: (i0, i1) =>
          __asterius_bigint_decode(i0) >= __asterius_bigint_decode(i1),
        divInteger: (i0, i1) => {
          const bi0 = __asterius_bigint_decode(i0),
            bi1 = __asterius_bigint_decode(i1);
          return __asterius_bigint_encode(
            bi0 > BigInt(0) && bi1 < BigInt(0)
              ? (bi0 - BigInt(1)) / bi1 - BigInt(1)
              : bi0 < BigInt(0) && bi1 > BigInt(0)
              ? (bi0 + BigInt(1)) / bi1 - BigInt(1)
              : bi0 / bi1
          );
        },
        modInteger: (i0, i1) => {
          const bi0 = __asterius_bigint_decode(i0),
            bi1 = __asterius_bigint_decode(i1);
          return __asterius_bigint_encode(
            bi0 > BigInt(0) && bi1 < BigInt(0)
              ? ((bi0 - BigInt(1)) % bi1) + bi1 + BigInt(1)
              : bi0 < BigInt(0) && bi1 > BigInt(0)
              ? ((bi0 + BigInt(1)) % bi1) + bi1 - BigInt(1)
              : bi0 % bi1
          );
        },
        quotInteger: (i0, i1) =>
          __asterius_bigint_encode(
            __asterius_bigint_decode(i0) / __asterius_bigint_decode(i1)
          ),
        remInteger: (i0, i1) =>
          __asterius_bigint_encode(
            __asterius_bigint_decode(i0) % __asterius_bigint_decode(i1)
          ),
        encodeFloatInteger: (i0, i1) =>
          Number(__asterius_bigint_decode(i0)) * 2 ** i1,
        decodeFloatInteger_m: d =>
          __asterius_bigint_encode(__asterius_number_decomp(d)[0]),
        decodeFloatInteger_n: d => __asterius_number_decomp(d)[1],
        floatFromInteger: i => Number(__asterius_bigint_decode(i)),
        encodeDoubleInteger: (i0, i1) =>
          Number(__asterius_bigint_decode(i0)) * 2 ** i1,
        decodeDoubleInteger_m: d =>
          __asterius_bigint_encode(__asterius_number_decomp(d)[0]),
        decodeDoubleInteger_n: d => __asterius_number_decomp(d)[1],
        doubleFromInteger: i => Number(__asterius_bigint_decode(i)),
        andInteger: (i0, i1) =>
          __asterius_bigint_encode(
            __asterius_bigint_decode(i0) & __asterius_bigint_decode(i1)
          ),
        orInteger: (i0, i1) =>
          __asterius_bigint_encode(
            __asterius_bigint_decode(i0) | __asterius_bigint_decode(i1)
          ),
        complementInteger: i =>
          __asterius_bigint_encode(~__asterius_bigint_decode(i)),
        shiftLInteger: (i0, i1) =>
          __asterius_bigint_encode(__asterius_bigint_decode(i0) << BigInt(i1)),
        shiftRInteger: (i0, i1) =>
          __asterius_bigint_encode(__asterius_bigint_decode(i0) >> BigInt(i1)),
        testBitInteger: (i0, i1) =>
          Boolean((__asterius_bigint_decode(i0) >> BigInt(i1)) & BigInt(1)),
        hashInteger: i =>
          Number(BigInt.asIntN(64, __asterius_bigint_decode(i))),
        integerLogBase: (i, b) => {
          const bi = __asterius_bigint_decode(i);
          return bi > BigInt(0)
            ? __asterius_bigint_decode(bi).toString(
                Number(__asterius_bigint_decode(b))
              ).length - 1
            : -1;
        },
        integerIsPowerOf2: i =>
          Number(/^10*$/.test(__asterius_bigint_decode(i).toString(2))),
        powInteger: (i0, i1) =>
          __asterius_bigint_encode(
            __asterius_bigint_decode(i0) ** __asterius_bigint_decode(i1)
          ),
        integerToString: (_i, _s) => {
          const bi_str = __asterius_bigint_decode(_i).toString();
          const rp = __asterius_wasm_instance.exports.allocate(
            bi_str.length * 5
          );
          const buf = new BigUint64Array(
            __asterius_wasm_instance.exports.memory.buffer,
            rp & 0xffffffff,
            bi_str.length * 5
          );
          for (let i = 0; i < bi_str.length; ++i) {
            buf[i * 5] = BigInt(
              req.staticsSymbolMap.ghczmprim_GHCziTypes_ZC_con_info
            );
            buf[i * 5 + 1] = BigInt(rp + i * 40 + 25);
            buf[i * 5 + 2] = BigInt(rp + (i + 1) * 40 + 2);
            buf[i * 5 + 3] = BigInt(
              req.staticsSymbolMap.ghczmprim_GHCziTypes_Czh_con_info
            );
            buf[i * 5 + 4] = BigInt(bi_str.codePointAt(i));
          }
          buf[(bi_str.length - 1) * 5 + 2] = BigInt(_s);
          return rp + 2;
        },
        encode: __asterius_bigint_encode,
        decode: __asterius_bigint_decode
      },
      stdio: {
        putChar: (h, c) => {
          __asterius_stdio_bufs[h] += String.fromCodePoint(c);
        },
        stdout: () => __asterius_stdio_bufs[1],
        stderr: () => __asterius_stdio_bufs[2]
      }
    };
    function __asterius_encodeUTF32(s) {
      const buf = new Uint32Array(s.length);
      let i = 0,
        j = 0;
      for (; i < s.length; ) {
        const char_code = s.charCodeAt(i),
          code_point = s.codePointAt(i);
        buf[j++] = code_point;
        i += char_code === code_point ? 1 : 2;
      }
      return buf.subarray(0, j);
    }
    const importObject = Object.assign(
      req.jsffiFactory(__asterius_jsffi_instance),
      {
        Math: {
          sin: x => Math.sin(x),
          cos: x => Math.cos(x),
          tan: x => Math.tan(x),
          sinh: x => Math.sinh(x),
          cosh: x => Math.cosh(x),
          tanh: x => Math.tanh(x),
          asin: x => Math.asin(x),
          acos: x => Math.acos(x),
          atan: x => Math.atan(x),
          log: x => Math.log(x),
          exp: x => Math.exp(x),
          pow: (x, y) => Math.pow(x, y)
        },
        rts: {
          newStablePtr: __asterius_newStablePtr,
          deRefStablePtr: __asterius_deRefStablePtr,
          freeStablePtr: __asterius_freeStablePtr,
          printI64: (lo, hi) => console.log(__asterius_show_I64(lo, hi)),
          printI64_with_sym: (lo, hi) =>
            console.log("[INFO] " + __asterius_show_I64_with_sym(lo, hi)),
          print: x => console.log(x),
          emitEvent: e => console.log("[EVENT] " + req.errorMessages[e]),
          __asterius_allocTSOid: () => __asterius_TSOs.push({}) - 1,
          __asterius_setTSOret: (i, ret) => (__asterius_TSOs[i].ret = ret),
          __asterius_setTSOrstat: (i, rstat) =>
            (__asterius_TSOs[i].rstat = rstat),
          __asterius_getTSOret: i => __asterius_TSOs[i].ret,
          __asterius_getTSOrstat: i => __asterius_TSOs[i].rstat,
          __asterius_allocGroup: n => {
            let ret_mblock = null,
              ret_block = null;
            if (__asterius_last_block + n <= 252) {
              ret_mblock = __asterius_last_mblock;
              ret_block = __asterius_last_block;
              __asterius_last_block += n;
            } else {
              const mblocks = 1 + (n <= 252 ? 0 : Math.ceil((n - 252) / 256));
              const d = mblocks << 4;
              if (__asterius_mem_cap < __asterius_mem_size + d) {
                const pd = Math.max(d, __asterius_mem_cap);
                if (
                  __asterius_wasm_instance.exports.memory.grow(pd) !==
                  __asterius_mem_cap
                )
                  throw new WebAssembly.RuntimeError("allocGroup failed");
                __asterius_mem_cap += pd;
              }
              __asterius_mem_size += d;
              ret_mblock = __asterius_last_mblock + 1;
              ret_block = 0;
              __asterius_last_mblock += mblocks;
              __asterius_last_block = Math.min(n, 252);
            }
            return Number(
              (BigInt(2097143) << BigInt(32)) |
                (BigInt(ret_mblock) << BigInt(20)) |
                (BigInt(256) + (BigInt(ret_block) << BigInt(6)))
            );
          },
          __asterius_strlen: _str => {
            const str = _str & 0xffffffff;
            const buf = new Uint8Array(
              __asterius_wasm_instance.exports.memory.buffer,
              str
            );
            return buf.indexOf(0);
          },
          __asterius_memchr: (_ptr, val, num) => {
            const ptr = _ptr & 0xffffffff;
            const buf = new Uint8Array(
              __asterius_wasm_instance.exports.memory.buffer,
              ptr,
              num
            );
            const off = buf.indexOf(val);
            return off === -1 ? 0 : _ptr + off;
          },
          __asterius_memcpy: (_dst, _src, n) => {
            const dst = _dst & 0xffffffff,
              src = _src & 0xffffffff,
              buf = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              );
            buf.copyWithin(dst, src, src + n);
          },
          __asterius_memmove: (_dst, _src, n) => {
            const dst = _dst & 0xffffffff,
              src = _src & 0xffffffff,
              buf = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              );
            buf.copyWithin(dst, src, src + n);
          },
          __asterius_memset: (_dst, c, n) => {
            const dst = _dst & 0xffffffff,
              buf = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              );
            buf.fill(c, dst, dst + n);
          },
          __asterius_memcmp: (_ptr1, _ptr2, n) => {
            const ptr1 = _ptr1 & 0xffffffff,
              ptr2 = _ptr2 & 0xffffffff,
              buf = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              );
            for (let i = 0; i < n; ++i) {
              const sgn = Math.sign(buf[ptr1 + i] - buf[ptr2 + i]);
              if (sgn) return sgn;
            }
            return 0;
          },
          __asterius_fromJSArrayBuffer: _i => {
            const buf = __asterius_jsffi_JSRefs[_i];
            let p = __asterius_wasm_instance.exports.allocate(
              Math.ceil((buf.byteLength + 31) / 8)
            );
            p = Math.ceil(p / 16) * 16;
            new Uint8Array(
              __asterius_wasm_instance.exports.memory.buffer,
              (p + 16) & 0xffffffff,
              buf.byteLength
            ).set(new Uint8Array(buf));
            const buf_header = new BigUint64Array(
              __asterius_wasm_instance.exports.memory.buffer,
              p & 0xffffffff,
              2
            );
            buf_header[0] = BigInt(req.staticsSymbolMap.stg_ARR_WORDS_info);
            buf_header[1] = BigInt(buf.byteLength);
            return p;
          },
          __asterius_toJSArrayBuffer: (_addr, len) => {
            const addr = _addr & 0xffffffff;
            return __asterius_jsffi_newJSRef(
              __asterius_wasm_instance.exports.memory.buffer.slice(
                addr,
                addr + len
              )
            );
          },
          __asterius_fromJSString: _i => {
            const s = __asterius_jsffi_JSRefs[_i];
            if (s) {
              const s_utf32 = __asterius_encodeUTF32(s);
              const rp = __asterius_wasm_instance.exports.allocate(
                s_utf32.length * 5
              );
              const buf = new BigUint64Array(
                __asterius_wasm_instance.exports.memory.buffer,
                rp & 0xffffffff,
                s_utf32.length * 5
              );
              for (let i = 0; i < s_utf32.length; ++i) {
                buf[i * 5] = BigInt(
                  req.staticsSymbolMap.ghczmprim_GHCziTypes_ZC_con_info
                );
                buf[i * 5 + 1] = BigInt(rp + i * 40 + 25);
                buf[i * 5 + 2] = BigInt(rp + (i + 1) * 40 + 2);
                buf[i * 5 + 3] = BigInt(
                  req.staticsSymbolMap.ghczmprim_GHCziTypes_Czh_con_info
                );
                buf[i * 5 + 4] = BigInt(s_utf32[i]);
              }
              buf[(s_utf32.length - 1) * 5 + 2] = BigInt(
                req.staticsSymbolMap.ghczmprim_GHCziTypes_ZMZN_closure + 1
              );
              return rp + 2;
            } else
              return req.staticsSymbolMap.ghczmprim_GHCziTypes_ZMZN_closure + 1;
          },
          __asterius_fromJSArray: _i => {
            const arr = __asterius_jsffi_JSRefs[_i];
            if (arr.length) {
              const rp = __asterius_wasm_instance.exports.allocate(
                arr.length * 5
              );
              const buf = new BigUint64Array(
                __asterius_wasm_instance.exports.memory.buffer,
                rp & 0xffffffff,
                arr.length * 5
              );
              for (let i = 0; i < arr.length; ++i) {
                buf[i * 5] = BigInt(
                  req.staticsSymbolMap.ghczmprim_GHCziTypes_ZC_con_info
                );
                buf[i * 5 + 1] = BigInt(rp + i * 40 + 25);
                buf[i * 5 + 2] = BigInt(rp + (i + 1) * 40 + 2);
                buf[i * 5 + 3] = BigInt(
                  req.staticsSymbolMap.ghczmprim_GHCziTypes_Izh_con_info
                );
                buf[i * 5 + 4] = BigInt(__asterius_jsffi_newJSRef(arr[i]));
              }
              buf[(arr.length - 1) * 5 + 2] = BigInt(
                req.staticsSymbolMap.ghczmprim_GHCziTypes_ZMZN_closure + 1
              );
              return rp + 2;
            } else
              return req.staticsSymbolMap.ghczmprim_GHCziTypes_ZMZN_closure + 1;
          },
          __asterius_current_memory: p => {
            __asterius_debug_log_info("Current Memory Pages: " + p);
            return p;
          },
          __asterius_debug_log_is_enabled: () => __asterius_debug_log_enabled,
          __asterius_debug_log_set_enabled: f => {
            __asterius_debug_log_enabled = Boolean(f);
          },
          __asterius_grow_memory: (p0, dp) => {
            __asterius_debug_log_info(
              "Previous Memory Pages: " + p0 + ", Allocated Memory Pages: " + dp
            );
            return p0;
          },
          __asterius_load_i64: (p_lo, p_hi, o, v_lo, v_hi) => {
            __asterius_memory_trap(p_lo, p_hi);
            __asterius_debug_log_info(
              "Loading i64 at " +
                __asterius_show_I64_with_sym(p_lo, p_hi) +
                "+" +
                o +
                ", value: " +
                __asterius_show_I64_with_sym(v_lo, v_hi)
            );
          },
          __asterius_store_i64: (p_lo, p_hi, o, v_lo, v_hi) => {
            __asterius_memory_trap(p_lo, p_hi);
            __asterius_debug_log_info(
              "Storing i64 at " +
                __asterius_show_I64_with_sym(p_lo, p_hi) +
                "+" +
                o +
                ", value: " +
                __asterius_show_I64_with_sym(v_lo, v_hi)
            );
          },
          __asterius_load_i8: (p_lo, p_hi, o, v) => {
            __asterius_memory_trap(p_lo, p_hi);
            __asterius_debug_log_info(
              "Loading i8 at " +
                __asterius_show_I64_with_sym(p_lo, p_hi) +
                "+" +
                o +
                ", value: " +
                v
            );
          },
          __asterius_store_i8: (p_lo, p_hi, o, v) => {
            __asterius_memory_trap(p_lo, p_hi);
            __asterius_debug_log_info(
              "Storing i8 at " +
                __asterius_show_I64_with_sym(p_lo, p_hi) +
                "+" +
                o +
                ", value: " +
                v
            );
          },
          __asterius_load_i16: (p_lo, p_hi, o, v) => {
            __asterius_memory_trap(p_lo, p_hi);
            __asterius_debug_log_info(
              "Loading i16 at " +
                __asterius_show_I64_with_sym(p_lo, p_hi) +
                "+" +
                o +
                ", value: " +
                v
            );
          },
          __asterius_store_i16: (p_lo, p_hi, o, v) => {
            __asterius_memory_trap(p_lo, p_hi);
            __asterius_debug_log_info(
              "Storing i16 at " +
                __asterius_show_I64_with_sym(p_lo, p_hi) +
                "+" +
                o +
                ", value: " +
                v
            );
          },
          __asterius_load_i32: (p_lo, p_hi, o, v) => {
            __asterius_memory_trap(p_lo, p_hi);
            __asterius_debug_log_info(
              "Loading i32 at " +
                __asterius_show_I64_with_sym(p_lo, p_hi) +
                "+" +
                o +
                ", value: " +
                v
            );
          },
          __asterius_store_i32: (p_lo, p_hi, o, v) => {
            __asterius_memory_trap(p_lo, p_hi);
            __asterius_debug_log_info(
              "Storing i32 at " +
                __asterius_show_I64_with_sym(p_lo, p_hi) +
                "+" +
                o +
                ", value: " +
                v
            );
          },
          __asterius_load_f32: (p_lo, p_hi, o, v) => {
            __asterius_memory_trap(p_lo, p_hi);
            __asterius_debug_log_info(
              "Loading f32 at " +
                __asterius_show_I64_with_sym(p_lo, p_hi) +
                "+" +
                o +
                ", value: " +
                v
            );
          },
          __asterius_store_f32: (p_lo, p_hi, o, v) => {
            __asterius_memory_trap(p_lo, p_hi);
            __asterius_debug_log_info(
              "Storing f32 at " +
                __asterius_show_I64_with_sym(p_lo, p_hi) +
                "+" +
                o +
                ", value: " +
                v
            );
          },
          __asterius_load_f64: (p_lo, p_hi, o, v) => {
            __asterius_memory_trap(p_lo, p_hi);
            __asterius_debug_log_info(
              "Loading f64 at " +
                __asterius_show_I64_with_sym(p_lo, p_hi) +
                "+" +
                o +
                ", value: " +
                v
            );
          },
          __asterius_store_f64: (p_lo, p_hi, o, v) => {
            __asterius_memory_trap(p_lo, p_hi);
            __asterius_debug_log_info(
              "Storing f64 at " +
                __asterius_show_I64_with_sym(p_lo, p_hi) +
                "+" +
                o +
                ", value: " +
                v
            );
          },
          __asterius_traceCmm: f =>
            __asterius_debug_log_info(
              "Entering " +
                __asterius_show_func_sym(f) +
                ", Sp: 0x" +
                __asterius_show_I(
                  __asterius_wasm_instance.exports.__asterius_Load_Sp()
                ) +
                ", SpLim: 0x" +
                __asterius_show_I(
                  __asterius_wasm_instance.exports.__asterius_Load_SpLim()
                ) +
                ", Hp: 0x" +
                __asterius_show_I(
                  __asterius_wasm_instance.exports.__asterius_Load_Hp()
                ) +
                ", HpLim: 0x" +
                __asterius_show_I(
                  __asterius_wasm_instance.exports.__asterius_Load_HpLim()
                )
            ),
          __asterius_traceCmmBlock: (f, lbl) =>
            __asterius_debug_log_info(
              "Branching to " +
                __asterius_show_func_sym(f) +
                " basic block " +
                lbl +
                ", Sp: 0x" +
                __asterius_show_I(
                  __asterius_wasm_instance.exports.__asterius_Load_Sp()
                ) +
                ", SpLim: 0x" +
                __asterius_show_I(
                  __asterius_wasm_instance.exports.__asterius_Load_SpLim()
                ) +
                ", Hp: 0x" +
                __asterius_show_I(
                  __asterius_wasm_instance.exports.__asterius_Load_Hp()
                ) +
                ", HpLim: 0x" +
                __asterius_show_I(
                  __asterius_wasm_instance.exports.__asterius_Load_HpLim()
                )
            ),
          __asterius_traceCmmSetLocal: (f, i, lo, hi) =>
            __asterius_debug_log_info(
              "In " +
                __asterius_show_func_sym(f) +
                ", Setting local register " +
                i +
                " to " +
                __asterius_show_I64_with_sym(lo, hi)
            )
        },
        bytestring: {
          fps_reverse: (_q, _p, n) => {
            const q = _q & 0xffffffff,
              p = _p & 0xffffffff;
            const buffer = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              ),
              subbuffer = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer,
                q,
                n
              );
            buffer.copyWithin(q, p, p + n);
            subbuffer.reverse();
          },
          fps_intersperse: (_q, _p, n, c) => {
            let q = _q & 0xffffffff,
              p = _p & 0xffffffff;
            const buffer = new Uint8Array(
              __asterius_wasm_instance.exports.memory.buffer
            );
            while (n > 1) {
              buffer[q++] = buffer[p++];
              buffer[q++] = c;
              --n;
            }
            if (n === 1) buffer[q] = buffer[p];
          },
          fps_maximum: (_p, len) => {
            const p = _p & 0xffffffff;
            const buffer = new Uint8Array(
              __asterius_wasm_instance.exports.memory.buffer,
              p,
              len
            );
            return buffer.reduce((x, y) => Math.max(x, y), buffer[0]);
          },
          fps_minimum: (_p, len) => {
            const p = _p & 0xffffffff;
            const buffer = new Uint8Array(
              __asterius_wasm_instance.exports.memory.buffer,
              p,
              len
            );
            return buffer.reduce((x, y) => Math.min(x, y), buffer[0]);
          },
          fps_count: (_p, len, w) => {
            const p = _p & 0xffffffff;
            const buffer = new Uint8Array(
              __asterius_wasm_instance.exports.memory.buffer,
              p,
              len
            );
            return buffer.reduce((tot, c) => (c === w ? tot + 1 : tot), 0);
          },
          fps_memcpy_offsets: (_dst, dst_off, _src, src_off, n) => {
            const dst = _dst & 0xffffffff,
              src = _src & 0xffffffff,
              buffer = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              );
            buffer.copyWithin(dst + dst_off, src + src_off, src + src_off + n);
            return _dst + dst_off;
          },
          _hs_bytestring_int_dec: (x, _buf) => {
            const buf = _buf & 0xffffffff,
              buffer = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              ),
              x_str = x.toString(10);
            for (let i = 0; i < x_str.length; ++i)
              buffer[buf + i] = x_str.codePointAt(i);
            return _buf + x_str.length;
          },
          _hs_bytestring_long_long_int_dec: (x, _buf) => {
            const buf = _buf & 0xffffffff,
              buffer = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              ),
              x_str = x.toString(10);
            for (let i = 0; i < x_str.length; ++i)
              buffer[buf + i] = x_str.codePointAt(i);
            return _buf + x_str.length;
          },
          _hs_bytestring_uint_dec: (x, _buf) => {
            const buf = _buf & 0xffffffff,
              buffer = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              ),
              x_str = x.toString(10);
            for (let i = 0; i < x_str.length; ++i)
              buffer[buf + i] = x_str.codePointAt(i);
            return _buf + x_str.length;
          },
          _hs_bytestring_long_long_uint_dec: (x, _buf) => {
            const buf = _buf & 0xffffffff,
              buffer = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              ),
              x_str = x.toString(10);
            for (let i = 0; i < x_str.length; ++i)
              buffer[buf + i] = x_str.codePointAt(i);
            return _buf + x_str.length;
          },
          _hs_bytestring_int_dec_padded9: (x, _buf) => {
            const buf = _buf & 0xffffffff,
              buffer = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              ),
              x_str = x.toString(10).padStart(9, "0");
            for (let i = 0; i < x_str.length; ++i)
              buffer[buf + i] = x_str.codePointAt(i);
          },
          _hs_bytestring_long_long_int_dec_padded18: (x, _buf) => {
            const buf = _buf & 0xffffffff,
              buffer = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              ),
              x_str = x.toString(10).padStart(18, "0");
            for (let i = 0; i < x_str.length; ++i)
              buffer[buf + i] = x_str.codePointAt(i);
          },
          _hs_bytestring_uint_hex: (x, _buf) => {
            const buf = _buf & 0xffffffff,
              buffer = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              ),
              x_str = x.toString(16);
            for (let i = 0; i < x_str.length; ++i)
              buffer[buf + i] = x_str.codePointAt(i);
            return _buf + x_str.length;
          },
          _hs_bytestring_long_long_uint_hex: (x, _buf) => {
            const buf = _buf & 0xffffffff,
              buffer = new Uint8Array(
                __asterius_wasm_instance.exports.memory.buffer
              ),
              x_str = x.toString(16);
            for (let i = 0; i < x_str.length; ++i)
              buffer[buf + i] = x_str.codePointAt(i);
            return _buf + x_str.length;
          }
        }
      }
    );
    const resultObject = await (WebAssembly.instantiateStreaming
      ? WebAssembly.instantiateStreaming(req.bufferSource, importObject)
      : WebAssembly.instantiate(req.bufferSource, importObject));
    __asterius_wasm_instance = resultObject.instance;
    __asterius_mem_cap =
      __asterius_wasm_instance.exports.memory.buffer.byteLength >> 16;
    __asterius_mem_size = __asterius_mem_cap;
    __asterius_last_mblock = (__asterius_mem_cap >> 4) - 1;
    __asterius_last_block = 252;
    return Object.assign(__asterius_jsffi_instance, {
      wasmModule: resultObject.module,
      wasmInstance: resultObject.instance,
      staticsSymbolMap: req.staticsSymbolMap,
      functionSymbolMap: req.functionSymbolMap,
      __asterius_jsffi_JSRefs: __asterius_jsffi_JSRefs,
      __asterius_SPT: __asterius_SPT
    });
  };
})();
let __asterius_instance = null;
async function main() {
const i = await newAsteriusInstance({errorMessages: ["HeapOverflow","Illegal thread return code","Inside stg_BLACKHOLE_entry, messageBlackHole failed: unimplemented stub function entered","Inside stg_BLOCKING_QUEUE_CLEAN_entry, barf failed: unimplemented stub function entered","Inside stg_BLOCKING_QUEUE_DIRTY_entry, barf failed: unimplemented stub function entered","Inside stg_MSG_BLACKHOLE_entry, barf failed: unimplemented stub function entered","Inside stg_PAP_entry, barf failed: unimplemented stub function entered","Inside stg_STACK_entry, barf failed: unimplemented stub function entered","Inside stg_TSO_entry, barf failed: unimplemented stub function entered","Inside stg_ap_p_ret, barf failed: unimplemented stub function entered","Inside stg_ap_v_ret, barf failed: unimplemented stub function entered","Inside stg_returnToSched, threadPaused failed: unimplemented stub function entered","StackOverflow","ThreadBlocked","ThreadYielding","__asterius_unreachable block is entered","rts_checkSchedStatus failed: illegal scheduler status code","schedule failed: scheduler reentered from Haskell"], bufferSource: fetch("fib.wasm"), jsffiFactory: __asterius_jsffi => ({jsffi: {__asterius_jsffi_mainzuMain_0:((_1)=>(console.log(_1)))}}), staticsSymbolMap: {"MainCapability":9007160600037424,"Main_.Lc3TQ_info":9007160600035344,"Main_.Lc3Tm_info":9007160600035376,"Main_main1_closure":9007160600038576,"Main_main1_info":9007160600035408,"Main_main2_closure":9007160600038592,"Main_main_closure":9007160600038608,"Main_main_info":9007160600035440,"Main_zdwiter_closure":9007160600038624,"Main_zdwiter_info":9007160600035472,"__stg_EAGER_BLACKHOLE_info":9007160600035504,"base_GHCziPtr_Ptr_con_info":9007160600035536,"base_GHCziPtr_i44sZ_str":9007160600035568,"base_GHCziStable_StablePtr_con_info":9007160600035600,"base_GHCziStable_i458b_str":9007160600035632,"ghczmprim_GHCziTuple_Z0T_closure":9007160600038640,"ghczmprim_GHCziTuple_Z0T_con_info":9007160600035664,"ghczmprim_GHCziTuple_img0_str":9007160600035696,"ghczmprim_GHCziTypes_Czh_con_info":9007160600035728,"ghczmprim_GHCziTypes_Dzh_con_info":9007160600035760,"ghczmprim_GHCziTypes_False_closure":9007160600038656,"ghczmprim_GHCziTypes_False_con_info":9007160600035792,"ghczmprim_GHCziTypes_Izh_con_info":9007160600035824,"ghczmprim_GHCziTypes_True_closure":9007160600038672,"ghczmprim_GHCziTypes_True_con_info":9007160600035856,"ghczmprim_GHCziTypes_Wzh_con_info":9007160600035888,"ghczmprim_GHCziTypes_ieAG_str":9007160600035920,"ghczmprim_GHCziTypes_ieAN_str":9007160600035952,"ghczmprim_GHCziTypes_ieAU_str":9007160600035984,"ghczmprim_GHCziTypes_ieAz_str":9007160600036016,"ghczmprim_GHCziTypes_ieB8_str":9007160600036048,"ghczmprim_GHCziTypes_ieC3_str":9007160600036080,"rts_StgMiscClosures_i1YX_str":9007160600036112,"stg_BLACKHOLE_info":9007160600036128,"stg_BLOCKING_QUEUE_CLEAN_info":9007160600036160,"stg_BLOCKING_QUEUE_DIRTY_info":9007160600036192,"stg_IND_info":9007160600036224,"stg_MSG_BLACKHOLE_info":9007160600036256,"stg_PAP_info":9007160600036288,"stg_STACK_info":9007160600036320,"stg_TSO_info":9007160600036352,"stg_ap_2_upd_info":9007160600036384,"stg_ap_p_info":9007160600036416,"stg_ap_stack_entries":9007160600036448,"stg_ap_v_info":9007160600036688,"stg_apply_interp_info":9007160600036720,"stg_arg_bitmaps":9007160600036752,"stg_enter_info":9007160600036992,"stg_forceIO_info":9007160600037024,"stg_gc_fun_info":9007160600037056,"stg_ret_p_info":9007160600037088,"stg_stack_save_entries":9007160600037120,"stg_stop_thread_info":9007160600037360,"stg_upd_frame_info":9007160600037392}, functionSymbolMap: {"Main_.Lc3TQ":9007117650362369,"Main_.Lc3Th":9007117650362370,"Main_.Lc3Tm":9007117650362371,"Main_main1_entry":9007117650362372,"Main_main_entry":9007117650362373,"Main_zdwiter_entry":9007117650362374,"StgReturn":9007117650362375,"__asterius_jsffi_mainzuMain_0_wrapper":9007117650362376,"__stg_EAGER_BLACKHOLE_entry":9007117650362377,"__stg_gc_enter_1":9007117650362378,"__stg_gc_fun":9007117650362379,"allocGroup":9007117650362380,"allocate":9007117650362381,"allocate_wrapper":9007117650362382,"base_GHCziPtr_Ptr_con_entry":9007117650362383,"base_GHCziStable_StablePtr_con_entry":9007117650362384,"createGenThread":9007117650362385,"createIOThread":9007117650362386,"createStrictIOThread":9007117650362387,"createThread":9007117650362388,"deRefStablePtr":9007117650362389,"deRefStablePtr_wrapper":9007117650362390,"getStablePtr":9007117650362391,"getStablePtr_wrapper":9007117650362392,"ghczmprim_GHCziTuple_Z0T_con_entry":9007117650362393,"ghczmprim_GHCziTypes_Czh_con_entry":9007117650362394,"ghczmprim_GHCziTypes_Dzh_con_entry":9007117650362395,"ghczmprim_GHCziTypes_False_con_entry":9007117650362396,"ghczmprim_GHCziTypes_Izh_con_entry":9007117650362397,"ghczmprim_GHCziTypes_True_con_entry":9007117650362398,"ghczmprim_GHCziTypes_Wzh_con_entry":9007117650362399,"hs_free_stable_ptr":9007117650362400,"hs_free_stable_ptr_wrapper":9007117650362401,"hs_init":9007117650362402,"loadI64":9007117650362403,"loadI64_wrapper":9007117650362404,"main":9007117650362405,"rts_apply":9007117650362406,"rts_apply_wrapper":9007117650362407,"rts_checkSchedStatus":9007117650362408,"rts_checkSchedStatus_wrapper":9007117650362409,"rts_eval":9007117650362410,"rts_evalIO":9007117650362411,"rts_evalIO_wrapper":9007117650362412,"rts_evalLazyIO":9007117650362413,"rts_evalLazyIO_wrapper":9007117650362414,"rts_evalStableIO":9007117650362415,"rts_evalStableIO_wrapper":9007117650362416,"rts_eval_wrapper":9007117650362417,"rts_getBool":9007117650362418,"rts_getBool_wrapper":9007117650362419,"rts_getChar":9007117650362420,"rts_getChar_wrapper":9007117650362421,"rts_getDouble":9007117650362422,"rts_getDouble_wrapper":9007117650362423,"rts_getInt":9007117650362424,"rts_getInt_wrapper":9007117650362425,"rts_getPtr":9007117650362426,"rts_getPtr_wrapper":9007117650362427,"rts_getSchedStatus":9007117650362428,"rts_getSchedStatus_wrapper":9007117650362429,"rts_getStablePtr":9007117650362430,"rts_getStablePtr_wrapper":9007117650362431,"rts_getWord":9007117650362432,"rts_getWord_wrapper":9007117650362433,"rts_mkBool":9007117650362434,"rts_mkBool_wrapper":9007117650362435,"rts_mkChar":9007117650362436,"rts_mkChar_wrapper":9007117650362437,"rts_mkDouble":9007117650362438,"rts_mkDouble_wrapper":9007117650362439,"rts_mkInt":9007117650362440,"rts_mkInt_wrapper":9007117650362441,"rts_mkPtr":9007117650362442,"rts_mkPtr_wrapper":9007117650362443,"rts_mkStablePtr":9007117650362444,"rts_mkStablePtr_wrapper":9007117650362445,"rts_mkWord":9007117650362446,"rts_mkWord_wrapper":9007117650362447,"scheduleWaitThread":9007117650362448,"stg_BCO_entry":9007117650362449,"stg_BLACKHOLE_entry":9007117650362450,"stg_BLOCKING_QUEUE_CLEAN_entry":9007117650362451,"stg_BLOCKING_QUEUE_DIRTY_entry":9007117650362452,"stg_IND_entry":9007117650362453,"stg_MSG_BLACKHOLE_entry":9007117650362454,"stg_PAP_apply":9007117650362455,"stg_PAP_entry":9007117650362456,"stg_STACK_entry":9007117650362457,"stg_TSO_entry":9007117650362458,"stg_ap_2_upd_entry":9007117650362459,"stg_ap_p_fast":9007117650362460,"stg_ap_p_ret":9007117650362461,"stg_ap_stk_":9007117650362462,"stg_ap_stk_d":9007117650362463,"stg_ap_stk_f":9007117650362464,"stg_ap_stk_l":9007117650362465,"stg_ap_stk_n":9007117650362466,"stg_ap_stk_nn":9007117650362467,"stg_ap_stk_nnn":9007117650362468,"stg_ap_stk_nnp":9007117650362469,"stg_ap_stk_np":9007117650362470,"stg_ap_stk_npn":9007117650362471,"stg_ap_stk_npp":9007117650362472,"stg_ap_stk_p":9007117650362473,"stg_ap_stk_pn":9007117650362474,"stg_ap_stk_pnn":9007117650362475,"stg_ap_stk_pnp":9007117650362476,"stg_ap_stk_pp":9007117650362477,"stg_ap_stk_ppn":9007117650362478,"stg_ap_stk_ppp":9007117650362479,"stg_ap_stk_pppp":9007117650362480,"stg_ap_stk_ppppp":9007117650362481,"stg_ap_stk_pppppp":9007117650362482,"stg_ap_stk_ppppppp":9007117650362483,"stg_ap_stk_pppppppp":9007117650362484,"stg_ap_stk_v16":9007117650362485,"stg_ap_stk_v32":9007117650362486,"stg_ap_stk_v64":9007117650362487,"stg_ap_v_ret":9007117650362488,"stg_apply_interp_ret":9007117650362489,"stg_block_blackhole":9007117650362490,"stg_enter_ret":9007117650362491,"stg_forceIO_ret":9007117650362492,"stg_gc_fun_ret":9007117650362493,"stg_gc_noregs":9007117650362494,"stg_gc_unpt_r1":9007117650362495,"stg_ret_p_ret":9007117650362496,"stg_returnToSched":9007117650362497,"stg_returnToSchedNotPaused":9007117650362498,"stg_returnToStackTop":9007117650362499,"stg_stk_save_":9007117650362500,"stg_stk_save_d":9007117650362501,"stg_stk_save_f":9007117650362502,"stg_stk_save_l":9007117650362503,"stg_stk_save_n":9007117650362504,"stg_stk_save_nn":9007117650362505,"stg_stk_save_nnn":9007117650362506,"stg_stk_save_nnp":9007117650362507,"stg_stk_save_np":9007117650362508,"stg_stk_save_npn":9007117650362509,"stg_stk_save_npp":9007117650362510,"stg_stk_save_p":9007117650362511,"stg_stk_save_pn":9007117650362512,"stg_stk_save_pnn":9007117650362513,"stg_stk_save_pnp":9007117650362514,"stg_stk_save_pp":9007117650362515,"stg_stk_save_ppn":9007117650362516,"stg_stk_save_ppp":9007117650362517,"stg_stk_save_pppp":9007117650362518,"stg_stk_save_ppppp":9007117650362519,"stg_stk_save_pppppp":9007117650362520,"stg_stk_save_ppppppp":9007117650362521,"stg_stk_save_pppppppp":9007117650362522,"stg_stk_save_v16":9007117650362523,"stg_stk_save_v32":9007117650362524,"stg_stk_save_v64":9007117650362525,"stg_stop_thread_ret":9007117650362526,"stg_upd_frame_ret":9007117650362527,"stg_yield_to_interpreter":9007117650362528}});
__asterius_instance = i
;(i => {
i.wasmInstance.exports.hs_init();
i.wasmInstance.exports.main();
})(i);
}
main();
