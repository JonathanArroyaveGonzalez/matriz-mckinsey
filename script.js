// Variables globales
let products = [
  { 
    name: 'Carvajal Tecnología y Servicios', 
    x: 4.2, 
    y: 4.1, 
    sales: 172645, 
    share: 35, 
    color: '#10b981', // Color personalizable
    projections: { 
      'Año 1': { x: 4.4, y: 4.2 }, 
      'Año 2': { x: 4.5, y: 4.3 }, 
      'Año 3': { x: 4.6, y: 4.4 } 
    } 
  },
  { 
    name: 'Facturación Electrónica', 
    x: 4.5, 
    y: 4.3, 
    sales: 85000, 
    share: 20, 
    color: '#10b981',
    projections: { 
      'Año 1': { x: 4.6, y: 4.4 }, 
      'Año 2': { x: 4.7, y: 4.5 }, 
      'Año 3': { x: 4.8, y: 4.6 } 
    } 
  },
  { 
    name: 'Plataforma GAIA', 
    x: 4.0, 
    y: 3.8, 
    sales: 45000, 
    share: 15, 
    color: '#f59e0b',
    projections: { 
      'Año 1': { x: 4.2, y: 4.0 }, 
      'Año 2': { x: 4.3, y: 4.1 }, 
      'Año 3': { x: 4.4, y: 4.2 } 
    } 
  },
  { 
    name: 'Fintech Álaga', 
    x: 3.2, 
    y: 4.0, 
    sales: 25000, 
    share: 8, 
    color: '#3b82f6',
    projections: { 
      'Año 1': { x: 3.5, y: 4.1 }, 
      'Año 2': { x: 3.7, y: 4.2 }, 
      'Año 3': { x: 4.0, y: 4.3 } 
    } 
  },
  { 
    name: 'App PliP', 
    x: 2.8, 
    y: 3.5, 
    sales: 15000, 
    share: 5, 
    color: '#ef4444',
    projections: { 
      'Año 1': { x: 3.0, y: 3.7 }, 
      'Año 2': { x: 3.2, y: 3.9 }, 
      'Año 3': { x: 3.4, y: 4.1 } 
    } 
  },
  { 
    name: 'Servicios Cloud Oracle', 
    x: 3.8, 
    y: 4.2, 
    sales: 35000, 
    share: 12, 
    color: '#8b5cf6',
    projections: { 
      'Año 1': { x: 4.0, y: 4.3 }, 
      'Año 2': { x: 4.1, y: 4.4 }, 
      'Año 3': { x: 4.3, y: 4.5 } 
    } 
  },
  { 
    name: 'Analítica de Datos', 
    x: 3.5, 
    y: 4.4, 
    sales: 18000, 
    share: 5, 
    color: '#06b6d4',
    projections: { 
      'Año 1': { x: 3.8, y: 4.5 }, 
      'Año 2': { x: 4.0, y: 4.6 }, 
      'Año 3': { x: 4.2, y: 4.7 } 
    } 
  }
];

let currentFilter = 'Actual';
let selectedProductIndex = -1;
const svg = document.getElementById('matrix-svg');
const tooltip = document.getElementById('tooltip');
const MARGIN = 80;
const WIDTH = 1000 - 2 * MARGIN;
const HEIGHT = 600 - 2 * MARGIN;

// Funciones de inicialización
function initializeMatrix() {
  loadProductsTable();
  updateDateLabels();
  updateWeights('internal');
  updateWeights('external');
  drawMatrix();
  setupColorPicker();
}

// Configurar selector de color
function setupColorPicker() {
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      if (selectedProductIndex >= 0) {
        const color = option.getAttribute('data-color');
        applyColorToProduct(color);
        
        // Actualizar UI
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
      } else {
        alert('Por favor, selecciona un producto de la matriz primero.');
      }
    });
  });
}

// Aplicar color personalizado
function applyCustomColor() {
  if (selectedProductIndex >= 0) {
    const customColor = document.getElementById('custom-color').value;
    applyColorToProduct(customColor);
    
    // Limpiar selección de colores predefinidos
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
  } else {
    alert('Por favor, selecciona un producto de la matriz primero.');
  }
}

