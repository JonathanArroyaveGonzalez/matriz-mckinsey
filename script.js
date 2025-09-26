// Variables globales
let products = [
  { 
    name: 'Carvajal Tecnología y Servicios',
    color: '#10b981',
    sales: 172645, 
    share: 35,
    internal: {
      'Liderazgo Tecnológico': 4,
      'Disponibilidad Plataformas': 5,
      'Base Clientes B2B': 4,
      'Experiencia Regional': 5,
      'Capacidad Innovación': 4
    },
    external: {
      'Transformación Digital': 4,
      'Crecimiento Fintech': 3,
      'Regulaciones Favorables': 4,
      'Demanda B2B Colombia': 5
    }
  },
  { 
    name: 'Facturación Electrónica',
    color: '#10b981',
    sales: 85000, 
    share: 20,
    internal: {
      'Liderazgo Tecnológico': 5,
      'Disponibilidad Plataformas': 5,
      'Base Clientes B2B': 4,
      'Experiencia Regional': 4,
      'Capacidad Innovación': 5
    },
    external: {
      'Transformación Digital': 5,
      'Crecimiento Fintech': 4,
      'Regulaciones Favorables': 5,
      'Demanda B2B Colombia': 4
    }
  },
  { 
    name: 'Plataforma GAIA',
    color: '#f59e0b',
    sales: 45000, 
    share: 15,
    internal: {
      'Liderazgo Tecnológico': 3,
      'Disponibilidad Plataformas': 4,
      'Base Clientes B2B': 5,
      'Experiencia Regional': 4,
      'Capacidad Innovación': 3
    },
    external: {
      'Transformación Digital': 4,
      'Crecimiento Fintech': 4,
      'Regulaciones Favorables': 3,
      'Demanda B2B Colombia': 4
    }
  },
  { 
    name: 'Fintech Álaga',
    color: '#3b82f6',
    sales: 25000, 
    share: 8,
    internal: {
      'Liderazgo Tecnológico': 3,
      'Disponibilidad Plataformas': 3,
      'Base Clientes B2B': 2,
      'Experiencia Regional': 4,
      'Capacidad Innovación': 4
    },
    external: {
      'Transformación Digital': 4,
      'Crecimiento Fintech': 5,
      'Regulaciones Favorables': 3,
      'Demanda B2B Colombia': 3
    }
  },
  { 
    name: 'App PliP',
    color: '#ef4444',
    sales: 15000, 
    share: 5,
    internal: {
      'Liderazgo Tecnológico': 2,
      'Disponibilidad Plataformas': 3,
      'Base Clientes B2B': 3,
      'Experiencia Regional': 3,
      'Capacidad Innovación': 3
    },
    external: {
      'Transformación Digital': 3,
      'Crecimiento Fintech': 4,
      'Regulaciones Favorables': 3,
      'Demanda B2B Colombia': 4
    }
  }
];

// Factores y sus pesos
let internalFactors = [
  { name: 'Liderazgo Tecnológico', weight: 25 },
  { name: 'Disponibilidad Plataformas', weight: 20 },
  { name: 'Base Clientes B2B', weight: 20 },
  { name: 'Experiencia Regional', weight: 15 },
  { name: 'Capacidad Innovación', weight: 20 }
];

let externalFactors = [
  { name: 'Transformación Digital', weight: 30 },
  { name: 'Crecimiento Fintech', weight: 25 },
  { name: 'Regulaciones Favorables', weight: 20 },
  { name: 'Demanda B2B Colombia', weight: 25 }
];

// Variables de control
let selectedProductIndex = -1;
let svg, tooltip;
const MARGIN = 80;
const WIDTH = 1000 - 2 * MARGIN;
const HEIGHT = 600 - 2 * MARGIN;

// Función para calcular coordenadas basadas en evaluaciones
function calculateCoordinates(product) {
  let x = 0, y = 0;
  
  // Calcular coordenada X (factores internos)
  internalFactors.forEach(factor => {
    const score = product.internal[factor.name] || 1;
    x += (score * factor.weight / 100);
  });
  
  // Calcular coordenada Y (factores externos)  
  externalFactors.forEach(factor => {
    const score = product.external[factor.name] || 1;
    y += (score * factor.weight / 100);
  });
  
  return { x, y };
}

// Inicialización
function initializeMatrix() {
  svg = document.getElementById('matrix-svg');
  tooltip = document.getElementById('tooltip');
  
  // Cargar datos del localStorage si existen
  const dataLoaded = loadFromLocalStorage();
  
  if (dataLoaded) {
    // Actualizar headers de factores si se cargaron datos
    updateInternalFactorHeaders();
    updateExternalFactorHeaders();
  }
  
  loadEvaluationTables();
  drawMatrix();
  setupColorPicker();
}

// Cargar tablas de evaluación
function loadEvaluationTables() {
  loadInternalTable();
  loadExternalTable();
  loadSalesTable();
  updateAllCalculations();
}

// Cargar tabla de factores internos
function loadInternalTable() {
  const tbody = document.getElementById('internal-products-tbody');
  tbody.innerHTML = '';
  
  products.forEach((product, productIndex) => {
    const row = document.createElement('tr');
    
    // Celda nombre del producto
    let html = `<td class="product-name-cell">
      <input type="text" value="${product.name}" onchange="updateProductName(${productIndex}, this.value)">
    </td>`;
    
    // Celdas de calificación para cada factor
    internalFactors.forEach(factor => {
      const score = product.internal[factor.name] || 1;
      html += `<td>
        <input type="number" class="score-input score-${score}" value="${score}" 
               min="1" max="5" 
               onchange="updateProductScore(${productIndex}, 'internal', '${factor.name}', this.value)">
      </td>`;
    });
    
    // Celda coordenada calculada
    const coords = calculateCoordinates(product);
    html += `<td class="coordinate-cell" id="internal-coord-${productIndex}">${coords.x.toFixed(2)}</td>`;
    
    // Celda acciones
    html += `<td class="actions-cell">
      <button class="btn btn-danger btn-sm" onclick="removeProduct(${productIndex})">🗑️</button>
    </td>`;
    
    row.innerHTML = html;
    tbody.appendChild(row);
  });
}

