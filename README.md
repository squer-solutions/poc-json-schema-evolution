# Intro
This repo consists of two parts ...
* test-code exploring the json-schema evolution
* documentation outlining the findings

To cut straight to the chase, we first outline the findings and describe how to set up and run the tests
afterwards.

# JSON-Schema Evolution
The models used for Kafka Records are the APIs used to interact with our services. As features are added and
modified, we will likely have to evolve the schemas as well. The schema registry helps us in doing so, but to use it
effectively, json-schema is an attractive choice. If you plan on using it, you should be aware of how it works in detail.

The official documentation does not go into said detail, which is why we document our possibilities here. 
We focus on our commonly used compatibility levels.

## FORWARD Compatibility
> Forward compatibility – all documents that conform to the new version are also valid according to the previous version of the schema

Forward compatibility is often used for documents and events. This allows old clients to still read the new documents,
decoupling our changes from client's changes -> allowing us to iterate faster.

| AdditionalProperties | true | false |
|----------------------|------|-------|
| Add optional         | :heavy_check_mark: | :x: |
| Add mandatory        | :heavy_check_mark: | :x: |
| Remove optional      | :x: | :heavy_check_mark: |
| Remove mandatory     | :x: | :x: |

Forward Compatible topics can transition from `true` -> `false` for `additionalProperties`. The other way around isn't possible.

## BACKWARD Compatibility
> Backward compatibility – all documents that conform to the previous version of the schema are also valid according to the new version.

Backward compatibility is often used for defining Commands your service accepts. This allows old versions of our clients 
to continue using us with old versions of their software, decoupling our changes from client's changes -> allowing us to iterate faster.

| AdditionalProperties | true | false |
|----------------------|------|-------|
| Add optional         | :x: | :heavy_check_mark: |
| Add mandatory        | :x: | :x: |
| Remove optional      | :x: | :x: |
| Remove mandatory     | :x: | :x: |

WARNING WARNING WARNING:
Transitioning from `additionalProperties=true` to `false` is not possible! Therefore if you don't pay attention,
you won't be able to modify the schema at all!

It should be noted that you can use old versions of schemas! Meaning that rollbacks and rolling updates are possible for
both FORWARD and BACKWARD compatible schemas.

### Addendum: What is additionalProperties?
As seen above, additionalProperties has a big impact on the compatibility of the kafka models. It therefore makes sense to
why is has such a big impact. To not reiterate what has already been said better, you can read up on the open, closed and partially
open content models in json-schema [here](https://yokota.blog/2021/03/29/understanding-json-schema-compatibility/).

The most important thing to understand is that, by setting additionalProperties to `true` (the default), we essentially say:
"This schema describes the minimum of what my message will contain - but anything else could be part of it as well."

This is why, in FORWARD compatibility, removing an optional field is not possible with `true`. We essentially stop guaranteeing
that we will deliver a field, but "anything else could be part of it as well." means that a field with the same name is also
included in what our new schema describes. This is a potential conflict and therefore not allowed.

Similar reasoning applies to BACKWARD compatibility. We cannot add any fields because all potential other fields are already included
in "anything else could be part of it as well." - by introducing a new field we'd be asking for a conflict according to json-schema.

This presents us with severe constraints on BACKWARDS compatibility.

# Setup and Running the Tests
### Getting Started with NodeJS
To get started with this repository we assume that you have the following installed locally...

#### Docker Desktop
Follow this link for instructions: https://docs.docker.com/get-docker/

#### Node Version Manager
You will need Node on your machine to be able to run the application. We will use the Node Version Manager to install
our first node install. Follow the official install guide for NVM: https://github.com/nvm-sh/nvm. Afterwards, navigate to the root directory of the repository and ...
```shell
nvm use
```
... you might need to install the requested version. Follow the feedback the tool gives you.

To pull all the dependencies needed, run...
```shell
npm install
```
.. you should be ready to run the code in this repository.

### Running the Tests
To execute the exploratory tests, run...
```shell
npm run test
```

# Final Notes

Please feel free to contribute and give feedback. It is highly appreciated.
