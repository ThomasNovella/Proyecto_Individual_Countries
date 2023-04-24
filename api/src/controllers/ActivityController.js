const { Activity } = require("../db.js")

const createActivity = async(name, difficulty, duration, season, ids)=>{
    if(!name || !difficulty || !duration || !season || !ids.length){
        return "Please enter the obligatory fields"
    } 

    const validSeasons = ["summer", "fall", "winter", "spring"]
    if(!validSeasons.includes(season)){
        return "the season is not valid"
    }

    const [activity, created] = await Activity.findOrCreated({
        where: { name },
        defaults: { difficulty, duration, season }
    })
    if(!created){
        return "there's already an activity with that name"
    }
    //relacion de los modelos
    await activity.setCountries(ids);

    return "activity created successfully"
}

module.exports = { createActivity }