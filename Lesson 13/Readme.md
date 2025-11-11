Lesson 13 - Homework

Endpoints containing tests:
POST /images/upload
GET /images/:image_id

POST /favourites
GET /favourites
DELETE /favourites/:favourite_id

POST /votes
GET /votes

v2 changes:
- Added checks to GET/images/:image_id that imageUrl was applied and it contains image id as a part of it;
- Added checks to GET/votes that a vote contains image object with correct id and url
- Added checks to GET/favourites that a favourite contains image object with correct id and url
