let boton_carrito = document.querySelector('.boton-carrito');
let carrito_container = document.querySelector('.carrito');
let boton_cerrar = document.querySelector('.cerrar');

boton_carrito.addEventListener('click', () => {
    carrito_container.classList.add('carrito_mostrar');
});

boton_cerrar.addEventListener('click', () => {
    carrito_container.classList.remove('carrito_mostrar');
});

function borrarCarrito() {
    let carrito = cargarCarrito();

    carrito.forEach(item => {
        const productoStock = products.find(prod => prod.producto === item.producto);
        if (productoStock) {
            productoStock.stock += item.cantidad;
        }
    });

    localStorage.removeItem('carrito');
    renderizarCarrito();
}


const boton_borrar_carrito = document.querySelector('.borrar_carrito');

boton_borrar_carrito.addEventListener('click', borrarCarrito);

function finalizarCompra() {

    if (localStorage.getItem('carrito')) {
        Toastify({
            text: "¡Compra finalizada!",
            duration: 3000,
            style: {
                background: "#1aa179"
            }
        }).showToast()
    } else {
        Toastify({
            text: "No hay productos en el carrito",
            duration: 3000,
            style: {
                background: "#DC3545"
            }
        }).showToast()

    }
    borrarCarrito()
}

const finalizar_compra_carrito = document.querySelector(".fin")
finalizar_compra_carrito.addEventListener('click', finalizarCompra)

function cargarCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function actualizarLocalStorage(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function renderizarCarrito() {
    const carritoContenido = document.querySelector('.carrito_container');
    carritoContenido.innerHTML = '';

    const carrito = cargarCarrito();

    if (carrito.length === 0) {
        carritoContenido.innerHTML = '<p>El carrito está vacío.</p>';
        document.querySelector('.total h3').textContent = "$ 0";
        return;
    }

    let total = 0;

    carrito.forEach(item => {
        const productoSeleccionado = products.find(prod => prod.producto === item.producto);

        if (productoSeleccionado) {
            total += productoSeleccionado.precio * item.cantidad;
            const productoElement = document.createElement('div');
            productoElement.classList.add('producto-carrito');
            productoElement.innerHTML = `
                <img src="${item.imagen}">
                <p>Producto: ${item.producto}</p>
                <p>Cantidad: ${item.cantidad}</p>
                <input type="number" class="cantidad-eliminar" value="1" min="1" max="${item.cantidad}">
                <button class="eliminar" data-producto="${item.producto}">Eliminar</button>
            `;
            carritoContenido.appendChild(productoElement);
        }
    });

    const botonesEliminar = document.querySelectorAll('.eliminar');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', () => {
            const productoNombre = boton.getAttribute('data-producto');
            const inputEliminar = boton.previousElementSibling;
            const cantidadAEliminar = parseInt(inputEliminar.value);
            eliminarProducto(productoNombre, cantidadAEliminar);
        });
    });

    const totalElement = document.querySelector('.total h3');
    totalElement.textContent = "$ " + Math.floor(total);
}

function eliminarProducto(productoNombre, cantidadAEliminar) {
    let carrito = cargarCarrito();

    const existingProductIndex = carrito.findIndex(item => item.producto === productoNombre);
    if (existingProductIndex > -1) {
        const productoDelCarrito = carrito[existingProductIndex];

        const productoStock = products.find(prod => prod.producto === productoNombre);
        if (productoStock) {
            productoStock.stock += productoDelCarrito.cantidad;

            if (productoDelCarrito.cantidad <= cantidadAEliminar) {
                carrito.splice(existingProductIndex, 1);
            } else {
                carrito[existingProductIndex].cantidad -= cantidadAEliminar;
            }
        }

        actualizarLocalStorage(carrito);
        renderizarCarrito();
    }
}

let products = [];

