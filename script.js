class Item {
    constructor(name) {
        this.name = name;
        this.purchased = false;
        this.count = 1;
    }

    toggle() {
        this.purchased = !this.purchased;
    }

    sumar() {
        if (!this.purchased) {
            this.count++;
        }
    }

    restar() {
        if (!this.purchased && this.count > 0) {
            this.count--;
        }
    }
}

let productos = [];
let compradosAlFinal = true;

const guardado = localStorage.getItem('listaCompra');
if (guardado) {
    const rawData = JSON.parse(guardado);
    productos = rawData.map(p => {
        const nombre = p.name || p.nombre;
        const item = new Item(nombre);
        item.purchased = (p.purchased !== undefined) ? p.purchased : p.comprado;
        item.count = (p.count !== undefined) ? p.count : (p.cantidad || 1);
        return item;
    });
}

const inputProducto = document.getElementById('inputProducto');
const listaProductos = document.getElementById('listaProductos');
const btnAdd = document.getElementById('btnAdd');
const btnClean = document.getElementById('btnClean');
const btnSort = document.getElementById('btnSort');
const btnToggleOrder = document.getElementById('btnToggleOrder');

function guardar() {
    localStorage.setItem('listaCompra', JSON.stringify(productos));
}

function render() {
    const pendientes = productos.filter(p => !p.purchased);
    const comprados = productos.filter(p => p.purchased);

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
        spanNombre.textContent = item.name;
        spanNombre.className = 'prod-name';

        const qtyControls = document.createElement('div');
        qtyControls.className = 'qty-controls';

        const btnMinus = document.createElement('button');
        btnMinus.textContent = '-';
        btnMinus.className = 'qty-btn';

        const spanQty = document.createElement('span');
        spanQty.textContent = item.count;
        spanQty.className = 'qty-span';

        const btnPlus = document.createElement('button');
        btnPlus.textContent = '+';
        btnPlus.className = 'qty-btn';

        if (item.purchased) {
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

    const existe = productos.some(p => p.name.toLowerCase() === valor.toLowerCase());
    if (existe) {
        alert('¡Ya está en la lista!');
        return;
    }

    productos.push(new Item(valor));

    guardar();
    inputProducto.value = '';
    render();
}

function incrementarCantidad(index) {
    productos[index].sumar();
    guardar();
    render();
}

function decrementarCantidad(index) {
    productos[index].restar();

    if (productos[index].count === 0) {
        eliminarProducto(index);
        return;
    }
    guardar();
    render();
}

function toggleComprado(index) {
    productos[index].toggle();
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
    productos.sort((a, b) => a.name.localeCompare(b.name));
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