// using native fetch
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTs-TKBoqAIJHVHrSKI0b_jUPggdNc42H9g4DKW6d1LoKJ1Xx_1j8o9bRhiOvBah-R/exec';

async function runTests() {
  console.log("Starting E2E Tests for Google Drive Database...");

  // 1. Test POST: Add Product
  console.log("\n[1/5] Testing POST - Adding a Product...");
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'addProduct',
        data: {
          id: 'PROD-' + Date.now(),
          name: 'Handcrafted Pashmina Shawl',
          vendor: 'Himalayan Weavers',
          price: 4500,
          category: 'Clothing',
          image: 'https://images.unsplash.com/photo-1520627582522-82ab81116c4e?w=500&q=80',
          stock: 25,
          sales: 5
        }
      })
    });
    const text = await res.text();
    console.log("Add Product Response:", text);
  } catch (err) {
    console.error("Failed to add product:", err.message);
  }

  // 2. Test GET: Fetch Products
  console.log("\n[2/5] Testing GET - Fetching Products...");
  try {
    const res = await fetch(`${SCRIPT_URL}?action=Products`);
    const data = await res.json();
    console.log(`Successfully fetched ${data.data?.length || 0} products.`);
    if (data.data?.length > 0) console.log("Sample:", data.data[data.data.length - 1].name);
  } catch (err) {
    console.error("Failed to fetch products:", err.message);
  }

  // 3. Test POST: Add Order
  console.log("\n[3/5] Testing POST - Adding an Order...");
  const orderId = 'ORD-' + Date.now();
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'addOrder',
        data: {
          id: orderId,
          customer: 'Aayush Shrestha',
          total: 4500,
          status: 'Pending',
          date: new Date().toISOString().split('T')[0]
        }
      })
    });
    const text = await res.text();
    console.log("Add Order Response:", text);
  } catch (err) {
    console.error("Failed to add order:", err.message);
  }

  // 4. Test POST: Update Order Status
  console.log("\n[4/5] Testing POST - Updating Order Status...");
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateOrderStatus',
        data: {
          id: orderId,
          status: 'Shipped'
        }
      })
    });
    const text = await res.text();
    console.log("Update Status Response:", text);
  } catch (err) {
    console.error("Failed to update status:", err.message);
  }

  // 5. Test GET: Fetch Orders
  console.log("\n[5/5] Testing GET - Fetching Orders...");
  try {
    const res = await fetch(`${SCRIPT_URL}?action=Orders`);
    const data = await res.json();
    console.log(`Successfully fetched ${data.data?.length || 0} orders.`);
    const updatedOrder = data.data?.find(o => o.id === orderId);
    if (updatedOrder) {
      console.log(`Order ${orderId} status verified as: ${updatedOrder.status}`);
    }
  } catch (err) {
    console.error("Failed to fetch orders:", err.message);
  }

  console.log("\nTests Complete!");
}

runTests();