// Aplicar color a producto seleccionado
function applyColorToProduct(color) {
  if (selectedProductIndex >= 0 && selectedProductIndex < products.length) {
    products[selectedProductIndex].color = color;
    drawProducts(); // Redibujar para mostrar el nuevo color
  }
}

// Funciones de edición de títulos
function editTitle(titleId) {
  const titleElement = document.getElementById(titleId);
  const editElement = document.getElementById(titleId + '-edit');
  
  editElement.value = titleElement.textContent;
  titleElement.style.display = 'none';
  editElement.style.display = 'inline-block';
  editElement.focus();
  editElement.select();
}

function saveTitle(titleId) {
  const titleElement = document.getElementById(titleId);
  const editElement = document.getElementById(titleId + '-edit');
  
  titleElement.textContent = editElement.value;
  titleElement.style.display = 'inline-block';
  editElement.style.display = 'none';
}

function saveTitleOnEnter(event, titleId) {
  if (event.key === 'Enter') {
    saveTitle(titleId);
  }
}

// Funciones de gestión de tablas
function addInternalFactor() {
  const table = document.querySelector('#internal-factors tbody');
  const row = table.insertRow();
  row.innerHTML = `
    <td><input type="text" value="Nuevo Factor" onchange="updateMatrix()"></td>
    <td><input type="number" class="factor-weight" value="10" min="1" max="100" onchange="updateWeights('internal')"></td>
    <td><button class="btn btn-danger" onclick="removeRow(this)">🗑️</button></td>
  `;
  updateWeights('internal');
}

function addExternalFactor() {
  const table = document.querySelector('#external-factors tbody');
  const row = table.insertRow();
  row.innerHTML = `
    <td><input type="text" value="Nuevo Factor" onchange="updateMatrix()"></td>
    <td><input type="number" class="factor-weight" value="10" min="1" max="100" onchange="updateWeights('external')"></td>
    <td><button class="btn btn-danger" onclick="removeRow(this)">🗑️</button></td>
  `;
  updateWeights('external');
}

function removeRow(button) {
  const row = button.parentNode.parentNode;
  const table = row.parentNode.parentNode;
  row.remove();
  
  const tableId = table.id;
  if (tableId === 'internal-factors') {
    updateWeights('internal');
  } else if (tableId === 'external-factors') {
    updateWeights('external');
  }
  updateMatrix();
}

function updateWeights(type) {
  const table = document.getElementById(type + '-factors');
  const weights = table.querySelectorAll('.factor-weight');
  const totalElement = document.getElementById(type + '-total');
  
  let total = 0;
  weights.forEach(weight => {
    total += parseInt(weight.value) || 0;
  });
  
  totalElement.textContent = total + '%';
  totalElement.style.color = total === 100 ? '#28a745' : '#dc3545';
  
  updateMatrix();
}

function addProduct() {
  const newProduct = {
    name: `Producto ${products.length + 1}`,
    x: 3.0,
    y: 3.0,
    sales: 10000,
    share: 5,
    color: '#2c5aa0',
    projections: {}
  };
  
  // Agregar proyecciones para todos los períodos existentes
  const dateRows = document.querySelectorAll('#dates-table tr');
  dateRows.forEach((row, index) => {
    if (index === 0) return; // Skip actual period
    const labelInput = row.querySelector('input[type="text"]');
    if (labelInput) {
      newProduct.projections[labelInput.value] = { x: 3.0, y: 3.0 };
    }
  });
  
  products.push(newProduct);
  loadProductsTable();
  drawProducts();
}

