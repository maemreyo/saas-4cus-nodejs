[**modern-backend-template v2.0.0**](../../../../../README.md)

***

[modern-backend-template](../../../../../modules.md) / [modules/email-marketing/services/email-template.service](../README.md) / EmailTemplateService

# Class: EmailTemplateService

Defined in: [src/modules/email-marketing/services/email-template.service.ts:24](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L24)

## Constructors

### Constructor

> **new EmailTemplateService**(`prisma`, `eventBus`, `redis`, `storage`): `EmailTemplateService`

Defined in: [src/modules/email-marketing/services/email-template.service.ts:27](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L27)

#### Parameters

##### prisma

[`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

##### eventBus

[`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

##### redis

[`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

##### storage

[`StorageService`](../../../../../shared/services/storage.service/classes/StorageService.md)

#### Returns

`EmailTemplateService`

## Methods

### archiveTemplate()

> **archiveTemplate**(`tenantId`, `templateId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:320](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L320)

Archive a template

#### Parameters

##### tenantId

`string`

##### templateId

`string`

#### Returns

`Promise`\<`void`\>

***

### cloneTemplate()

> **cloneTemplate**(`tenantId`, `templateId`, `name?`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:290](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L290)

Clone a template

#### Parameters

##### tenantId

`string`

##### templateId

`string`

##### name?

`string`

#### Returns

`Promise`\<\{ \}\>

***

### createTemplate()

> **createTemplate**(`tenantId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:74](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L74)

Create a new template

#### Parameters

##### tenantId

`string`

##### data

###### category?

`string` = `...`

###### description?

`string` = `...`

###### htmlContent?

`string` = `...`

###### isPublic?

`boolean` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### name?

`string` = `...`

###### preheader?

`string` = `...`

###### subject?

`string` = `...`

###### textContent?

`string` = `...`

###### thumbnail?

`string` = `...`

###### variables?

`object`[] = `...`

#### Returns

`Promise`\<\{ \}\>

***

### deleteTemplate()

> **deleteTemplate**(`tenantId`, `templateId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:348](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L348)

Delete a template

#### Parameters

##### tenantId

`string`

##### templateId

`string`

#### Returns

`Promise`\<`void`\>

***

### exportTemplate()

> **exportTemplate**(`tenantId`, `templateId`, `format`): `Promise`\<`string` \| `object`\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:695](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L695)

Export template

#### Parameters

##### tenantId

`string`

##### templateId

`string`

##### format

`"json"` | `"html"`

#### Returns

`Promise`\<`string` \| `object`\>

***

### extractVariables()

> `private` **extractVariables**(`content`): `any`[]

Defined in: [src/modules/email-marketing/services/email-template.service.ts:429](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L429)

Extract template variables

#### Parameters

##### content

`string`

#### Returns

`any`[]

***

### generateTextFromHtml()

> `private` **generateTextFromHtml**(`html`): `string`

Defined in: [src/modules/email-marketing/services/email-template.service.ts:416](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L416)

Generate text content from HTML

#### Parameters

##### html

`string`

#### Returns

`string`

***

### generateThumbnail()

> `private` **generateThumbnail**(`html`): `Promise`\<`string`\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:452](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L452)

Generate template thumbnail

#### Parameters

##### html

`string`

#### Returns

`Promise`\<`string`\>

***

### getCategories()

> **getCategories**(`tenantId`): `Promise`\<`string`[]\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:380](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L380)

Get template categories

#### Parameters

##### tenantId

`string`

#### Returns

`Promise`\<`string`[]\>

***

### getEmailDeliveryService()

> `private` **getEmailDeliveryService**(): `Promise`\<`any`\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:681](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L681)

Get email delivery service

#### Returns

`Promise`\<`any`\>

***

### getSubscriberData()

> `private` **getSubscriberData**(`subscriber`): `Record`\<`string`, `any`\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:513](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L513)

Get subscriber data for templates

#### Parameters

##### subscriber

`any`

#### Returns

`Record`\<`string`, `any`\>

***

### getTemplate()

> **getTemplate**(`tenantId`, `templateId`): `Promise`\<[`TemplateWithUsage`](../interfaces/TemplateWithUsage.md)\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:164](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L164)

Get template

#### Parameters

##### tenantId

`string`

##### templateId

`string`

#### Returns

`Promise`\<[`TemplateWithUsage`](../interfaces/TemplateWithUsage.md)\>

***

### getTemplateStats()

> **getTemplateStats**(`tenantId`, `templateId`, `startDate?`, `endDate?`): `Promise`\<\{ `automations`: `object`[]; `campaigns`: `object`[]; `performance`: \{ `averageClickRate`: `number`; `averageOpenRate`: `number`; `clicks`: `number`; `opens`: `number`; \}; `usageCount`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:528](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L528)

Get template usage statistics

#### Parameters

##### tenantId

`string`

##### templateId

`string`

##### startDate?

`Date`

##### endDate?

`Date`

#### Returns

`Promise`\<\{ `automations`: `object`[]; `campaigns`: `object`[]; `performance`: \{ `averageClickRate`: `number`; `averageOpenRate`: `number`; `clicks`: `number`; `opens`: `number`; \}; `usageCount`: `number`; \}\>

***

### getTemplateVariables()

> **getTemplateVariables**(`tenantId`, `templateId`): `Promise`\<`object`[]\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:741](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L741)

Get template variables

#### Parameters

##### tenantId

`string`

##### templateId

