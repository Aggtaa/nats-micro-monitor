export interface MicroserviceInfo {
    firstFoundAt: string;
    lastFoundAt: string;
    name: string;
    id: string;
    version: string;
    description: string;
    endpoints: EndpointInfo[];

    // todo:
    healthStatus: {
        value: number;
    };

    status: number;
}

export interface EndpointInfo {
    name: string;
    subject: string;
    metadata: unknown;
}