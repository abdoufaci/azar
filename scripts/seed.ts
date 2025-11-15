import { db } from "@/lib/db";
import ShortUniqueId from "short-unique-id";
import { v4 } from "uuid";

const main = async () => {
  try {
    console.log("Adding direct group");

    // await db.demandStage.createMany({
    //   data: [
    //     {
    //       color: "#8A38F5",
    //       name: "Commande",
    //     },
    //     {
    //       color: "#1E78FF",
    //       name: "En Cours..",
    //     },
    //     {
    //       color: "#21D954",
    //       name: "Fini",
    //     },
    //     {
    //       color: "#CE2A2A",
    //       name: "Annule",
    //     },
    //   ],
    // });

    // await db.demandMaterial.createMany({
    //   data: [
    //     {
    //       name: "Bois",
    //       color: "#056BE4",
    //     },
    //     {
    //       name: "Tissu",
    //       color: "#F37323",
    //     },
    //   ],
    // });

    await db.stock.deleteMany();
    await db.desk.deleteMany();

    console.log("adding finished");
  } catch (error) {
    console.log({ error });
    // throw new Error("Failed to seed the database");
  }
};

main();
