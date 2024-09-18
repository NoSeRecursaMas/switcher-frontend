import axiosClient from "./httpClient";
import MockAdapter from "axios-mock-adapter";

const mockAdapter = new MockAdapter(axiosClient, { delayResponse: 200 });

export default mockAdapter;