fetch('https://tomasaronna.github.io/falling-in-reverse/products.json')
    .then(response => response.json())
    .then(data => {
        products = data;

        renderizarCarrito();

        let cantidadViniloInput = document.querySelector('.contador-1');
        let cantidadCDInput = document.querySelector('.contador-2');
        let cantidadRemeraInput = document.querySelector('.contador-3');

        let masVinilo = document.querySelector('.mas-vinilo');
        let menosVinilo = document.querySelector('.menos-vinilo');
        let masCD = document.querySelector('.mas-cd');
        let menosCD = document.querySelector('.menos-cd');
        let masRemera = document.querySelector('.mas-remera');
        let menosRemera = document.querySelector('.menos-remera');

        let botonAgregarCarrito = document.querySelectorAll('.agregar');

        cantidadViniloInput.max = products[0].stock;
        cantidadCDInput.max = products[1].stock;
        cantidadRemeraInput.max = products[2].stock;

        masVinilo.addEventListener('click', () => {
            if (parseInt(cantidadViniloInput.value) < products[0].stock) {
                cantidadViniloInput.value = parseInt(cantidadViniloInput.value) + 1;
            }
        });

        menosVinilo.addEventListener('click', () => {
            if (parseInt(cantidadViniloInput.value) > 0) {
                cantidadViniloInput.value = parseInt(cantidadViniloInput.value) - 1;
            }
        });

        masCD.addEventListener('click', () => {
            if (parseInt(cantidadCDInput.value) < products[1].stock) {
                cantidadCDInput.value = parseInt(cantidadCDInput.value) + 1;
            }
        });

        menosCD.addEventListener('click', () => {
            if (parseInt(cantidadCDInput.value) > 0) {
                cantidadCDInput.value = parseInt(cantidadCDInput.value) - 1;
            }
        });

        masRemera.addEventListener('click', () => {
            if (parseInt(cantidadRemeraInput.value) < products[2].stock) {
                cantidadRemeraInput.value = parseInt(cantidadRemeraInput.value) + 1;
            }
        });

        menosRemera.addEventListener('click', () => {
            if (parseInt(cantidadRemeraInput.value) > 0) {
                cantidadRemeraInput.value = parseInt(cantidadRemeraInput.value) - 1;
            }
        });

        let stock_producto = document.querySelectorAll('.stock-producto')


        for (let i = 0; i < products.length; i++) {
            let stock = products[i].stock
            stock_producto[i].innerText = `Stock: ${stock}`
        }

        botonAgregarCarrito.forEach((boton, index) => {
            if (products[index]) {
                boton.addEventListener('click', () => {
                    const productoSeleccionado = products[index];

                    if (productoSeleccionado) {
                        const cantidadInput = document.querySelector(`.contador-${productoSeleccionado.id}`);

                        if (cantidadInput && cantidadInput.value > 0) {
                            const cantidad = parseInt(cantidadInput.value);

                            if (productoSeleccionado.stock >= cantidad) {
                                productoSeleccionado.stock -= cantidad;

                                let carrito = cargarCarrito();
                                const existingProductIndex = carrito.findIndex(item => item.producto === productoSeleccionado.producto);
                                if (existingProductIndex > -1) {
                                    carrito[existingProductIndex].cantidad += cantidad;
                                } else {
                                    carrito.push({
                                        producto: productoSeleccionado.producto,
                                        cantidad: cantidad,
                                        imagen: productoSeleccionado.imagen
                                    });
                                }

                                Toastify({
                                    text: `Se agregó ${productoSeleccionado.producto} al carrito`,
                                    duration: 3000
                                }).showToast();

                                actualizarLocalStorage(carrito);
                                renderizarCarrito();

                                const stockElement = document.querySelector(`.stock-producto[data-producto-id="${productoSeleccionado.id}"]`);
                                if (stockElement) {
                                    stockElement.innerText = `Stock: ${productoSeleccionado.stock}`;
                                }
                            } else {
                                Swal.fire({
                                    icon: "warning",
                                    title: "Sin stock",
                                    text: `No hay suficiente stock de ${productoSeleccionado.producto}. Disponible: ${productoSeleccionado.stock}`
                                });
                            }
                        }
                    }
                });
            }
        });

    })
    .catch(error => console.error('Error al obtener los productos.', error));
