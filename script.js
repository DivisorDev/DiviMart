import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔴 Yaha apni details daal
const supabase = createClient(
  'https://rajmcqxllncobghpahyc.supabase.co/rest/v1/',
  'YOUR_ANON_KEY'
)

let cart = []

// 🔥 PRODUCTS LOAD
async function loadProducts() {
  let { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.log(error)
    return
  }

  let html = ''

  data.forEach(p => {
    html += `
      <div class="card">
        <img src="${p.image}" width="100%">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart('${p.id}','${p.name}',${p.price})">Add</button>
      </div>
    `
  })

  document.getElementById('products').innerHTML = html
}

// 🛒 CART
function addToCart(id, name, price) {
  cart.push({ id, name, price, qty: 1 })
  alert(name + " added")
}

// 📦 PLACE ORDER
async function placeOrder() {
  let name = document.getElementById('name').value
  let phone = document.getElementById('phone').value
  let address = document.getElementById('address').value
  let payment = document.getElementById('payment').value

  let total = cart.reduce((sum, i) => sum + i.price, 0)

  // 👉 delivery charge logic
  if (total < 299) total += 20

  let { data: order, error } = await supabase
    .from('orders')
    .insert([{
      customer_name: name,
      phone,
      address,
      total,
      payment
    }])
    .select()

  if (error) {
    alert("Error placing order")
    return
  }

  let orderId = order[0].id

  let items = cart.map(i => ({
    order_id: orderId,
    product_name: i.name,
    price: i.price,
    qty: i.qty
  }))

  await supabase.from('order_items').insert(items)

  alert("Order Placed Successfully 🎉")
}

loadProducts()
