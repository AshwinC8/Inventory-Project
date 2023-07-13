const spreadsheetID = "1Hdo1_4q5Id9-qafaM4AY8fyN_cxC4PxIlZ9GMFMxPaM"
const ZERO = 0
const IDIndex = 1 
const ProductNameIndex = 2 
const QuantityIndex = 3

export const getStores = async (session) => {

    const request = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}?includeGridData=true&ranges=Stores`,{
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + session.provider_token 
        }
    })

    const data = await request.json()
    console.log(data)
    // console.log(data.sheets[0].data[0].rowData)
    // console.log(data.sheets[0].data[0].rowData[0].values[0].effectiveValue.stringValue)
    // console.log(data.sheets[0].data[0].rowData.length)
    
    const storeList = data.sheets[ZERO].data[ZERO].rowData
    const length = data.sheets[ZERO].data[ZERO].rowData.length
    let storeNames = []
    for( let i=1 ; i<length ; i++){
        const store = storeList[i].values[ZERO].effectiveValue.stringValue
        storeNames.push({ index : i-1, value : store})
        // console.log(storeList[i].values[0].effectiveValue.stringValue)
    }
    // console.log(storeNames)
    return storeNames
    // }).then((data) => {
    //     return data.JSON
    // }).then((data) => {
    //     console.log(data)
    // })
}


export async function getProductIDs(session){
    const request = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}?includeGridData=true&ranges=Products!B:B`,{
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
    for( let i=1 ; i<length ; i++){
        let productID = productList[i].values[ZERO].effectiveValue.stringValue
        productIDs.push({ index : i-1, value : productID})
    }

    // console.log(productIDs)
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
    // console.log("info = " + JSON.stringify(data))
    const productInfoList = data.sheets[ZERO].data[ZERO].rowData
    const length = data.sheets[ZERO].data[ZERO].rowData.length
 
    const  productInfo = {
        productID: "",
        productName: "",
        quantity: ""
    }

    // console.log(productInfoList)

    for( let i=1 ; i<length ; i++){
        const pID = productInfoList[i].values[IDIndex].effectiveValue.stringValue
        if( pID === productID ){
            const productName = productInfoList[i].values[ProductNameIndex].effectiveValue.stringValue
            const quantity = productInfoList[i].values[QuantityIndex].effectiveValue.numberValue
            
            productInfo.productID = pID
            productInfo.productName = productName
            productInfo.quantity = quantity

            console.log(productInfo)
            return productInfo
        }
    }

    return null 
}

export async function appendInventory(session, dateTime, storeName, productUpdates){
    const appendInfo = [ dateTime, storeName ]

    console.log(productUpdates)
    productUpdates.forEach(element => {
        console.log(element)
        appendInfo.push(element)        
    });

    const body = {
        "range": "Inventory",
        "majorDimension": "ROWS",
        "values": [appendInfo]
      }

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/Inventory:append?insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=FORMATTED_STRING&valueInputOption=USER_ENTERED`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + session.provider_token 
        },
        body: JSON.stringify(body)
    })

    console.log(response)
    return response
}

// Example Calls
// const date = new Date().toLocaleString()
// getStores(session)
// getProductIDs(session)
// getProductInfo(session, "8906150680001")
// appendInventory(session, date, "Store 1", [ 1, 2 ,3, 4, 5, 6, 7])
