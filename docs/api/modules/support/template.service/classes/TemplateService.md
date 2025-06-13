[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/template.service](../README.md) / TemplateService

# Class: TemplateService

Defined in: [src/modules/support/template.service.ts:11](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/template.service.ts#L11)

## Constructors

### Constructor

> **new TemplateService**(): `TemplateService`

#### Returns

`TemplateService`

## Methods

### applyTemplateVariables()

> **applyTemplateVariables**(`template`, `variables`): `object`

Defined in: [src/modules/support/template.service.ts:152](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/template.service.ts#L152)

Apply template variables

#### Parameters

##### template

##### variables

`Record`\<`string`, `string`\>

#### Returns

`object`

##### content

> **content**: `string`

##### subject

> **subject**: `string`

***

### createTemplate()

> **createTemplate**(`data`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/template.service.ts:59](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/template.service.ts#L59)

Create template

#### Parameters

##### data

[`CreateTemplateDTO`](../../ticket.dto/classes/CreateTemplateDTO.md)

#### Returns

`Promise`\<\{ \}\>

***

### deleteTemplate()

> **deleteTemplate**(`templateId`): `Promise`\<`void`\>

Defined in: [src/modules/support/template.service.ts:100](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/template.service.ts#L100)

Delete template

#### Parameters

##### templateId

`string`

#### Returns

`Promise`\<`void`\>

***

### duplicateTemplate()

> **duplicateTemplate**(`templateId`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/template.service.ts:176](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/template.service.ts#L176)

Duplicate template

#### Parameters

##### templateId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getFrequentTemplates()

> **getFrequentTemplates**(`limit`, `userId?`): `Promise`\<`object`[]\>

Defined in: [src/modules/support/template.service.ts:134](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/template.service.ts#L134)

Get frequently used templates

#### Parameters

##### limit

`number` = `5`

##### userId?

`string`

#### Returns

`Promise`\<`object`[]\>

***

### getTemplate()

> **getTemplate**(`templateId`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/template.service.ts:43](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/template.service.ts#L43)

Get template by ID

#### Parameters

##### templateId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getTemplates()

> **getTemplates**(`options?`): `Promise`\<`object`[]\>

Defined in: [src/modules/support/template.service.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/template.service.ts#L16)

Get all templates

#### Parameters

##### options?

###### active?

`boolean`

###### category?

`string`

#### Returns

`Promise`\<`object`[]\>

***

### toggleTemplateStatus()

> **toggleTemplateStatus**(`templateId`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/template.service.ts:114](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/template.service.ts#L114)

Toggle template status

#### Parameters

##### templateId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### updateTemplate()

> **updateTemplate**(`templateId`, `updates`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/template.service.ts:80](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/template.service.ts#L80)

Update template

#### Parameters

##### templateId

`string`

##### updates

`Partial`\<[`CreateTemplateDTO`](../../ticket.dto/classes/CreateTemplateDTO.md)\>

#### Returns

`Promise`\<\{ \}\>
