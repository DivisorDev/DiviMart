import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 🔴 YAHAN KEYS DAAL
const supabase = createClient(
  'https://rajmcqxllncobghpahyc.supabase.co/rest/v1/',
  'YOUR_ANON_KEY'
)

window.addProduct = async function(){

  let name = document.getElementById('name').value
  let price = document.getElementById('price').value
  let category = document.getElementById('category').value
  let file = document.getElementById('imageFile').files[0]

  if(!file){
    alert("Select image")
    return
  }

  let fileName = Date.now() + file.name

  // UPLOAD IMAGE
  let { error } = await supabase.storage
    .from('products')
    .upload(fileName, file)

  if(error){
    alert(error.message)
    console.log(error)
    return
  }

  // GET URL
  let { data } = supabase.storage
    .from('products')
    .getPublicUrl(fileName)

  let imageUrl = data.publicUrl

  // INSERT PRODUCT
  let { error: dbError } = await supabase
    .from('products')
    .insert([{
      name,
      price,
      category,
      image: imageUrl
    }])

  if(dbError){
    alert(dbError.message)
    return
  }

  alert("Product Added ✅")
}