`string`

#### Returns

`Promise`\<`object`[]\>

***

### importTemplate()

> **importTemplate**(`tenantId`, `name`, `templateData`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:715](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L715)

Import template

#### Parameters

##### tenantId

`string`

##### name

`string`

##### templateData

`any`

#### Returns

`Promise`\<\{ \}\>

***

### invalidateTemplateCache()

> `private` **invalidateTemplateCache**(`templateId`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:468](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L468)

Invalidate template cache

#### Parameters

##### templateId

`string`

#### Returns

`Promise`\<`void`\>

***

### listTemplates()

> **listTemplates**(`tenantId`, `filters`): `Promise`\<\{ `page`: `number`; `pages`: `number`; `templates`: [`TemplateWithUsage`](../interfaces/TemplateWithUsage.md)[]; `total`: `number`; \}\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:200](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L200)

List templates with filters

#### Parameters

##### tenantId

`string`

##### filters

###### category?

`string` = `...`

###### isArchived?

`boolean` = `...`

###### isPublic?

`boolean` = `...`

###### limit?

`number` = `...`

###### page?

`number` = `...`

###### search?

`string` = `...`

###### sortBy?

`"name"` \| `"createdAt"` \| `"updatedAt"` = `...`

###### sortOrder?

`"asc"` \| `"desc"` = `...`

#### Returns

`Promise`\<\{ `page`: `number`; `pages`: `number`; `templates`: [`TemplateWithUsage`](../interfaces/TemplateWithUsage.md)[]; `total`: `number`; \}\>

***

### previewTemplate()

> **previewTemplate**(`tenantId`, `templateId`, `subscriberId?`, `sampleData?`): `Promise`\<\{ `html`: `string`; `subject`: `string`; `text`: `string`; \}\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:475](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L475)

Preview template with subscriber data

#### Parameters

##### tenantId

`string`

##### templateId

`string`

##### subscriberId?

`string`

##### sampleData?

`Record`\<`string`, `any`\> = `{}`

#### Returns

`Promise`\<\{ `html`: `string`; `subject`: `string`; `text`: `string`; \}\>

***

### processHtmlContent()

> `private` **processHtmlContent**(`html`): `Promise`\<`string`\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:397](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L397)

Process HTML content

#### Parameters

##### html

`string`

#### Returns

`Promise`\<`string`\>

***

### registerHelpers()

> `private` **registerHelpers**(): `void`

Defined in: [src/modules/email-marketing/services/email-template.service.ts:40](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L40)

Register Handlebars helpers

#### Returns

`void`

***

### renderTemplate()

> **renderTemplate**(`templateId`, `data`, `tenantId?`): `Promise`\<\{ `html`: `string`; `subject`: `string`; `text`: `string`; \}\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:254](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L254)

Render template with data

#### Parameters

##### templateId

`string`

##### data

`Record`\<`string`, `any`\>

##### tenantId?

`string`

#### Returns

`Promise`\<\{ `html`: `string`; `subject`: `string`; `text`: `string`; \}\>

***

### sendTestTemplate()

> **sendTestTemplate**(`tenantId`, `templateId`, `recipientEmail`, `sampleData`): `Promise`\<`void`\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:639](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L639)

Send a test email for a template

#### Parameters

##### tenantId

`string`

##### templateId

`string`

##### recipientEmail

`string`

##### sampleData

`Record`\<`string`, `any`\> = `{}`

#### Returns

`Promise`\<`void`\>

***

### updateTemplate()

> **updateTemplate**(`tenantId`, `templateId`, `data`): `Promise`\<\{ \}\>

Defined in: [src/modules/email-marketing/services/email-template.service.ts:124](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L124)

Update a template

#### Parameters

##### tenantId

`string`

##### templateId

`string`

##### data

###### category?

`string` = `...`

###### description?

`string` = `...`

###### htmlContent?

`string` = `...`

###### isArchived?

`boolean` = `...`

###### isPublic?

`boolean` = `...`

###### metadata?

`Record`\<`string`, `any`\> = `...`

###### name?

`string` = `...`

###### preheader?

`string` = `...`

###### subject?

`string` = `...`

###### textContent?

`string` = `...`

###### thumbnail?

`string` = `...`

###### variables?

`object`[] = `...`

#### Returns

`Promise`\<\{ \}\>

## Properties

### eventBus

> `private` `readonly` **eventBus**: [`EventBus`](../../../../../shared/events/event-bus/classes/EventBus.md)

Defined in: [src/modules/email-marketing/services/email-template.service.ts:29](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L29)

***

### handlebars

> `private` **handlebars**: *typeof* `Handlebars`

Defined in: [src/modules/email-marketing/services/email-template.service.ts:25](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L25)

***

### prisma

> `private` `readonly` **prisma**: [`PrismaService`](../../../../../infrastructure/database/prisma.service/classes/PrismaService.md)

Defined in: [src/modules/email-marketing/services/email-template.service.ts:28](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L28)

***

### redis

> `private` `readonly` **redis**: [`RedisService`](../../../../../infrastructure/cache/redis.service/classes/RedisService.md)

Defined in: [src/modules/email-marketing/services/email-template.service.ts:30](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L30)

***

### storage

> `private` `readonly` **storage**: [`StorageService`](../../../../../shared/services/storage.service/classes/StorageService.md)

Defined in: [src/modules/email-marketing/services/email-template.service.ts:31](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/email-marketing/services/email-template.service.ts#L31)
