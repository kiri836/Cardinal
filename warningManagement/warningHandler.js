const warningEmbed = include('./embeds/warningEmbed');

const db = new sql.Database('./warningManagement/warnings.db', (err) => {
  if (err) {
    // Log the error
    console.error(err.message);
  } else {
    // Create the "warnings" table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS points (
      userId TEXT PRIMARY KEY,
      warningSeverity INTEGER,
      reason TEXT,
      warningId INTEGER
    )`);
  }
});

function warn(interaction){
	if (!interaction.options.getUser('user').bot){
		var warningId = uniqueIdGen(interaction.options.getUser('user').id);
		db.run('INSERT INTO warnings (userId, warningSeverity, reason, warningId) VALUES(${interaction.options.getUser('user').id}, ${interaction.options.getInteger('warningSeverity')}, ${interaction.options.getString('reason')}, ${uniqueIdGen(interaction.author.id)})');
	}
}

async function warnings(interaction){
	if (!interaction.options.getUser('user').bot){uniqueIdGen(interaction.author.id)
		db.all(`SELECT userId, warningSeverity, reason FROM warnings WHERE userId=${interaction.options.getUser('user').id} ORDER BY warningSeverity DESC`, [], async (err, row) => {
	      await setTimeout(() => {
	        return warningEmbed.create(row);
	      });
    	});
	}	
}

async function removeWarning(interaction, type){
	db.get(`SELECT warningId FROM warnings WHERE warningId=${interaction.options.getInt('warningId')}`, [], async (err,row) => {
			await setTimeout(() => {
				if (!err){
					db.run(`DELETE FROM warnings WHERE warningId=${interaction.options.getInt('warningId')}`);
					interaction.reply("Successfully removed the warning from the user.");
				} else {
					interaction.reply("No warnings with that Id.");
				}
			})
	})
}

async function uniqueIdGen(userId){
	var uniqueId = Math.floor(Math.random() * 1000000000) + 1000000000;
	db.all(`SELECT warningId FROM warnings WHERE userId=${userId}`, [], async (err, row) => {
	  await setTimeoute(() => {
		return row;
	  })
	})
	for (var i = 0; i < row.size; i++){
		if (uniqueId != row[i].warningId){
			continue;
		} else {
			uniqueId = Math.floor(Math.random() * 1000000000) + 1000000000;
			i = 0;
		}
	}
	return uniqueId;
}