function loadProductsTable() {
  const container = document.getElementById('products-container');
  container.innerHTML = '';
  
  products.forEach((product, index) => {
    const productDiv = document.createElement('div');
    productDiv.style.border = '1px solid #ddd';
    productDiv.style.borderRadius = '4px';
    productDiv.style.padding = '8px';
    productDiv.style.marginBottom = '8px';
    productDiv.style.backgroundColor = '#f9f9f9';
    
    productDiv.innerHTML = `
      <table style="margin: 0;">
        <tr>
          <td style="border: none; padding: 2px; background: none;"><strong>Nombre:</strong></td>
          <td style="border: none; padding: 2px; background: none;">
            <input type="text" value="${product.name}" onchange="updateProductName(${index}, this.value)">
          </td>
        </tr>
        <tr>
          <td style="border: none; padding: 2px; background: none;">Fortaleza (X):</td>
          <td style="border: none; padding: 2px; background: none;">
            <input type="number" min="1" max="5" step="0.1" value="${product.x}" onchange="updateProductPosition(${index}, 'x', this.value)">
          </td>
        </tr>
        <tr>
          <td style="border: none; padding: 2px; background: none;">Atractivo (Y):</td>
          <td style="border: none; padding: 2px; background: none;">
            <input type="number" min="1" max="5" step="0.1" value="${product.y}" onchange="updateProductPosition(${index}, 'y', this.value)">
          </td>
        </tr>
        <tr>
          <td style="border: none; padding: 2px; background: none;">Ventas (M):</td>
          <td style="border: none; padding: 2px; background: none;">
            <input type="number" min="1" value="${product.sales}" onchange="updateProductSales(${index}, this.value)">
          </td>
        </tr>
        <tr>
          <td style="border: none; padding: 2px; background: none;">Participación (%):</td>
          <td style="border: none; padding: 2px; background: none;">
            <input type="number" min="0" max="100" value="${product.share}" onchange="updateProductShare(${index}, this.value)">
          </td>
        </tr>
        <tr>
          <td colspan="2" style="border: none; padding: 2px; background: none; text-align: center;">
            <button class="btn btn-danger" onclick="removeProduct(${index})">🗑️ Eliminar</button>
          </td>
        </tr>
      </table>
    `;
    
    container.appendChild(productDiv);
  });
}

function updateProductName(index, name) {
  products[index].name = name;
  drawProducts();
}

function updateProductPosition(index, axis, value) {
  products[index][axis] = parseFloat(value);
  drawProducts();
}

function updateProductSales(index, value) {
  products[index].sales = parseInt(value);
  drawProducts();
}

function updateProductShare(index, value) {
  products[index].share = parseInt(value);
  drawProducts();
}

function removeProduct(index) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    products.splice(index, 1);
    if (selectedProductIndex === index) {
      selectedProductIndex = -1;
      document.getElementById('selected-product-name').textContent = 'Ninguno';
    } else if (selectedProductIndex > index) {
      selectedProductIndex--;
    }
    loadProductsTable();
    drawProducts();
  }
}

// Funciones de fechas
function addDatePeriod() {
  const table = document.querySelector('#dates-table');
  const row = table.insertRow();
  const currentYear = new Date().getFullYear();
  row.innerHTML = `
    <td><input type="text" value="Nuevo Período" onchange="updateDateLabels()"></td>
    <td><input type="date" value="${currentYear}-01-01" onchange="updateDateLabels()"></td>
    <td><button class="btn btn-danger" onclick="removeRow(this)">🗑️</button></td>
  `;
  updateDateLabels();
}

function updateDateLabels() {
  const dateRows = document.querySelectorAll('#dates-table tr');
  const yearFilter = document.getElementById('year-filter');
  yearFilter.innerHTML = '';
  
  dateRows.forEach((row, index) => {
    const labelInput = row.querySelector('input[type="text"]');
    if (labelInput) {
      const period = labelInput.value;
      const button = document.createElement('button');
      button.className = 'year-btn';
      button.textContent = period;
      button.onclick = () => filterByYear(period);
      yearFilter.appendChild(button);
    }
  });
  
  // Agregar botón "Ver Todos"
  const allButton = document.createElement('button');
  allButton.className = 'year-btn';
  allButton.textContent = 'Todos';
  allButton.onclick = showAllYears;
  yearFilter.appendChild(allButton);
}

function updateMatrix() {
  drawProducts();
}

function drawMatrix() {
  drawGrid();
  drawProducts();
}

