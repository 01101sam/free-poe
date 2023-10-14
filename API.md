# API Docs

### Endpoint

```http request
POST https://www.quora.com/poe_api/gql_POST
content-type: application/json
poe-tag-id:
quora-formkey: 19bb3ba84e68fa18b00c50b2412f5b1b
apollographql-client-version: 2.1.0-530
accept: */*
x-apollo-operation-name: SendVerificationCodeForLoginMutation
accept-language: zh-HK,zh-Hant;q=0.9
accept-encoding: gzip, deflate, br
user-agent: Poe 2.1.0 rv:530 env:prod (iPhone15,3; iOS 17.0.3; en_HK)
x-apollo-operation-type: mutation
apollographql-client-name: com.quora.app.Experts-apollo-ios
quora-tchannel: poe-chan50-8888-kvwkyuinzjchsajancku
cookie: m-b=GmwACORstd2FUPpoQwzyEA==
cookie: m-b_lax=GmwACORstd2FUPpoQwzyEA==
cookie: m-b_strict=GmwACORstd2FUPpoQwzyEA==
cookie: m-login=0
cookie: m-s=E0u-E8EIrXaC05tyy7UUzg==
cookie: m-uid=None
cookie: m-lat=SsI77fE7oqrhKRoplCsDbg==
poe-language-code: zh
```

### Cookie

All cookie starts with prefix `m-`

Here's the list of cookie key:

| Key          | Default              |
|--------------|----------------------|
| `m-b`        | (use settings value) |
| `m-b_lax`    | (use settings value) |
| `m-b_strict` | (use settings value) |
| `m-login`    | 0                    |
| `m-s`        | (use settings value) |
| `m-uid`      | None                 |

In get settings (init state), you'll get all cookie you need to make request.

## Get Settings (Init)

# Logout

```json
{
  "operationName": "LogoutMutation",
  "query": "mutation LogoutMutation {\n  logout {\n    __typename\n    viewer {\n      __typename\n      uid\n    }\n  }\n}"
}
```

# SendVerificationCodeForLogin

```json
{
  "operationName": "SendVerificationCodeForLoginMutation",
  "query": "mutation SendVerificationCodeForLoginMutation($emailAddress: String, $phoneNumber: String, $recaptchaToken: String) {\n  sendVerificationCode(\n    verificationReason: login\n    emailAddress: $emailAddress\n    phoneNumber: $phoneNumber\n    recaptchaToken: $recaptchaToken\n  ) {\n    __typename\n    status\n    errorMessage\n  }\n}",
  "variables": {
    "emailAddress": "john.smith*@poe*.0s.hk",
    "recaptchaToken": ""
  }
}
```

## Response

```json
{
  "data": {
    "sendVerificationCode": {
      "__typename": "SendVerificationCode",
      "errorMessage": null,
      "status": "user_with_confirmed_email_not_found"
    }
  },
  "extensions": {
    "is_final": true
  }
}
```

# SignupWithVerificationCode

```json
{
  "operationName": "SignupWithVerificationCodeMutation",
  "query": "mutation SignupWithVerificationCodeMutation($verificationCode: String, $emailAddress: String, $phoneNumber: String, $birthday: String) {\n  signupWithVerificationCode(\n    verificationCode: $verificationCode\n    emailAddress: $emailAddress\n    phoneNumber: $phoneNumber\n    birthday: $birthday\n  ) {\n    __typename\n    status\n    errorMessage\n  }\n}",
  "variables": {
    "emailAddress": "john.smith*@poe*.0s.hk",
    "verificationCode": "119231"
  }
}
```

## Response

> Note: Set-Cookie Header available

