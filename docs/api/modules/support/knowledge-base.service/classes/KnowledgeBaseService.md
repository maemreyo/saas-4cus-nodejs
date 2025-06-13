[**modern-backend-template v2.0.0**](../../../../README.md)

***

[modern-backend-template](../../../../modules.md) / [modules/support/knowledge-base.service](../README.md) / KnowledgeBaseService

# Class: KnowledgeBaseService

Defined in: [src/modules/support/knowledge-base.service.ts:32](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L32)

## Constructors

### Constructor

> **new KnowledgeBaseService**(): `KnowledgeBaseService`

#### Returns

`KnowledgeBaseService`

## Methods

### buildResponseTemplate()

> `private` **buildResponseTemplate**(`phrases`): `string`

Defined in: [src/modules/support/knowledge-base.service.ts:332](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L332)

#### Parameters

##### phrases

`string`[]

#### Returns

`string`

***

### extractCommonPhrases()

> `private` **extractCommonPhrases**(`messages`): `string`[]

Defined in: [src/modules/support/knowledge-base.service.ts:312](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L312)

#### Parameters

##### messages

`string`[]

#### Returns

`string`[]

***

### extractKeywords()

> `private` **extractKeywords**(`text`): `string`[]

Defined in: [src/modules/support/knowledge-base.service.ts:252](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L252)

#### Parameters

##### text

`string`

#### Returns

`string`[]

***

### fallbackSearch()

> `private` **fallbackSearch**(`query`, `options?`): `Promise`\<[`SuggestedSolution`](../interfaces/SuggestedSolution.md)[]\>

Defined in: [src/modules/support/knowledge-base.service.ts:243](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L243)

#### Parameters

##### query

`string`

##### options?

###### category?

`string`

###### limit?

`number`

#### Returns

`Promise`\<[`SuggestedSolution`](../interfaces/SuggestedSolution.md)[]\>

***

### generateAutoResponse()

> **generateAutoResponse**(`category`, `issueType`): `Promise`\<`string`\>

Defined in: [src/modules/support/knowledge-base.service.ts:205](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L205)

Create auto-response template from resolved tickets

#### Parameters

##### category

`string`

##### issueType

`string`

#### Returns

`Promise`\<`string`\>

***

### getCommonIssueArticles()

> **getCommonIssueArticles**(): `Promise`\<`object`[]\>

Defined in: [src/modules/support/knowledge-base.service.ts:169](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L169)

Get articles related to common ticket issues

#### Returns

`Promise`\<`object`[]\>

***

### getPopularArticles()

> **getPopularArticles**(`limit`): `Promise`\<[`KnowledgeArticle`](../interfaces/KnowledgeArticle.md)[]\>

Defined in: [src/modules/support/knowledge-base.service.ts:117](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L117)

Get popular articles

#### Parameters

##### limit

`number` = `10`

#### Returns

`Promise`\<[`KnowledgeArticle`](../interfaces/KnowledgeArticle.md)[]\>

***

### getSuggestedArticles()

> **getSuggestedArticles**(`ticketSubject`, `ticketDescription`, `category?`): `Promise`\<[`SuggestedSolution`](../interfaces/SuggestedSolution.md)[]\>

Defined in: [src/modules/support/knowledge-base.service.ts:100](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L100)

Get suggested articles for a ticket

#### Parameters

##### ticketSubject

`string`

##### ticketDescription

`string`

##### category?

`string`

#### Returns

`Promise`\<[`SuggestedSolution`](../interfaces/SuggestedSolution.md)[]\>

***

### identifyCommonIssues()

> `private` **identifyCommonIssues**(`tickets`): `object`[]

Defined in: [src/modules/support/knowledge-base.service.ts:287](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L287)

#### Parameters

##### tickets

`any`[]

#### Returns

`object`[]

***

### indexArticle()

> **indexArticle**(`article`): `Promise`\<`void`\>

Defined in: [src/modules/support/knowledge-base.service.ts:340](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L340)

Index knowledge article for search

#### Parameters

##### article

[`KnowledgeArticle`](../interfaces/KnowledgeArticle.md)

#### Returns

`Promise`\<`void`\>

***

### rateArticle()

> **rateArticle**(`articleId`, `userId`, `helpful`): `Promise`\<`void`\>

Defined in: [src/modules/support/knowledge-base.service.ts:144](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L144)

Rate article helpfulness

#### Parameters

##### articleId

`string`

##### userId

`string`

##### helpful

`boolean`

#### Returns

`Promise`\<`void`\>

***

### searchSolutions()

> **searchSolutions**(`query`, `options?`): `Promise`\<[`SuggestedSolution`](../interfaces/SuggestedSolution.md)[]\>

Defined in: [src/modules/support/knowledge-base.service.ts:36](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L36)

Search for solutions based on ticket content

#### Parameters

##### query

`string`

##### options?

###### category?

`string`

###### limit?

`number`

#### Returns

`Promise`\<[`SuggestedSolution`](../interfaces/SuggestedSolution.md)[]\>

***

### trackArticleView()

> **trackArticleView**(`articleId`, `userId?`): `Promise`\<`void`\>

Defined in: [src/modules/support/knowledge-base.service.ts:126](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L126)

Track article view

#### Parameters

##### articleId

`string`

##### userId?

`string`

#### Returns

`Promise`\<`void`\>

***

### updateArticleRatings()

> `private` **updateArticleRatings**(`articleId`): `Promise`\<`void`\>

Defined in: [src/modules/support/knowledge-base.service.ts:274](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L274)

#### Parameters

##### articleId

`string`

#### Returns

`Promise`\<`void`\>

***

### updateArticleViewCount()

> `private` **updateArticleViewCount**(`articleId`, `views`): `Promise`\<`void`\>

Defined in: [src/modules/support/knowledge-base.service.ts:269](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/modules/support/knowledge-base.service.ts#L269)

#### Parameters

##### articleId

`string`

##### views

`number`

#### Returns

`Promise`\<`void`\>
