const spreadsheetID = "1Hdo1_4q5Id9-qafaM4AY8fyN_cxC4PxIlZ9GMFMxPaM"
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
        const store = storeList[i].values[ZERO].effectiveValue.stringValue+""
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
        quantity: ""
    }

    for( let i=1 ; i<length ; i++){
        const pID = productInfoList[i].values[IDIndex].formattedValue
        if( pID === productID ){
            const productName = productInfoList[i].values[ProductNameIndex].effectiveValue.stringValue
            const quantity = productInfoList[i].values[QuantityIndex].effectiveValue.numberValue
            
            productInfo.productID = pID
            productInfo.productName = productName
            productInfo.quantity = quantity

            return productInfo
        }
    }

    return null 
}

export async function appendInventory(session, dateTime, storeName, productUpdates){
    const appendInfo = [ dateTime, storeName ]

    productUpdates.forEach(element => {
        appendInfo.push(element)        
    })

    const body = {
        "range": "Inventory",
        "majorDimension": "ROWS",
        "values": [appendInfo]
    }

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/Inventory:append?includeValuesInResponse=true&valueInputOption=USER_ENTERED`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + session.provider_token 
        },
        body: JSON.stringify(body)
    })

    //Check later
    const responseData = await response.json()
    if(responseData.updates.updatedRows >= 1){
        return true
    }

    return false
}