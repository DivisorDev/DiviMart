import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔴 Yaha apni Supabase details daal
const supabase = createClient(
  'https://rajmcqxllncobghpahyc.supabase.co/rest/v1/',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJham1jcXhsbG5jb2JnaHBhaHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTUzNTcsImV4cCI6MjA5MzQ5MTM1N30.AOzf2qjUxN9lsksC-cM7MwCosNYd60QB42g6ZT2ajpU'
)

let cart = JSON.parse(localStorage.getItem("cart")) || []

// ================= LOAD PRODUCTS =================
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

// ================= ADD TO CART =================
window.addToCart = function(id, name, price) {
  cart.push({ id, name, price, qty: 1 })
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCart()
  alert(name + " added to cart")
}

// ================= CART COUNT =================
function updateCart() {
  let count = cart.length
  let el = document.getElementById("cartCount")
  if (el) el.innerText = count + " Items"
}

// ================= CHECKOUT PAGE =================
window.placeOrder = async function() {

  let name = document.getElementById('name').value
  let phone = document.getElementById('phone').value
  let address = document.getElementById('address').value
  let payment = document.getElementById('payment').value

  if (!name || !phone || !address) {
    alert("Please fill all fields")
    return
  }

  let total = cart.reduce((sum, i) => sum + i.price, 0)

  if (total < 299) total += 20

  // 🔥 INSERT ORDER
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
    alert("Order failed")
    console.log(error)
    return
  }

  let orderId = order[0].id

  // 🔥 INSERT ITEMS
  let items = cart.map(i => ({
    order_id: orderId,
    product_name: i.name,
    price: i.price,
    qty: i.qty
  }))

  await supabase.from('order_items').insert(items)

  alert("Order Placed Successfully 🎉")

  localStorage.removeItem("cart")
  window.location.href = "index.html"
}

// ================= NAVIGATION =================
window.goCheckout = function() {
  window.location.href = "checkout.html"
}

// ================= INIT =================
loadProducts()
updateCart()
