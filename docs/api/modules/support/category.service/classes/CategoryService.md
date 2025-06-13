[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/category.service](../README.md) / CategoryService

# Class: CategoryService

Defined in: [src/modules/support/category.service.ts:11](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/category.service.ts#L11)

## Constructors

### Constructor

> **new CategoryService**(): `CategoryService`

#### Returns

`CategoryService`

## Methods

### createCategory()

> **createCategory**(`data`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/category.service.ts:98](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/category.service.ts#L98)

Create category

#### Parameters

##### data

[`CreateCategoryDTO`](../../ticket.dto/classes/CreateCategoryDTO.md)

#### Returns

`Promise`\<\{ \}\>

***

### deleteCategory()

> **deleteCategory**(`categoryId`): `Promise`\<`void`\>

Defined in: [src/modules/support/category.service.ts:210](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/category.service.ts#L210)

Delete category

#### Parameters

##### categoryId

`string`

#### Returns

`Promise`\<`void`\>

***

### getCategories()

> **getCategories**(`includeInactive`): `Promise`\<`object`[]\>

Defined in: [src/modules/support/category.service.ts:16](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/category.service.ts#L16)

Get all categories

#### Parameters

##### includeInactive

`boolean` = `false`

#### Returns

`Promise`\<`object`[]\>

***

### getCategory()

> **getCategory**(`categoryId`): `Promise`\<`object` & `object`\>

Defined in: [src/modules/support/category.service.ts:56](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/category.service.ts#L56)

Get category by ID

#### Parameters

##### categoryId

`string`

#### Returns

`Promise`\<`object` & `object`\>

***

### getCategoryBySlug()

> **getCategoryBySlug**(`slug`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/category.service.ts:78](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/category.service.ts#L78)

Get category by slug

#### Parameters

##### slug

`string`

#### Returns

`Promise`\<\{ \}\>

***

### getPopularCategories()

> **getPopularCategories**(`limit`): `Promise`\<`object`[]\>

Defined in: [src/modules/support/category.service.ts:282](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/category.service.ts#L282)

Get popular categories

#### Parameters

##### limit

`number` = `5`

#### Returns

`Promise`\<`object`[]\>

***

### reorderCategories()

> **reorderCategories**(`categoryOrders`): `Promise`\<`void`\>

Defined in: [src/modules/support/category.service.ts:262](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/category.service.ts#L262)

Reorder categories

#### Parameters

##### categoryOrders

`object`[]

#### Returns

`Promise`\<`void`\>

***

### toggleCategoryStatus()

> **toggleCategoryStatus**(`categoryId`): `Promise`\<\{ \}\>

Defined in: [src/modules/support/category.service.ts:238](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/category.service.ts#L238)

Toggle category status

#### Parameters

##### categoryId

`string`

#### Returns

`Promise`\<\{ \}\>

***

### updateCategory()

> **updateCategory**(`categoryId`, `updates`): `Promise`\<`object` & `object`\>

Defined in: [src/modules/support/category.service.ts:144](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/category.service.ts#L144)

Update category

#### Parameters

##### categoryId

`string`

##### updates

`Partial`\<[`CreateCategoryDTO`](../../ticket.dto/classes/CreateCategoryDTO.md)\>

#### Returns

`Promise`\<`object` & `object`\>