// Cargar tabla de factores externos
function loadExternalTable() {
  const tbody = document.getElementById('external-products-tbody');
  tbody.innerHTML = '';
  
  products.forEach((product, productIndex) => {
    const row = document.createElement('tr');
    
    // Celda nombre del producto
    let html = `<td class="product-name-cell">
      <span>${product.name}</span>
    </td>`;
    
    // Celdas de calificación para cada factor
    externalFactors.forEach(factor => {
      const score = product.external[factor.name] || 1;
      html += `<td>
        <input type="number" class="score-input score-${score}" value="${score}" 
               min="1" max="5" 
               onchange="updateProductScore(${productIndex}, 'external', '${factor.name}', this.value)">
      </td>`;
    });
    
    // Celda coordenada calculada
    const coords = calculateCoordinates(product);
    html += `<td class="coordinate-cell" id="external-coord-${productIndex}">${coords.y.toFixed(2)}</td>`;
    
    // Celda acciones
    html += `<td class="actions-cell">
      <button class="btn btn-primary btn-sm" onclick="selectProduct(${productIndex})">🎨</button>
    </td>`;
    
    row.innerHTML = html;
    tbody.appendChild(row);
  });
}

// Actualizar nombre del producto
function updateProductName(index, newName) {
  products[index].name = newName;
  saveToLocalStorage(); // Guardar cambios
  loadExternalTable(); // Actualizar la otra tabla
  loadSalesTable(); // Actualizar tabla de ventas
  populateProductSelector(); // Actualizar selector de productos
  drawMatrix();
}

// Actualizar calificación de producto
function updateProductScore(productIndex, type, factorName, newScore) {
  const score = Math.max(1, Math.min(5, parseInt(newScore)));
  products[productIndex][type][factorName] = score;
  
  // Actualizar clase CSS del input
  const input = event.target;
  input.className = input.className.replace(/score-\d/, `score-${score}`);
  
  saveToLocalStorage(); // Guardar cambios
  updateAllCalculations();
  drawProducts();
}

// Actualizar todos los cálculos
function updateAllCalculations() {
  products.forEach((product, index) => {
    const coords = calculateCoordinates(product);
    
    // Actualizar coordenadas mostradas
    const internalCell = document.getElementById(`internal-coord-${index}`);
    const externalCell = document.getElementById(`external-coord-${index}`);
    
    if (internalCell) internalCell.textContent = coords.x.toFixed(2);
    if (externalCell) externalCell.textContent = coords.y.toFixed(2);
  });
  
  updateWeightTotals();
}

// Actualizar totales de pesos
function updateWeightTotals() {
  // Total factores internos
  const internalTotal = internalFactors.reduce((sum, factor) => sum + factor.weight, 0);
  const internalElement = document.getElementById('internal-weights-total');
  if (internalElement) {
    internalElement.textContent = `${internalTotal}%`;
    internalElement.style.color = internalTotal === 100 ? '#28a745' : '#dc3545';
  }
  
  // Total factores externos
  const externalTotal = externalFactors.reduce((sum, factor) => sum + factor.weight, 0);
  const externalElement = document.getElementById('external-weights-total');
  if (externalElement) {
    externalElement.textContent = `${externalTotal}%`;
    externalElement.style.color = externalTotal === 100 ? '#28a745' : '#dc3545';
  }
}

// Actualizar cálculos cuando cambian los pesos
function updateInternalCalculations() {
  const weightInputs = document.querySelectorAll('#internal-factors-header input.factor-weight');
  weightInputs.forEach((input, index) => {
    if (internalFactors[index]) {
      internalFactors[index].weight = parseInt(input.value) || 0;
    }
  });
  saveToLocalStorage(); // Guardar cambios
  updateAllCalculations();
  drawProducts();
}

function updateExternalCalculations() {
  const weightInputs = document.querySelectorAll('#external-factors-header input.factor-weight');
  weightInputs.forEach((input, index) => {
    if (externalFactors[index]) {
      externalFactors[index].weight = parseInt(input.value) || 0;
    }
  });
  saveToLocalStorage(); // Guardar cambios
  updateAllCalculations();
  drawProducts();
}

// Agregar nuevo producto
function addProductRow() {
  const newProduct = {
    name: `Nuevo Producto ${products.length + 1}`,
    color: '#94a3b8',
    sales: 10000,
    share: 1,
    internal: {},
    external: {}
  };
  
  // Inicializar evaluaciones con valor 1
  internalFactors.forEach(factor => {
    newProduct.internal[factor.name] = 1;
  });
  externalFactors.forEach(factor => {
    newProduct.external[factor.name] = 1;
  });
  
  products.push(newProduct);
  saveToLocalStorage(); // Guardar cambios
  loadEvaluationTables(); // Esto ahora incluye la tabla de ventas
  drawMatrix();
  populateProductSelector(); // Actualizar selector de productos
}

// Eliminar producto
function removeProduct(index) {
  if (products.length > 1) {
    products.splice(index, 1);
    
    // Resetear selección si el producto eliminado estaba seleccionado
    if (selectedProductIndex === index) {
      selectedProductIndex = null;
      updateSelectedProduct();
    } else if (selectedProductIndex > index) {
      selectedProductIndex--; // Ajustar índice si se eliminó un producto anterior
    }
    
    saveToLocalStorage(); // Guardar cambios
    loadEvaluationTables(); // Esto ahora incluye la tabla de ventas
    drawMatrix();
    populateProductSelector(); // Actualizar selector de productos
  } else {
    alert('Debe haber al menos un producto en la matriz');
  }
}