function drawGrid() {
  svg.innerHTML = '';

  // Definir regiones de la matriz
  const regions = [
    { x: MARGIN, y: MARGIN, w: WIDTH / 3, h: HEIGHT / 3, color: '#10b98130', label: 'Invertir/Proteger' },
    { x: MARGIN + WIDTH / 3, y: MARGIN, w: WIDTH / 3, h: HEIGHT / 3, color: '#10b98130', label: 'Invertir/Crecer' },
    { x: MARGIN + (2 * WIDTH) / 3, y: MARGIN, w: WIDTH / 3, h: HEIGHT / 3, color: '#f59e0b30', label: 'Selectivo/Crecer' },
    { x: MARGIN, y: MARGIN + HEIGHT / 3, w: WIDTH / 3, h: HEIGHT / 3, color: '#10b98130', label: 'Invertir/Crecer' },
    { x: MARGIN + WIDTH / 3, y: MARGIN + HEIGHT / 3, w: WIDTH / 3, h: HEIGHT / 3, color: '#f59e0b30', label: 'Selectividad/Ganancias' },
    { x: MARGIN + (2 * WIDTH) / 3, y: MARGIN + HEIGHT / 3, w: WIDTH / 3, h: HEIGHT / 3, color: '#f59e0b30', label: 'Selectividad/Prueba' },
    { x: MARGIN, y: MARGIN + (2 * HEIGHT) / 3, w: WIDTH / 3, h: HEIGHT / 3, color: '#f59e0b30', label: 'Selectividad/Prueba' },
    { x: MARGIN + WIDTH / 3, y: MARGIN + (2 * HEIGHT) / 3, w: WIDTH / 3, h: HEIGHT / 3, color: '#ef444430', label: 'Cosechar/Desinvertir' },
    { x: MARGIN + (2 * WIDTH) / 3, y: MARGIN + (2 * HEIGHT) / 3, w: WIDTH / 3, h: HEIGHT / 3, color: '#ef444430', label: 'Desinvertir/Retirar' }
  ];

  // Dibujar regiones
  regions.forEach((region) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', region.x);
    rect.setAttribute('y', region.y);
    rect.setAttribute('width', region.w);
    rect.setAttribute('height', region.h);
    rect.setAttribute('fill', region.color);
    rect.setAttribute('stroke', '#ddd');
    rect.setAttribute('stroke-width', '1');
    svg.appendChild(rect);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', region.x + region.w / 2);
    text.setAttribute('y', region.y + region.h / 2);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', '#666');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', 'bold');
    text.textContent = region.label;
    svg.appendChild(text);
  });

  // Líneas de cuadrícula
  for (let i = 1; i < 3; i++) {
    const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vLine.setAttribute('x1', MARGIN + (i * WIDTH) / 3);
    vLine.setAttribute('y1', MARGIN);
    vLine.setAttribute('x2', MARGIN + (i * WIDTH) / 3);
    vLine.setAttribute('y2', MARGIN + HEIGHT);
    vLine.setAttribute('stroke', '#666');
    vLine.setAttribute('stroke-width', '2');
    svg.appendChild(vLine);

    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hLine.setAttribute('x1', MARGIN);
    hLine.setAttribute('y1', MARGIN + (i * HEIGHT) / 3);
    hLine.setAttribute('x2', MARGIN + WIDTH);
    hLine.setAttribute('y2', MARGIN + (i * HEIGHT) / 3);
    hLine.setAttribute('stroke', '#666');
    hLine.setAttribute('stroke-width', '2');
    svg.appendChild(hLine);
  }

  // Bordes del marco
  const border = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  border.setAttribute('x', MARGIN);
  border.setAttribute('y', MARGIN);
  border.setAttribute('width', WIDTH);
  border.setAttribute('height', HEIGHT);
  border.setAttribute('fill', 'none');
  border.setAttribute('stroke', '#333');
  border.setAttribute('stroke-width', '3');
  svg.appendChild(border);

  // Etiquetas de los ejes
  for (let i = 1; i <= 5; i++) {
    const xPos = MARGIN + ((5 - i) * WIDTH) / 4;
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', xPos);
    xLabel.setAttribute('y', MARGIN + HEIGHT + 30);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('fill', '#333');
    xLabel.setAttribute('font-weight', 'bold');
    xLabel.setAttribute('font-size', '14');
    xLabel.textContent = i;
    svg.appendChild(xLabel);

    const yPos = MARGIN + ((5 - i) * HEIGHT) / 4;
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', MARGIN - 25);
    yLabel.setAttribute('y', yPos + 5);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('fill', '#333');
    yLabel.setAttribute('font-weight', 'bold');
    yLabel.setAttribute('font-size', '14');
    yLabel.textContent = i;
    svg.appendChild(yLabel);
  }

  // Títulos de los ejes
  const xTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xTitle.setAttribute('x', MARGIN + WIDTH / 2);
  xTitle.setAttribute('y', MARGIN + HEIGHT + 55);
  xTitle.setAttribute('text-anchor', 'middle');
  xTitle.setAttribute('fill', '#2c5aa0');
  xTitle.setAttribute('font-weight', 'bold');
  xTitle.setAttribute('font-size', '16');
  xTitle.textContent = 'Fortalezas de la Organización →';
  svg.appendChild(xTitle);

  const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yTitle.setAttribute('x', 25);
  yTitle.setAttribute('y', MARGIN + HEIGHT / 2);
  yTitle.setAttribute('text-anchor', 'middle');
  yTitle.setAttribute('fill', '#2c5aa0');
  yTitle.setAttribute('font-weight', 'bold');
  yTitle.setAttribute('font-size', '16');
  yTitle.setAttribute('transform', `rotate(-90 25 ${MARGIN + HEIGHT / 2})`);
  yTitle.textContent = '← Atractivo del Mercado';
  svg.appendChild(yTitle);
}

