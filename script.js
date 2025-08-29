// ===== Global utilities =====
const $ = (sel, scope=document) => scope.querySelector(sel);
const $$ = (sel, scope=document) => Array.from(scope.querySelectorAll(sel));

// ===== Footer year =====
(() => { const y = new Date().getFullYear(); const year = document.getElementById('year'); if (year) year.textContent = y; })();

// ===== Calculator Logic =====
(function initCalculator(){
  const display = document.getElementById('display');
  if(!display) return;

  let current = '0', previous = null, operation = null, justComputed = false;

  const updateDisplay = (val) => { display.textContent = val; };
  const clearAll = () => { current='0'; previous=null; operation=null; updateDisplay(current); };
  const appendNumber = (n) => {
    if (justComputed){ current='0'; justComputed=false; }
    if (n === '0' && current === '0') return;
    if (current === '0') current = n;
    else current += n;
    updateDisplay(current);
  };
  const addDot = () => {
    if (!current.includes('.')) { current += '.'; updateDisplay(current); }
  };
  const setSign = () => { if (current !== '0') { current = (parseFloat(current)*-1).toString(); updateDisplay(current);} };
  const percent = () => { current = (parseFloat(current)/100).toString(); updateDisplay(current); };
  const chooseOperation = (op) => {
    if (previous !== null && operation) compute();
    previous = current;
    current = '0';
    operation = op;
  };
  const compute = () => {
    const a = parseFloat(previous), b = parseFloat(current);
    if (isNaN(a) || isNaN(b) || !operation) return;
    let res = 0;
    switch(operation){
      case '+': res = a + b; break;
      case '−': res = a - b; break;
      case '×': res = a * b; break;
      case '÷': res = b === 0 ? 'Error' : a / b; break;
    }
    current = String(res);
    previous = null; operation = null; justComputed = true;
    updateDisplay(current);
  };

  document.addEventListener('click', (e)=>{
    const t = e.target;
    if(!t.classList.contains('btn-calc')) return;
    const num = t.dataset.num;
    const op = t.dataset.op;
    const action = t.dataset.action;

    if(num){ appendNumber(num); return; }
    if(op){ chooseOperation(op); return; }
    if(action==='dot'){ addDot(); return; }
    if(action==='clear'){ clearAll(); return; }
    if(action==='sign'){ setSign(); return; }
    if(action==='percent'){ percent(); return; }
    if(action==='equals'){ compute(); return; }
  });
})();

// ===== Live view page logic =====
(function initLiveView(){
  const htmlTA = document.getElementById('htmlCode');
  const cssTA = document.getElementById('cssCode');
  const jsTA = document.getElementById('jsCode');
  const runBtn = document.getElementById('runBtn');
  const frame = document.getElementById('previewFrame');
  if(!htmlTA || !cssTA || !jsTA || !runBtn || !frame) return;

  const run = () => {
    const doc = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<style>${cssTA.value}</style></head>
<body>${htmlTA.value}
<script>${jsTA.value}<\/script>
</body></html>`;
    const blob = new Blob([doc], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    frame.src = url;
  };
  runBtn.addEventListener('click', run);

  // initial run
  run();
})();
