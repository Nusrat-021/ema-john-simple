import React, { useEffect, useState } from 'react';
import Product from '../Product/Product';
import './Shop.css';
import Cart from '../Cart/Cart';
import { addToDb, getShoppingCart } from '../../utilities/fakedb';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('products.json')
      .then(res => res.json())
      .then(data => setProducts(data))
  }, []);

  useEffect(() => {
    const storedCart = getShoppingCart();
    const savedCart =[];
    // step 1: get id of the addedProduct
    for (const id in storedCart) {
      // product details in object

      // step 2: get product from products state by using id
      const addedProduct = products.find(product => product.id === id);
      if (addedProduct) {
        // step 3: get quantity of the product
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        // step 4: add the added product to the saved cart
        savedCart.push(addedProduct);
      }
      // step 5: set the cart
      setCart(savedCart);
    }
  }, [products]);

  const handleAddToCart = (product) => {
    // const newCart = [...cart, product];
    let newCart = [];
    const exists = cart.find(pd => pd.id === product.id);
    if(!exists){
      product.quantity =1;
      newCart = [...cart,product];
    }
    else{
      exists.quantity = exists.quantity+1;
      const remaining = cart.filter(pd => pd.id !== product.id);
      newCart =[...remaining,exists]; 
    }
    // if product dose not exist in the cart, set quantity = 1
    // if exist update quantity by 1

    setCart(newCart);
    addToDb(product.id);
  }

  return (
    <div className='shop-container'>
      <div className="product-container">
        {
          products.map(product => <Product
            key={product.id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>)
        }
      </div>
      <div className="cart-container">
        <Cart cart={cart}></Cart>

      </div>
    </div>
  );
};

export default Shop;