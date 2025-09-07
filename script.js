const amountEl = document.getElementById('amount');
const firstHolder = document.getElementById('firstHolder');
const secondHolder = document.getElementById('secondHolder');
const btn = document.getElementById('btn');
const icon = document.getElementById('icon');
const resultEl = document.getElementById('result');

function readAmount() {
  return parseFloat(String(amountEl.value).replace(',', '.'));
}

function formatMoney(value, currency) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
}

icon.addEventListener('click', () => {
  const tmp = firstHolder.value;
  firstHolder.value = secondHolder.value;
  secondHolder.value = tmp;
  if (readAmount() > 0) converter();
});

async function converter() {
  const amount = readAmount();
  const from = firstHolder.value;
  const to = secondHolder.value;

  if (!amount || amount <= 0) {
    resultEl.style.color = 'tomato';
    resultEl.style.fontSize = '20px'
    resultEl.textContent = 'Digite um valor válido.';
    return;
  }

  if (from === to) {
    resultEl.style.color = '#177fff';
     resultEl.style.fontSize = '20px'
    resultEl.textContent = `${formatMoney(amount, from)} = ${formatMoney(amount, to)} (taxa: 1)`;
    return;
  }

  const url = `https://economia.awesomeapi.com.br/json/last/${from}-${to}`;

  btn.disabled = true;
  const originalLabel = btn.textContent;
  btn.textContent = 'Convertendo...';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const key = `${from}${to}`;
    const rate = parseFloat(data[key]?.bid);
    if (!rate) throw new Error('Par de moedas não suportado');

    const converted = amount * rate;

    resultEl.style.color = '#177fff';
    resultEl.style.fontSize = '20px'
    resultEl.textContent =
      `${formatMoney(amount, from)} = ${formatMoney(converted, to)} (taxa: ${rate.toFixed(4)})`;

  } catch (err) {
    console.error(err);
    resultEl.style.color = 'tomato';
    resultEl.textContent = 'Não consegui buscar a cotação agora. Tente novamente.';
  } finally {
    btn.disabled = false;
    btn.textContent = originalLabel;
  }
}

btn.addEventListener('click', converter);

