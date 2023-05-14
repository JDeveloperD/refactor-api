import db from "mongoose";

async function init(url: string) {
  await db.connect(url).then(() => {
    console.log("✔️ [DB] =>" + url);
    console.log(db.models);
  });
}

export default {
  init,
};