```json
{
  "broadcastData": {
    "dirtiedDepkeyToVersion": {
      "LIUB:5c3d680e4d898c8205c8492ad7875fe2": 4,
      "LIUS:34211887d7d9d5541a13d8dfbf88e79e": 1,
      "cARQT:7a3972e8ed1a3cc70a187899fc7d001a": 1,
      "eou:3ffe5c25e7605d231331e64a902a93ba": 1,
      "msuo:e758167f2d0e84710296cb76113293a2": 16
    }
  },
  "data": {
    "signupWithVerificationCode": {
      "__typename": "SignupWithVerificationCode",
      "errorMessage": null,
      "status": "success"
    }
  },
  "extensions": {
    "is_final": true
  }
}
```

# AppleInAppPurchasesUpdatePurchase

> Fields to change:
> `appAccountToken`, `latestTransactionId`, `originalTransactionId`

```json
{
  "operationName": "AppleInAppPurchasesUpdatePurchaseMutation",
  "query": "mutation AppleInAppPurchasesUpdatePurchaseMutation($transaction: AppleInAppPurchasesTransaction!, $botsPerPage: Int!, $botCursorAfter: String) {\n  appleInAppPurchasesUpdatePurchase(transaction: $transaction) {\n    __typename\n    viewer {\n      __typename\n      id\n      availableBotsConnection(first: $botsPerPage, after: $botCursorAfter) {\n        __typename\n        edges {\n          __typename\n          node {\n            __typename\n            ...BotPreviewFragment\n          }\n        }\n        pageInfo {\n          __typename\n          hasNextPage\n        }\n      }\n    }\n  }\n}\nfragment BotPreviewFragment on Bot {\n  id\n  __typename\n  isSystemBot\n  botId\n  deletionState\n  model\n  nickname\n  displayName\n  description\n  isPrivateBot\n  minBuildNumberIos\n  shouldHide\n  botImageInfo {\n    __typename\n    ...BotImageInfoFragment\n  }\n  translatedBotTags\n  monthlyActiveUsers\n  messageTimeoutSecs\n  isApiBot\n  limitedAccessType\n  baseModelDisplayName\n  viewerIsFollower\n  providerName\n  messageUsageLimit {\n    __typename\n    id\n    ...MessageUsageLimitFragment\n  }\n  introduction\n  viewerIsCreator\n  canUserAccessBot\n  supportsFileUpload\n}\nfragment BotImageInfoFragment on BotImageInfo {\n  __typename\n  localAssetName\n  remoteAssetURL: remoteAssetUrl\n  assetTypeToUse\n}\nfragment MessageUsageLimitFragment on MessageLimit {\n  id\n  __typename\n  canSendMessage\n  dailyMessageSent\n  freeLimit\n  freeLimitBalance\n  freeLimitResetTime\n  totalBalance\n  balanceTooltipText\n  shouldShowLimitInfoBanner\n}",
  "variables": {
    "botsPerPage": 10,
    "transaction": {
      "appAccountToken": "00000000-0000-0000-BBDA-548F00000000",
      "environment": "Production",
      "expiresDateSeconds": 1697895720,
      "isUpgraded": false,
      "latestTransactionId": "350001725569582",
      "offerType": "yearly",
      "originalPurchaseDateSeconds": 1697290922,
      "originalTransactionId": "350001725569582",
      "ownershipType": "PURCHASED",
      "productId": "com.quora.app.poe.annual_subscription",
      "productType": "Auto-Renewable Subscription",
      "purchaseDateSeconds": 1697290920,
      "webOrderLineItemId": "350000814930384"
    }
  }
}
```

## Response