// Seleccionar producto para cambiar color (compatible con nuevo sistema)
function selectProduct(index) {
  selectedProductIndex = index;
  const productSelector = document.getElementById('product-selector');
  if (productSelector) {
    productSelector.value = index.toString();
    updateSelectedProduct();
  }
  // Mantener compatibilidad con sistema anterior por si acaso
  const oldDisplay = document.getElementById('selected-product-name');
  if (oldDisplay) {
    oldDisplay.textContent = products[index].name;
  }
}

// Funciones de matriz y visualización
function drawMatrix() {
  if (!svg) return;
  drawGrid();
  drawProducts();
}

function drawGrid() {
  if (!svg) {
    console.error('SVG element not found');
    return;
  }
  svg.innerHTML = '';

  // Definir regiones de la matriz
  const regions = [
    { x: MARGIN, y: MARGIN, w: WIDTH / 3, h: HEIGHT / 3, color: '#10b98130', label: 'Invertir/Proteger' },
    { x: MARGIN + WIDTH / 3, y: MARGIN, w: WIDTH / 3, h: HEIGHT / 3, color: '#10b98130', label: 'Invertir/Crecer' },
    { x: MARGIN + (2 * WIDTH) / 3, y: MARGIN, w: WIDTH / 3, h: HEIGHT / 3, color: '#f59e0b30', label: 'Selectivo/Crecer' },
    { x: MARGIN, y: MARGIN + HEIGHT / 3, w: WIDTH / 3, h: HEIGHT / 3, color: '#10b98130', label: 'Invertir/Crecer' },
    { x: MARGIN + WIDTH / 3, y: MARGIN + HEIGHT / 3, w: WIDTH / 3, h: HEIGHT / 3, color: '#f59e0b30', label: 'Selectividad/Ganancias' },
    { x: MARGIN + (2 * WIDTH) / 3, y: MARGIN + HEIGHT / 3, w: WIDTH / 3, h: HEIGHT / 3, color: '#f59e0b30', label: 'Selectivo/Ganancias' },
    { x: MARGIN, y: MARGIN + (2 * HEIGHT) / 3, w: WIDTH / 3, h: HEIGHT / 3, color: '#ef444430', label: 'Cosechar/Retirar' },
    { x: MARGIN + WIDTH / 3, y: MARGIN + (2 * HEIGHT) / 3, w: WIDTH / 3, h: HEIGHT / 3, color: '#ef444430', label: 'Cosechar/Retirar' },
    { x: MARGIN + (2 * WIDTH) / 3, y: MARGIN + (2 * HEIGHT) / 3, w: WIDTH / 3, h: HEIGHT / 3, color: '#ef444430', label: 'Cosechar/Retirar' }
  ];

  // Dibujar regiones
  regions.forEach(region => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', region.x);
    rect.setAttribute('y', region.y);
    rect.setAttribute('width', region.w);
    rect.setAttribute('height', region.h);
    rect.setAttribute('fill', region.color);
    rect.setAttribute('stroke', '#666');
    rect.setAttribute('stroke-width', 1);
    svg.appendChild(rect);

    // Etiquetas de región
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', region.x + region.w / 2);
    text.setAttribute('y', region.y + region.h / 2);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '12px');
    text.setAttribute('fill', '#666');
    text.textContent = region.label;
    svg.appendChild(text);
  });

  // Líneas de cuadrícula principales (3x3)
  for (let i = 0; i <= 3; i++) {
    const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vLine.setAttribute('x1', MARGIN + (i * WIDTH / 3));
    vLine.setAttribute('y1', MARGIN);
    vLine.setAttribute('x2', MARGIN + (i * WIDTH / 3));
    vLine.setAttribute('y2', MARGIN + HEIGHT);
    vLine.setAttribute('stroke', '#999');
    vLine.setAttribute('stroke-width', i === 0 || i === 3 ? 2 : 1);
    svg.appendChild(vLine);

    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hLine.setAttribute('x1', MARGIN);
    hLine.setAttribute('y1', MARGIN + (i * HEIGHT / 3));
    hLine.setAttribute('x2', MARGIN + WIDTH);
    hLine.setAttribute('y2', MARGIN + (i * HEIGHT / 3));
    hLine.setAttribute('stroke', '#999');
    hLine.setAttribute('stroke-width', i === 0 || i === 3 ? 2 : 1);
    svg.appendChild(hLine);
  }

  // Etiquetas descriptivas en los ejes
  const xLabels = ['Fuerte', 'Medio', 'Débil'];
  const yLabels = ['Bajo', 'Medio', 'Alto'];
  
  // Eje X (Débil, Medio, Fuerte)
  xLabels.forEach((label, i) => {
    const x = MARGIN + (i + 0.5) * (WIDTH / 3);
    const xText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xText.setAttribute('x', x);
    xText.setAttribute('y', MARGIN + HEIGHT + 25);
    xText.setAttribute('text-anchor', 'middle');
    xText.setAttribute('fill', '#2c5aa0');
    xText.setAttribute('font-size', '14');
    xText.setAttribute('font-weight', 'bold');
    xText.textContent = label;
    svg.appendChild(xText);
  });
  
  // Eje Y (Bajo, Medio, Alto) - de abajo hacia arriba
  yLabels.forEach((label, i) => {
    const y = MARGIN + HEIGHT - (i + 0.5) * (HEIGHT / 3);
    const yText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yText.setAttribute('x', MARGIN - 35);
    yText.setAttribute('y', y + 5);
    yText.setAttribute('text-anchor', 'middle');
    yText.setAttribute('fill', '#2c5aa0');
    yText.setAttribute('font-size', '14');
    yText.setAttribute('font-weight', 'bold');
    yText.textContent = label;
    svg.appendChild(yText);
  });

  // Etiquetas de ejes
  const xAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xAxisLabel.setAttribute('x', MARGIN + WIDTH / 2);
  xAxisLabel.setAttribute('y', MARGIN + HEIGHT + 50);
  xAxisLabel.setAttribute('text-anchor', 'middle');
  xAxisLabel.setAttribute('font-weight', 'bold');
  xAxisLabel.setAttribute('font-size', '14px');
  xAxisLabel.setAttribute('fill', '#2c5aa0');
  xAxisLabel.textContent = 'Fortaleza Competitiva (Factores Internos) →';
  svg.appendChild(xAxisLabel);

  const yAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yAxisLabel.setAttribute('x', 20);
  yAxisLabel.setAttribute('y', MARGIN + HEIGHT / 2);
  yAxisLabel.setAttribute('text-anchor', 'middle');
  yAxisLabel.setAttribute('font-weight', 'bold');
  yAxisLabel.setAttribute('font-size', '14px');
  yAxisLabel.setAttribute('fill', '#2c5aa0');
  yAxisLabel.setAttribute('transform', `rotate(-90, 20, ${MARGIN + HEIGHT / 2})`);
  yAxisLabel.textContent = '↑ Atractivo del Mercado (Factores Externos)';
  svg.appendChild(yAxisLabel);
}

