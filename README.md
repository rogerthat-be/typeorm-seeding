<p align="center">
  <img src="./logo.png" alt="logo" width="160" />
</p>
<h1 align="center" style="text-align: center;">TypeORM Seeding</h1>

<p align="center">
  <img alt="NPM" src="https://img.shields.io/npm/l/@concepta/typeorm-seeding?style=for-the-badge">
  <a href="https://www.npmjs.com/package/@concepta/typeorm-seeding">
    <img alt="NPM latest version" src="https://img.shields.io/npm/v/@concepta/typeorm-seeding/latest?style=for-the-badge">
  </a>
</p>

<p align="center">
  <b>A simple but powerful database seeder for TypeORM ^0.3.0</b></br>
</p>

<p align="center">
  <sub>A <a href="https://github.com/conceptadev">Concepta</a> Fork of <a href="https://github.com/w3tecch/typeorm-seeding">TypeORM Seeding</a></sub>
</p>

<p align="center">
  <sub>Originally authored and maintained by <a href="https://github.com/hirsch88">Gery Hirschfeld</a>,
  <a href="https://github.com/jorgebodega">Jorge Bodega</a> and
  <a href="https://github.com/w3tecch/typeorm-seeding/graphs/contributors">Contributors</a></sub>
</p>

<br />

## Additional contents

