let productos = [];
let compradosAlFinal = true; 

const guardado = localStorage.getItem('listaCompraPro');
if (guardado) {
    productos = JSON.parse(guardado);
}

const inputProducto = document.getElementById('inputProducto');
const listaProductos = document.getElementById('listaProductos');
const btnAdd = document.getElementById('btnAdd');
const btnClean = document.getElementById('btnClean');
const btnSort = document.getElementById('btnSort');
const btnToggleOrder = document.getElementById('btnToggleOrder');

function guardar() {
    localStorage.setItem('listaCompraPro', JSON.stringify(productos));
}

function render() {
    const pendientes = productos.filter(p => !p.comprado);
    const comprados = productos.filter(p => p.comprado);

    let listaOrdenada;
    if (compradosAlFinal) {
        listaOrdenada = [...pendientes, ...comprados]; 
        btnToggleOrder.textContent = "Ver comprados: AL FINAL ⬇️";
    } else {
        listaOrdenada = [...comprados, ...pendientes]; 
        btnToggleOrder.textContent = "Ver comprados: ARRIBA ⬆️";
    }

    productos = listaOrdenada; 
    
    listaProductos.innerHTML = ''; 

    productos.forEach((item, index) => {
        const li = document.createElement('li');
        
        const spanNombre = document.createElement('span');
        spanNombre.textContent = item.nombre;
        spanNombre.className = 'prod-name';
        
        const qtyControls = document.createElement('div');
        qtyControls.className = 'qty-controls';

        const btnMinus = document.createElement('button');
        btnMinus.textContent = '-';
        btnMinus.className = 'qty-btn';
        
        const spanQty = document.createElement('span');
        spanQty.textContent = item.cantidad;
        spanQty.className = 'qty-span';
        
        const btnPlus = document.createElement('button');
        btnPlus.textContent = '+';
        btnPlus.className = 'qty-btn';

        if (item.comprado) {
            li.classList.add('comprado');
            btnMinus.disabled = true;
            btnPlus.disabled = true;
        }

        spanNombre.onclick = () => toggleComprado(index);
        
        btnMinus.onclick = (e) => { e.stopPropagation(); decrementarCantidad(index); };
        btnPlus.onclick = (e) => { e.stopPropagation(); incrementarCantidad(index); };

        qtyControls.appendChild(btnMinus);
        qtyControls.appendChild(spanQty);
        qtyControls.appendChild(btnPlus);
        
        li.appendChild(spanNombre);
        li.appendChild(qtyControls);
        listaProductos.appendChild(li);
    });
}

function agregarProducto() {
    const valor = inputProducto.value.trim();
    if (valor === '') return;

    const existe = productos.some(p => p.nombre.toLowerCase() === valor.toLowerCase());
    if (existe) {
        alert('¡Ya está en la lista!');
        return;
    }

    productos.push({
        nombre: valor,
        comprado: false,
        cantidad: 1
    });

    guardar();
    inputProducto.value = '';
    render();
}

function incrementarCantidad(index) {
    if (productos[index].comprado) return;
    productos[index].cantidad++;
    guardar();
    render();
}

function decrementarCantidad(index) {
    if (productos[index].comprado) return;
    
    if (productos[index].cantidad > 1) {
        productos[index].cantidad--;
    } else {
        eliminarProducto(index);
        return;
    }
    guardar();
    render();
}

function toggleComprado(index) {
    productos[index].comprado = !productos[index].comprado;
    guardar();
    render(); 
}

function eliminarProducto(index) {
    productos.splice(index, 1);
    guardar();
    render();
}

function limpiarLista() {
    if (confirm('¿Borrar todo?')) {
        productos = [];
        guardar();
        render();
    }
}

function ordenarAlfabeticamente() {
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    guardar();
    render();
}

function togglePosicionComprados() {
    compradosAlFinal = !compradosAlFinal;
    render();
}

function manejarEnter(e) {
    if (e.key === 'Enter') agregarProducto();
}

btnAdd.addEventListener('click', agregarProducto);
btnClean.addEventListener('click', limpiarLista);
btnSort.addEventListener('click', ordenarAlfabeticamente);
btnToggleOrder.addEventListener('click', togglePosicionComprados);
inputProducto.addEventListener('keydown', manejarEnter);

render();