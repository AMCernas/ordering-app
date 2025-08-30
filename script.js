import {menuArray} from './data.js'

const container = document.getElementById('container')
const orderData = document.getElementById('order-data')
const modal = document.getElementById('modal')
const orderForm = document.getElementById('order-form')

const orders = {} 

function getMenuHtml(){
    return menuArray.map(function(item){
        return  `
        <section class="item-container">
            <div class="item">
                <h2 class="emoji">${item.emoji}</h2>
                <div class="item-text">
                    <h3>${item.name}</h3>
                    <p>${item.ingredients.join(', ')}</p>
                    <h4>$${item.price}</h4>
                </div>
            </div>
            <button class="add-btn" data-id="${item.id}">+</button>
        </section>
        `
    }).join('')
}
container.innerHTML = getMenuHtml()

container.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-btn')) {
        const id = e.target.getAttribute('data-id')
        orders[id] = (orders[id] || 0) + 1
        renderOrder()
        console.log('add')
    }
})

orderData.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-btn')) {
        const id = e.target.getAttribute('data-id')
        if (orders[id]) {
            orders[id]--
            if (orders[id] === 0) delete orders[id]
            renderOrder()
        }
    }
})

orderForm.addEventListener('submit', function(e) {
    e.preventDefault()
    const fullname = orderForm.elements['fullname'].value
    modal.style.display = 'none'
    orderData.innerHTML = `<h2 class="order-message">Thank you, ${fullname}! Your order is on its way.</h2>`
    for (let id in orders) delete orders[id]
})

function renderOrder() {
    let order = ''
    let total = 0
    const orderIds = Object.keys(orders)
    if (orderIds.length > 0) {
        order += '<h3>Your order</h3>'
        orderIds.forEach(id => {
            const item = menuArray.find(i => i.id == id)
            const itemTotal = item.price * orders[id]
            total += itemTotal
            order += `
                <div class="order-item">
                    <div>
                        <p>${item.name} x ${orders[id]} <button class="remove-btn" data-id="${id}">Remove</button> </p>
                    </div>
                    <p>$${itemTotal}</p>
                </div>
            `
        })
        order += `<div class="display-total"> <h4>Total Price</h4> <h4> $${total}</h4> </div>`
        order += `<button id="process-order-btn" class="process-order-btn">Process Order</button>`
    }
    orderData.innerHTML = order

    // Attach event listener after rendering the button
    const processOrderBtn = document.getElementById('process-order-btn')
    if (processOrderBtn) {
        processOrderBtn.addEventListener('click', function() {
            modal.style.display = 'flex'
        })
    }
}

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none'
    }
})
