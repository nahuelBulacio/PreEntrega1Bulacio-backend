import { Router } from 'express';

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
    res.send({status: 'success', payload: newCart});
});

router.post('/:cid/products/:pid', (req, res) => {
    const cid = +req.params.cid;
    const pid = +req.params.pid;

    const indexCart = carrito.findIndex(cart => cart.id === cid);
    const indexProduct = carrito[indexCart].products.findIndex(prod => prod.product === pid);

    if(indexCart === -1){
        return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' })
    }
    let newCart = {
        "product": pid,
        "quantity": 1
    }

    if(indexProduct === -1){
        carrito[indexCart].products.push(newCart);
    }else{
        carrito[indexCart].products[indexProduct].quantity++;
    }
    res.send(carrito[indexCart].products)
});

router.get('/:cid', (req, res) => {
    const cid = +req.params.cid;
    const indexCart = carrito.findIndex(cart => cart.id === cid);
    res.send(carrito[indexCart].products);
});

export default router; 