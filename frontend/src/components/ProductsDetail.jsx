import React, { use, useEffect, useState } from "react";
import "../css/main.css";
import "../css/util.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../fonts/iconic/css/material-design-iconic-font.min.css";
import { data } from "react-router-dom";

export default function ProductsDetail() {
    const [productDetail, setProductDetail] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (productDetail) => {
        setShow(true);
        setProductDetail(productDetail);
    };

    useEffect(() =>{
        fetch('http://localhost:8080/products')
        .then((res) => res.json())
        .then((data) => {
            setProductDetail(data);
            setLoading(true);
        })
    },[]);
    
    return (
        <div>
            <section className="sec-product-detail bg0 p-t-65 p-b-60">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-lg-7 p-b-30">
                            <div className="p-l-25 p-r-30 p-lr-0-lg">
                                <div className="wrap-slick3 flex-sb flex-w">
                                    <div className="wrap-slick3-dots"></div>
                            
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}