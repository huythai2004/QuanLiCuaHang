import React from "react";
import { useState, useEffect } from "react";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [sku, setSku] = useState("");
    const [name, setName] = useState (" ");
    const [description, setDescription] = useState(" "); 
    const [price, setPrice] = useState(" ");
    const [stockQty, setStockQty] = useState([]);
    const [images, setImages] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const API = "http://localhost:8080/products";

    //Get all data products
    const fetchProducts = async() => {
        try {
            const res = await fetch(API);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error When getting products data", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    //CRUD products
    
}