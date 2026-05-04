import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_ANON_KEY'
)

// ================= ADD PRODUCT WITH IMAGE UPLOAD =================
async function addProduct() {
  let name = document.getElementById('name').value
  let price = document.getElementById('price').value
  let category = document.getElementById('category').value
  let file = document.getElementById('imageFile').files[0]

  if (!name || !price || !file) {
    alert("Fill all fields")
    return
  }

  // 🔥 Upload image
  let fileName = Date.now() + "_" + file.name

  let { error: uploadError } = await supabase.storage
    .from('products')
    .upload(fileName, file)

  if (uploadError) {
    alert("Image upload failed")
    return
  }

  // 🔥 Get public URL
  let { data } = supabase.storage
    .from('products')
    .getPublicUrl(fileName)

  let imageUrl = data.publicUrl

  // 🔥 Insert product
  let { error } = await supabase.from('products').insert([{
    name,
    price,
    category,
    image: imageUrl
  }])

  if (error) {
    alert("Product add failed")
    console.log(error)
    return
  }

  alert("Product Added ✅")
  loadProducts()
}

// ================= LOAD PRODUCTS =================
async function loadProducts() {
  let { data } = await supabase.from('products').select('*')

  let html = ''
  data.forEach(p => {
    html += `
      <div class="card">
        <img src="${p.image}" width="80">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <button onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
    `
  })

  document.getElementById('products').innerHTML = html
}

// ================= DELETE =================
async function deleteProduct(id) {
  await supabase.from('products').delete().eq('id', id)
  loadProducts()
}

// ================= LOAD ORDERS =================
async function loadOrders() {
  let { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })

  let html = ''
  data.forEach(o => {
    html += `
      <div class="order-card">
        <h4>${o.customer_name} (${o.phone})</h4>
        <p>${o.address}</p>
        <p>₹${o.total}</p>
        <p>${o.status}</p>
      </div>
    `
  })

  document.getElementById('orders').innerHTML = html
}

// ================= INIT =================
loadProducts()
loadOrders()
