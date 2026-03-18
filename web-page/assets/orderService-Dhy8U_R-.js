import{s as a}from"./index-6Ye7uOlj.js";const u={getUserOrders:async r=>{const{data:e,error:o}=await a.from("orders").select(`
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
            `).eq("user_id",r).order("created_at",{ascending:!1});return{data:e,error:o}},getOrderDetails:async r=>{const e=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(r);let o;e?o=a.from("orders").select(`
                    *,
                    profiles:user_id (email),
                    order_items (
                        *,
                        products (*),
                        variant:variant_id (*)
                    )
                `).eq("id",r):o=a.rpc("find_order_by_short_id",{short_id:r}).select(`
                    *,
                    profiles:user_id (email),
                    order_items (
                        *,
                        products (*),
                        variant:variant_id (*)
                    )
                `);const{data:n,error:t}=await o.maybeSingle();return{data:n,error:t}},getStatusConfig(r){const e={pending_payment:{label:"Esperando Pago",color:"text-orange-400",bgColor:"bg-orange-500/10",icon:"hourglass_empty"},pending:{label:"Por Confirmar",color:"text-yellow-400",bgColor:"bg-yellow-500/10",icon:"pending"},paid:{label:"Pagado",color:"text-emerald-400",bgColor:"bg-emerald-500/10",icon:"check_circle"},processing:{label:"Preparando",color:"text-cyan-400",bgColor:"bg-cyan-500/10",icon:"coffee"},shipped:{label:"Enviado",color:"text-sky-400",bgColor:"bg-sky-500/10",icon:"local_shipping"},delivered:{label:"Entregado",color:"text-purple-400",bgColor:"bg-purple-500/10",icon:"home"},cancelled:{label:"Cancelado",color:"text-rose-400",bgColor:"bg-rose-500/10",icon:"cancel"}};return e[r]||e.pending},uploadPaymentProof:async(r,e)=>{var c;if(!["image/jpeg","image/png","image/webp","application/pdf"].includes(e.type))return{url:null,error:{message:`Tipo de archivo no permitido: ${e.type}. Solo JPG, PNG, WEBP o PDF.`}};if(e.size>5242880)return{url:null,error:{message:`Archivo excede 5MB. Tamaño actual: ${(e.size/1024/1024).toFixed(2)}MB.`}};const t=["jpg","jpeg","png","webp","pdf"].includes(((c=e.name.split(".").pop())==null?void 0:c.toLowerCase())||"")?e.name.split(".").pop().toLowerCase():"jpg",p=`comprobante_${Date.now()}.${t}`,i=`${r}/${p}`,{data:g,error:s}=await a.storage.from("payments").upload(i,e);if(s)return{url:null,error:s};const{data:{publicUrl:l}}=a.storage.from("payments").getPublicUrl(i),{error:d}=await a.from("payments").update({payment_evidence_url:l}).eq("order_id",r);return{url:l,error:d}}};export{u as o};
