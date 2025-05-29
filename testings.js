 dbConnection.query("SELECT * FROM rooms", (roomsSelectError, rooms) => {
      if (roomsSelectError) {
        res.status(500).send("Server Error: 500");
      } else {
        dbConnection.query("SELECT * FROM spots", (spotsSelectError, spots) => {
          if (spotsSelectError) {
            res.status(500).send("Server Error: 500");
          } else {
            res.render("index.ejs", { rooms, spots });
          }
          