function drawProducts() {
  // Limpiar productos anteriores
  const existingProducts = svg.querySelectorAll('.product-group');
  existingProducts.forEach(p => p.remove());

  if (products.length === 0) return;

  const maxSales = Math.max(...products.map(p => p.sales || 1));

  products.forEach((product, index) => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'product-group');
    group.setAttribute('id', `product-${index}`);

    const cx = MARGIN + ((5 - product.x) * WIDTH) / 4;
    const cy = MARGIN + ((5 - product.y) * HEIGHT) / 4;
    const radius = 15 + (product.sales / maxSales) * 30;

    // Usar el color personalizado del producto
    const color = product.color || '#f59e0b';

    // Círculo principal
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', color + '40');
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', '3');
    circle.setAttribute('cursor', 'pointer');
    circle.setAttribute('class', 'product-circle');

    // Eventos del círculo
    circle.addEventListener('mouseenter', (e) => showTooltip(e, product));
    circle.addEventListener('mouseleave', hideTooltip);
    circle.addEventListener('mousemove', (e) => moveTooltip(e));
    circle.addEventListener('click', (e) => selectProduct(index, e));

    group.appendChild(circle);

    // Sector de participación
    if (product.share > 0) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const angle = (product.share / 100) * 2 * Math.PI;
      const x1 = cx + radius * Math.cos(-Math.PI / 2);
      const y1 = cy + radius * Math.sin(-Math.PI / 2);
      const x2 = cx + radius * Math.cos(-Math.PI / 2 + angle);
      const y2 = cy + radius * Math.sin(-Math.PI / 2 + angle);
      const largeArc = angle > Math.PI ? 1 : 0;

      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      path.setAttribute('d', d);
      path.setAttribute('fill', '#2c5aa0');
      path.setAttribute('opacity', '0.6');
      group.appendChild(path);
    }

    // Indicador de selección
    if (selectedProductIndex === index) {
      const selectionRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      selectionRing.setAttribute('cx', cx);
      selectionRing.setAttribute('cy', cy);
      selectionRing.setAttribute('r', radius + 5);
      selectionRing.setAttribute('fill', 'none');
      selectionRing.setAttribute('stroke', '#2c5aa0');
      selectionRing.setAttribute('stroke-width', '3');
      selectionRing.setAttribute('stroke-dasharray', '5,5');
      group.appendChild(selectionRing);
    }

    // Etiqueta del producto
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', cx);
    label.setAttribute('y', cy - radius - 8);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#333');
    label.setAttribute('font-size', '11');
    label.setAttribute('font-weight', 'bold');
    label.textContent = product.name;
    group.appendChild(label);

    // Dibujar proyecciones
    if (currentFilter !== 'Actual' || currentFilter === 'Todos') {
      drawProjections(group, product, cx, cy, color, index);
    }

    svg.appendChild(group);
  });
}

