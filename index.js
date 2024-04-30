import { $ } from "bun";
const ffmpegPath = require("ffmpeg-static")

const server = Bun.serve({
    async fetch(req) {
        const path = new URL(req.url).pathname;
        if (req.method === "POST" && path === "/upload") {
            const blob = await Bun.readableStreamToBlob(req.body)
            await Bun.write("temp.png", blob); // Write temp file

            // Convert video
            await $`${ffmpegPath} -loop 1 -i temp.png -i money.ogg -shortest -c:v libx264 -tune stillimage -c:a aac -t 16.21 -pix_fmt yuv420p -vf "scale='in_w - mod(in_w, 2):in_h - mod(in_h, 2)',fade=t=in:st=0:d=1.2861" temp.mp4`
            
            unlinkSync("temp.png") // Delete temp file
            return new Response(Bun.file("temp.mp4")); // Return vid
        }

        // Delete temporary files
        if (Bun.file("temp.png").exists()) { unlinkSync("temp.png") }
        if (Bun.file("temp.mp4").exists()) { unlinkSync("temp.mp4") }

        return new Response("Page not found. Post request to /upload with a file.", { status: 404 }); // 404
    }
})

console.log(`Listening on ${server.url}`);