const guardado = localStorage.getItem('listaCompra');
let productos = guardado ? JSON.parse(guardado) : [];

const inputProducto = document.getElementById('inputProducto');
const listaProductos = document.getElementById('listaProductos');
const btnAdd = document.getElementById('btnAdd');
const btnClean = document.getElementById('btnClean');
const btnSort = document.getElementById('btnSort');

function guardarEnStorage() {
    localStorage.setItem('listaCompra', JSON.stringify(productos));
}

function render() {
    listaProductos.innerHTML = ''; 

    productos.forEach((producto, index) => {
        const li = document.createElement('li');
        const texto = document.createElement('span');
        const btnDelete = document.createElement('button');

        texto.textContent = producto;
        btnDelete.textContent = 'Eliminar';
        btnDelete.className = 'btn-delete'
        btnDelete.onclick = () => eliminarProducto(index);

        li.appendChild(texto);
        li.appendChild(btnDelete);
        listaProductos.appendChild(li);
    });
}

function agregarProducto() {
    const valor = inputProducto.value.trim();

    if (valor === '') {
        alert('Por favor, escribe un producto.');
        return;
    }

    if (productos.includes(valor)) {
        alert('¡Este producto ya está en la lista!');
        return;
    }

    productos.push(valor);
    
    guardarEnStorage();
    inputProducto.value = '';
    render();
}

function eliminarProducto(index) {
    productos.splice(index, 1); 
    guardarEnStorage();
    render();
}

function limpiarLista() {
    if (productos.length === 0) return; 

    if (confirm('¿Seguro que quieres borrar toda la lista?')) {
        productos = [];
        guardarEnStorage();
        render();
    }
}

function ordenarLista() {
    productos.sort();
    guardarEnStorage();
    render();
}

function manejarEnter(event) {
    if (event.key === 'Enter') {
        agregarProducto();
    }
}

btnAdd.addEventListener('click', agregarProducto);
btnClean.addEventListener('click', limpiarLista);
btnSort.addEventListener('click', ordenarLista);
inputProducto.addEventListener('keydown', manejarEnter);

render();