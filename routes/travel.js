const router = require("express").Router();
// const {
//   requireSuperadminSignin,
// } = require("../controllers/auth-owner");
const {
  add,
  update,
  read,
  remove,
  getTravels,
  travelById
} = require("../controllers/travel");

router
  .route("/")
  .get(getTravels)
  .post(add);
//   .post(requireSuperadminSignin, add);

router
  .route("/:id")
  .get(read)
  .put(update)
  .delete(remove);

router.param("id", travelById);

module.exports = router;
