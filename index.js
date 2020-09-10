const crypto = require('crypto')
const fetch = require('node-fetch')
const { Reporter } = require('open-oracle-reporter')

const COINBASE_ENDPOINT = 'https://api.pro.coinbase.com/oracle'
const COINBASE_API_KEY_ID = '{coinbase oracle api key}'
const COINBASE_API_SECRET = '{coinbase oracle api secret}'
const COINBASE_API_PASSPHRASE = '{coinbase oracle api passphrase}'

const fetchCoinbaseOraclePayload = async () => {
  const timestamp = Date.now() / 1000
  const what = `${timestamp}GET/oracle`
  const key = Buffer.from(COINBASE_API_SECRET, 'base64')
  const hmac = crypto.createHmac('sha256', key)
  const signature = hmac.update(what).digest('base64')
  const headers = {
    'CB-ACCESS-KEY': COINBASE_API_KEY_ID,
    'CB-ACCESS-SIGN': signature,
    'CB-ACCESS-TIMESTAMP': timestamp,
    'CB-ACCESS-PASSPHRASE': COINBASE_API_PASSPHRASE,
    'Content-Type': 'application/json',
  }

  try {
    const res = await fetch(COINBASE_ENDPOINT, {
      headers: headers,
    })
    const { messages } = await res.json()
    const decoded = Reporter.decode('prices', messages)
    // For example: decoded = [ [ '1583195520', 'BTC', '8845095000' ] ]
    console.log(JSON.stringify(decoded))
  } catch (error) {
    console.error(error)
  }
}

fetchCoinbaseOraclePayload()
