# Member-Backend

This repo is the backend for the Member project.

Find the frontend repo at: [LINK](https://google.com)

Download Android: [LINK](https://google.com)\
Download IOS: [LINK](https://google.com)

Note: Frontend Repo and download links are temporary placeholders.

## Objective

The Objective of the Member project is to provide an easy-to-use mobile-first platform with which:
1. Organizations can easily manage and distribute information to their members
2. Users can easily access all their memberships.


## Installation

Download the repository and use the node-package-manager to install all the relevant packages.

```bash
npm install
```

Add a `.env` file to the root folder. Follow the below template:


```python
MOBGODB_URI=[YOUR_ACTIVE_MONGO_DB_URI_HERE]
TEST_MONGODB_URI=[YOUR_TEST_MONGO_DB_URI_HERE]

NODE_ENV=[PICK ONE: active OR test]

PORT=3001

JWT_SECRET =[YOUR_JWT_SECRET_KEY_HERE]
JWT_EXPIRY = [YOUR_EXPIRY_TIME_HERE_IN_SECONDS]
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
Copyright © 2022, Saikrishna Tadepalli. Released under the [MIT](https://choosealicense.com/licenses/mit/) License.
