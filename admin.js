import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔴 YAHAN APNI KEYS DAAL
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJham1jcXhsbG5jb2JnaHBhaHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTUzNTcsImV4cCI6MjA5MzQ5MTM1N30.AOzf2qjUxN9lsksC-cM7MwCosNYd60QB42g6ZT2ajpU'
)

// ================= ADD PRODUCT =================
window.addProduct = async function () {

  let name = document.getElementById('name').value
  let price = document.getElementById('price').value
  let category = document.getElementById('category').value
  let file = document.getElementById('imageFile').files[0]

  if (!name || !price || !file) {
    alert("Fill all fields + select image")
    return
  }

  // 🔥 UNIQUE FILE NAME
  let fileName = Date.now() + "_" + file.name

  // 🔥 UPLOAD (FIXED PATH)
  let { error: uploadError } = await supabase.storage
    .from('products')
    .upload('public/' + fileName, file)

  if (uploadError) {
    alert("Upload error: " + uploadError.message)
    console.log(uploadError)
    return
  }

  // 🔥 GET PUBLIC URL (FIXED PATH)
  let { data } = supabase.storage
    .from('products')
    .getPublicUrl('public/' + fileName)

  let imageUrl = data.publicUrl

  // 🔥 INSERT INTO DATABASE
  let { error: dbError } = await supabase
    .from('products')
    .insert([{
      name,
      price,
      category,
      image: imageUrl
    }])

  if (dbError) {
    alert("Database error: " + dbError.message)
    console.log(dbError)
    return
  }

  alert("✅ Product Added Successfully")

  // 🔄 reset form
  document.getElementById('name').value = ''
  document.getElementById('price').value = ''
  document.getElementById('category').value = ''
  document.getElementById('imageFile').value = ''
}
