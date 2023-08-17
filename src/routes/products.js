import { Router } from 'express';
import fs from 'fs';
const router = Router();

const products = [];

router.get('/', (req, res) => {
    const limit = +req.query.limit;
    if(limit < 0){
        res.status(400).send({status:'error', error:"Ingrese un número válido para esta operación"});
    }else if(limit > 0){
        products.length = limit;
        const jsonData = fs.readFileSync('products.json', 'utf-8');
        const existingData = JSON.parse(jsonData);
        products.push(existingData)
        products.length = limit;
        return res.send(products);
    }else if(!limit){
        const jsonData = fs.readFileSync('products.json', 'utf-8');
        const existingData = JSON.parse(jsonData);
        products.push(existingData)
        return res.send(products);
    }
});
router.get('/:pid', (req, res) => {
    const pid = +req.params.pid;
    const jsonData = fs.readFileSync('products.json', 'utf-8');
    const existingData = JSON.parse(jsonData);
    const indexProduct = existingData.findIndex(prod => prod.id === pid);
    res.send(existingData[indexProduct]);
});

let valor = 0;
router.post('/', (req, res) => {
    valor++;
    let product = req.body;
    product["id"] = valor;
    products.push(product)
    if(fs.existsSync('products.json')){
        const jsonData = fs.readFileSync('products.json', 'utf-8');
        const existingData = JSON.parse(jsonData);
        existingData.push(product);
        const updatedJsonData = JSON.stringify(existingData, null, 2);
        fs.writeFileSync('products.json', updatedJsonData);
        res.send({status: 'success'});
    }else{
        const stringProduct = JSON.stringify(products, null, 2)
        fs.writeFileSync('products.json', stringProduct);
        res.send({status: 'success'});
    }
});

router.put('/:pid', (req, res) => {
    const pid = req.params.pid;
    const updateProduct = req.body;
    const jsonData = fs.readFileSync('products.json', 'utf-8');
    const existingData = JSON.parse(jsonData);
    const indexProduct = existingData.findIndex((prod) => prod.id === +pid);

    if (indexProduct === -1) {
        return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' })
    }

    existingData[indexProduct] = updateProduct;
    (existingData[indexProduct])["id"] = pid;
    const updatedJsonData = JSON.stringify(existingData, null, 2);
    fs.writeFileSync('products.json', updatedJsonData);
    res.send({ status: 'success', message: products[indexProduct] });
});

router.delete('/:pid', (req, res)=>{
    const pid = req.params.pid;
    
    let jsonData = fs.readFileSync('products.json', 'utf-8');
    let existingData = JSON.parse(jsonData);

    let productsLength = existingData.length;
    existingData = existingData.filter((prod) => +pid !== prod.id);
    if(productsLength === existingData.length){
        return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
    }
    const stringProduct = JSON.stringify(existingData, null, 2)
    fs.writeFileSync('products.json', stringProduct);
    res.send({status:"success", message: existingData})
});

export default router;