// Seleccionar producto para cambiar color
function selectProduct(index, event) {
  selectedProductIndex = index;
  document.getElementById('selected-product-name').textContent = products[index].name;
  
  // Limpiar selección de colores
  document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
  
  // Redibujar para mostrar indicador de selección
  drawProducts();
  
  event.stopPropagation();
}

// Funciones de proyecciones y animaciones (continuación del código original)
function drawProjections(group, product, startX, startY, color, productIndex) {
  if (!product.projections) return;

  const dateRows = document.querySelectorAll('#dates-table tr');
  let prevX = startX, prevY = startY;

  dateRows.forEach((row, index) => {
    if (index === 0) return; // Skip actual period

    const labelInput = row.querySelector('input[type="text"]');
    const dateInput = row.querySelector('input[type="date"]');
    
    if (labelInput && dateInput) {
      const period = labelInput.value;
      const projection = product.projections[period];
      
      if (projection && (currentFilter === 'Todos' || currentFilter === period)) {
        const projX = MARGIN + ((5 - projection.x) * WIDTH) / 4;
        const projY = MARGIN + ((5 - projection.y) * HEIGHT) / 4;

        // Línea de conexión
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', prevX);
        line.setAttribute('y1', prevY);
        line.setAttribute('x2', projX);
        line.setAttribute('y2', projY);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '5,5');
        line.setAttribute('opacity', '0.7');
        group.appendChild(line);

        // Círculo de proyección
        const projCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        projCircle.setAttribute('cx', projX);
        projCircle.setAttribute('cy', projY);
        projCircle.setAttribute('r', 8);
        projCircle.setAttribute('fill', color + '30');
        projCircle.setAttribute('stroke', color);
        projCircle.setAttribute('stroke-width', '2');
        projCircle.setAttribute('stroke-dasharray', '3,2');
        projCircle.setAttribute('cursor', 'pointer');

        // Evento de hover para proyección
        projCircle.addEventListener('mouseenter', (e) => {
          showTooltip(e, {
            name: product.name,
            x: projection.x,
            y: projection.y,
            period: period,
            date: dateInput.value
          }, true);
        });
        projCircle.addEventListener('mouseleave', hideTooltip);
        projCircle.addEventListener('mousemove', (e) => moveTooltip(e));

        group.appendChild(projCircle);

        // Etiqueta del período
        const yearLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        yearLabel.setAttribute('x', projX);
        yearLabel.setAttribute('y', projY - 12);
        yearLabel.setAttribute('text-anchor', 'middle');
        yearLabel.setAttribute('fill', color);
        yearLabel.setAttribute('font-size', '8');
        yearLabel.setAttribute('font-weight', 'bold');
        yearLabel.textContent = period;
        group.appendChild(yearLabel);

        prevX = projX;
        prevY = projY;
      }
    }
  });
}

// Funciones de tooltip
function showTooltip(event, product, isProjection = false) {
  const formatCurrency = (value) => new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    minimumFractionDigits: 0 
  }).format(value * 1000000);

  let content = `
    <strong>${product.name}</strong><br>
    Fortaleza: ${product.x}<br>
    Atractivo: ${product.y}<br>
  `;

  if (isProjection) {
    content += `Período: ${product.period}<br>Fecha: ${product.date}`;
  } else {
    content += `
      Ventas: ${formatCurrency(product.sales)}<br>
      Participación: ${product.share}%
    `;
  }

  tooltip.innerHTML = content;
  tooltip.classList.add('show');
  moveTooltip(event);
}

function hideTooltip() {
  tooltip.classList.remove('show');
}

