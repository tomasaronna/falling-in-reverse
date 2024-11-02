let boton_carrito = document.querySelector('.boton-carrito');
let carrito_container = document.querySelector('.carrito');
let boton_cerrar = document.querySelector('.cerrar');

// Funciones para mostrar y cerrar el carrito
boton_carrito.addEventListener('click', () => {
    carrito_container.classList.add('carrito_mostrar');
});

boton_cerrar.addEventListener('click', () => {
    carrito_container.classList.remove('carrito_mostrar');
});

// Función para borrar el carrito completo
function borrarCarrito() {
    localStorage.removeItem('carrito'); // Borrar el carrito de localStorage
    renderizarCarrito(); // Vuelve a renderizar para mostrar el carrito vacío
}

// Seleccionar el botón de borrar carrito (asegúrate de tener un botón con la clase 'borrar_carrito' en tu HTML)
const boton_borrar_carrito = document.querySelector('.borrar_carrito');

// Agregar el evento al botón de borrar carrito
if (boton_borrar_carrito) {
    boton_borrar_carrito.addEventListener('click', borrarCarrito);
}


// Cargar el carrito desde localStorage al iniciar
function cargarCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function actualizarLocalStorage(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function renderizarCarrito() {
    const carritoContenido = document.querySelector('.carrito_container');
    carritoContenido.innerHTML = '';

    const carrito = cargarCarrito(); // Cargar el carrito desde localStorage

    if (carrito.length === 0) {
        carritoContenido.innerHTML = '<p>El carrito está vacío.</p>';
        document.querySelector('.total h3').textContent = "$ 0"; // Mostrar $0 si está vacío
        return;
    }

    let total = 0; // Reinicializar total a 0

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

    // Selecciona todos los botones después de haber agregado todos los productos
    const botonesEliminar = document.querySelectorAll('.eliminar');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', () => {
            const productoNombre = boton.getAttribute('data-producto');
            const inputEliminar = boton.previousElementSibling; // Selecciona el input de cantidad
            const cantidadAEliminar = parseInt(inputEliminar.value); // Obtiene la cantidad a eliminar
            eliminarProducto(productoNombre, cantidadAEliminar);
        });
    });

    // Actualiza el total
    const totalElement = document.querySelector('.total h3');
    totalElement.textContent = "$ " + Math.floor(total); // Total como número entero
}

function eliminarProducto(productoNombre, cantidadAEliminar) {
    let carrito = cargarCarrito(); // Cargar el carrito desde localStorage

    const existingProductIndex = carrito.findIndex(item => item.producto === productoNombre);
    if (existingProductIndex > -1) {
        // Reduce la cantidad del carrito
        carrito[existingProductIndex].cantidad -= cantidadAEliminar;

        // Si la cantidad llega a cero, elimina el producto del carrito
        if (carrito[existingProductIndex].cantidad <= 0) {
            carrito.splice(existingProductIndex, 1); // Elimina el producto
        }

        actualizarLocalStorage(carrito); // Actualiza el localStorage
        renderizarCarrito(); // Vuelve a renderizar el carrito para actualizar el total
    }
}

// Cargar los productos y renderizar el carrito al inicio
let products = []; // Asegúrate de inicializar como un array.

fetch('../products.json')
    .then(response => response.json())
    .then(data => {
        products = data; // Aquí se carga el array de productos.

        renderizarCarrito(); // Renderiza el carrito inicial

        // Código para manejar las cantidades de los productos
        let cantidadViniloInput = document.querySelector('.contador-vinilo');
        let cantidadCDInput = document.querySelector('.contador-cd');
        let cantidadRemeraInput = document.querySelector('.contador-remera');

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

        // Aumentar y disminuir cantidades de productos
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

        // Agregar productos al carrito
        botonAgregarCarrito.forEach((boton, index) => {
            if (products[index]) {
                boton.addEventListener('click', () => {
                    const productoSeleccionado = products[index];

                    if (productoSeleccionado) {
                        const cantidadInput = document.querySelector(`.contador-${productoSeleccionado.producto.toLowerCase()}`);

                        if (cantidadInput && cantidadInput.value > 0) {
                            const cantidad = parseInt(cantidadInput.value); // Asegúrate de usar la cantidad como entero

                            let carrito = cargarCarrito(); // Cargar el carrito actual

                            const existingProductIndex = carrito.findIndex(item => item.producto === productoSeleccionado.producto);
                            if (existingProductIndex > -1) {
                                let nuevaCantidad = carrito[existingProductIndex].cantidad + cantidad;
                                let stockDisponible = productoSeleccionado.stock;

                                // Asegúrate de que no exceda el stock
                                if (nuevaCantidad <= stockDisponible) {
                                    carrito[existingProductIndex].cantidad = nuevaCantidad;
                                } else {
                                    carrito[existingProductIndex].cantidad = stockDisponible;
                                    console.log(`Cantidad ajustada al máximo disponible para ${productoSeleccionado.producto}`);
                                }
                            } else {
                                // Si no existe en el carrito, agrégalo
                                carrito.push({
                                    producto: productoSeleccionado.producto,
                                    cantidad: cantidad,
                                    imagen: productoSeleccionado.imagen // Asegúrate de incluir la imagen
                                });
                            }

                            actualizarLocalStorage(carrito); // Actualiza el localStorage
                            renderizarCarrito(); // Renderiza el carrito
                            console.log(carrito);
                        }
                    } else {
                        console.error(`Producto no encontrado`);
                    }
                });
            } else {
                console.error(`Producto no encontrado en el índice ${index}`);
            }
        });
    })
    .catch(error => console.error('Error fetching products:', error));