// Función auxiliar para calcular el tamaño del círculo basado en ventas y participación
function calculateCircleSize(product, allProducts) {
  const maxSales = Math.max(...allProducts.map(p => p.sales || 1));
  const maxShare = Math.max(...allProducts.map(p => p.share || 1));
  
  // Normalizar ventas y participación (0-1)
  const normalizedSales = (product.sales || 1) / maxSales;
  const normalizedShare = (product.share || 1) / maxShare;
  
  // Combinar ventas (70%) y participación (30%) para el tamaño
  const combinedSize = (normalizedSales * 0.7) + (normalizedShare * 0.3);
  
  const minRadius = 8;  // Tamaño mínimo
  const maxRadius = 45; // Tamaño máximo
  return minRadius + (combinedSize * (maxRadius - minRadius));
}

function drawProducts() {
  if (!svg) return;
  
  // Limpiar productos existentes
  const existingProducts = svg.querySelectorAll('.product-group');
  existingProducts.forEach(p => p.remove());

  products.forEach((product, index) => {
    const coords = calculateCoordinates(product);
    
    // Convertir coordenadas de 1-5 a coordenadas SVG
    const x = MARGIN + (coords.x - 1) * (WIDTH / 4);
    const y = MARGIN + HEIGHT - ((coords.y - 1) * (HEIGHT / 4));
    
    // Crear grupo para el producto
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('product-group');
    group.setAttribute('data-index', index);

    // Calcular tamaño del círculo usando función auxiliar
    const circleRadius = calculateCircleSize(product, products);

    // Círculo principal (más transparente para ver sector de participación)
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', circleRadius);
    circle.setAttribute('fill', product.color);
    circle.setAttribute('fill-opacity', '0.2'); // Más transparente
    circle.setAttribute('stroke', selectedProductIndex === index ? '#000' : '#333');
    circle.setAttribute('stroke-width', selectedProductIndex === index ? 4 : 2.5);
    circle.setAttribute('cursor', 'pointer');
    circle.classList.add('product-circle');
    
    // Sector de participación de mercado (visual mejorado)
    if (product.share > 0) {
      const totalMarketShare = products.reduce((sum, p) => sum + p.share, 0);
      const relativeShare = (product.share / totalMarketShare) * 100;
      const sectorAngle = (relativeShare / 100) * 360;
      
      if (sectorAngle > 3) { // Mostrar sectores más pequeños también
        const startAngle = -90; // Comenzar desde arriba
        const endAngleRad = ((startAngle + sectorAngle) * Math.PI) / 180;
        const startAngleRad = (startAngle * Math.PI) / 180;
        
        const x1 = x + (circleRadius * 0.95) * Math.cos(startAngleRad);
        const y1 = y + (circleRadius * 0.95) * Math.sin(startAngleRad);
        const x2 = x + (circleRadius * 0.95) * Math.cos(endAngleRad);
        const y2 = y + (circleRadius * 0.95) * Math.sin(endAngleRad);
        
        const largeArcFlag = sectorAngle > 180 ? 1 : 0;
        
        const pathData = [
          `M ${x} ${y}`,
          `L ${x1} ${y1}`,
          `A ${circleRadius * 0.95} ${circleRadius * 0.95} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          'Z'
        ].join(' ');
        
        const sector = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        sector.setAttribute('d', pathData);
        sector.setAttribute('fill', '#ffffff');
        sector.setAttribute('opacity', '0.9');
        sector.setAttribute('stroke', '#2c5aa0');
        sector.setAttribute('stroke-width', '2');
        sector.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
        
        group.appendChild(sector);
      }
    }
    
    // Círculo interno para dar profundidad visual
    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', x);
    innerCircle.setAttribute('cy', y);
    innerCircle.setAttribute('r', circleRadius * 0.8);
    innerCircle.setAttribute('fill', 'none');
    innerCircle.setAttribute('stroke', '#ffffff');
    innerCircle.setAttribute('stroke-width', 1);
    innerCircle.setAttribute('opacity', '0.3');
    
    // Eventos
    circle.addEventListener('click', () => selectProduct(index));
    circle.addEventListener('mouseover', (e) => showTooltip(e, product, coords));
    circle.addEventListener('mouseout', hideTooltip);

    // Etiqueta del producto
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y - circleRadius - 8);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '11px');
    text.setAttribute('font-weight', '600');
    text.setAttribute('fill', '#333');
    text.textContent = product.name;

    // Texto de porcentaje de participación con color diferente
    const percentageText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    percentageText.setAttribute('x', x);
    percentageText.setAttribute('y', y + 5); // Centrado en el círculo
    percentageText.setAttribute('text-anchor', 'middle');
    percentageText.setAttribute('font-size', '12px');
    percentageText.setAttribute('font-weight', 'bold');
    percentageText.setAttribute('fill', '#ffffff');
    percentageText.setAttribute('stroke', '#000');
    percentageText.setAttribute('stroke-width', '0.5');
    percentageText.classList.add('percentage-text');
    percentageText.textContent = `${product.share}%`;
    
    // Añadir sombra al texto para mejor legibilidad
    const percentageTextShadow = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    percentageTextShadow.setAttribute('x', x + 1);
    percentageTextShadow.setAttribute('y', y + 6);
    percentageTextShadow.setAttribute('text-anchor', 'middle');
    percentageTextShadow.setAttribute('font-size', '12px');
    percentageTextShadow.setAttribute('font-weight', 'bold');
    percentageTextShadow.setAttribute('fill', '#000');
    percentageTextShadow.setAttribute('opacity', '0.3');
    percentageTextShadow.textContent = `${product.share}%`;

    // Flecha dinámica para cada producto (con distancia variable)
    if (!product.arrowDirection) {
      product.arrowDirection = Math.random() * 360; // Dirección aleatoria inicial
    }
    if (!product.arrowDistance) {
      product.arrowDistance = 50; // Distancia inicial desde el círculo
    }
    
    const arrowAngle = (product.arrowDirection * Math.PI) / 180;
    const startDistance = circleRadius + 5;
    const arrowStartX = x + startDistance * Math.cos(arrowAngle);
    const arrowStartY = y + startDistance * Math.sin(arrowAngle);
    const arrowEndX = x + product.arrowDistance * Math.cos(arrowAngle);
    const arrowEndY = y + product.arrowDistance * Math.sin(arrowAngle);
    
    // Línea de la flecha
    const arrowLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    arrowLine.setAttribute('x1', arrowStartX);
    arrowLine.setAttribute('y1', arrowStartY);
    arrowLine.setAttribute('x2', arrowEndX);
    arrowLine.setAttribute('y2', arrowEndY);
    arrowLine.setAttribute('stroke', product.color);
    arrowLine.setAttribute('stroke-width', '3');
    arrowLine.setAttribute('data-product-index', index);
    arrowLine.setAttribute('data-product-name', product.name);
    arrowLine.classList.add('arrow-line');
    arrowLine.setAttribute('stroke-dasharray', '5,5');
    arrowLine.setAttribute('marker-end', `url(#arrowhead-${index})`);
    arrowLine.classList.add('dynamic-arrow');
    arrowLine.style.cursor = 'grab';
    
    // Crear marcador de flecha único para cada producto
    const defs = svg.querySelector('defs') || svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'defs'));
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', `arrowhead-${index}`);
    marker.setAttribute('markerWidth', '12');
    marker.setAttribute('markerHeight', '8');
    marker.setAttribute('refX', '10');
    marker.setAttribute('refY', '4');
    marker.setAttribute('orient', 'auto');
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 12 4, 0 8');
    polygon.setAttribute('fill', product.color);
    
    marker.appendChild(polygon);
    defs.appendChild(marker);
    
    // Sistema simplificado de drag para flechas
    arrowLine.style.cursor = 'grab';
    
    const handleMouseDown = (e) => {
      console.log(`Iniciando drag para ${product.name} (index: ${index})`);
      e.preventDefault();
      e.stopPropagation();
      arrowLine.style.cursor = 'grabbing';
      
      const handleMouseMove = (moveEvent) => {
        const svgRect = svg.getBoundingClientRect();
        const mouseX = ((moveEvent.clientX - svgRect.left) / svgRect.width) * 1000;
        const mouseY = ((moveEvent.clientY - svgRect.top) / svgRect.height) * 600;
        
        // Calcular ángulo y distancia desde el centro del círculo
        const deltaX = mouseX - x;
        const deltaY = mouseY - y;
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Actualizar propiedades del producto
        product.arrowDirection = (angle * 180) / Math.PI;
        product.arrowDistance = Math.max(circleRadius + 15, Math.min(120, distance));
        
        console.log(`Moviendo flecha de ${product.name}: dirección=${product.arrowDirection.toFixed(1)}°, distancia=${product.arrowDistance.toFixed(1)}`);
        
        // Redibujar solo esta flecha actualizando todo el producto
        drawProducts();
      };
      
      const handleMouseUp = () => {
        console.log(`Terminando drag para ${product.name}`);
        saveToLocalStorage(); // Guardar cambios de posición de flecha
        arrowLine.style.cursor = 'grab';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    arrowLine.addEventListener('mousedown', handleMouseDown);

    group.appendChild(circle);
    // El sector ya se añadió dentro del bloque condicional
    group.appendChild(innerCircle); // Añadir círculo interno
    group.appendChild(text);
    group.appendChild(percentageTextShadow); // Sombra primero
    group.appendChild(percentageText); // Texto encima
    group.appendChild(arrowLine); // Añadir flecha dinámica
    svg.appendChild(group);
  });
  
  // Actualizar gráfico de torta después de dibujar productos
  drawMarketSharePie();
}

// Tooltip functions
function showTooltip(event, product, coords) {
  if (!tooltip) return;
  
  // Crear contenido detallado del tooltip
  const totalMarketShare = products.reduce((sum, p) => sum + p.share, 0);
  const relativeShare = ((product.share / totalMarketShare) * 100).toFixed(1);
  
  // Calcular información del tamaño
  const circleRadius = calculateCircleSize(product, products);
  const maxRadius = 45;
  const sizePercentage = ((circleRadius / maxRadius) * 100).toFixed(1);
  
  tooltip.innerHTML = `
    <div style="font-weight: bold; color: ${product.color}; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 5px;">
      ${product.name}
    </div>
    <div><strong>Posición en Matriz:</strong></div>
    <div>• Fortaleza (X): ${coords.x.toFixed(2)}/5.0</div>
    <div>• Atractivo (Y): ${coords.y.toFixed(2)}/5.0</div>
    <div style="margin-top: 8px;"><strong>Datos de Mercado:</strong></div>
    <div>• Participación: ${product.share}% (${relativeShare}% relativo)</div>
    <div>• Ventas: $${product.sales.toLocaleString()}</div>
    <div style="margin-top: 8px;"><strong>Tamaño Burbuja:</strong></div>
    <div>• Tamaño: ${sizePercentage}% del máximo</div>
    <div style="margin-top: 8px; font-size: 11px; color: #666;">
      💡 Tamaño = Ventas (70%) + Participación (30%)
    </div>
  `;
  
  tooltip.style.display = 'block';
  tooltip.style.left = Math.min(event.pageX + 15, window.innerWidth - 250) + 'px';
  tooltip.style.top = Math.max(event.pageY - 10, 10) + 'px';
}

function hideTooltip() {
  if (tooltip) {
    tooltip.style.display = 'none';
  }
}

// Sistema de colores simplificado con selects
function setupColorPicker() {
    populateProductSelector();
}

function populateProductSelector() {
    const select = document.getElementById('product-selector');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Seleccionar producto --</option>';
    
    products.forEach((product, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = product.name;
        select.appendChild(option);
    });
}

function updateSelectedProduct() {
    const select = document.getElementById('product-selector');
    const colorSelect = document.getElementById('color-selector');
    const display = document.getElementById('selected-product-display');
    const colorDisplay = document.getElementById('selected-color-display');
    
    if (!select || !display || !colorDisplay) return;
    
    selectedProductIndex = select.value !== '' ? parseInt(select.value) : null;
    
    if (selectedProductIndex !== null && selectedProductIndex < products.length) {
        const product = products[selectedProductIndex];
        display.textContent = product.name;
        colorDisplay.style.backgroundColor = product.color || '#2c5aa0';
    } else {
        display.textContent = 'Ninguno seleccionado';
        colorDisplay.style.backgroundColor = 'transparent';
        selectedProductIndex = null;
    }
    
    // Resetear selector de color cuando se cambia de producto
    if (colorSelect) colorSelect.value = '';
}

function applySelectedColor() {
    const colorSelect = document.getElementById('color-selector');
    const selectedColor = colorSelect.value;
    
    if (selectedProductIndex !== null && selectedColor) {
        applyColorToProduct(selectedColor);
        updateSelectedProduct(); // Actualizar display
    } else if (!selectedColor) {
        // No hacer nada si no hay color seleccionado
        return;
    } else {
        alert('Por favor, selecciona primero un producto');
        if (colorSelect) colorSelect.value = '';
    }
}

function applyCustomColorToSelected() {
    const customColorInput = document.getElementById('custom-color');
    if (!customColorInput) return;
    
    const selectedColor = customColorInput.value;
    
    if (selectedProductIndex !== null) {
        applyColorToProduct(selectedColor);
        updateSelectedProduct(); // Actualizar display
    } else {
        alert('Por favor, selecciona primero un producto');
    }
}

function applyColorToProduct(color) {
  if (selectedProductIndex >= 0 && selectedProductIndex < products.length) {
    products[selectedProductIndex].color = color;
    saveToLocalStorage(); // Guardar cambios
    drawMatrix(); // Cambiar a drawMatrix para actualización completa - las flechas están integradas
  }
}

function applyCustomColor() {
  const customColor = document.getElementById('custom-color').value;
  applyCustomColorToSelected();
}

// Funciones para manejo de filas
function removeRow(button) {
  const row = button.closest('tr');
  if (row) {
    row.remove();
    updateAllCalculations();
    drawProducts();
  }
}

// Funciones de factores
function addInternalFactor() {
  const factorName = prompt('Nombre del nuevo factor interno:');
  if (factorName && factorName.trim()) {
    internalFactors.push({ name: factorName.trim(), weight: 10 });
    
    // Agregar el factor a todos los productos existentes
    products.forEach(product => {
      product.internal[factorName.trim()] = 1;
    });
    
    saveToLocalStorage(); // Guardar cambios
    // Actualizar tabla
    updateInternalFactorHeaders();
    loadEvaluationTables();
  }
}

function addExternalFactor() {
  const factorName = prompt('Nombre del nuevo factor externo:');
  if (factorName && factorName.trim()) {
    externalFactors.push({ name: factorName.trim(), weight: 10 });
    
    // Agregar el factor a todos los productos existentes
    products.forEach(product => {
      product.external[factorName.trim()] = 1;
    });
    
    saveToLocalStorage(); // Guardar cambios
    // Actualizar tabla
    updateExternalFactorHeaders();
    loadEvaluationTables();
  }
}

function updateInternalFactorHeaders() {
  const headerRow = document.getElementById('internal-factors-header');
  if (headerRow) {
    let html = '';
    internalFactors.forEach((factor, index) => {
      html += `<th>
        <div>${factor.name}</div>
        <input type="number" class="factor-weight" value="${factor.weight}" min="0" max="100" 
               onchange="updateInternalCalculations()" style="width: 50px;">%
      </th>`;
    });
    headerRow.innerHTML = html;
  }
}

function updateExternalFactorHeaders() {
  const headerRow = document.getElementById('external-factors-header');
  if (headerRow) {
    let html = '';
    externalFactors.forEach((factor, index) => {
      html += `<th>
        <div>${factor.name}</div>
        <input type="number" class="factor-weight" value="${factor.weight}" min="0" max="100" 
               onchange="updateExternalCalculations()" style="width: 50px;">%
      </th>`;
    });
    headerRow.innerHTML = html;
  }
}

// Funciones de fechas (simplificadas)
function updateDateLabels() {
  // Función mantenida para compatibilidad con HTML
}

function addDatePeriod() {
  const tbody = document.getElementById('dates-table');
  if (!tbody) return;
  
  const newRow = document.createElement('tr');
  const periodName = `Período ${tbody.children.length + 1}`;
  const futureDate = new Date(Date.now() + (tbody.children.length + 1) * 365 * 24 * 60 * 60 * 1000);
  
  newRow.innerHTML = `
    <td><input type="text" value="${periodName}"></td>
    <td><input type="date" value="${futureDate.toISOString().split('T')[0]}"></td>
    <td><button class="btn btn-danger btn-sm" onclick="removeRow(this)">🗑️</button></td>
  `;
  
  tbody.appendChild(newRow);
}

// Funciones de visualización simplificadas
function showAllYears() {
  drawProducts(); // Solo redibuja los productos
}

function exportMatrix() {
  const svgElement = document.getElementById('matrix-svg');
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  // Tamaño más grande para mejor calidad
  canvas.width = 2000;
  canvas.height = 1200;
  
  img.onload = function() {
    // Fondo blanco para mejor contraste
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Escalar el SVG al tamaño del canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const link = document.createElement('a');
    link.download = 'matriz-mckinsey-hd.png';
    link.href = canvas.toDataURL('image/png', 1.0); // Máxima calidad
    link.click();
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

// Funciones simplificadas (reemplazadas por flechas dinámicas)
function showProjectionModal() {
  alert('💡 Usa las flechas dinámicas!\n\nCada producto tiene una flecha que puedes arrastrar para cambiar dirección y distancia.');
}

function closeProjectionModal() { /* Compatibilidad */ }
function loadProjectionForm() { /* Compatibilidad */ }
function saveProjections() { /* Compatibilidad */ }

function animateMovements() {
  alert('🎯 Las flechas son interactivas!\n\nArrastra cada flecha para cambiar su dirección y distancia del círculo.');
}

// Las flechas dinámicas están integradas en drawProducts()

// Gráfico de participación sin círculo de fondo
function drawMarketSharePie() {
  const pieContainer = document.createElement('div');
  pieContainer.id = 'pie-chart-container';
  pieContainer.style.position = 'absolute';
  pieContainer.style.top = '20px';
  pieContainer.style.right = '20px';
  pieContainer.style.width = '150px';
  pieContainer.style.height = '150px';
  pieContainer.style.background = 'rgba(255,255,255,0.95)';
  pieContainer.style.borderRadius = '10px';
  pieContainer.style.border = '2px solid #ddd';
  pieContainer.style.padding = '10px';
  
  const pieSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  pieSvg.setAttribute('width', '130');
  pieSvg.setAttribute('height', '130');
  pieSvg.setAttribute('viewBox', '0 0 130 130');
  
  let startAngle = 0;
  const centerX = 65;
  const centerY = 65;
  const radius = 50;
  
  products.forEach((product, index) => {
    const angle = (product.share / 100) * 360;
    const endAngle = startAngle + angle;
    
    // Crear sector del círculo (sin círculo de fondo)
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    path.setAttribute('d', pathData);
    path.setAttribute('fill', product.color);
    path.setAttribute('stroke', '#fff');
    path.setAttribute('stroke-width', 2);
    path.setAttribute('opacity', 0.9);
    
    // Tooltip en hover
    path.addEventListener('mouseover', function(e) {
      showTooltip(e, product, calculateCoordinates(product));
    });
    path.addEventListener('mouseout', hideTooltip);
    
    pieSvg.appendChild(path);
    startAngle = endAngle;
  });
  
  // Título del gráfico
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', centerX);
  title.setAttribute('y', 15);
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('font-size', '12px');
  title.setAttribute('font-weight', 'bold');
  title.setAttribute('fill', '#333');
  title.textContent = 'Participación';
  pieSvg.appendChild(title);
  
  pieContainer.appendChild(pieSvg);
  
  // Agregar al contenedor de la matriz
  const matrixContainer = document.querySelector('.matrix-container');
  if (matrixContainer) {
    // Remover gráfico anterior si existe
    const existingPie = document.getElementById('pie-chart-container');
    if (existingPie) {
      existingPie.remove();
    }
    matrixContainer.style.position = 'relative';
    matrixContainer.appendChild(pieContainer);
  }
}

// Funciones de títulos editables
function editTitle(titleId) {
  const titleElement = document.getElementById(titleId);
  const editElement = document.getElementById(titleId + '-edit');
  
  if (titleElement && editElement) {
    editElement.value = titleElement.textContent;
    titleElement.style.display = 'none';
    editElement.style.display = 'inline-block';
    editElement.focus();
  }
}

function saveTitle(titleId) {
  const titleElement = document.getElementById(titleId);
  const editElement = document.getElementById(titleId + '-edit');
  
  if (titleElement && editElement) {
    titleElement.textContent = editElement.value;
    titleElement.style.display = 'inline-block';
    editElement.style.display = 'none';
  }
}

function saveTitleOnEnter(event, titleId) {
  if (event.key === 'Enter') {
    saveTitle(titleId);
  }
}

// drawProducts ya incluye todo lo necesario

// Funciones para tabla de ventas y participación
function loadSalesTable() {
  const tbody = document.getElementById('sales-table-body');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  products.forEach((product, index) => {
    const row = document.createElement('tr');
    
    // Calcular el tamaño relativo de la burbuja usando la función auxiliar
    const circleRadius = calculateCircleSize(product, products);
    const maxPossibleRadius = 45;
    const relativeSize = ((circleRadius / maxPossibleRadius) * 100).toFixed(1);
    
    row.innerHTML = `
      <td class="product-name-cell">${product.name}</td>
      <td>
        <input type="number" 
               value="${product.sales}" 
               min="0" 
               step="1000"
               onchange="updateProductSales(${index}, this.value)"
               style="width: 100px; text-align: right;">
      </td>
      <td>
        <input type="number" 
               value="${product.share}" 
               min="0" 
               max="100" 
               step="0.1"
               onchange="updateProductShare(${index}, this.value)"
               style="width: 80px; text-align: right;">%
      </td>
      <td style="text-align: center;">${relativeSize}%</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="removeProductFromSales(${index})" title="Eliminar">❌</button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
  
  updateSalesTotals();
}

function updateProductSales(index, value) {
  const sales = parseFloat(value) || 0;
  if (index >= 0 && index < products.length) {
    products[index].sales = sales;
    saveToLocalStorage(); // Guardar cambios
    updateSalesTotals();
    drawMatrix(); // Actualizar matriz para reflejar el nuevo tamaño
  }
}

function updateProductShare(index, value) {
  const share = parseFloat(value) || 0;
  if (index >= 0 && index < products.length) {
    products[index].share = Math.max(0, Math.min(100, share)); // Limitar entre 0-100
    saveToLocalStorage(); // Guardar cambios
    updateSalesTotals();
    drawMatrix(); // Actualizar matriz
  }
}

function updateSalesTotals() {
  const totalSales = products.reduce((sum, product) => sum + (product.sales || 0), 0);
  const totalShare = products.reduce((sum, product) => sum + (product.share || 0), 0);
  
  const totalSalesElement = document.getElementById('total-sales');
  const totalShareElement = document.getElementById('total-share');
  
  if (totalSalesElement) {
    totalSalesElement.textContent = '$' + totalSales.toLocaleString();
  }
  
  if (totalShareElement) {
    totalShareElement.textContent = totalShare.toFixed(1) + '%';
    // Cambiar color si no suma 100%
    totalShareElement.style.color = Math.abs(totalShare - 100) < 0.1 ? '#28a745' : '#dc3545';
  }
}

function addProductToSalesTable() {
  addProductRow(); // Reutilizar la función existente
}

function removeProductFromSales(index) {
  removeProduct(index); // Reutilizar la función existente
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
    const nameElement = document.getElementById('selected-product-name');
    if (nameElement) nameElement.textContent = 'Ninguno';
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    drawProducts();
  }
});

// Script cargado y optimizado
// Funciones de localStorage
function saveToLocalStorage() {
  const dataToSave = {
    products: products,
    internalFactors: internalFactors,
    externalFactors: externalFactors,
    selectedProductIndex: selectedProductIndex,
    timestamp: new Date().toISOString()
  };
  
  try {
    localStorage.setItem('matrixMcKinsey', JSON.stringify(dataToSave));
    console.log('✅ Datos guardados en localStorage');
  } catch (error) {
    console.error('❌ Error guardando en localStorage:', error);
  }
}

function loadFromLocalStorage() {
  try {
    const savedData = localStorage.getItem('matrixMcKinsey');
    if (savedData) {
      const data = JSON.parse(savedData);
      
      // Cargar productos
      if (data.products && Array.isArray(data.products)) {
        products = data.products;
      }
      
      // Cargar factores internos
      if (data.internalFactors && Array.isArray(data.internalFactors)) {
        internalFactors = data.internalFactors;
      }
      
      // Cargar factores externos
      if (data.externalFactors && Array.isArray(data.externalFactors)) {
        externalFactors = data.externalFactors;
      }
      
      // Cargar producto seleccionado
      if (typeof data.selectedProductIndex === 'number') {
        selectedProductIndex = data.selectedProductIndex;
      }
      
      console.log('✅ Datos cargados desde localStorage');
      console.log('📊 Productos:', products.length);
      console.log('🏢 Factores internos:', internalFactors.length);
      console.log('🌍 Factores externos:', externalFactors.length);
      return true;
    }
  } catch (error) {
    console.error('❌ Error cargando desde localStorage:', error);
  }
  return false;
}

function clearLocalStorage() {
  try {
    localStorage.removeItem('matrixMcKinsey');
    console.log('🗑️ Datos eliminados del localStorage');
    location.reload(); // Recargar la página para usar datos por defecto
  } catch (error) {
    console.error('❌ Error eliminando localStorage:', error);
  }
}

function exportData() {
  const dataToExport = {
    products: products,
    internalFactors: internalFactors,
    externalFactors: externalFactors,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `matriz-mckinsey-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log('📥 Datos exportados');
}

function importData(fileInput) {
  const file = fileInput.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      
      if (data.products) products = data.products;
      if (data.internalFactors) internalFactors = data.internalFactors;
      if (data.externalFactors) externalFactors = data.externalFactors;
      
      // Guardar en localStorage y recargar
      saveToLocalStorage();
      location.reload();
      
      console.log('📤 Datos importados exitosamente');
    } catch (error) {
      alert('Error al importar el archivo: ' + error.message);
      console.error('❌ Error importando:', error);
    }
  };
  reader.readAsText(file);
}

console.log('✅ Matriz McKinsey cargada - Flechas dinámicas activas - LocalStorage habilitado');