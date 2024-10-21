
export type Provider = {
    name: string;
    apiKey?: string;
}

export type Model = {
    model: string;
    provider: Provider;
}