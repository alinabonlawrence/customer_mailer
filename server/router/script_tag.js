import Router from "koa-router";
const router = new Router({ prefix: "/scrip_tag" });
router.get("/", async (ctx) => {
  ctx.body = "Get Script tag";
});

router.get("/all", async (ctx) => {
  ctx.body = "Get All Script tag";
});

router.get("/", async (ctx) => {
  ctx.body = "Get Script tag";
});

router.get("/", async (ctx) => {
  ctx.body = "Delete Script tag";
});

export default router;