```json
{
  "data": {
    "appleInAppPurchasesUpdatePurchase": {
      "__typename": "AppleInAppPurchasesUpdatePurchase",
      "viewer": {
        "__typename": "Viewer",
        "id": "Vmlld2VyOjA=",
        "availableBotsConnection": {
          "__typename": "BotsConnection",
          "edges": [
            {
              "__typename": "BotEdge",
              "node": {
                "__typename": "Bot",
                "id": "Qm90OjMwMDI=",
                "isSystemBot": true,
                "botId": 3002,
                "deletionState": "not_deleted",
                "model": "capybara",
                "nickname": "capybara",
                "displayName": "Assistant",
                "description": "General-purpose assistant bot with strengths in programming-related tasks and non-English languages. Powered by gpt-3.5-turbo. Formerly known as Sage.",
                "isPrivateBot": false,
                "minBuildNumberIos": null,
                "shouldHide": false,
                "botImageInfo": {
                  "__typename": "BotImageInfo",
                  "localAssetName": "assistant",
                  "remoteAssetURL": "https://qph.fs.quoracdn.net/main-qimg-e4a356b7683dbb27559361caa79a1af4",
                  "assetTypeToUse": "local"
                },
                "translatedBotTags": [
                  "OFFICIAL"
                ],
                "monthlyActiveUsers": null,
                "messageTimeoutSecs": 15,
                "isApiBot": false,
                "limitedAccessType": "no_limit",
                "baseModelDisplayName": "Assistant",
                "viewerIsFollower": false,
                "providerName": "OpenAI",
                "messageUsageLimit": {
                  "__typename": "MessageLimit",
                  "id": "TWVzc2FnZUxpbWl0OjE6MA==",
                  "canSendMessage": true,
                  "dailyMessageSent": 0,
                  "freeLimit": null,
                  "freeLimitBalance": null,
                  "freeLimitResetTime": 1697328000000000,
                  "totalBalance": null,
                  "balanceTooltipText": null,
                  "shouldShowLimitInfoBanner": false
                },
                "introduction": "",
                "viewerIsCreator": false,
                "canUserAccessBot": true,
                "supportsFileUpload": true
              }
            },
            {
              "__typename": "BotEdge",
              "node": {
                "__typename": "Bot",
                "id": "Qm90OjIyNTQ3MDQ=",
                "isSystemBot": true,
                "botId": 2254704,
                "deletionState": "not_deleted",
                "model": "websearch",
                "nickname": "websearch",
                "displayName": "Web-Search",
                "description": "General-purpose assistant bot capable of conducting web search as necessary to inform its responses. Particularly good for queries regarding up-to-date information or specific facts. Powered by gpt-3.5-turbo. (Currently in beta release)",
                "isPrivateBot": false,
                "minBuildNumberIos": null,
                "shouldHide": true,
                "botImageInfo": {
                  "__typename": "BotImageInfo",
                  "localAssetName": null,
                  "remoteAssetURL": "https://qph.cf2.quoracdn.net/main-thumb-pb-2254704-200-frglciooglqoetmxwtnjvoezstfasmvp.jpeg",
                  "assetTypeToUse": "remote"
                },
                "translatedBotTags": [
                  "OFFICIAL"
                ],
                "monthlyActiveUsers": null,
                "messageTimeoutSecs": 15,
                "isApiBot": true,
                "limitedAccessType": "no_limit",
                "baseModelDisplayName": "Web-Search",
                "viewerIsFollower": false,
                "providerName": null,
                "messageUsageLimit": {
                  "__typename": "MessageLimit",
                  "id": "TWVzc2FnZUxpbWl0OjM6MjI1NDcwNA==",
                  "canSendMessage": true,
                  "dailyMessageSent": 0,
                  "freeLimit": null,
                  "freeLimitBalance": null,
                  "freeLimitResetTime": 1697328000000000,
                  "totalBalance": null,
                  "balanceTooltipText": null,
                  "shouldShowLimitInfoBanner": false
                },
                "introduction": "",
                "viewerIsCreator": false,
                "canUserAccessBot": true,
                "supportsFileUpload": false
              }
            },
            {
              "__typename": "BotEdge",
              "node": {
                "__typename": "Bot",
                "id": "Qm90OjMwMDc=",
                "isSystemBot": true,
                "botId": 3007,
                "deletionState": "not_deleted",
                "model": "beaver",
                "nickname": "beaver",
                "displayName": "GPT-4",
                "description": "OpenAI's most powerful model. Stronger than ChatGPT in quantitative questions (math and physics), creative writing, and many other challenging tasks. Availability is currently limited.",
                "isPrivateBot": false,
                "minBuildNumberIos": null,
                "shouldHide": false,
                "botImageInfo": {
                  "__typename": "BotImageInfo",
                  "localAssetName": "Avatar_GPT_Blue",
                  "remoteAssetURL": null,
                  "assetTypeToUse": "local"
                },
                "translatedBotTags": [
                  "OFFICIAL",
                  "SUBSCRIBED"
                ],
                "monthlyActiveUsers": null,
                "messageTimeoutSecs": 15,
                "isApiBot": false,
                "limitedAccessType": "soft_limit",
                "baseModelDisplayName": "GPT-4",
                "viewerIsFollower": false,
                "providerName": "OpenAI",
                "messageUsageLimit": {
                  "__typename": "MessageLimit",
                  "id": "TWVzc2FnZUxpbWl0OjA6MzAwNw==",
                  "canSendMessage": true,
                  "dailyMessageSent": 0,
                  "freeLimit": 0,
                  "freeLimitBalance": 0,
                  "freeLimitResetTime": 1697328000000000,
                  "totalBalance": 600,
                  "balanceTooltipText": null,
                  "shouldShowLimitInfoBanner": false
                },
                "introduction": "",
                "viewerIsCreator": false,
                "canUserAccessBot": true,
                "supportsFileUpload": true
              }
            },
            {
              "__typename": "BotEdge",
              "node": {
                "__typename": "Bot",
                "id": "Qm90OjE1Nzk4NTI=",
                "isSystemBot": true,
                "botId": 1579852,
                "deletionState": "not_deleted",
                "model": "stablediffusionxl",
                "nickname": "stablediffusionxl",
                "displayName": "StableDiffusionXL",
                "description": "Generates high quality images based on the user's most recent prompt. \n\nAllows users to specify elements to avoid in the image using the \"--no\" parameter at the end of the prompt (e.g. \"Tall trees, daylight --no rain\"). \n\nPowered by Stable Diffusion XL.",
                "isPrivateBot": false,
                "minBuildNumberIos": null,
                "shouldHide": true,
                "botImageInfo": {
                  "__typename": "BotImageInfo",
                  "localAssetName": null,
                  "remoteAssetURL": "https://qph.cf2.quoracdn.net/main-thumb-pb-1579852-200-lucxefupsdwraneitjvtcsgorqrbmncv.jpeg",
                  "assetTypeToUse": "remote"
                },
                "translatedBotTags": [
                  "OFFICIAL"
                ],
                "monthlyActiveUsers": null,
                "messageTimeoutSecs": 15,
                "isApiBot": true,
                "limitedAccessType": "soft_limit",
                "baseModelDisplayName": "StableDiffusionXL",
                "viewerIsFollower": false,
                "providerName": null,
                "messageUsageLimit": {
                  "__typename": "MessageLimit",
                  "id": "TWVzc2FnZUxpbWl0OjA6MTU3OTg1Mg==",
                  "canSendMessage": true,
                  "dailyMessageSent": 0,
                  "freeLimit": 100,
                  "freeLimitBalance": 100,
                  "freeLimitResetTime": 1697328000000000,
                  "totalBalance": 3100,
                  "balanceTooltipText": null,
                  "shouldShowLimitInfoBanner": false
                },
                "introduction": "",
                "viewerIsCreator": false,
                "canUserAccessBot": true,
                "supportsFileUpload": false
              }
            },
            {
              "__typename": "BotEdge",
              "node": {
                "__typename": "Bot",
                "id": "Qm90OjEwMDk=",
                "isSystemBot": true,
                "botId": 1009,
                "deletionState": "not_deleted",
                "model": "a2_100k",
                "nickname": "a2_100k",
                "displayName": "Claude-instant-100k",
                "description": "Anthropic’s fastest model, with an increased context window of 100k tokens (around 75,000 words). Enables analysis of very long documents, code, and more.",
                "isPrivateBot": false,
                "minBuildNumberIos": null,
                "shouldHide": false,
                "botImageInfo": {
                  "__typename": "BotImageInfo",
                  "localAssetName": "Avatar_Placeholder_Orange",
                  "remoteAssetURL": null,
                  "assetTypeToUse": "local"
                },
                "translatedBotTags": [
                  "OFFICIAL",
                  "SUBSCRIBED"
                ],
                "monthlyActiveUsers": null,
                "messageTimeoutSecs": 120,
                "isApiBot": false,
                "limitedAccessType": "hard_limit",
                "baseModelDisplayName": "Claude-instant-100k",
                "viewerIsFollower": false,
                "providerName": "Anthropic",
                "messageUsageLimit": {
                  "__typename": "MessageLimit",
                  "id": "TWVzc2FnZUxpbWl0OjA6MTAwOQ==",
                  "canSendMessage": true,
                  "dailyMessageSent": 0,
                  "freeLimit": 30,
                  "freeLimitBalance": 30,
                  "freeLimitResetTime": 1697328000000000,
                  "totalBalance": 1030,
                  "balanceTooltipText": null,
                  "shouldShowLimitInfoBanner": false
                },
                "introduction": "",
                "viewerIsCreator": false,
                "canUserAccessBot": true,
                "supportsFileUpload": true
              }
            },
            {
              "__typename": "BotEdge",
              "node": {
                "__typename": "Bot",
                "id": "Qm90OjEwMDg=",
                "isSystemBot": true,
                "botId": 1008,
                "deletionState": "not_deleted",
                "model": "a2_2",
                "nickname": "a2_2",
                "displayName": "Claude-2-100k",
                "description": "Anthropic's most powerful model, with an increased context window of 100k tokens (around 75,000 words). Particularly good at creative writing.",
                "isPrivateBot": false,
                "minBuildNumberIos": null,
                "shouldHide": false,
                "botImageInfo": {
                  "__typename": "BotImageInfo",
                  "localAssetName": "Avatar_Orange_Gradient",
                  "remoteAssetURL": null,
                  "assetTypeToUse": "local"
                },
                "translatedBotTags": [
                  "OFFICIAL",
                  "SUBSCRIBED"
                ],
                "monthlyActiveUsers": null,
                "messageTimeoutSecs": 120,
                "isApiBot": false,
                "limitedAccessType": "soft_limit",
                "baseModelDisplayName": "Claude-2-100k",
                "viewerIsFollower": false,
                "providerName": "Anthropic",
                "messageUsageLimit": {
                  "__typename": "MessageLimit",
                  "id": "TWVzc2FnZUxpbWl0OjA6MTAwOA==",
                  "canSendMessage": true,
                  "dailyMessageSent": 0,
                  "freeLimit": 5,
                  "freeLimitBalance": 5,
                  "freeLimitResetTime": 1697328000000000,
                  "totalBalance": 1005,
                  "balanceTooltipText": null,
                  "shouldShowLimitInfoBanner": false
                },
                "introduction": "",
                "viewerIsCreator": false,
                "canUserAccessBot": true,
                "supportsFileUpload": true
              }
            },
            {
              "__typename": "BotEdge",
              "node": {
                "__typename": "Bot",
                "id": "Qm90OjEwMDY=",
                "isSystemBot": true,
                "botId": 1006,
                "deletionState": "not_deleted",
                "model": "a2",
                "nickname": "a2",
                "displayName": "Claude-instant",
                "description": "Anthropic’s fastest model, with strength in creative tasks. Features a context window of 9k tokens (around 7,000 words).",
                "isPrivateBot": false,
                "minBuildNumberIos": null,
                "shouldHide": false,
                "botImageInfo": {
                  "__typename": "BotImageInfo",
                  "localAssetName": "Avatar_Placeholder_Orange",
                  "remoteAssetURL": null,
                  "assetTypeToUse": "local"
                },
                "translatedBotTags": [
                  "OFFICIAL"
                ],
                "monthlyActiveUsers": null,
                "messageTimeoutSecs": 15,
                "isApiBot": false,
                "limitedAccessType": "no_limit",
                "baseModelDisplayName": "Claude-instant",
                "viewerIsFollower": false,
                "providerName": "Anthropic",
                "messageUsageLimit": {
                  "__typename": "MessageLimit",
                  "id": "TWVzc2FnZUxpbWl0OjE6MA==",
                  "canSendMessage": true,
                  "dailyMessageSent": 0,
                  "freeLimit": null,
                  "freeLimitBalance": null,
                  "freeLimitResetTime": 1697328000000000,
                  "totalBalance": null,
                  "balanceTooltipText": null,
                  "shouldShowLimitInfoBanner": false
                },
                "introduction": "",
                "viewerIsCreator": false,
                "canUserAccessBot": true,
                "supportsFileUpload": true
              }
            },
            {
              "__typename": "BotEdge",
              "node": {
                "__typename": "Bot",
                "id": "Qm90OjMwMDQ=",
                "isSystemBot": true,
                "botId": 3004,
                "deletionState": "not_deleted",
                "model": "chinchilla",
                "nickname": "chinchilla",
                "displayName": "ChatGPT",
                "description": "Powered by gpt-3.5-turbo.",
                "isPrivateBot": false,
                "minBuildNumberIos": null,
                "shouldHide": false,
                "botImageInfo": {
                  "__typename": "BotImageInfo",
                  "localAssetName": "Avatar_Placeholder_Blue",
                  "remoteAssetURL": null,
                  "assetTypeToUse": "local"
                },
                "translatedBotTags": [
                  "OFFICIAL"
                ],
                "monthlyActiveUsers": null,
                "messageTimeoutSecs": 15,
                "isApiBot": false,
                "limitedAccessType": "no_limit",
                "baseModelDisplayName": "ChatGPT",
                "viewerIsFollower": false,
                "providerName": "OpenAI",
                "messageUsageLimit": {
                  "__typename": "MessageLimit",
                  "id": "TWVzc2FnZUxpbWl0OjE6MA==",
                  "canSendMessage": true,
                  "dailyMessageSent": 0,
                  "freeLimit": null,
                  "freeLimitBalance": null,
                  "freeLimitResetTime": 1697328000000000,
                  "totalBalance": null,
                  "balanceTooltipText": null,
                  "shouldShowLimitInfoBanner": false
                },
                "introduction": "",
                "viewerIsCreator": false,
                "canUserAccessBot": true,
                "supportsFileUpload": true
              }
            },
            {
              "__typename": "BotEdge",
              "node": {
                "__typename": "Bot",
                "id": "Qm90OjMwMDk=",
                "isSystemBot": true,
                "botId": 3009,
                "deletionState": "not_deleted",
                "model": "agouti",
                "nickname": "agouti",
                "displayName": "ChatGPT-16k",
                "description": "Powered by gpt-3.5-turbo-16k. Since this is a beta model, the usage limit is subject to change.",
                "isPrivateBot": false,
                "minBuildNumberIos": 291,
                "shouldHide": false,
                "botImageInfo": {
                  "__typename": "BotImageInfo",
                  "localAssetName": null,
                  "remoteAssetURL": "https://qph.fs.quoracdn.net/main-qimg-1569b6c5f28e1a2d5b1f821a8a8d27ec",
                  "assetTypeToUse": "remote"
                },
                "translatedBotTags": [
                  "OFFICIAL",
                  "SUBSCRIBED"
                ],
                "monthlyActiveUsers": null,
                "messageTimeoutSecs": 15,
                "isApiBot": false,
                "limitedAccessType": "soft_limit",
                "baseModelDisplayName": "ChatGPT-16k",
                "viewerIsFollower": false,
                "providerName": "OpenAI",
                "messageUsageLimit": {
                  "__typename": "MessageLimit",
                  "id": "TWVzc2FnZUxpbWl0OjA6MzAwOQ==",
                  "canSendMessage": true,
                  "dailyMessageSent": 0,
                  "freeLimit": 0,
                  "freeLimitBalance": 0,
                  "freeLimitResetTime": 1697328000000000,
                  "totalBalance": 1000,
                  "balanceTooltipText": null,
                  "shouldShowLimitInfoBanner": false
                },
                "introduction": "",
                "viewerIsCreator": false,
                "canUserAccessBot": true,
                "supportsFileUpload": true
              }
            },
            {
              "__typename": "BotEdge",
              "node": {
                "__typename": "Bot",
                "id": "Qm90OjMwMTA=",
                "isSystemBot": true,
                "botId": 3010,
                "deletionState": "not_deleted",
                "model": "vizcacha",
                "nickname": "vizcacha",
                "displayName": "GPT-4-32k",
                "description": "Powered by gpt-4-32k. Since this is a beta model, the usage limit is subject to change.",
                "isPrivateBot": false,
                "minBuildNumberIos": 291,
                "shouldHide": false,
                "botImageInfo": {
                  "__typename": "BotImageInfo",
                  "localAssetName": null,
                  "remoteAssetURL": "https://qph.fs.quoracdn.net/main-qimg-3f53030558570aeb0bf0e8fcd483b464",
                  "assetTypeToUse": "remote"
                },
                "translatedBotTags": [
                  "OFFICIAL",
                  "SUBSCRIBED"
                ],
                "monthlyActiveUsers": null,
                "messageTimeoutSecs": 15,
                "isApiBot": false,
                "limitedAccessType": "hard_limit",
                "baseModelDisplayName": "GPT-4-32k",
                "viewerIsFollower": false,
                "providerName": "OpenAI",
                "messageUsageLimit": {
                  "__typename": "MessageLimit",
                  "id": "TWVzc2FnZUxpbWl0OjA6MzAxMA==",
                  "canSendMessage": true,
                  "dailyMessageSent": 0,
                  "freeLimit": 0,
                  "freeLimitBalance": 0,
                  "freeLimitResetTime": 1697328000000000,
                  "totalBalance": 50,
                  "balanceTooltipText": null,
                  "shouldShowLimitInfoBanner": false
                },
                "introduction": "",
                "viewerIsCreator": false,
                "canUserAccessBot": true,
                "supportsFileUpload": true
              }
            }
          ],
          "pageInfo": {
            "__typename": "PageInfo",
            "hasNextPage": true
          }
        }
      }
    }
  },
  "extensions": {
    "is_final": true
  }
}
```

