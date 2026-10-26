// Bootstrap сам управляет navbar, modal, accordion и tabs через data-bs-*.
// Наша доработка: выбранный товар, учебная проверка формы и фильтры каталога.
const modalElement = document.getElementById('orderModal');
const statusMessage = document.getElementById('requestStatus');
const allowedProducts = ['tshirt', 'hoodie', 'jeans', 'consultation'];
modalElement.addEventListener('show.bs.modal', (event) => {
  const product = event.relatedTarget?.dataset.product;
  const selected = allowedProducts.includes(product) ? product : 'consultation';
  document.getElementById('quick-product').value = selected;
  document.getElementById('fullOrderLink').href = 'order.html?product=' + selected;
  statusMessage.hidden = true;
});
modalElement.addEventListener('shown.bs.modal', () => {
  document.getElementById('quick-name').focus();
});
// Безопасно используем только значения из списка товаров, не вставляем URL в HTML.
const requestedProduct = new URLSearchParams(location.search).get('product');
const pageProduct = document.getElementById('order-product');
if (pageProduct && allowedProducts.includes(requestedProduct)) {
  pageProduct.value = requestedProduct;
}
document.querySelectorAll('.request-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const selection = form.querySelector('[name="product"]');
    const productName = selection.options[selection.selectedIndex].textContent.trim();
    statusMessage.textContent = 'Заявка проверена: ' + productName + '. Это учебная демонстрация: данные не отправлены и не сохранены.';
    statusMessage.hidden = false;
    form.reset();
    if (form.id === 'quick-form') {
      modalElement.addEventListener('hidden.bs.modal', () => statusMessage.focus(), { once: true });
      bootstrap.Modal.getInstance(modalElement).hide();
    } else {
      statusMessage.focus();
    }
  });
});
// Фильтры работают по уже имеющимся карточкам; сервер и база не требуются.
const filters = document.getElementById('catalogFilters');
if (filters) {
  const categoryInput = document.getElementById('categoryFilter');
  const priceInput = document.getElementById('priceFilter');
  const items = document.querySelectorAll('.catalog-item');
  const count = document.getElementById('catalogCount');
  const empty = document.getElementById('catalogEmpty');
  const applyFilters = () => {
    let visible = 0;
    const maximum = priceInput.value === '' ? Infinity : Number(priceInput.value);
    items.forEach((item) => {
      const matches = (categoryInput.value === 'all' || item.dataset.category === categoryInput.value)
        && Number(item.dataset.price) <= maximum;
      item.hidden = !matches;
      if (matches) visible++;
    });
    count.textContent = 'Найдено моделей: ' + visible;
    empty.hidden = visible !== 0;
  };
  filters.addEventListener('submit', (event) => { event.preventDefault(); applyFilters(); });
  filters.addEventListener('reset', () => {
    items.forEach((item) => { item.hidden = false; });
    count.textContent = 'Найдено моделей: ' + items.length;
    empty.hidden = true;
  });
}
