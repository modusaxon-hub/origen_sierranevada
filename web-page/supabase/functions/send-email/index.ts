import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const { to, subject, html } = body;

        console.log(`Intentando enviar email a: ${to} con asunto: ${subject}`);

        if (!RESEND_API_KEY) {
            console.error("CRITICAL: RESEND_API_KEY is not set in environment variables");
            throw new Error("RESEND_API_KEY is not set");
        }

        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Origen Sierra Nevada <hola@cafemalu.com>",
                to: [to],
                subject: subject,
                html: html,
            }),
        });

        const data = await res.json();
        console.log("Respuesta de Resend:", JSON.stringify(data));

        if (!res.ok) {
            throw new Error(`Resend API error: ${JSON.stringify(data)}`);
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Error en send-email function:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
