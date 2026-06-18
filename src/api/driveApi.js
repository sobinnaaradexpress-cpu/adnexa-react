const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL

// Generic fetch function
const fetchSheet = async (sheetName) => {
  if (!SCRIPT_URL || SCRIPT_URL === "YOUR_WEB_APP_URL_HERE") {
    console.error("VITE_GOOGLE_SCRIPT_URL is not configured.");
    return [];
  }
  try {
    const res = await fetch(`${SCRIPT_URL}?action=${sheetName}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(`Failed to fetch ${sheetName}:`, err);
    return [];
  }
}

// Generic POST function
const postSheet = async (action, data) => {
  if (!SCRIPT_URL || SCRIPT_URL === "YOUR_WEB_APP_URL_HERE") {
    console.error("VITE_GOOGLE_SCRIPT_URL is not configured.");
    throw new Error("API URL missing");
  }
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action, data })
    });
    return { success: true };
  } catch (err) {
    console.error(`Failed to post ${action}:`, err);
    throw err;
  }
}

// ==========================================
// EXPORTED API METHODS
// ==========================================

export const fetchUsers = () => fetchSheet('Users');
export const addUser = (data) => postSheet('add_Users', data);
export const updateUser = (data) => postSheet('update_Users', data);
export const deleteUser = (id) => postSheet('delete_Users', { id });

export const fetchTickets = () => fetchSheet('Tickets');
export const updateTicket = (data) => postSheet('update_Tickets', data);

export const fetchBanners = () => fetchSheet('Banners');
export const addBanner = (data) => postSheet('add_Banners', data);
export const deleteBanner = (id) => postSheet('delete_Banners', { id });

export const fetchProducts = () => fetchSheet('Products');
export const addProduct = (data) => postSheet('add_Products', data);
export const updateProduct = (data) => postSheet('update_Products', data);
export const deleteProduct = (id) => postSheet('delete_Products', { id });

export const fetchVendors = () => fetchSheet('Vendors');
export const addVendor = (data) => postSheet('add_Vendors', data);
export const updateVendor = (data) => postSheet('update_Vendors', data);

export const fetchOrders = () => fetchSheet('Orders');
export const addOrder = (data) => postSheet('add_Orders', data);
export const updateOrderStatus = (id, status) => postSheet('update_Orders', { id, status });

export const fetchPayouts = () => fetchSheet('Payouts');
export const updatePayout = (data) => postSheet('update_Payouts', data);

export const fetchSettings = () => fetchSheet('Settings');
export const saveSettings = (data) => postSheet('replace_Settings', data);

export const fetchIntegrations = () => fetchSheet('Integrations');
export const saveIntegrations = (data) => postSheet('replace_Integrations', data);
