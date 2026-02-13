import City from "../../models/extra-models/City.js";
import Country from "../../models/extra-models/Country.js";
import Language from "../../models/extra-models/Language.js";
import Skills from "../../models/extra-models/Skills.js";
import State from "../../models/extra-models/States.js";

export const getCountry = async (req, res) => {
  try {
    const countries = await Country.find().sort({ country_name: 1 });

    if (!countries || countries.length === 0) {
      return res.status(404).json({ message: "No countries found." });
    }

    return res.status(200).json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getState = async (req, res) => {
  try {
    const states = await State.find().sort({ name: 1 });

    if (!states || states.length === 0) {
      return res.status(404).json({ message: "No states found." });
    }

    return res.status(200).json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
export const getStateByCountry = async (req, res) => {
  try {
    const { country_name } = req.params;
    const states = await State.find({ country_name }).sort({ name: 1 });

    if (!states || states.length === 0) {
      return res.status(404).json({ message: "No states found." });
    }

    return res.status(200).json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getCity = async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });

    if (!cities || cities.length === 0) {
      return res.status(404).json({ message: "No cities found." });
    }

    return res.status(200).json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
export const getCityByState = async (req, res) => {
  try {
    const { state_name } = req.params;
    const cities = await City.find({ state_name }).sort({ name: 1 });

    if (!cities || cities.length === 0) {
      return res.status(404).json({ message: "No cities found." });
    }

    return res.status(200).json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getLanguages = async (req, res) => {
  try {
    const languages = await Language.find().sort({ language: 1 });

    if (!languages || languages.length <= 0) {
      return res.status(404).json({ message: "No languages found." });
    }

    return res.status(200).json(languages);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getSkills = async (req, res) => {
  try {
    const skills = await Skills.find().sort({ skill: 1 });

    if (!skills || skills.length <= 0) {
      return res.status(404).json({ message: "No skills found." });
    }

    return res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
