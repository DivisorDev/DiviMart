import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔴 YAHAN APNI KEYS DAAL
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_ANON_KEY'
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

  // 🔥 SAFE FILE NAME (no spaces)
  let fileName = Date.now() + "_" + file.name.replaceAll(" ", "_")

  // 🔥 UPLOAD (NO FOLDER → ERROR FIX)
  let { error: uploadError } = await supabase.storage
    .from('products')
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type
    })

  if (uploadError) {
    alert("Upload error: " + uploadError.message)
    console.log(uploadError)
    return
  }

  // 🔥 GET PUBLIC URL
  let { data } = supabase.storage
    .from('products')
    .getPublicUrl(fileName)

  let imageUrl = data.publicUrl

  // 🔥 INSERT INTO DB
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
