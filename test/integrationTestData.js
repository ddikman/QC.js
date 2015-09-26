
var data = {};


data.connectionInfo = {
	host: "192.168.25.185",
	port: 8080,
	server: "http://192.168.25.185:8080/qcbin",
	domain: "USEMANGO",
	project: "FLIT_CURRENT",
	user: "testuser1",
	password: "tests"
};


data.testsResponse = {
  "Entities": {
    "$": {
      "TotalResults": "49"
    },
    "Entity": [
      {
        "$": {
          "Type": "test"
        },
        "Fields": [
          {
            "Field": [
              {
                "$": {
                  "Name": "id"
                },
                "Value": [
                  "2"
                ]
              },
              {
                "$": {
                  "Name": "name"
                },
                "Value": [
                  "SAP GUI - Scanned SAP Button"
                ]
              }
            ]
          }
        ],
        "RelatedEntities": [
          ""
        ]
      }
    ]
  }
};


module.exports = data;