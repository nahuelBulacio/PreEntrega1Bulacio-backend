import { Router } from 'express';
import fs from 'fs'
const router = Router();

let valor = 0;
let carrito = [];
let products = [];
router.post('/', (req, res) => {
    valor++
    const newCart = {
        "id": valor,
        products
    }
    carrito.push(newCart);

    let stringCarrito = JSON.stringify(carrito, null, 2);
    if(!(fs.existsSync('carrito.json'))){
        fs.writeFileSync('carrito.json', stringCarrito);
    }else{
        const jsonData = fs.readFileSync('carrito.json', 'utf-8');
        const existingData = JSON.parse(jsonData);
        existingData.push(newCart);
        let stringCarrito = JSON.stringify(carrito, null, 2);
        fs.writeFileSync('carrito.json', stringCarrito);
    }
    res.send({status: 'success', payload: newCart});
});

router.post('/:cid/products/:pid', (req, res) => {
    const cid = +req.params.cid;
    const pid = +req.params.pid;

    
    const jsonData = fs.readFileSync('carrito.json', 'utf-8');
    const existingData = JSON.parse(jsonData);
    const indexCart = existingData.findIndex(cart => cart.id === cid);
    const indexProduct = existingData[indexCart].products.findIndex(prod => prod.product === pid);

    if(indexCart === -1){
        return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' })
    }
    let newCart = {
        "product": pid,
        "quantity": 1
    }

    if(indexProduct === -1){
        existingData[indexCart].products.push(newCart);
        let stringCarrito = JSON.stringify(existingData, null, 2);
        fs.writeFileSync('carrito.json', stringCarrito);
    }else{
        existingData[indexCart].products[indexProduct].quantity++;
        let stringCarrito = JSON.stringify(existingData, null, 2);
        fs.writeFileSync('carrito.json', stringCarrito);
    }
    res.send(existingData[indexCart].products)
});

router.get('/:cid', (req, res) => {
    const cid = +req.params.cid;
    const jsonData = fs.readFileSync('carrito.json', 'utf-8');
    const existingData = JSON.parse(jsonData);
    const indexCart = existingData.findIndex(cart => cart.id === cid);

    if(indexCart === -1){
        res.status(404).send({ status: 'error', error: 'Carrito no encontrado' })
    }else{
        res.send(existingData[indexCart].products);
    }
});

export default router; 