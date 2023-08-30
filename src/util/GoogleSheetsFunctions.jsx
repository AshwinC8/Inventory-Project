const spreadsheetID = import.meta.env.VITE_SHEET_URL
const ZERO = 0
const IDIndex = 0 
const ProductNameIndex = 1 
const QuantityIndex = 2


export const getStores = async (session) => {

    const request = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}?includeGridData=true&ranges=Stores`,{
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + session.provider_token 
        }
    })

    const data = await request.json()

    const storeList = data.sheets[ZERO].data[ZERO].rowData
    const length = data.sheets[ZERO].data[ZERO].rowData.length
    let storeNames = [""]
    for( let i=1 ; i<length ; i++){
        const store = storeList[i].values[ZERO].formattedValue
        storeNames.push(store)
        // storeNames.push({ label : store, index : i-1})
    }
    
    return storeNames
}


export async function getProductIDs(session){
    const request = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}?includeGridData=true&ranges=Products!A:A`,{
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + session.provider_token 
        }
    })

    const data = await request.json()

    const productList = data.sheets[ZERO].data[ZERO].rowData
    const length = data.sheets[ZERO].data[ZERO].rowData.length
    let productIDs = []
    for( let i=1 ; i<length && productList[i].values[IDIndex].formattedValue ; i++){
        let productID = productList[i].values[ZERO].formattedValue + ""
        let formattedPID = productID.slice(-4)
        productIDs.push({ index : i-1, value : productID, formattedValue : formattedPID})
    }

    return productIDs
}


export async function getProductInfoHistoryFormat(session, productIDs, quantities){
    const request = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}?includeGridData=true&ranges=Products`,{
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + session.provider_token 
        }
    })

    const data = await request.json()

    const productInfoList = data.sheets[ZERO].data[ZERO].rowData
    const length = data.sheets[ZERO].data[ZERO].rowData.length

    let returnedData = []

    for( let i=1 ; i<length ; i++){
        const pID = productInfoList[i].values[IDIndex].formattedValue
        if( productIDs.includes(pID) ){
            const productName = productInfoList[i].values[ProductNameIndex].formattedValue
            
            var productInfo = {
                productId: pID,
                productName: productName,
                quantityReplenished: quantities[productIDs.indexOf(pID)],
            }

            returnedData.push(productInfo)
        }
    }

    if( returnedData.length === 0 )
        return null
    else
        return returnedData
}


export async function getProductInfo(session, productID){
    const request = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}?includeGridData=true&ranges=Products`,{
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + session.provider_token 
        }
    })

    const data = await request.json()

    const productInfoList = data.sheets[ZERO].data[ZERO].rowData
    const length = data.sheets[ZERO].data[ZERO].rowData.length
    const  productInfo = {
        productID: "",
        productName: "",
        // quantity: ""
    }

    let returnedData = []

    for( let i=1 ; i<length ; i++){
        const pID = productInfoList[i].values[IDIndex].formattedValue
        if( pID === productID ){
            const productName = productInfoList[i].values[ProductNameIndex].effectiveValue.stringValue
            // const quantity = productInfoList[i].values[QuantityIndex].effectiveValue.numberValue
            
            productInfo.productID = pID
            productInfo.productName = productName
            // productInfo.quantity = quantity

            return productInfo
        }else if( productID.includes(pID) ){
            const productName = productInfoList[i].values[ProductNameIndex].effectiveValue.stringValue
            // const quantity = productInfoList[i].values[QuantityIndex].effectiveValue.numberValue
            
            productInfo.productID = pID
            productInfo.productName = productName

            returnedData.push(productInfo)
        }
    }

    if( returnedData.length === 0 )
        return null
    else {
        return returnedData
    }
}

export async function appendInventory(session, dateTime, storeName, productUpdates){
    //data being sent appendInfo being the whole row we r going to update
    const appendInfo = [ "", "", dateTime, session.user.email, "", storeName ]
    productUpdates.forEach(element => {
        appendInfo.push(element)        
    })
    
    const range = "DeliveredItems"
    const body = {
        "range": range,
        "majorDimension": "ROWS",
        "values": [appendInfo],
    }

    var returnVal = true

    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${range}:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&valueInputOption=USER_ENTERED`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + session.provider_token 
            },
            body: JSON.stringify(body)
        })

        if( !response.ok ){
            throw new Error(`HTTP error! status: ${response.status}`);
        }   
            
        const responseData = await response.json()

    } catch(error){
        console.error(error);
        returnVal = false
    }

    return returnVal
}

export async function getStoreHistory(session, storeName){
    const fields = 'sheets.data.rowData.values(formattedValue)';
    const request = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}?includeGridData=true&ranges=DeliveredItems!C5%3AC&ranges=DeliveredItems!F5%3AZZ&fields=${fields}`,{
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + session.provider_token 
        }
    })
    

    //error handling can be better :)
    if( !request.ok ){
        return null
    } 

    const data = await request.json()

    const history = data.sheets[ZERO].data
    let length = history[1].rowData.length
    
    //only has storeName and productIds
    const inventorySchema = history[1]
    
    //Checking through each row and if the 
    let storeHistory = []
    let check = 0
    for( let i=length-1 ; i>=0 && check<=2; i--){
        if( !history[1].rowData[i].values || history[1].rowData[i].values.length < 2){
            continue
        }

        const store = history[1].rowData[i].values[0].formattedValue + ""

        if( storeName === store ){
            check++;
            
            //changing date format
            var date = new Date(history[0].rowData[i].values[ZERO].formattedValue)
            var date = history[0].rowData[i].values[ZERO].formattedValue
            // date = date.toString('YYYY-MM-dd');
            // date = date.substr(0,25)

            let item = {
                time : date,
                products : []
            }

            var productList = []
            var quantities = []
            for(let j=1 ; j < history[1].rowData[i].values.length ; j++ ){
                if(JSON.stringify(history[1].rowData[i].values[j]) === "{}" ){
                    continue
                }

                productList.push(inventorySchema.rowData[0].values[j].formattedValue)
                quantities.push(history[1].rowData[i].values[j].formattedValue)
            }
            const products = await getProductInfoHistoryFormat(session, productList, quantities)
            
            item.products.push(...products);

            storeHistory.push(item)
        }
    }
    
    
    console.log(storeHistory)

    return storeHistory
}
