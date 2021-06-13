"use strict"

exports.handler = (event, context, callback) => {
  const response = event.Records[0].cf.response
  const headers = response.headers

  headers["access-control-allow-origin"] = [
    {
      key: "access-control-allow-origin",
      value: "*"
    }
  ]

  callback(null, response)
}
