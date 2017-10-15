createRequest = (url, callback) => {
    const xobj = new XMLHttpRequest()
    xobj.overrideMimeType('application/json')
    xobj.open('GET', url, true)
    xobj.onreadystatechange = () => {
        if (xobj.readyState == 4 && xobj.status == '200') {
            callback(xobj.responseText)
        }
    }
    xobj.send(null)
}

downloadData = () => {
    console.log('Downloading Data')
    const URL = 'https://api-project-683412643633.firebaseio.com/.json?'
    createRequest(URL, response => {
        const data = JSON.parse(response)
        const cleanedData = data.filter((data) => data != undefined)
        saveToLocalStorage(cleanedData)
        showQuote(cleanedData)
        return
    })
}

showQuote = (quotes) => {
    const quote = quotes[Math.floor(Math.random()*quotes.length)]
    document.getElementById("quote").innerHTML = quote.quote
    document.getElementById("author").innerHTML = quote.author
}

saveToLocalStorage = (data) => {
    chrome.storage.local.set({
        quotes: data,
        updated: Date.now()
    }, () => console.log('Quotes Saved !'))
}

displayInfo = () => document.getElementById("info-overlay").className = "show"
hideInfo = () => document.getElementById("info-overlay").className = "hide"

init = () => {
    chrome.storage.local.get('quotes', (data) => {
        if (!data) {
            downloadData()
        } else if (Object.keys(data).length === 0) {
            downloadData()
        } else {
            showQuote(data.quotes)
        }
    })
    document.getElementById("info-button").addEventListener("click", displayInfo)
    document.getElementById("info-close").addEventListener("click", hideInfo)
}

init()
