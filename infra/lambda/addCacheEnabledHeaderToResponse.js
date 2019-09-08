"use strict";

exports.handler = (event, context, callback) => {
  const response = event.Records[0].cf.response;
  const headers = response.headers;

  headers["cache-control"] = [
    {
      key: "Cache-Control",
      value: "public, max-age=86400"
    }
  ];

  callback(null, response);
};
