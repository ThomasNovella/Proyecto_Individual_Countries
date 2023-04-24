const { Router } = require('express');
const axios = require("axios");
const { Activity, Country } = require("../db.js")
const { Op } = require('sequelize')
const { createActivity } = require("../controllers/ActivityController.js")
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

const getApiInfo = async () => {
    const infoApi = await axios.get("https://restcountries.com/v3/all");

    const countries = infoApi.data.map(({ cca3, name, flags, continents, capital, subregion, area, population})=>{
        return {
            id: cca3,
            name: name.common,
            flags: flags? flags[1] : "not found",
            continent: continents[0],
            capital: capital? capital[0] : "No capital",
            subregion: subregion,
            area: area,
            population: population
        }
    })
    return countries
};

const apiToDb = async () => {
    try {
        const apiInfo = await getApiInfo();
        if(apiInfo.length > 0){
            const dbInfo = await Country.bulkCreate(apiInfo);
            console.log("Datos de la Api ingresados a la Base de Datos exitosamente")
        }
    } catch (error) {
        console.log("Error al cargar la informacion de la Api", error);
    }
};

apiToDb();


router.get("/countries", async (req, res) =>{
    const { name } = req.query;
    try {
        if(name) {
            const countryName = await Country.findAll({
                where: {
                    name: {
                        [Op.iLike]:`%${name}%`
                    }
                }
            })
            countryName ? res.send(countryName) : res.send("the country is not found")
        }else{
            const countries = await Country.findAll({
                include: {
                    model: Activity,
                    attributes: ["name", "difficulty", "duration", "season"],
                    through: {
                        attributes: []
                    }
                }
            })
            countries.length > 0 ? res.send(countries) : res.send('No info in DataBase')
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
});

router.get("/countries/:id", async (req, res)=>{
    const { id } = req.params
    const newId = id.toLocaleUpperCase()
    try {
        const country = await Country.findOne({
            where: {
                id: newId
            },
            include: Activity
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
});

router.get("/activities", async (req, res)=>{
    try {
        const allActivities = await Activity.findAll();
        res.send(allActivities)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.post("activities", async (req, res)=>{
    const { ids, name, difficulty, duration, season } = req.body
    try {
        let newActivity = await createActivity(name, difficulty, duration, season, ids)

        res.send(newActivity)
    } catch (error) {
        res.status(500).send(error.message)
    }
})



module.exports = router;