function moveTooltip(event) {
  tooltip.style.left = (event.pageX + 10) + 'px';
  tooltip.style.top = (event.pageY - 10) + 'px';
}

// Funciones de filtrado
function filterByYear(period) {
  currentFilter = period;
  document.querySelectorAll('.year-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent === period) {
      btn.classList.add('active');
    }
  });
  drawProducts();
}

function showAllYears() {
  currentFilter = 'Todos';
  document.querySelectorAll('.year-btn').forEach(btn => btn.classList.remove('active'));
  drawProducts();
}

// Funciones de proyecciones
function showProjectionModal() {
  const modal = document.getElementById('projectionModal');
  const form = document.getElementById('projectionForm');
  form.innerHTML = '';

  const dateRows = document.querySelectorAll('#dates-table tr');
  const periods = [];
  
  dateRows.forEach((row, index) => {
    if (index === 0) return; // Skip actual period
    const labelInput = row.querySelector('input[type="text"]');
    if (labelInput) periods.push(labelInput.value);
  });

  products.forEach((product, index) => {
    const productSection = document.createElement('div');
    productSection.innerHTML = `<h4 style="color:#2c5aa0;margin:15px 0 10px 0;border-bottom:1px solid #ccc;padding-bottom:5px;">${product.name}</h4>`;

    periods.forEach(period => {
      const projection = product.projections[period] || { x: product.x, y: product.y };
      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';
      formGroup.innerHTML = `
        <label>${period}:</label>
        <input type="number" id="x_${index}_${period}" placeholder="X (Fortaleza)" min="1" max="5" step="0.1" value="${projection.x}" style="text-align:center;">
        <input type="number" id="y_${index}_${period}" placeholder="Y (Atractivo)" min="1" max="5" step="0.1" value="${projection.y}" style="text-align:center;">
      `;
      productSection.appendChild(formGroup);
    });

    form.appendChild(productSection);
  });

  modal.style.display = 'block';
}

function closeProjectionModal() {
  document.getElementById('projectionModal').style.display = 'none';
}

function saveProjections() {
  const dateRows = document.querySelectorAll('#dates-table tr');
  const periods = [];
  
  dateRows.forEach((row, index) => {
    if (index === 0) return;
    const labelInput = row.querySelector('input[type="text"]');
    if (labelInput) periods.push(labelInput.value);
  });

  products.forEach((product, index) => {
    if (!product.projections) product.projections = {};
    
    periods.forEach(period => {
      const xInput = document.getElementById(`x_${index}_${period}`);
      const yInput = document.getElementById(`y_${index}_${period}`);

      if (xInput && yInput && xInput.value && yInput.value) {
        product.projections[period] = {
          x: parseFloat(xInput.value),
          y: parseFloat(yInput.value)
        };
      }
    });
  });

  closeProjectionModal();
  drawProducts();
}

function animateMovements() {
  const dateRows = document.querySelectorAll('#dates-table tr');
  const periods = [];
  
  dateRows.forEach(row => {
    const labelInput = row.querySelector('input[type="text"]');
    if (labelInput) periods.push(labelInput.value);
  });

  let currentIndex = 0;
  const animate = () => {
    if (currentIndex < periods.length) {
      filterByYear(periods[currentIndex]);
      currentIndex++;
      setTimeout(animate, 1500);
    }
  };
  animate();
}

function exportMatrix() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1000;
  canvas.height = 600;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const svgData = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    const link = document.createElement('a');
    link.download = 'matriz_ge_mckinsey_' + new Date().toISOString().split('T')[0] + '.png';
    link.href = canvas.toDataURL();
    link.click();
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

// Event listeners
window.addEventListener('load', initializeMatrix);

window.addEventListener('click', function (event) {
  const modal = document.getElementById('projectionModal');
  if (event.target === modal) {
    closeProjectionModal();
  }
});

// Deseleccionar producto al hacer clic en el fondo
document.addEventListener('click', function(event) {
  if (!event.target.closest('.product-group') && !event.target.closest('.color-picker-section')) {
    selectedProductIndex = -1;
    document.getElementById('selected-product-name').textContent = 'Ninguno';
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    drawProducts();
  }
});