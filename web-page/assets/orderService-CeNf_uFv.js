import{s as o}from"./index-6lYz1azz.js";const u={getUserOrders:async r=>{const{data:e,error:a}=await o.from("orders").select(`
                *,
                profiles:user_id (email),
                order_items (
                    *,
                    products (
                        name,
                        image_url
                    ),
                    variant:variant_id (
                        name,
                        grind
                    )
                )
            `).eq("user_id",r).order("created_at",{ascending:!1});return{data:e,error:a}},getOrderDetails:async r=>{const{data:e,error:a}=await o.from("orders").select(`
                *,
                profiles:user_id (email),
                order_items (
                    *,
                    products (*),
                    variant:variant_id (*)
                )
            `).eq("id",r).single();return{data:e,error:a}},getStatusConfig(r){const e={pending_payment:{label:"Esperando Pago",color:"text-orange-400",bgColor:"bg-orange-500/10",icon:"hourglass_empty"},pending:{label:"Por Confirmar",color:"text-yellow-400",bgColor:"bg-yellow-500/10",icon:"pending"},paid:{label:"Pagado",color:"text-emerald-400",bgColor:"bg-emerald-500/10",icon:"check_circle"},processing:{label:"Preparando",color:"text-cyan-400",bgColor:"bg-cyan-500/10",icon:"coffee"},shipped:{label:"Enviado",color:"text-sky-400",bgColor:"bg-sky-500/10",icon:"local_shipping"},delivered:{label:"Entregado",color:"text-purple-400",bgColor:"bg-purple-500/10",icon:"home"},cancelled:{label:"Cancelado",color:"text-rose-400",bgColor:"bg-rose-500/10",icon:"cancel"}};return e[r]||e.pending},uploadPaymentProof:async(r,e)=>{var s;if(!["image/jpeg","image/png","image/webp","application/pdf"].includes(e.type))return{url:null,error:{message:`Tipo de archivo no permitido: ${e.type}. Solo JPG, PNG, WEBP o PDF.`}};if(e.size>5242880)return{url:null,error:{message:`Archivo excede 5MB. Tamaño actual: ${(e.size/1024/1024).toFixed(2)}MB.`}};const i=["jpg","jpeg","png","webp","pdf"].includes(((s=e.name.split(".").pop())==null?void 0:s.toLowerCase())||"")?e.name.split(".").pop().toLowerCase():"jpg",c=`comprobante_${Date.now()}.${i}`,t=`${r}/${c}`,{data:g,error:n}=await o.storage.from("payments").upload(t,e);if(n)return{url:null,error:n};const{data:{publicUrl:l}}=o.storage.from("payments").getPublicUrl(t),{error:p}=await o.from("payments").update({payment_evidence_url:l}).eq("order_id",r);return{url:l,error:p}}};export{u as o};
