const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL

// Generic fetch function
const fetchSheet = async (sheetName) => {
  if (!SCRIPT_URL || SCRIPT_URL === "YOUR_WEB_APP_URL_HERE") {
    console.warn(`Mocking fetch for ${sheetName} from localStorage`);
    const cached = localStorage.getItem(`mock_${sheetName}`);
    return cached ? JSON.parse(cached) : [];
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
    console.warn(`Mocking post for ${action} to localStorage`);
    const parts = action.split('_');
    const op = parts[0]; 
    const sheetName = parts[1];
    
    let currentData = [];
    const cached = localStorage.getItem(`mock_${sheetName}`);
    if (cached) currentData = JSON.parse(cached);
    
    if (op === 'add') {
      currentData.unshift(data);
    } else if (op === 'update') {
      const idx = currentData.findIndex(item => item.id === data.id);
      if (idx !== -1) currentData[idx] = { ...currentData[idx], ...data };
    } else if (op === 'delete') {
      currentData = currentData.filter(item => item.id !== data.id);
    } else if (op === 'replace') {
      currentData = data; // for settings/integrations that send the whole array/object
    }
    
    localStorage.setItem(`mock_${sheetName}`, JSON.stringify(currentData));
    return { success: true };
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
