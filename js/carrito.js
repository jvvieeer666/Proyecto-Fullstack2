// =========================
// CARRITO DE COMPRAS
// =========================

// Cargar carrito desde localStorage o iniciar vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

/* =========================
   ELEMENTOS HTML
========================= */

const botonesAgregar = document.querySelectorAll(".btn-agregar");
const carritoHTML = document.getElementById("carrito");
const totalHTML = document.getElementById("total");
const contadorCarrito = document.getElementById("contador-carrito");
const botonVaciar = document.getElementById("vaciar-carrito");
const botonComprar = document.getElementById("comprar-carrito");
const botonAbrir = document.getElementById("abrir-carrito");
const botonCerrar = document.getElementById("cerrar-carrito");
const carritoLateral = document.getElementById("carrito-lateral");
const fondoCarrito = document.getElementById("fondo-carrito");

/* =========================
   GUARDAR EN LOCALSTORAGE
========================= */

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

/* =========================
   ABRIR CARRITO
========================= */

if (botonAbrir) {
    botonAbrir.addEventListener("click", function() {
        carritoLateral.classList.add("abierto");
        fondoCarrito.classList.add("abierto");
    });
}

/* =========================
   CERRAR CARRITO
========================= */

function cerrarCarrito() {
    carritoLateral.classList.remove("abierto");
    fondoCarrito.classList.remove("abierto");
}

if (botonCerrar) {
    botonCerrar.addEventListener("click", cerrarCarrito);
}

if (fondoCarrito) {
    fondoCarrito.addEventListener("click", cerrarCarrito);
}

/* =========================
   AGREGAR PRODUCTOS
========================= */

if (botonesAgregar) {
    botonesAgregar.forEach(function(boton) {
        boton.addEventListener("click", function() {
            let nombre = boton.dataset.nombre;
            let precioTexto = boton.dataset.precio;
            
            // Limpiar el precio (eliminar $, ., CLP, espacios)
            let precio = Number(
                precioTexto
                    .replace("$", "")
                    .replace(/\./g, "")
                    .replace(" CLP", "")
                    .replace("CLP", "")
                    .trim()
            );

            // Si el precio no es un número válido, intentar parsear
            if (isNaN(precio)) {
                precio = Number(precioTexto);
            }

            let productoExistente = carrito.find(function(producto) {
                return producto.nombre === nombre;
            });

            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                carrito.push({
                    nombre: nombre,
                    precio: precio,
                    cantidad: 1
                });
            }

            guardarCarrito();
            mostrarCarrito();

            // ABRIR AUTOMÁTICAMENTE
            carritoLateral.classList.add("abierto");
            fondoCarrito.classList.add("abierto");
        });
    });
}

/* =========================
   MOSTRAR CARRITO
========================= */

function mostrarCarrito() {
    if (!carritoHTML) return;

    carritoHTML.innerHTML = "";

    if (carrito.length === 0) {
        carritoHTML.innerHTML = "<p id='carrito-vacio'>🛒 Tu carrito está vacío.</p>";
        if (totalHTML) totalHTML.textContent = "0";
        if (contadorCarrito) contadorCarrito.textContent = "0";
        return;
    }

    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach(function(producto, indice) {
        let subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        cantidadTotal += producto.cantidad;

        let productoHTML = document.createElement("div");
        productoHTML.classList.add("producto-carrito");

        productoHTML.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio.toLocaleString("es-CL")} CLP</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <button onclick="disminuirCantidad(${indice})">➖</button>
            <button onclick="aumentarCantidad(${indice})">➕</button>
            <button onclick="eliminarProducto(${indice})">🗑️</button>
            <p>Subtotal: $${subtotal.toLocaleString("es-CL")} CLP</p>
        `;

        carritoHTML.appendChild(productoHTML);
    });

    if (totalHTML) totalHTML.textContent = total.toLocaleString("es-CL");
    if (contadorCarrito) contadorCarrito.textContent = cantidadTotal;
}

/* =========================
   AUMENTAR CANTIDAD
========================= */

function aumentarCantidad(indice) {
    carrito[indice].cantidad++;
    guardarCarrito();
    mostrarCarrito();
}

/* =========================
   DISMINUIR CANTIDAD
========================= */

function disminuirCantidad(indice) {
    if (carrito[indice].cantidad > 1) {
        carrito[indice].cantidad--;
    } else {
        carrito.splice(indice, 1);
    }
    guardarCarrito();
    mostrarCarrito();
}

/* =========================
   ELIMINAR PRODUCTO
========================= */

function eliminarProducto(indice) {
    carrito.splice(indice, 1);
    guardarCarrito();
    mostrarCarrito();
}

/* =========================
   VACIAR CARRITO
========================= */

if (botonVaciar) {
    botonVaciar.addEventListener("click", function() {
        if (carrito.length === 0) {
            alert("🛒 Tu carrito ya está vacío.");
            return;
        }
        if (confirm("¿Estás seguro de vaciar el carrito?")) {
            carrito = [];
            guardarCarrito();
            mostrarCarrito();
        }
    });
}

/* =========================
   COMPRAR
========================= */

if (botonComprar) {
    botonComprar.addEventListener("click", function() {
        if (carrito.length === 0) {
            alert("🛒 Tu carrito está vacío.");
            return;
        }

        let total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        
        if (confirm(`💳 Total: $${total.toLocaleString("es-CL")} CLP\n\n¿Confirmas tu compra en LEVEL-UP GAMER?`)) {
            alert("✅ ¡Gracias por tu compra en LEVEL-UP GAMER! 🎮");
            carrito = [];
            guardarCarrito();
            mostrarCarrito();
            cerrarCarrito();
        }
    });
}

/* =========================
   CERRAR CARRITO CON TECLA ESC
========================= */

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        cerrarCarrito();
    }
});

/* =========================
   INICIAR
========================= */

mostrarCarrito();