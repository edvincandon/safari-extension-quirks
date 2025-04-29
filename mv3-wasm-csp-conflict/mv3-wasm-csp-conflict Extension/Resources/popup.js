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
  
  return (mod = instance.exports);
};

const logs = document.getElementById('logs');
const btn_add_local = document.getElementById('add--local');
const btn_add_sw = document.getElementById('add--sw');


const log = (...messages) => {
    const div = document.createElement('div');
    div.classList.add('log');
    div.innerText = messages.join(' ');
    logs.appendChild(div);
    logs.scrollTo(0, logs.scrollHeight);
}

const csp = browser.runtime.getManifest()?.content_security_policy?.extension_pages ?? 'Default';

log('[CSP]', csp)

loadWASM()
  .then(() => log('[WASM::Popup] 🟢 Popup WASM successfully loaded'))
  .catch((err) => log('[WASM::Popup] 🔴 Popup WASM failed to load', err.message))

btn_add_local.addEventListener('click', async () => {
  try {
   const value = (await loadWASM()).my_add(2, 2);
   log('[WASM::Popup] 🟢 Added `2 + 2` = ', value);
  } catch (err) {
    log('[WASM::Popup] 🔴 ', err.message);
  }
});

btn_add_sw.addEventListener('click', async () => {
  try {
   const res = await browser.runtime.sendMessage({ type: 'add', params: [2,2] });
   if (res.ok) log('[WASM::SW] 🟢 Added `2 + 2` = ', res.value);
   else log('[WASM::SW] 🔴 ', res.error);
  } catch (err) {
    log('[SW] 🔴 ', err.message);
  }
})
