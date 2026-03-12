import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const { to, subject, html } = body;

        console.log(`Intentando enviar email vía Brevo a: ${to}`);

        if (!BREVO_API_KEY) {
            console.error("CRITICAL: BREVO_API_KEY is not set");
            throw new Error("BREVO_API_KEY is not set");
        }

        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": BREVO_API_KEY,
            },
            body: JSON.stringify({
                sender: { name: "Origen Sierra Nevada", email: "hola@cafemalu.com" },
                to: [{ email: to }],
                subject: subject,
                htmlContent: html,
            }),
        });

        const data = await res.json();
        console.log("Respuesta de Brevo:", JSON.stringify(data));

        if (!res.ok) {
            throw new Error(`Brevo API error: ${JSON.stringify(data)}`);
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
