import express from "express";
import axios from "axios";

const app = express();
const port = 3021;
const API_URL = "https://api.clashroyale.com/v1";
const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjJiNTVmZmE3LWY0MDAtNGY3OS1hNWJjLTE3ZmFlZWVkMTBhMiIsImlhdCI6MTcyODQ1NTc3NSwic3ViIjoiZGV2ZWxvcGVyL2ZlNTQwZDA1LTliYzItZDcwYi1mNDRmLWM0MDc3M2VjZjYyOSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTQuNS4xOS40Il0sInR5cGUiOiJjbGllbnQifV19.2843Ws8qnZHIiBc0joHjbc2cF7GF_DidJu0smh2PXdLAOU23Dvu6cdj1FHFXe_kShRm1vXUhuOop-6HEdkuDnQ";
const config = {
  headers: { Authorization: `Bearer ${token}` },
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

function fixChestNames(chestItems) {
  for (let i = 0; i < chestItems.length; i++) {
    switch (chestItems[i].name) {
      case "Golden Chest":
        chestItems[i].name = "Gold";
        break;

      case "Silver Chest":
        chestItems[i].name = "Silver";
        break;

      case "Gold Crate":
        chestItems[i].name = "GoldCrate";
        break;

      case "Plentiful Gold Crate":
        chestItems[i].name = "PlentifulCrate";
        break;

      case "Overflowing Gold Crate":
        chestItems[i].name = "OverflowingCrate";
        break;

      case "Magical Chest":
        chestItems[i].name = "Magic";
        break;

      case "Giant Chest":
        chestItems[i].name = "Giant";
        break;

      case "Legendary Chest":
        chestItems[i].name = "Legendary";
        break;

      case "Tower Troop Chest":
        chestItems[i].name = "Tower";
        break;

      case "Epic Chest":
        chestItems[i].name = "Epic";
        break;

      case "Royal Wild Chest":
        chestItems[i].name = "RoyalWildChest";
        break;

      case "Golden Chest":
        chestItems[i].name = "Gold";
        break;

      case "Mega Lightning Chest":
        chestItems[i].name = "Mega";
        break;

      default:
        break;
    }
  }
  return chestItems;
}

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/clans", async (req, res) => {
  try {
    const player = await axios.get(
      `${API_URL}/players/%23${req.query.playerTag}`,
      config
    );
    let clanTag = player.data.clan.tag;
    console.log(clanTag);
    clanTag = clanTag.replace("#", "%23");
    let clan = await axios.get(`${API_URL}/clans/${clanTag}`, config);
    clan = clan.data;
    console.log(clan);
    res.render("clans.ejs", {
      clan: {
        name: clan.name,
        description: clan.description,
        warTrophies: clan.clanWarTrophies,
        clanName: clan.location.name,
        isCountry: clan.location.isCountry,
        reqTrophies: clan.requiredTrophies,
        members: clan.members,
      },
      players: {
        one: {
          name: clan.memberList[0].name,
          role: clan.memberList[0].role,
          trophies: clan.memberList[0].trophies,
          arena: clan.memberList[0].arena.name,
        },
        two: {
          name: clan.memberList[1].name,
          role: clan.memberList[1].role,
          trophies: clan.memberList[1].trophies,
          arena: clan.memberList[1].arena.name,
        },
        three: {
          name: clan.memberList[2].name,
          role: clan.memberList[2].role,
          trophies: clan.memberList[2].trophies,
          arena: clan.memberList[2].arena.name,
        },
      },
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.render("index.ejs", {
      content: { error: "An error occurred while fetching player info." },
    });
  }
});

app.post("/player-info", async (req, res) => {
  try {
    // player inf
    const player = await axios.get(
      `${API_URL}/players/%23${req.body.playerTag}`,
      config
    );
    const chests = await axios.get(
      `${API_URL}/players/%23${req.body.playerTag}/upcomingchests`,
      config
    );

    console.log("HERE");
    console.log(chests.data.items);
    fixChestNames(chests.data.items);
    res.render("index.ejs", {
      player: {
        main: {
          name: player.data.name,
          trophies: player.data.trophies,
          bestTrophies: player.data.bestTrophies,
          arena: player.data.arena.name,
          league: player.data.currentPathOfLegendSeasonResult.leagueNumber,
        },
        games: {
          wins: player.data.wins,
          losses: player.data.losses,
          battleCount: player.data.battleCount,
          threeCrownWins: player.data.threeCrownWins,
        },
        donations: {
          donations: player.data.donations,
          donationsReceived: player.data.donationsReceived,
          totalDonations: player.data.totalDonations,
        },
      },
      chests: chests.data.items,
      playerTag: req.body.playerTag,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.render("index.ejs", {
      content: { error: "An error occurred while fetching player info." },
    });
  }
});

app.listen(port, () => {
  console.log(`Index running on port ${port}`);
});
