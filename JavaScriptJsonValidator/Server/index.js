
const WebSocket = require('ws');
const yup = require('yup')

const wss = new WebSocket.Server({port:8081});

const yupEventSchema={
    "address":yup.object().shape({
        contactName:yup.string().required(),
        pin:yup.string().required(),
        country:yup.string().required(),
        detailAddress:yup.object().shape({
            line1:yup.string().required(),
            line2:yup.string().required()

        })
                
        }),
        cart:yup.object().shape({
            id:yup.string().required(),
            count: yup.number().required().positive().integer()
        })

}

function parseMessage(message){

    const object = JSON.parse(message);

    if(!('name' in object)){
        throw new Error("name is missing")
    }
    if(!('phone' in object)){
        throw new Error("phone is missing")
    }
    if(!('address' in object)){
        throw new Error("address is missing")
    }
    if(!('cart' in object)){
        throw new Error("cart is missing")
    }
    

    object.address=yupEventSchema["address"].validateSync(object.address) 
     object.cart=yupEventSchema["cart"].validateSync(object.cart)

     return object;

}


wss.on('connection',ws => {
ws.on('message',message=>{
    
    let data;
     try{
        data = parseMessage(message);
    }
    catch(e){console.log(e.message) 
        return;
    }
    console.log(data);
})

});