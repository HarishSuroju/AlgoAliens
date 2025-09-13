import api from "./api";

export const saveOnboarding = async (data) => {
  const res = await api.post("/onboarding", data);
  return res.data;
};

export const checkOnboardingStatus = async () => {
  const res = await api.get("/onboarding");
  return res.data;
};
