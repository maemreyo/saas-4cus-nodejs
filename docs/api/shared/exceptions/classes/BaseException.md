[**modern-backend-template v2.0.0**](../../../README.md)

***

[modern-backend-template](../../../modules.md) / [shared/exceptions](../README.md) / BaseException

# Class: BaseException

Defined in: [src/shared/exceptions/index.ts:1](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/exceptions/index.ts#L1)

## Extends

- `Error`

## Extended by

- [`AppError`](AppError.md)
- [`BadRequestException`](BadRequestException.md)
- [`UnauthorizedException`](UnauthorizedException.md)
- [`ForbiddenException`](ForbiddenException.md)
- [`NotFoundException`](NotFoundException.md)
- [`ConflictException`](ConflictException.md)
- [`ValidationException`](ValidationException.md)
- [`TooManyRequestsException`](TooManyRequestsException.md)
- [`InternalServerException`](InternalServerException.md)
- [`ServiceUnavailableException`](ServiceUnavailableException.md)

## Constructors

### Constructor

> **new BaseException**(`message`, `statusCode`, `code`, `details?`): `BaseException`

Defined in: [src/shared/exceptions/index.ts:2](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/exceptions/index.ts#L2)

#### Parameters

##### message

`string`

##### statusCode

`number`

##### code

`string`

##### details?

`any`

#### Returns

`BaseException`

#### Overrides

`Error.constructor`

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

## Properties

### code

> **code**: `string`

Defined in: [src/shared/exceptions/index.ts:5](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/exceptions/index.ts#L5)

***

### details?

> `optional` **details**: `any`

Defined in: [src/shared/exceptions/index.ts:6](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/exceptions/index.ts#L6)

***

### message

> **message**: `string`

Defined in: [src/shared/exceptions/index.ts:3](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/exceptions/index.ts#L3)

#### Inherited from

`Error.message`

***

### statusCode

> **statusCode**: `number`

Defined in: [src/shared/exceptions/index.ts:4](https://github.com/maemreyo/saas-4cus-nodejs/blob/2a5b3f3aa11335dfa561e80e1feabb8e6084261e/src/shared/exceptions/index.ts#L4)
