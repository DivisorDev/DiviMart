import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔴 YAHAN KEYS DAAL
const supabase = createClient(
  'https://rajmcqxllncobghpahyc.supabase.co/rest/v1/',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJham1jcXhsbG5jb2JnaHBhaHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTUzNTcsImV4cCI6MjA5MzQ5MTM1N30.AOzf2qjUxN9lsksC-cM7MwCosNYd60QB42g6ZT2ajpU'
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
