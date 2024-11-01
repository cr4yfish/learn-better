
import { redirect } from "next/navigation";


type Params = {
    params : {
        type : string;
        id : string;
    }
}

export default async function Complete(params: Params) {
    const { type, id } = params.params;


    // TODO - check if user has completed this level

    // if so, then show the stats
    redirect(`/complete/${type}/${id}/stats`);
}