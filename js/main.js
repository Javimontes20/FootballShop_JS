const productContainer = document.querySelector('.productContainer-js');
const cartIcon = document.querySelector('.fa-cart-shopping');
const cartContainer = document.querySelector('.cartContainer');
const closeCartButton = document.querySelector('.closeCart');
let cart = [];

// Recorrer el array de productos y crear dinámicamente los productos
footballShopItems.forEach(item => {
    const productCard = document.createElement('div');
    productCard.classList.add('productCard-js');
    productCard.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}">
        <h3>${item.nombre}</h3>
        <p>${item.descripcion}</p>
        <p>Precio: €${item.precio}</p>
        <p>Stock: ${item.stock}</p>
        <button class="addToCartButton-js" data-id="${item.id}">Agregar al Carrito</button>
    `;
    productContainer.appendChild(productCard);
});

// Escuchar clic en "Agregar al carrito"
productContainer.addEventListener('click', event => {
    if (event.target.classList.contains('addToCartButton-js')) {
        const productId = parseInt(event.target.dataset.id);
        const product = footballShopItems.find(item => item.id === productId);

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        if (existingProductIndex !== -1) {
            // Si ya está en el carrito, aumentar la cantidad
            cart[existingProductIndex].quantity += 1;
        } else {
            // Si no está en el carrito, agregarlo con cantidad 1
            cart.push({ ...product, quantity: 1 });
        }

        // Abrir el carrito automáticamente
        cartContainer.style.display = 'block';

        // Actualizar el carrito visualmente
        renderCart();

        // Confirmación de que el producto fue agregado al carrito
        alert(`Producto "${product.nombre}" agregado al carrito.`);
    }
});

// Función para renderizar el carrito
function renderCart() {
    const cartItemsContainer = document.querySelector('.cartItems');
    cartItemsContainer.innerHTML = '';
    let total = 0;

    // Recorrer los productos en el carrito y mostrar sus detalles
    cart.forEach(product => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cartItem');
        cartItemDiv.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}" width="50">
            <h4>${product.nombre}</h4>
            <p>Precio: €${product.precio}</p>
            <p>Cantidad: <input type="number" class="quantityInput" data-id="${product.id}" value="${product.quantity}" min="1" max="${product.stock}" /></p>
            <p>Subtotal: €<span class="subtotal">${(product.precio * product.quantity).toFixed(2)}</span></p>
            <button class="removeItem" data-id="${product.id}">Eliminar</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);

        total += product.precio * product.quantity;
    });

    // Actualizar el total
    document.querySelector('.totalPrice').textContent = total.toFixed(2);

    // Escuchar cambios de cantidad en el carrito
    document.querySelectorAll('.quantityInput').forEach(input => {
        input.addEventListener('input', event => {
            const productId = parseInt(event.target.dataset.id);
            const newQuantity = parseInt(event.target.value);
            const product = cart.find(item => item.id === productId);
            const subtotalElement = event.target.closest('div').querySelector('.subtotal');

            if (newQuantity <= product.stock && newQuantity > 0) {
                product.quantity = newQuantity; // Actualizar la cantidad del producto
                subtotalElement.textContent = (product.precio * newQuantity).toFixed(2);
                updateTotal();
            } else {
                // Si la cantidad es mayor que el stock, revertir al valor máximo
                event.target.value = product.quantity;
            }
        });
    });

    // Escuchar clic en "Eliminar" para remover un producto del carrito
    document.querySelectorAll('.removeItem').forEach(button => {
        button.addEventListener('click', event => {
            const productId = parseInt(event.target.dataset.id);
            removeFromCart(productId);
            renderCart();
        });
    });
}

// Función para actualizar el total
function updateTotal() {
    let total = 0;
    cart.forEach(product => {
        total += product.precio * product.quantity;
    });
    document.querySelector('.totalPrice').textContent = total.toFixed(2);
}

// Eliminar un producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
}

// Cerrar el carrito
closeCartButton.addEventListener('click', () => {
    cartContainer.style.display = 'none';
});

// Mostrar/ocultar el carrito al hacer clic en el icono del carrito
cartIcon.addEventListener('click', () => {
    cartContainer.style.display = cartContainer.style.display === 'none' ? 'block' : 'none';
});

// Vaciar el carrito
document.querySelector('.emptyCart').addEventListener('click', () => {
    cart = [];
    renderCart();
});

// Comprar
document.querySelector('.checkout').addEventListener('click', () => {
    if (cart.length > 0) {
        alert('¡Gracias por su compra!');
        cart = [];
        renderCart();
    } else {
        alert('¡El carrito está vacío!');
    }
});
