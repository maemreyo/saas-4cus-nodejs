[**modern-backend-template v2.0.0**](../../../README.md)

***

[modern-backend-template](../../../modules.md) / [shared/exceptions](../README.md) / NotFoundException

# Class: NotFoundException

Defined in: [src/shared/exceptions/index.ts:53](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/exceptions/index.ts#L53)

## Extends

- [`BaseException`](BaseException.md)

## Constructors

### Constructor

> **new NotFoundException**(`message`, `details?`): `NotFoundException`

Defined in: [src/shared/exceptions/index.ts:54](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/exceptions/index.ts#L54)

#### Parameters

##### message

`string` = `'Not Found'`

##### details?

`any`

#### Returns

`NotFoundException`

#### Overrides

[`BaseException`](BaseException.md).[`constructor`](BaseException.md#constructor)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [src/shared/exceptions/index.ts:13](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/exceptions/index.ts#L13)

#### Returns

`object`

##### code

> **code**: `string`

##### details

> **details**: `any`

##### message

> **message**: `string`

##### name

> **name**: `string`

##### statusCode

> **statusCode**: `number`

#### Inherited from

[`BaseException`](BaseException.md).[`toJSON`](BaseException.md#tojson)

## Properties

### code

> **code**: `string`

Defined in: [src/shared/exceptions/index.ts:5](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/exceptions/index.ts#L5)

#### Inherited from

[`BaseException`](BaseException.md).[`code`](BaseException.md#code)

***

### details?

> `optional` **details**: `any`

Defined in: [src/shared/exceptions/index.ts:6](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/exceptions/index.ts#L6)

#### Inherited from

[`BaseException`](BaseException.md).[`details`](BaseException.md#details)

***

### message

> **message**: `string`

Defined in: [src/shared/exceptions/index.ts:3](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/exceptions/index.ts#L3)

#### Inherited from

[`BaseException`](BaseException.md).[`message`](BaseException.md#message)

***

### statusCode

> **statusCode**: `number`

Defined in: [src/shared/exceptions/index.ts:4](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/exceptions/index.ts#L4)

#### Inherited from

[`BaseException`](BaseException.md).[`statusCode`](BaseException.md#statuscode)
