const { Router } = require("express");
const ControllerBanner = require("./controller");
const {
  // archivosBanner,
  archivosBannerResponsive,
} = require("../../middlewares/files");

const router = Router();

router.get("/", ControllerBanner.list);
router.post("/", archivosBannerResponsive, ControllerBanner.create);
// router.post('/', archivosBanner, ControllerBanner.create)
router.delete("/:id", ControllerBanner.remove);

module.exports = router;
