import React, { useState, useEffect } from "react";
import {
  getAllProducts,
  deleteProduct,
  addProduct,
  updateProduct,
} from "../Services/ProduitServices";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Form } from "react-bootstrap";

import io from "socket.io-client";

function Produit() {

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => { 
    const socket = io("http://localhost:3000");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("newMessage", (data) => {
      console.log("Received newMessage event:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);  

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




  const handleSendMessage = () => {
    if (socket && newMessage.trim() !== "") {
      socket.emit("newMessage", { message: newMessage });
      setNewMessage("");
    }
  };

  return (
    <div className="container">
      <h1>WebSocket Messages</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message.message}</div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send Message</button>
      </div>

      <h1 className="text-center" style={{ margin: "70px" }}>
        Products
      </h1>
      <div className="mb-8">
        <input
          style={{ width: "300px", float: "right" }}
          type="text"
          className="form-control"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          className="btn btn-primary"
          onClick={openAddModal}
          style={{ float: "right", marginRight: "10px" }}
        >
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
                  style={{ marginRight: "10px" }}
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
