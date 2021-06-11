const express = require("express");
const router = express.Router();
// const { requireOwnerSignin, isPoster } = require("../controllers/auth-owner");

const {
  read,
  create,
  update,
  remove,
  busBySlug,
  getBuses,
  searchBus,
  addNewBus,
  searchBusByFilter,
  getAvailableBusesOfOwner,
  getUnavailableBusesOfOwner,
  getAllAvailableBuses,
  getAllUnavailableBuses
} = require("../controllers/bus");

const { uploadBusImage } = require("../helpers");

// router
//   .route("/")
//   .get(getBuses)
//   .post(addNewBus);

router.get(
  "/owner-bus-available",
  // requireOwnerSignin,
  getAvailableBusesOfOwner
);
router.get(
  "/owner-bus-unavailable",
  // requireOwnerSignin,
  getUnavailableBusesOfOwner
);

router.get("/all-bus-available", getAllAvailableBuses);
router.get("/all-bus-unavailable", getAllUnavailableBuses);
router.post("/bus/add", addNewBus);

router.get("/search", searchBus);
router.post("/filter", searchBusByFilter);

router
  .route("/:busSlug")
  .get(read)
  .put(uploadBusImage, update)
  .delete(remove);

router.param("busSlug", busBySlug);

module.exports = router;
