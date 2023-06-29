# Discriminators with Mongoose and MongoDB

This is the complementary repository for our
video [How to use discriminators with Mongoose and MongoDB](https://www.youtube.com/watch?v=hSHcMhPGME8) (channel
[@fromDev2Dev](https://www.youtube.com/@fromDev2Dev)).

[![How to use discriminators with Mongoose and MongoDB](https://img.youtube.com/vi/hSHcMhPGME8/0.jpg)](https://www.youtube.com/watch?v=hSHcMhPGME8)

This is about how to have different schemas in a same MongoDB collection using discriminators.
Discriminators provide a way to implement inheritance-like behavior in your data models. They allow you to define a base
schema that can be extended or specialized by creating child schemas.

### Installation

```
npm install
```

### Running the tests

```
npm run test
```

### Running the demo

Open a terminal in the project's root directory and run:

```
cd mongodb
docker-compose up -d
./init-db.sh
cd ..
npm run dev
```
