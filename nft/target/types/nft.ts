/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/nft.json`.
 */
export type Nft = {
  "address": "9dDzq4c5y68STfWnRPVt1AD3SoDhJygRyUWvjiKnPmSj",
  "metadata": {
    "name": "nft",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addSubAdminAccounts",
      "discriminator": [
        130,
        141,
        64,
        137,
        151,
        104,
        59,
        232
      ],
      "accounts": [
        {
          "name": "maintainers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "addresses",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "burn",
      "discriminator": [
        116,
        110,
        29,
        56,
        107,
        219,
        42,
        93
      ],
      "accounts": [
        {
          "name": "mintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "collection"
              },
              {
                "kind": "arg",
                "path": "nft"
              }
            ]
          }
        },
        {
          "name": "collections",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "collection"
              }
            ]
          }
        },
        {
          "name": "nftCounter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "from",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "collection",
          "type": "string"
        },
        {
          "name": "nft",
          "type": "string"
        }
      ]
    },
    {
      "name": "closeNft",
      "discriminator": [
        234,
        232,
        31,
        120,
        12,
        30,
        61,
        117
      ],
      "accounts": [
        {
          "name": "mintAccount",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
    },
    {
      "name": "createNft",
      "discriminator": [
        231,
        119,
        61,
        97,
        217,
        46,
        142,
        109
      ],
      "accounts": [
        {
          "name": "maintainers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "params.collection"
              },
              {
                "kind": "arg",
                "path": "params.name"
              }
            ]
          }
        },
        {
          "name": "collections",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "params.collection"
              }
            ]
          }
        },
        {
          "name": "nftCounter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "createNftParams"
            }
          }
        }
      ]
    },
    {
      "name": "init",
      "discriminator": [
        220,
        59,
        207,
        236,
        108,
        250,
        47,
        100
      ],
      "accounts": [
        {
          "name": "maintainers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "nftCounter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initCollection",
      "discriminator": [
        244,
        242,
        133,
        0,
        152,
        187,
        144,
        139
      ],
      "accounts": [
        {
          "name": "collections",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "collection"
              }
            ]
          }
        },
        {
          "name": "nftCounter",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "collection",
          "type": "string"
        }
      ]
    },
    {
      "name": "manageAdmin",
      "discriminator": [
        141,
        136,
        128,
        177,
        111,
        187,
        95,
        148
      ],
      "accounts": [
        {
          "name": "maintainers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "mint",
      "discriminator": [
        51,
        57,
        225,
        47,
        182,
        146,
        137,
        166
      ],
      "accounts": [
        {
          "name": "mintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "collection"
              },
              {
                "kind": "arg",
                "path": "nft"
              }
            ]
          }
        },
        {
          "name": "toAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "collection",
          "type": "string"
        },
        {
          "name": "nft",
          "type": "string"
        }
      ]
    },
    {
      "name": "removeSubAdminAccounts",
      "discriminator": [
        152,
        249,
        193,
        89,
        66,
        185,
        139,
        172
      ],
      "accounts": [
        {
          "name": "maintainers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "addresses",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "transfer",
      "discriminator": [
        163,
        52,
        200,
        231,
        140,
        3,
        69,
        186
      ],
      "accounts": [
        {
          "name": "mintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "collection"
              },
              {
                "kind": "arg",
                "path": "nft"
              }
            ]
          }
        },
        {
          "name": "fromAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "toAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "toAccount"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "toAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "collection",
          "type": "string"
        },
        {
          "name": "nft",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "collections",
      "discriminator": [
        17,
        245,
        98,
        29,
        50,
        29,
        161,
        148
      ]
    },
    {
      "name": "maintainers",
      "discriminator": [
        201,
        217,
        234,
        104,
        25,
        149,
        168,
        56
      ]
    },
    {
      "name": "nftCounter",
      "discriminator": [
        214,
        107,
        73,
        138,
        146,
        104,
        208,
        57
      ]
    }
  ],
  "events": [
    {
      "name": "burnEvent",
      "discriminator": [
        33,
        89,
        47,
        117,
        82,
        124,
        238,
        250
      ]
    },
    {
      "name": "closeNftEvent",
      "discriminator": [
        86,
        8,
        136,
        106,
        243,
        251,
        229,
        158
      ]
    },
    {
      "name": "createNftEvent",
      "discriminator": [
        107,
        35,
        20,
        170,
        82,
        99,
        134,
        24
      ]
    },
    {
      "name": "initCollectionEvent",
      "discriminator": [
        52,
        252,
        40,
        88,
        8,
        33,
        120,
        156
      ]
    },
    {
      "name": "initEvent",
      "discriminator": [
        224,
        129,
        78,
        87,
        58,
        43,
        94,
        127
      ]
    },
    {
      "name": "mintEvent",
      "discriminator": [
        197,
        144,
        146,
        149,
        66,
        164,
        95,
        16
      ]
    },
    {
      "name": "transferEvent",
      "discriminator": [
        100,
        10,
        46,
        113,
        8,
        28,
        179,
        125
      ]
    },
    {
      "name": "updateAdminEvent",
      "discriminator": [
        225,
        152,
        171,
        87,
        246,
        63,
        66,
        234
      ]
    },
    {
      "name": "updateSubAdminsEvent",
      "discriminator": [
        72,
        133,
        167,
        136,
        247,
        186,
        123,
        166
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "amountCantBeZero",
      "msg": "Error: Amount can't be zero!"
    },
    {
      "code": 6001,
      "name": "unauthorized",
      "msg": "Error: Unauthorized User!"
    },
    {
      "code": 6002,
      "name": "unknownReceiver",
      "msg": "Error: Unknown Receiver!"
    }
  ],
  "types": [
    {
      "name": "burnEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nft",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "closeNftEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintAccount",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "collections",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nfts",
            "docs": [
              "NFTs mint address"
            ],
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "createNftEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "docs": [
              "NFT Name"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "createNftParams",
      "docs": [
        "The struct containing instructions for creating nfts"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collection",
            "docs": [
              "Collection Name"
            ],
            "type": "string"
          },
          {
            "name": "name",
            "docs": [
              "Token Name"
            ],
            "type": "string"
          },
          {
            "name": "symbol",
            "docs": [
              "Symbol"
            ],
            "type": "string"
          },
          {
            "name": "uri",
            "docs": [
              "URI"
            ],
            "type": "string"
          },
          {
            "name": "royalty",
            "docs": [
              "Royalty"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "initCollectionEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "initEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "subAdmin",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "maintainers",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "subAdmins",
            "docs": [
              "Sub Admins"
            ],
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "admin",
            "docs": [
              "Admin"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "mintEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nft",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "nftCounter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "value",
            "docs": [
              "Total no. of NFTs"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "transferEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nft",
            "type": "string"
          },
          {
            "name": "from",
            "type": "pubkey"
          },
          {
            "name": "to",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "updateAdminEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "from",
            "type": "pubkey"
          },
          {
            "name": "to",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "updateSubAdminsEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "updateType",
            "type": {
              "defined": {
                "name": "updateType"
              }
            }
          },
          {
            "name": "addresses",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "updateType",
      "docs": [
        "Update Type"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "add"
          },
          {
            "name": "remove"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "collectionCounterTag",
      "type": "bytes",
      "value": "[99, 111, 117, 110, 116, 101, 114]"
    },
    {
      "name": "collectionTag",
      "type": "bytes",
      "value": "[99, 111, 108, 108, 101, 99, 116, 105, 111, 110]"
    },
    {
      "name": "maintainersTag",
      "type": "bytes",
      "value": "[109, 97, 105, 110, 116, 97, 105, 110, 101, 114, 115]"
    },
    {
      "name": "mintTag",
      "type": "bytes",
      "value": "[109, 105, 110, 116]"
    }
  ]
};
