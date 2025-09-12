import pool from "../config/database.js";

// Save onboarding data
export const saveOnboarding = async (req, res) => {
  const userId = req.user.id;
  const { interests, goals, fieldOfStudy, collegeDetails } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM onboarding WHERE user_id=$1", [userId]);

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE onboarding 
         SET interests=$1, goals=$2, field_of_study=$3, college_details=$4, completed=true 
         WHERE user_id=$5`,
        [interests, goals, fieldOfStudy, collegeDetails, userId]
      );
    } else {
      await pool.query(
        `INSERT INTO onboarding (user_id, interests, goals, field_of_study, college_details, completed) 
         VALUES ($1,$2,$3,$4,$5,true)`,
        [userId, interests, goals, fieldOfStudy, collegeDetails]
      );
    }

    res.json({ message: "Onboarding saved successfully", completed: true });
  } catch (error) {
    console.error("Onboarding save error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Check onboarding status
export const getOnboardingStatus = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query("SELECT completed FROM onboarding WHERE user_id=$1", [userId]);
    const completed = result.rows[0]?.completed || false;
    res.json({ completed });
  } catch (error) {
    console.error("Onboarding status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
