import React, { useState, useEffect } from "react";
import {
  getAllProducts,
  deleteProduct,
  addProduct,
  updateProduct,
} from "../Services/ProduitServices";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Form } from "react-bootstrap";

function Produit() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProductId, setEditProductId] = useState("");
  const [productData, setProductData] = useState({
    nom: "",
    prix_unitaire: 0,
    quantite: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
      setSearchResults(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      loadProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredProducts = products.filter(
      (product) =>
        product.nom &&
        product.nom.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSearchResults(filteredProducts);
  };

  const handleAddProduct = async () => {
    try {
      await addProduct(productData);
      handleCloseAddModal();
      loadProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProduct = async () => {
    try {
      await updateProduct(editProductId, productData);
      handleCloseEditModal();
      loadProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setProductData({ nom: "", prix_unitaire: 0, quantite: 0 });
  };

  const openEditModal = (productId, product) => {
    setShowEditModal(true);
    setEditProductId(productId);
    setProductData(product);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditProductId("");
    setProductData({ nom: "", prix_unitaire: 0, quantite: 0 });
  };

  return (
    <div className="container">
      <div className="my-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="mb-4">
        <button className="btn btn-primary" onClick={openAddModal}>
          New Product
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Prix</th>
            <th scope="col">Quantité</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((product) => (
            <tr key={product._id}>
              <td>{product.nom}</td>
              <td>{product.prix_unitaire}</td>
              <td>{product.quantite}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => openEditModal(product._id, product)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={productData.nom}
                onChange={(e) =>
                  setProductData({ ...productData, nom: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={productData.prix_unitaire}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    prix_unitaire: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity"
                value={productData.quantite}
                onChange={(e) =>
                  setProductData({ ...productData, quantite: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={productData.nom}
                onChange={(e) =>
                  setProductData({ ...productData, nom: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={productData.prix_unitaire}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    prix_unitaire: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity"
                value={productData.quantite}
                onChange={(e) =>
                  setProductData({ ...productData, quantite: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditProduct}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Produit;
