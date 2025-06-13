[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/controllers/email-template.controller](../README.md) / EmailTemplateController

# Class: EmailTemplateController

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:22](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L22)

## Constructors

### Constructor

> **new EmailTemplateController**(`templateService`): `EmailTemplateController`

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:23](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L23)

#### Parameters

##### templateService

[`EmailTemplateService`](../../../services/email-template.service/classes/EmailTemplateService.md)

#### Returns

`EmailTemplateController`

## Methods

### cloneTemplate()

> **cloneTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:129](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L129)

Clone template

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `name?`: `string`; \}; `Params`: \{ `templateId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### createTemplate()

> **createTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:30](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L30)

Create template

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `category?`: `string`; `description?`: `string`; `htmlContent?`: `string`; `isPublic?`: `boolean`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `preheader?`: `string`; `subject?`: `string`; `textContent?`: `string`; `thumbnail?`: `string`; `variables?`: `object`[]; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### deleteTemplate()

> **deleteTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:112](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L112)

Delete template

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `templateId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### exportTemplate()

> **exportTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:264](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L264)

Export template

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `templateId`: `string`; \}; `Querystring`: \{ `format?`: `"json"` \| `"html"`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getTemplate()

> **getTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:70](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L70)

Get single template

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `templateId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getTemplates()

> **getTemplates**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:50](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L50)

Get templates

#### Parameters

##### request

`FastifyRequest`\<\{ `Querystring`: \{ `category?`: `string`; `isArchived?`: `boolean`; `isPublic?`: `boolean`; `limit?`: `number`; `page?`: `number`; `search?`: `string`; `sortBy?`: `"name"` \| `"createdAt"` \| `"updatedAt"`; `sortOrder?`: `"asc"` \| `"desc"`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getTemplateStats()

> **getTemplateStats**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:209](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L209)

Get template usage statistics

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `templateId`: `string`; \}; `Querystring`: \{ `endDate?`: `string`; `startDate?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### getTemplateVariables()

> **getTemplateVariables**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:334](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L334)

Get template variables

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `templateId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### importTemplate()

> **importTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:291](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L291)

Import template

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `format`: `"json"`; `name`: `string`; `templateData`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### previewTemplate()

> **previewTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:171](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L171)

Get template preview

#### Parameters

##### request

`FastifyRequest`\<\{ `Params`: \{ `templateId`: `string`; \}; `Querystring`: \{ `sampleData?`: `string`; `subscriberId?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### renderTemplate()

> **renderTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:151](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L151)

Render template with data

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `data?`: `Record`\<`string`, `any`\>; `templateId?`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### testTemplate()

> **testTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:239](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L239)

Test template rendering

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `recipientEmail`: `string`; `sampleData?`: `Record`\<`string`, `any`\>; \}; `Params`: \{ `templateId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

***

### updateTemplate()

> **updateTemplate**(`request`, `reply`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:90](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L90)

Update template

#### Parameters

##### request

`FastifyRequest`\<\{ `Body`: \{ `category?`: `string`; `description?`: `string`; `htmlContent?`: `string`; `isArchived?`: `boolean`; `isPublic?`: `boolean`; `metadata?`: `Record`\<`string`, `any`\>; `name?`: `string`; `preheader?`: `string`; `subject?`: `string`; `textContent?`: `string`; `thumbnail?`: `string`; `variables?`: `object`[]; \}; `Params`: \{ `templateId`: `string`; \}; \}\>

##### reply

`FastifyReply`

#### Returns

`Promise`\<`void`\>

## Properties

### templateService

> `private` `readonly` **templateService**: [`EmailTemplateService`](../../../services/email-template.service/classes/EmailTemplateService.md)

Defined in: [src/modules/email-marketing/controllers/email-template.controller.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/controllers/email-template.controller.ts#L24)
