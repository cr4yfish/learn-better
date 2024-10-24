export async function POST(req: Request) {
    try {
        const { url } = await req.json();
       
        const res = await fetch(url);

        const html = await res.text();

        return Response.json({
            data: html
        })

    } catch (e) {
        console.error(e);
        return Response.json({
            data: e
        })
    }
   
}