import axios from "axios";

const API_URL = "http://localhost:5000";

const getAllProducts = async () => {
  try {
      const response = await axios.get(`${API_URL}/produit`);
      console.log("Hii : "+response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addProduct = async (product) => {
  try {
    await axios.post(`${API_URL}/produit`, product);
    return "Product added successfully";
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteProduct = async (productId) => {
  try {
    await axios.delete(`${API_URL}/produit/${productId}`);
    return "Product deleted";
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateProduct = async (productId, product) => {
  try {
    await axios.put(`${API_URL}/produit/${productId}`, product);
    return "Product modified done";
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/produit/${productId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  getAllProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  getProductById,
};
