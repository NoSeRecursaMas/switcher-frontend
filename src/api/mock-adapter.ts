import axiosClient from "./http-client";
import MockAdapter from "axios-mock-adapter";

const mockAdapter = new MockAdapter(axiosClient, { delayResponse: 200 });

export default mockAdapter;