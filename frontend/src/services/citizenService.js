import api from "./api";

export const getMyGrievances = async () => {
    const response = await api.get("/grievances/my");
    return response.data;
};
export const submitGrievance = async (data) => {
    const response = await api.post("/grievances", data);
    return response.data;
};

export const trackGrievance = async (referenceNumber) => {
    const response = await api.get(
        `/grievances/track/${referenceNumber}`
    );
    return response.data;
};

export const submitGrievanceFeedback = async (id, data) => {
    const response = await api.post(
        `/grievances/${id}/feedback`,
        data
    );
    return response.data;
};