import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_ANON_KEY'
)

// ================= LOAD PRODUCTS =================
async function loadProducts() {
  let { data, error } = await supabase.from('products').select('*')

  if (error) return console.log(error)

  let html = ''

  data.forEach(p => {
    html += `
      <div class="card">
        <img src="${p.image}" width="80">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <p>${p.category}</p>

        <button onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
    `
  })

  document.getElementById('products').innerHTML = html
}

// ================= ADD PRODUCT =================
async function addProduct() {
  let name = document.getElementById('name').value
  let price = document.getElementById('price').value
  let category = document.getElementById('category').value
  let image = document.getElementById('image').value

  if (!name || !price) {
    alert("Fill all fields")
    return
  }

  await supabase.from('products').insert([{
    name,
    price,
    category,
    image
  }])

  alert("Product Added ✅")
  loadProducts()
}

// ================= DELETE PRODUCT =================
async function deleteProduct(id) {
  await supabase.from('products').delete().eq('id', id)
  loadProducts()
}

// ================= LOAD ORDERS =================
async function loadOrders() {
  let { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return console.log(error)

  let html = ''

  data.forEach(o => {
    html += `
      <div class="order-card">
        <h4>${o.customer_name} (${o.phone})</h4>
        <p>${o.address}</p>
        <p>Total: ₹${o.total}</p>
        <p>Payment: ${o.payment}</p>
        <p>Status: ${o.status}</p>

        <button onclick="updateStatus('${o.id}','delivered')">Mark Delivered</button>
        <button onclick="deleteOrder('${o.id}')">Delete</button>
      </div>
    `
  })

  document.getElementById('orders').innerHTML = html
}

// ================= UPDATE STATUS =================
async function updateStatus(id, status) {
  await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)

  loadOrders()
}

// ================= DELETE ORDER =================
async function deleteOrder(id) {
  await supabase.from('orders').delete().eq('id', id)
  loadOrders()
}

// ================= EARNINGS =================
async function loadEarnings() {
  let { data } = await supabase.from('orders').select('total')

  let total = 0
  data.forEach(o => total += o.total)

  document.getElementById('earnings').innerText = "Total Earnings: ₹" + total
}

// ================= INIT =================
loadProducts()
loadOrders()
loadEarnings()

// 🔥 AUTO REFRESH (every 10 sec)
setInterval(() => {
  loadOrders()
  loadEarnings()
}, 10000)