# SettingsPageQuery

```json
{
  "operationName": "SettingsPageQuery",
  "query": "query SettingsPageQuery($first: Int, $after: String) {\n  viewer {\n    __typename\n    id\n    primaryPhoneNumber\n    primaryEmail\n    confirmedEmails\n    showPoeDebugPanel: booleanGate(gateName: \"poe_show_debug_panel\")\n    ...MessageLimitsConnectionFragment\n  }\n}\nfragment MessageLimitsConnectionFragment on Viewer {\n  __typename\n  messageLimitsConnection(first: $first, after: $after) {\n    __typename\n    edges {\n      __typename\n      node {\n        __typename\n        ...MessageLimitFragment\n      }\n    }\n    pageInfo {\n      __typename\n      hasNextPage\n    }\n  }\n}\nfragment MessageLimitFragment on MessageLimit {\n  __typename\n  id\n  bot {\n    __typename\n    displayName\n  }\n  freeLimit\n  freeLimitBalance\n  freeLimitResetTime\n  messageLimitId\n  paidLimit\n  paidLimitBalance\n  paidLimitResetTime\n}",
  "variables": {
    "after": null,
    "first": 10
  }
}
```

## Response

```json
{
  "data": {
    "viewer": {
      "__typename": "Viewer",
      "id": "Vmlld2VyOjA=",
      "primaryPhoneNumber": null,
      "primaryEmail": "john.smith*@poe*.0s.hk",
      "confirmedEmails": [
        "john.smith*@poe*.0s.hk"
      ],
      "showPoeDebugPanel": false,
      "messageLimitsConnection": {
        "__typename": "MessageLimitConnection",
        "edges": [
          {
            "__typename": "MessageLimitEdge",
            "node": {
              "__typename": "MessageLimit",
              "id": "TWVzc2FnZUxpbWl0OjA6MTAwOA==",
              "bot": {
                "__typename": "Bot",
                "displayName": "Claude-2-100k"
              },
              "freeLimit": 5,
              "freeLimitBalance": 5,
              "freeLimitResetTime": 1697328000000000,
              "messageLimitId": "0:1008",
              "paidLimit": 1000,
              "paidLimitBalance": 1000,
              "paidLimitResetTime": 1699833600000000
            }
          },
          {
            "__typename": "MessageLimitEdge",
            "node": {
              "__typename": "MessageLimit",
              "id": "TWVzc2FnZUxpbWl0OjA6MTAwOQ==",
              "bot": {
                "__typename": "Bot",
                "displayName": "Claude-instant-100k"
              },
              "freeLimit": 30,
              "freeLimitBalance": 30,
              "freeLimitResetTime": 1697328000000000,
              "messageLimitId": "0:1009",
              "paidLimit": 1000,
              "paidLimitBalance": 1000,
              "paidLimitResetTime": 1699833600000000
            }
          },
          {
            "__typename": "MessageLimitEdge",
            "node": {
              "__typename": "MessageLimit",
              "id": "TWVzc2FnZUxpbWl0OjA6MzAwNw==",
              "bot": {
                "__typename": "Bot",
                "displayName": "GPT-4"
              },
              "freeLimit": 0,
              "freeLimitBalance": 0,
              "freeLimitResetTime": 1697328000000000,
              "messageLimitId": "0:3007",
              "paidLimit": 600,
              "paidLimitBalance": 600,
              "paidLimitResetTime": 1699833600000000
            }
          },
          {
            "__typename": "MessageLimitEdge",
            "node": {
              "__typename": "MessageLimit",
              "id": "TWVzc2FnZUxpbWl0OjA6MzAwOQ==",
              "bot": {
                "__typename": "Bot",
                "displayName": "ChatGPT-16k"
              },
              "freeLimit": 0,
              "freeLimitBalance": 0,
              "freeLimitResetTime": 1697328000000000,
              "messageLimitId": "0:3009",
              "paidLimit": 1000,
              "paidLimitBalance": 1000,
              "paidLimitResetTime": 1699833600000000
            }
          },
          {
            "__typename": "MessageLimitEdge",
            "node": {
              "__typename": "MessageLimit",
              "id": "TWVzc2FnZUxpbWl0OjA6MzAxMA==",
              "bot": {
                "__typename": "Bot",
                "displayName": "GPT-4-32k"
              },
              "freeLimit": 0,
              "freeLimitBalance": 0,
              "freeLimitResetTime": 1697328000000000,
              "messageLimitId": "0:3010",
              "paidLimit": 50,
              "paidLimitBalance": 50,
              "paidLimitResetTime": 1699833600000000
            }
          },
          {
            "__typename": "MessageLimitEdge",
            "node": {
              "__typename": "MessageLimit",
              "id": "TWVzc2FnZUxpbWl0OjA6MTU3OTg1Mg==",
              "bot": {
                "__typename": "Bot",
                "displayName": "StableDiffusionXL"
              },
              "freeLimit": 100,
              "freeLimitBalance": 100,
              "freeLimitResetTime": 1697328000000000,
              "messageLimitId": "0:1579852",
              "paidLimit": 3000,
              "paidLimitBalance": 3000,
              "paidLimitResetTime": 1699833600000000
            }
          }
        ],
        "pageInfo": {
          "__typename": "PageInfo",
          "hasNextPage": false
        }
      }
    }
  },
  "extensions": {
    "is_final": true
  }
}
```