- [Factory](#factory-1)
- [Seeder](#seeder-1)
- [CLI](#cli-configuration)
- [Testing features](#testing-features)

## Installation

Before using this TypeORM extension please read the [TypeORM Getting Started](https://typeorm.io/#/) documentation. This explains how to setup a TypeORM project.

After that install the extension with `npm` or `yarn`. Add development flag if you are not using seeders nor factories in production code.

```bash
npm i [-D] @concepta/typeorm-seeding
yarn add [-D] @concepta/typeorm-seeding

> This module requires TypeORM 0.3.0 and higher.
```

### Configuration

To enable seeding from the CLI, you must provide a DataSource config and SeedingSource config.

### DataSource Config

```javascript
const { DataSource } = require('typeorm')
const { User, Pet } = require('./my-module')

module.exports = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [User, Pet],
})
```

### SeedingSource Options

```typescript
type SeedingSourceOptions = {
  // seeders
  seeders: ClassConstructor<Seeder>[]
  // default seeders
  defaultSeeders: ClassConstructor<Seeder>[]
  // data source instance, or options for creating a data source instance
  dataSource: DataSource | DataSourceOptions
}
```

```javascript
const { SeedingSource } = require('@concepta/typeorm-seeding')
const { AppSeeder, UserSeeder, PetSeeder, dataSource } = require('./my-module')

module.exports = new SeedingSource({
  seeders: [UserSeeder, PetSeeder],
  defaultSeeders: [AppSeeder],
  dataSource, // overridden if provided by CLI arg
})
```

## Introduction

Isn't it exhausting to create some sample data for your database? Well this time is over!

How does it work? Just create a entity factory and/or seed script.

### Entity

```typescript
@Entity()
class User {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column() name: string

  @Column() lastname: string
}
```

### Factory

```typescript
// basic
class UserFactory extends Factory<User> {
  protected entity(): User {
    const user = new User()
    user.name = 'John'
    user.lastname = 'Doe'
    return user
  }
}

// advanced (see overrides API)
class UserFactory extends Factory<User> {
  protected options = {
    entity: User,
  }

  protected entity(user: User): User {
    user.name = 'John'
    user.lastname = 'Doe'
    return user
  }
}
```

### Seeder

```typescript
import { seedingSource } from './my-module'

export class UserExampleSeeder extends Seeder {
  async run() {
    await new UserFactory({ seedingSource }).create({
      name: 'Jane',
    })
  }
}
```

## Factory

Factory is how we provide a way to simplify entities creation, implementing a
[factory creational pattern](https://refactoring.guru/design-patterns/factory-method).
It is defined as an abstract class with generic typing, so you have to extend over it.

```typescript
// basic
class UserFactory extends Factory<User> {
  protected entity(): User {
    const user = new User()
    // ...
    return user
  }
}

// advanced (see overrides API)
class UserFactory extends Factory<User> {
  protected options = {
    entity: User,
  }

  protected entity(user: User): User {
    // ...
    return user
  }
}
```

### `entity`

This method can be overridden to customize how the entity is generated.
It is called to instantiate the entity and the result will be used on the rest of factory lifecycle.

```typescript
protected entity(user: User): User {
    user.name = 'John'
    user.lastname = 'Doe'
    return user
}
```

It is possible to create more than one factory related to a single entity, with different entity functions.

### `map`

Use the `.map()` function to alter the generated value before they get processed.

```typescript
map(mapFunction: (entity: Entity) => void): Factory
```

```typescript
import { seedingSource } from './my-module'

new UserFactory({ seedingSource }).map((user) => {
  user.name = 'Jane'
})
```

### `finalize`

This method can be overridden to customize how the entity is finalized.
It is called at the end of the entity generation lifecycle, giving one last opportunity to set defaults or perform data validation, etc.

```typescript
import { seedingSource } from './my-module'

protected async finalize(pet: Pet): Promise<void> {
  if (!pet.owner) {
    pet.owner = await new UserFactory({ seedingSource }).create()
  }
}
```

### `make` & `makeMany`

Make and makeMany executes the factory functions and return a new instance of the given entity. The instance is filled with the generated values from the factory function, but not saved in the database.

- **overrideParams** - Override some of the attributes of the entity.

```typescript
make(overrideParams: Partial<Entity> = {}): Promise<Entity>
makeMany(amount: number, overrideParams: Partial<Entity> = {}): Promise<Entity>
```

```typescript
import { seedingSource } from './my-module'

// new factory
const userFactory = new UserFactory({ seedingSource })

// using defaults
const user = userFactory.make()
const users = userFactory.makeMany(10)

// override the email
const user = userFactory.make({ email: 'other@mail.com' })
const users = userFactory.makeMany(10, { email: 'other@mail.com' })
```

### `create` & `createMany`

the create and createMany method is similar to the make and makeMany method, but at the end the created entity instance gets persisted in the database using TypeORM entity manager.

- **overrideParams** - Override some of the attributes of the entity.
- **saveOptions** - [Save options](https://github.com/typeorm/typeorm/blob/master/src/repository/SaveOptions.ts) from TypeORM

```typescript
create(overrideParams: Partial<Entity> = {}, saveOptions?: SaveOptions): Promise<Entity>
createMany(amount: number, overrideParams: Partial<Entity> = {}, saveOptions?: SaveOptions): Promise<Entity>
```

```typescript
import { seedingSource } from './my-module'

// new factory
const userFactory = new UserFactory({ seedingSource })

// using default
const user = await userFactory.create()
const users = await userFactory.createMany(10)

// override the email
const user = await userFactory.create({ email: 'other@mail.com' })
const users = await userFactory.createMany(10, { email: 'other@mail.com' })

// using save options
const user = await userFactory.create({ email: 'other@mail.com' }, { listeners: false })
const users = await userFactory.createMany(10, { email: 'other@mail.com' }, { listeners: false })
```

### Execution order

As the order of execution can be complex, you can check it here:

1. **Map function**: Map function alters the already existing entity.
2. **Override params**: Alters the already existing entity.
3. **finalize method**: Last chance to set missing attributes or do data validation.
4. **Promises**: If some attribute is a promise, the promise will be resolved before the entity is created.
5. **Factories**: If some attribute is a factory, the factory will be executed with `make`/`create` like the previous one.

### Faker

[Faker](https://github.com/marak/Faker.js/) package was previously a dependency of the project,
but now it is optional due to its size. If you want to use faker, you may need to install it and import it.

```typescript
import { faker } from '@faker-js/faker'

class UserFactory extends Factory<User> {
  protected options = {
    entity: User,
  }

  protected entity(user: User): User {
    user.name = faker.name.firstName()
    user.lastname = faker.name.lastName()

    return user
  }
}
```

## Seeder

Seeder class is how we provide a way to insert data into databases,
and could be executed by the command line or by helper method.

It is an abstract class with one method to be implemented, and a helper function to run some more seeder sequentially.

```typescript
class UserSeeder extends Seeder {
  async run() {
    // ...
  }
}
```

### `run`

This function is the one that needs to be defined when extending the class. Could use `call` to run some other seeders.

```typescript
run(): Promise<void>
```

```typescript
async run() {
    await new UserFactory({ seedingSource: this.seedingSource }).createMany(10)
    await this.call([PetSeeder])
}
```

### `call`

This function allow to run some other seeders in a sequential way.

In order to use seeders from cli command, a default seeder class must be provided as root seeder, working as a tree structure.

<p align="center">
  <img src="./seeders.png" alt="logo" />
</p>

## CLI Configuration

There are two possible commands to execute, one to see the current configuration and one to run a seeder.

Add the following scripts to your `package.json` file to configure them.

```json
"scripts": {
  "seed:config": "typeorm-seeding config -r ./dist -c seeding-source.js",
  "seed:run": "typeorm-seeding seed -r ./dist -c seeding-source.js",
}
```

### `config`

This command just prints the seeder configuration.

```bash
typeorm-seeding config
```

Example result

```
{
  seeders: [ [class User], [class Pet] ],
  defaultSeeders: [ [class AppSeeder] ]
}
```

##### Options

| Option                    | Default         | Description                                      |
| ------------------------- | --------------- | ------------------------------------------------ |
| `--root` or `-r`          | `process.cwd()` | Path to the project root                         |
| `--seedingSource` or `-c` |                 | Relative path to the seeding config from `root`. |

### `seed`

This command execute a seeder, that could be specified as a parameter.

```bash
typeorm-seeding seed
```

##### Options

| Option                    | Default         | Description                                              |
| ------------------------- | --------------- | -------------------------------------------------------- |
| `--root` or `-r`          | `process.cwd()` | Path to the project root                                 |
| `--seedingSource` or `-c` |                 | Relative path to the seeding config from `root`.         |
| `--dataSource` or `-d`    |                 | Relative path to TypeORM data source config from `root`. |
| `--seed` or `-s`          |                 | Run a specific seeder class to run individually.         |

## Testing Features

To make seeding your unit tests a simple task, the `Runner` class is provided on `SeedingSource`.

To run one or more seeders with one command, use the `SeedingSource.runner` instance.

### Seeders

#### `SeedingSource.runner.one`

Execute one seeder.

```typescript
SeedingSource.runner.one(
  seeder: SeederInstanceOrClass,
): Promise<void>
```

#### `SeedingSource.runner.many`

Execute many seeders.

```typescript
SeedingSource.runner.many(
  seeders: SeederInstanceOrClass[],
): Promise<void>
```

#### `SeedingSource.runner.defaults`

Execute all default seeders.

```typescript
SeedingSource.runner.defaults(): Promise<void>
```

### Factories

Factories can be used stand alone if you explicitly pass a SeedingSource instance option to the constructor.

```typescript
import { seedingSource } from './my-module'

const factory = new UserFactory({ seedingSource })
const user = await factory.create()
```

### Seeders

Seeders can be used stand alone if you explicitly pass a SeedingSource instance option to the constructor.

```typescript
import { seedingSource } from './my-module'

const userSeeder = new UserSeeder({ seedingSource })
await userSeeder.run()
```
