import React, {useCallback, useEffect, useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../hooks/useTelegram";

const products = [
    {id: 1, title: 'Вок',price: 350,description:'С курицей'},
    {id: 2, title: 'Рамен',price: 300,description:'С курицей'},
    {id: 3, title: 'Рамен',price: 300,description:'С говядиной'},
    {id: 4, title: 'Булочка бао',price: 50,description:'На пару'},
    {id: 5, title: 'Поке',price: 350,description:'С тунцем'},
]

const getTotalPrice = (items) => {
    return items.reduce((total, item) => {
        return total + item.price;
    },0)
}

const ProductList = () => {

    const [addedItems, setAddedItems] = useState([]);
    const {tg,queryId} = useTelegram();

    const onSendData = useCallback(()=>{
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
       fetch('http://localhost:3000', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify(data)
       })
    },[]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData]);

    const onAdd = (product) => {
    const alreadyAdded = addedItems.find(item => item.id === product.id);
    let newItems=[];
    if (alreadyAdded) {
        newItems = addedItems.filter(item => item.id !== product.id);
    }
    else {
        newItems = [...addedItems,product];
    }
    setAddedItems(newItems);

    if(newItems.length === 0){
        tg.MainButton.hide();
    }
    else {
        tg.MainButton.show();
        tg.MainButton.setParams({
            text: `Купить ${getTotalPrice(newItems)}`
        })
    }
    }

    return (
        <div className={'list'}>
            {products.map((item) => (
                <ProductItem product={item}
                onAdd={onAdd}
                className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;