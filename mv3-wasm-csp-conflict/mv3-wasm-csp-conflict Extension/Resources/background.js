let mod = null;

const loadWASM = async () => {
  if (mod) return mod;
  
  /**
   * (module
   *  (type (;0;) (func (param f64 f64) (result f64)))
   *  (func $myadd (type 0) (param f64 f64) (result f64)
   *    get_local 0
   *    get_local 1
   *    f64.add)
   *  (export "my_add" (func $myadd))
   * )
   */
  const wasm_base64 = "AGFzbQEAAAABBwFgAnx8AXwDAgEABwoBBm15X2FkZAAACgkBBwAgACABoAs=";
  const wasm_buffer = Uint8Array.from(atob(wasm_base64), c => c.charCodeAt(0)).buffer;
  const wasm = await WebAssembly.compile(wasm_buffer)
  const instance = new WebAssembly.Instance(wasm);
  
  mod = instance.exports;
  return mod;
};


browser.runtime.onMessage.addListener(async (message, sender) => {
  try {
    if (message.type === "add") {
      return {
        ok: true,
        value: (await loadWASM()).my_add(...message.params)
      };
    }
  } catch (err) {
    return { ok: false, error: err.message };
  }
});
