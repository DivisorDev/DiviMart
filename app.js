import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔴 YAHAN KEYS DAAL
const supabase = createClient(
  'https://rajmcqxllncobghpahyc.supabase.co/rest/v1/',
  'YOUR_ANON_KEY'
)

// LOAD PRODUCTS
async function loadProducts(){
  let { data } = await supabase.from('products').select('*')

  let html = ''
  data.forEach(p=>{
    html += `
    <div class="card">
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
    </div>`
  })

  document.getElementById('products').innerHTML = html
}

loadProducts()
